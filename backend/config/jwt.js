import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET && process.env.JWT_SECRET.trim();

if (!secret) {
  const errMsg = 'FATAL SECURITY ERROR: JWT_SECRET environment variable is missing. Server must not start with an insecure or missing secret.';
  console.error(`❌ ${errMsg}`);
  throw new Error(errMsg);
}

export const JWT_SECRET = secret;
export const JWT_REFRESH_SECRET = (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.trim()) || `${secret}_refresh_secure_salt`;
export const ACCESS_TOKEN_EXPIRY = '7d';
export const REFRESH_TOKEN_EXPIRY = '30d';
