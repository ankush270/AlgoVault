import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { JWT_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../config/jwt.js';

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Generates an Access Token (7 days) and a Refresh Token (30 days)
 */
const generateAuthTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, name: user.name, type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: user._id, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

// 1. REGISTER Endpoint (Rate limited, email & password validation)
router.post('/register', authRateLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name is required and must be between 2 and 100 characters.'
      });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()) || email.trim().length > 255) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: 'Password must be between 6 and 128 characters long.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const existingUser = await UserModel.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name: name.trim(),
      email: trimmedEmail,
      password: hashedPassword
    });

    const { accessToken, refreshToken } = generateAuthTokens(newUser);

    // Persist refresh token for session lifecycle & revocation tracking
    newUser.refreshTokens = [{ token: refreshToken, createdAt: new Date() }];
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token: accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again later.'
    });
  }
});

// 2. LOGIN Endpoint (Rate limited, validation)
router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: 'Password must be between 6 and 128 characters long.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const user = await UserModel.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const { accessToken, refreshToken } = generateAuthTokens(user);

    // Keep up to 5 most recent active sessions (token rotation)
    const existingTokens = Array.isArray(user.refreshTokens) ? user.refreshTokens : [];
    user.refreshTokens = [...existingTokens.slice(-4), { token: refreshToken, createdAt: new Date() }];
    await user.save();

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again later.'
    });
  }
});

// 3. REFRESH Token Endpoint (Exchanges valid refreshToken for a new 7d access token)
router.post('/refresh', authRateLimiter, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken || typeof refreshToken !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required.'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token. Please sign in again.'
      });
    }

    if (decoded.type !== 'refresh' || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token structure.'
      });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account associated with this session no longer exists.'
      });
    }

    // Revocation check: Token must exist in user's refreshTokens array
    const tokenIndex = (user.refreshTokens || []).findIndex(t => t.token === refreshToken);
    if (tokenIndex === -1) {
      return res.status(403).json({
        success: false,
        message: 'Refresh token has been revoked or already used. Please log in again.'
      });
    }

    // Token Rotation: Generate new access and refresh tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateAuthTokens(user);

    // Replace the consumed refresh token with the new one
    user.refreshTokens[tokenIndex] = { token: newRefreshToken, createdAt: new Date() };
    await user.save();

    res.json({
      success: true,
      token: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh authentication session.'
    });
  }
});

// 4. LOGOUT Endpoint (Revokes refresh token from database)
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken && typeof refreshToken === 'string') {
      try {
        const decoded = jwt.decode(refreshToken);
        if (decoded && decoded.id) {
          await UserModel.findByIdAndUpdate(decoded.id, {
            $pull: { refreshTokens: { token: refreshToken } }
          });
        }
      } catch (err) {
        // Silently continue if decoding fails
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully and session revoked.'
    });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process logout.'
    });
  }
});

// 5. GET Current Logged-in User
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred fetching your profile.'
    });
  }
});

export default router;
