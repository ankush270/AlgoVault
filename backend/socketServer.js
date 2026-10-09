import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ARENA_PROBLEMS, validateArenaCode } from './services/arenaValidator.js';
import { ArenaProfileModel } from './models/ArenaProfile.js';
import { getCorsOptions } from './config/cors.js';
import { JWT_SECRET } from './config/jwt.js';

// Server-side authoritative match duration (Default: 15 minutes = 900 seconds)
export const MATCH_DURATION_SECONDS = parseInt(process.env.ARENA_MATCH_TIMEOUT_SECONDS || '900', 10);
export const MATCH_TIMEOUT_MS = MATCH_DURATION_SECONDS * 1000;

/**
 * Standard Elo Rating System with variable K-factor
 * Expected score E_A = 1 / (1 + 10^((R_B - R_A) / 400))
 * Outcome: 1 for WIN, 0 for LOSS, 0.5 for DRAW
 */
export function calculateDynamicEloDelta({
  playerElo = 1500,
  opponentElo = 1500,
  outcome = 1,
  isAiMatch = false,
  timeTakenSeconds = 60
}) {
  // Anti-bot farming: If solution submitted unnaturally fast (< 10s) vs AI, 0 ELO awarded
  if (isAiMatch && timeTakenSeconds < 10 && outcome === 1) {
    return 0;
  }

  // AI matches use a smaller K-factor (K=10) to prevent rapid inflation/farming
  // High-rated players use smaller K-factor for stabilization
  let kFactor = 32;
  if (isAiMatch) {
    kFactor = 10;
  } else if (playerElo >= 2000) {
    kFactor = 16;
  } else if (playerElo >= 1800) {
    kFactor = 24;
  }

  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const rawDelta = kFactor * (outcome - expectedScore);
  let delta = Math.round(rawDelta);

  // Decisive matches always have at least 1 point change
  if (outcome === 1 && delta <= 0) delta = 1;
  if (outcome === 0 && delta >= 0) delta = -1;

  // Anti-farming cap: If player rating is > 300 points above AI bot rating, win delta is 0
  if (isAiMatch && outcome === 1 && playerElo - opponentElo > 300) {
    return 0;
  }

  return delta;
}

/**
 * Fetches player's current ELO rating from Mongo
 */
async function getPlayerElo(userId) {
  if (!userId || userId.startsWith('guest_') || userId === 'ai_bot') return 1500;
  try {
    const profile = await ArenaProfileModel.findOne({ userId }).select('elo');
    return profile?.elo || 1500;
  } catch {
    return 1500;
  }
}

/**
 * Persists match result and updated ELO in MongoDB ArenaProfile
 */
async function updateArenaElo({ userId, username, result, eloDelta, timeTaken, problemTitle, opponentName, isAuthenticated }) {
  if (!isAuthenticated || !userId || userId.startsWith('guest_') || userId === 'ai_bot') return;
  try {
    let profile = await ArenaProfileModel.findOne({ userId });
    if (!profile) {
      profile = new ArenaProfileModel({
        userId,
        username: username || 'Candidate',
        elo: 1500,
        wins: 0,
        losses: 0,
        draws: 0,
        matchesPlayed: 0
      });
    }

    profile.elo = Math.max(1000, profile.elo + eloDelta);
    profile.matchesPlayed += 1;
    if (result === 'WIN') profile.wins += 1;
    else if (result === 'LOSS') profile.losses += 1;
    else profile.draws += 1;

    profile.winRate = profile.matchesPlayed > 0
      ? Math.round((profile.wins / profile.matchesPlayed) * 100)
      : 0;

    if (profile.elo >= 2000) { profile.rankTitle = 'Grandmaster'; profile.badge = 'Grandmaster'; }
    else if (profile.elo >= 1800) { profile.rankTitle = 'Master'; profile.badge = 'Master'; }
    else if (profile.elo >= 1600) { profile.rankTitle = 'Challenger'; profile.badge = 'Challenger'; }
    else { profile.rankTitle = 'Candidate'; profile.badge = 'Candidate'; }

    profile.recentMatches.unshift({
      id: `match_${Date.now()}`,
      opponentName: opponentName || 'Opponent',
      result,
      eloDelta,
      timeTakenSeconds: timeTaken,
      problemTitle: problemTitle || 'Coding Duel',
      date: new Date().toLocaleDateString()
    });

    if (profile.recentMatches.length > 20) {
      profile.recentMatches = profile.recentMatches.slice(0, 20);
    }

    profile.updatedAt = new Date();
    await profile.save();
  } catch (err) {
    console.warn('Failed to update ArenaProfile in Mongo:', err.message);
  }
}

export default function setupSocketServer(server, customCorsOptions) {
  const io = new Server(server, {
    cors: customCorsOptions || getCorsOptions()
  });

  const waitingQueue = [];
  const activeRooms = new Map();

  /**
   * Authoritative server-side match timeout executor.
   * Eliminates infinite match run time and client-side fake testsPassed exploits.
   */
  function executeMatchTimeout(roomId) {
    const room = activeRooms.get(roomId);
    if (!room) return;

    // Immediately cancel and clear any ongoing timers
    if (room.matchTimeoutTimer) {
      clearTimeout(room.matchTimeoutTimer);
      room.matchTimeoutTimer = null;
    }
    if (room.aiInterval) {
      clearInterval(room.aiInterval);
      room.aiInterval = null;
    }

    const p1 = room.players[0];
    const p2 = room.players[1];
    if (!p1 || !p2) {
      activeRooms.delete(roomId);
      return;
    }

    // Security: Do NOT trust client-supplied testsPassed!
    // Tests passed on timeout is capped at 4 (since 5 requires server-verified submit_solution)
    const p1Tests = Math.min(4, Math.max(0, p1.testsPassed || 0));
    const p2Tests = Math.min(4, Math.max(0, p2.testsPassed || 0));

    let winner = null;
    let loser = null;
    let isDraw = false;

    if (p1Tests > p2Tests) {
      winner = p1;
      loser = p2;
    } else if (p2Tests > p1Tests) {
      winner = p2;
      loser = p1;
    } else {
      isDraw = true;
    }

    const p1Elo = p1.elo || 1500;
    const p2Elo = p2.elo || 1500;
    const isAi = !!room.isAiMatch;

    const p1Delta = isDraw
      ? calculateDynamicEloDelta({ playerElo: p1Elo, opponentElo: p2Elo, outcome: 0.5, isAiMatch: isAi, timeTakenSeconds: MATCH_DURATION_SECONDS })
      : (winner === p1
        ? calculateDynamicEloDelta({ playerElo: p1Elo, opponentElo: p2Elo, outcome: 1, isAiMatch: isAi, timeTakenSeconds: MATCH_DURATION_SECONDS })
        : calculateDynamicEloDelta({ playerElo: p1Elo, opponentElo: p2Elo, outcome: 0, isAiMatch: isAi, timeTakenSeconds: MATCH_DURATION_SECONDS }));

    const p2Delta = isDraw
      ? calculateDynamicEloDelta({ playerElo: p2Elo, opponentElo: p1Elo, outcome: 0.5, isAiMatch: isAi, timeTakenSeconds: MATCH_DURATION_SECONDS })
      : (winner === p2
        ? calculateDynamicEloDelta({ playerElo: p2Elo, opponentElo: p1Elo, outcome: 1, isAiMatch: isAi, timeTakenSeconds: MATCH_DURATION_SECONDS })
        : calculateDynamicEloDelta({ playerElo: p2Elo, opponentElo: p1Elo, outcome: 0, isAiMatch: isAi, timeTakenSeconds: MATCH_DURATION_SECONDS }));

    io.to(roomId).emit('match_ended', {
      winnerSocketId: winner ? winner.socketId : null,
      winnerUsername: winner ? winner.username : 'Match Draw',
      winnerUserId: winner ? winner.userId : null,
      loserSocketId: loser ? loser.socketId : null,
      loserUsername: loser ? loser.username : null,
      loserUserId: loser ? loser.userId : null,
      timeTakenSeconds: MATCH_DURATION_SECONDS,
      eloDelta: isDraw ? 0 : (winner === p1 ? p1Delta : p2Delta),
      loserEloDelta: isDraw ? 0 : (loser === p1 ? p1Delta : p2Delta),
      isTimeout: true,
      isDraw
    });

    if (p1.socketId !== 'ai_bot') {
      updateArenaElo({
        userId: p1.userId,
        username: p1.username,
        result: isDraw ? 'DRAW' : (winner === p1 ? 'WIN' : 'LOSS'),
        eloDelta: p1Delta,
        timeTaken: MATCH_DURATION_SECONDS,
        problemTitle: room.problem.title,
        opponentName: p2.username,
        isAuthenticated: p1.isAuthenticated
      });
    }

    if (p2.socketId !== 'ai_bot') {
      updateArenaElo({
        userId: p2.userId,
        username: p2.username,
        result: isDraw ? 'DRAW' : (winner === p2 ? 'WIN' : 'LOSS'),
        eloDelta: p2Delta,
        timeTaken: MATCH_DURATION_SECONDS,
        problemTitle: room.problem.title,
        opponentName: p1.username,
        isAuthenticated: p2.isAuthenticated
      });
    }

    activeRooms.delete(roomId);
  }

  // Socket.IO Handshake Authentication Middleware
  io.use((socket, next) => {
    try {
      const rawToken = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      const token = rawToken ? rawToken.replace(/^Bearer\s+/i, '').trim() : null;

      if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
          if (err) {
            socket.isAuthenticated = false;
            socket.user = {
              id: `guest_${socket.id.slice(0, 8)}`,
              name: `Guest_${socket.id.slice(0, 4)}`,
              isGuest: true
            };
            return next();
          }

          socket.isAuthenticated = true;
          socket.user = {
            id: String(decoded.id),
            name: decoded.name || 'Candidate',
            email: decoded.email,
            isGuest: false
          };
          next();
        });
      } else {
        socket.isAuthenticated = false;
        socket.user = {
          id: `guest_${socket.id.slice(0, 8)}`,
          name: `Guest_${socket.id.slice(0, 4)}`,
          isGuest: true
        };
        next();
      }
    } catch (authErr) {
      console.warn('Socket handshake authentication error:', authErr.message);
      socket.isAuthenticated = false;
      socket.user = {
        id: `guest_${socket.id.slice(0, 8)}`,
        name: `Guest_${socket.id.slice(0, 4)}`,
        isGuest: true
      };
      next();
    }
  });

  io.on('connection', (socket) => {
    // Dynamic Re-Authentication (handles in-flight auth updates without dropping connection or match state)
    socket.on('authenticate', async ({ token } = {}, callback) => {
      try {
        const rawToken = token || socket.handshake.auth?.token;
        const cleanToken = rawToken ? rawToken.replace(/^Bearer\s+/i, '').trim() : null;

        if (!cleanToken) {
          socket.isAuthenticated = false;
          socket.user = {
            id: `guest_${socket.id.slice(0, 8)}`,
            name: `Guest_${socket.id.slice(0, 4)}`,
            isGuest: true
          };
          socket.emit('authenticated', { success: true, isAuthenticated: false, user: socket.user });
          if (typeof callback === 'function') callback({ success: true, isAuthenticated: false, user: socket.user });
          return;
        }

        jwt.verify(cleanToken, JWT_SECRET, async (err, decoded) => {
          if (err) {
            socket.isAuthenticated = false;
            socket.user = {
              id: `guest_${socket.id.slice(0, 8)}`,
              name: `Guest_${socket.id.slice(0, 4)}`,
              isGuest: true
            };
            socket.emit('arena_error', { message: 'Authentication failed: token expired or invalid.' });
            if (typeof callback === 'function') callback({ success: false, error: 'Invalid or expired token', isAuthenticated: false });
            return;
          }

          socket.isAuthenticated = true;
          socket.user = {
            id: String(decoded.id),
            name: decoded.name || 'Candidate',
            email: decoded.email,
            isGuest: false
          };

          const playerElo = await getPlayerElo(socket.user.id);

          // Retroactively update player in any active room this socket is participating in
          activeRooms.forEach((room) => {
            const player = room.players.find((p) => p.socketId === socket.id);
            if (player) {
              player.userId = socket.user.id;
              player.username = socket.user.name;
              player.isAuthenticated = true;
              player.elo = playerElo;
            }
          });

          // Retroactively update waiting queue if socket is queued
          const queued = waitingQueue.find((p) => p.socketId === socket.id);
          if (queued) {
            queued.userId = socket.user.id;
            queued.username = socket.user.name;
            queued.isAuthenticated = true;
            queued.elo = playerElo;
          }

          socket.emit('authenticated', {
            success: true,
            isAuthenticated: true,
            user: socket.user,
            elo: playerElo
          });

          if (typeof callback === 'function') {
            callback({ success: true, isAuthenticated: true, user: socket.user, elo: playerElo });
          }
        });
      } catch (authErr) {
        if (typeof callback === 'function') {
          callback({ success: false, error: authErr.message });
        }
      }
    });

    // Join PvP Matchmaking
    socket.on('join_matchmaking', async ({ username }) => {
      const now = Date.now();
      if (socket.lastQueueJoin && now - socket.lastQueueJoin < 3000) {
        socket.emit('arena_error', { message: 'Matchmaking request throttled. Please wait a few seconds.' });
        return;
      }
      socket.lastQueueJoin = now;

      if (waitingQueue.length >= 100) {
        socket.emit('arena_error', { message: 'Matchmaking queue is full. Please try again shortly.' });
        return;
      }

      // Remove existing entry for this socket
      const existingIdx = waitingQueue.findIndex((p) => p.socketId === socket.id);
      if (existingIdx !== -1) waitingQueue.splice(existingIdx, 1);

      const effectiveUserId = socket.user.id;
      const clientIp = socket.handshake.address || socket.conn?.remoteAddress;
      const playerUsername = socket.isAuthenticated
        ? socket.user.name
        : (username && username.trim()) || socket.user.name || 'Candidate';
      const playerElo = await getPlayerElo(effectiveUserId);

      // Anti-Self Match Farming:
      // A player CANNOT match with themselves (same userId across multiple tabs/browsers),
      // nor with another socket connected from the exact same client IP in production.
      const candidateIndex = waitingQueue.findIndex((candidate) => {
        // Prevent matching against self (same user ID)
        if (candidate.userId === effectiveUserId) return false;

        // In production, prevent matching from the same external IP
        if (clientIp && candidate.ip && candidate.ip === clientIp) {
          if (process.env.NODE_ENV === 'production' && !clientIp.includes('127.0.0.1') && !clientIp.includes('::1')) {
            return false;
          }
        }

        // Anti-win-trading cooldown: prevent matching the exact same opponent twice in a row within 3 minutes
        if (socket.lastOpponentUserId && socket.lastOpponentUserId === candidate.userId && (now - (socket.lastMatchTime || 0) < 180000)) {
          return false;
        }

        return true;
      });

      if (candidateIndex !== -1) {
        const opponent = waitingQueue.splice(candidateIndex, 1)[0];
        const roomId = `room_${Date.now()}`;
        const randomProblem = ARENA_PROBLEMS[Math.floor(Math.random() * ARENA_PROBLEMS.length)];

        let oppName = opponent.username;
        let currName = playerUsername;
        if (oppName.toLowerCase() === currName.toLowerCase()) {
          oppName = `${oppName} (1)`;
          currName = `${currName} (2)`;
        }

        const roomData = {
          roomId,
          players: [
            { socketId: opponent.socketId, username: oppName, userId: opponent.userId, isAuthenticated: opponent.isAuthenticated, elo: opponent.elo || 1500, testsPassed: 0 },
            { socketId: socket.id, username: currName, userId: effectiveUserId, isAuthenticated: socket.isAuthenticated, elo: playerElo, testsPassed: 0 }
          ],
          problem: randomProblem,
          startTime: Date.now(),
          isAiMatch: false,
          matchTimeoutTimer: null
        };

        // Server-Side Authoritative Match Timeout Watchdog (auto-triggers after MATCH_TIMEOUT_MS)
        roomData.matchTimeoutTimer = setTimeout(() => {
          executeMatchTimeout(roomId);
        }, MATCH_TIMEOUT_MS);

        activeRooms.set(roomId, roomData);

        socket.join(roomId);
        io.sockets.sockets.get(opponent.socketId)?.join(roomId);

        // Store last opponent to prevent rematch win-trading
        socket.lastOpponentUserId = opponent.userId;
        socket.lastMatchTime = now;
        const oppSocket = io.sockets.sockets.get(opponent.socketId);
        if (oppSocket) {
          oppSocket.lastOpponentUserId = effectiveUserId;
          oppSocket.lastMatchTime = now;
        }

        io.to(roomId).emit('match_found', {
          roomId,
          players: roomData.players.map((p) => p.username),
          playersMeta: roomData.players.map((p) => ({ socketId: p.socketId, username: p.username, userId: p.userId, elo: p.elo })),
          problem: randomProblem,
          isAiMatch: false
        });
      } else {
        waitingQueue.push({
          socketId: socket.id,
          userId: effectiveUserId,
          username: playerUsername,
          isAuthenticated: socket.isAuthenticated,
          ip: clientIp,
          elo: playerElo
        });
        socket.emit('waiting_for_opponent');
      }
    });

    // Start Instant AI Bot Match with difficulty tiers
    socket.on('start_ai_battle', async ({ username, aiDifficulty = 'master' }) => {
      const roomId = `room_ai_${Date.now()}`;
      const randomProblem = ARENA_PROBLEMS[Math.floor(Math.random() * ARENA_PROBLEMS.length)];

      const botConfigs = {
        apprentice: { title: 'AlgoBot AI (Apprentice Tier)', elo: 1200, intervalMs: 8000 },
        master: { title: 'AlgoBot AI (Master Tier)', elo: 1500, intervalMs: 5000 },
        grandmaster: { title: 'AlgoBot AI (Grandmaster Tier)', elo: 1800, intervalMs: 3000 }
      };

      const selectedBot = botConfigs[aiDifficulty] || botConfigs.master;
      const botName = selectedBot.title;
      const botElo = selectedBot.elo;
      const intervalMs = selectedBot.intervalMs;

      const effectiveUserId = socket.user.id;
      const playerUsername = socket.isAuthenticated
        ? socket.user.name
        : (username && username.trim()) || socket.user.name || 'Candidate';
      const playerElo = await getPlayerElo(effectiveUserId);

      const roomData = {
        roomId,
        players: [
          { socketId: socket.id, username: playerUsername, userId: effectiveUserId, isAuthenticated: socket.isAuthenticated, elo: playerElo, testsPassed: 0 },
          { socketId: 'ai_bot', username: botName, userId: 'ai_bot', isAuthenticated: false, elo: botElo, testsPassed: 0 }
        ],
        problem: randomProblem,
        startTime: Date.now(),
        isAiMatch: true,
        aiDifficulty,
        botElo,
        matchTimeoutTimer: null
      };

      // Server-Side Authoritative Match Timeout Watchdog (auto-triggers after MATCH_TIMEOUT_MS)
      roomData.matchTimeoutTimer = setTimeout(() => {
        executeMatchTimeout(roomId);
      }, MATCH_TIMEOUT_MS);

      activeRooms.set(roomId, roomData);
      socket.join(roomId);

      socket.emit('match_found', {
        roomId,
        players: [playerUsername, botName],
        playersMeta: roomData.players.map((p) => ({ socketId: p.socketId, username: p.username, userId: p.userId, elo: p.elo })),
        problem: randomProblem,
        isAiMatch: true,
        aiDifficulty
      });

      // Simulate AI bot progress
      let aiTests = 0;
      const aiInterval = setInterval(() => {
        if (!activeRooms.has(roomId)) {
          clearInterval(aiInterval);
          return;
        }
        aiTests += 1;
        if (aiTests > 5) aiTests = 5;

        const aiPlayer = roomData.players.find((p) => p.socketId === 'ai_bot');
        if (aiPlayer) aiPlayer.testsPassed = aiTests;

        socket.emit('opponent_progress', {
          socketId: 'ai_bot',
          username: botName,
          codeLength: aiTests * 48,
          testsPassed: aiTests,
          totalTests: 5,
          lastAction: aiTests === 5 ? 'Submitting Validated Solution...' : 'Evaluating Test Cases'
        });

        if (aiTests >= 5) {
          clearInterval(aiInterval);
          setTimeout(() => {
            if (activeRooms.has(roomId)) {
              if (roomData.matchTimeoutTimer) {
                clearTimeout(roomData.matchTimeoutTimer);
                roomData.matchTimeoutTimer = null;
              }
              const timeTakenSeconds = Math.round((Date.now() - roomData.startTime) / 1000);
              const loserDelta = calculateDynamicEloDelta({
                playerElo,
                opponentElo: botElo,
                outcome: 0,
                isAiMatch: true,
                timeTakenSeconds
              });

              io.to(roomId).emit('match_ended', {
                winnerSocketId: 'ai_bot',
                winnerUsername: botName,
                winnerUserId: 'ai_bot',
                loserSocketId: socket.id,
                loserUsername: playerUsername,
                timeTakenSeconds,
                eloDelta: 0,
                loserEloDelta: loserDelta,
                isAiMatch: true
              });

              updateArenaElo({
                userId: effectiveUserId,
                username: playerUsername,
                result: 'LOSS',
                eloDelta: loserDelta,
                timeTaken: timeTakenSeconds,
                problemTitle: randomProblem.title,
                opponentName: botName,
                isAuthenticated: socket.isAuthenticated
              });

              activeRooms.delete(roomId);
            }
          }, 1200);
        }
      }, intervalMs);

      roomData.aiInterval = aiInterval;
    });

    // Code Progress Synchronization
    socket.on('code_progress', ({ roomId, codeLength, testsPassed, totalTests }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        const player = room.players.find((p) => p.socketId === socket.id);
        if (player) {
          player.testsPassed = Math.min(5, Math.max(0, testsPassed || 0));
        }
      }

      socket.to(roomId).emit('opponent_progress', {
        socketId: socket.id,
        codeLength,
        testsPassed: Math.min(5, Math.max(0, testsPassed || 0)),
        totalTests: totalTests || 5
      });
    });

    // Arena Chat / Emoji Reaction
    socket.on('send_arena_chat', ({ roomId, text, isEmoji }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        const senderPlayer = room.players.find((p) => p.socketId === socket.id);
        io.to(roomId).emit('arena_chat_message', {
          id: `msg_${Date.now()}`,
          sender: senderPlayer ? senderPlayer.username : 'Candidate',
          text,
          isEmoji: !!isEmoji,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    });

    // Secure Server-Side Verified Solution Submission
    socket.on('submit_solution', async ({ roomId, language, userCode }) => {
      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit('submission_rejected', { error: 'Match room has expired or does not exist.' });
        return;
      }

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player) {
        socket.emit('submission_rejected', { error: 'Player is not part of this battle.' });
        return;
      }

      if (!userCode || typeof userCode !== 'string' || userCode.trim().length === 0) {
        socket.emit('submission_rejected', { error: 'Submitted code cannot be empty.' });
        return;
      }

      try {
        const evalResult = await validateArenaCode({
          problemId: room.problem.id,
          language: language || 'javascript',
          code: userCode
        });

        if (!evalResult.allPassed) {
          socket.emit('submission_rejected', {
            error: `Submission failed test verification! Only ${evalResult.testsPassed}/${evalResult.totalTests} test cases passed.`,
            testsPassed: evalResult.testsPassed,
            totalTests: evalResult.totalTests,
            testResults: evalResult.testResults,
            output: evalResult.output
          });
          return;
        }

        if (room.matchTimeoutTimer) {
          clearTimeout(room.matchTimeoutTimer);
          room.matchTimeoutTimer = null;
        }
        if (room.aiInterval) clearInterval(room.aiInterval);

        const timeTakenSeconds = Math.round((Date.now() - room.startTime) / 1000);
        const opponent = room.players.find((p) => p.socketId !== socket.id);
        const isAi = !!room.isAiMatch;

        const playerElo = player.elo || 1500;
        const opponentElo = opponent ? (opponent.elo || 1500) : (room.botElo || 1500);

        // Dynamically calculate Elo delta based on rating discrepancy
        const winnerDelta = calculateDynamicEloDelta({
          playerElo,
          opponentElo,
          outcome: 1,
          isAiMatch: isAi,
          timeTakenSeconds
        });

        const loserDelta = isAi
          ? 0
          : calculateDynamicEloDelta({
              playerElo: opponentElo,
              opponentElo: playerElo,
              outcome: 0,
              isAiMatch: false,
              timeTakenSeconds
            });

        io.to(roomId).emit('match_ended', {
          winnerSocketId: socket.id,
          winnerUsername: player.username,
          winnerUserId: player.userId,
          loserSocketId: opponent ? opponent.socketId : null,
          loserUsername: opponent ? opponent.username : 'Opponent',
          loserUserId: opponent ? opponent.userId : null,
          timeTakenSeconds,
          eloDelta: winnerDelta,
          loserEloDelta: loserDelta,
          isAiMatch: isAi
        });

        // Persist Winner Stats
        updateArenaElo({
          userId: player.userId,
          username: player.username,
          result: 'WIN',
          eloDelta: winnerDelta,
          timeTaken: timeTakenSeconds,
          problemTitle: room.problem.title,
          opponentName: opponent ? opponent.username : 'Opponent',
          isAuthenticated: player.isAuthenticated
        });

        // Persist Loser Stats (PvP only)
        if (opponent && opponent.socketId !== 'ai_bot') {
          updateArenaElo({
            userId: opponent.userId,
            username: opponent.username,
            result: 'LOSS',
            eloDelta: loserDelta,
            timeTaken: timeTakenSeconds,
            problemTitle: room.problem.title,
            opponentName: player.username,
            isAuthenticated: opponent.isAuthenticated
          });
        }

        activeRooms.delete(roomId);
      } catch (err) {
        console.error('Server error verifying solution:', err);
        socket.emit('submission_rejected', { error: 'Validation error: ' + err.message });
      }
    });

    // Surrender Match
    socket.on('surrender_match', ({ roomId }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        if (room.matchTimeoutTimer) {
          clearTimeout(room.matchTimeoutTimer);
          room.matchTimeoutTimer = null;
        }
        if (room.aiInterval) clearInterval(room.aiInterval);
        const surrenderingPlayer = room.players.find((p) => p.socketId === socket.id);
        const opponent = room.players.find((p) => p.socketId !== socket.id);
        const timeTaken = Math.round((Date.now() - room.startTime) / 1000);
        const isAi = !!room.isAiMatch;

        const surrElo = surrenderingPlayer?.elo || 1500;
        const oppElo = opponent?.elo || (room.botElo || 1500);

        // Anti-win-trading penalty on quick surrender: Winner gets 0 ELO if surrendered under 20s
        let winnerDelta = calculateDynamicEloDelta({
          playerElo: oppElo,
          opponentElo: surrElo,
          outcome: 1,
          isAiMatch: isAi,
          timeTakenSeconds: timeTaken
        });
        if (timeTaken < 20 && !isAi) {
          winnerDelta = 0; // Prevent instant-surrender ELO pumping
        }

        const loserDelta = calculateDynamicEloDelta({
          playerElo: surrElo,
          opponentElo: oppElo,
          outcome: 0,
          isAiMatch: isAi,
          timeTakenSeconds: timeTaken
        });

        io.to(roomId).emit('match_ended', {
          winnerSocketId: opponent ? opponent.socketId : 'ai_bot',
          winnerUsername: opponent ? opponent.username : 'Opponent',
          winnerUserId: opponent ? opponent.userId : null,
          loserSocketId: socket.id,
          loserUsername: surrenderingPlayer ? surrenderingPlayer.username : 'Candidate',
          loserUserId: surrenderingPlayer ? surrenderingPlayer.userId : null,
          timeTakenSeconds: timeTaken,
          eloDelta: isAi ? 0 : winnerDelta,
          loserEloDelta: loserDelta,
          isSurrender: true,
          isAiMatch: isAi
        });

        if (surrenderingPlayer) {
          updateArenaElo({
            userId: surrenderingPlayer.userId,
            username: surrenderingPlayer.username,
            result: 'LOSS',
            eloDelta: loserDelta,
            timeTaken,
            problemTitle: room.problem.title,
            opponentName: opponent ? opponent.username : 'Opponent',
            isAuthenticated: surrenderingPlayer.isAuthenticated
          });
        }

        if (opponent && opponent.socketId !== 'ai_bot') {
          updateArenaElo({
            userId: opponent.userId,
            username: opponent.username,
            result: 'WIN',
            eloDelta: winnerDelta,
            timeTaken,
            problemTitle: room.problem.title,
            opponentName: surrenderingPlayer ? surrenderingPlayer.username : 'Candidate',
            isAuthenticated: opponent.isAuthenticated
          });
        }

        activeRooms.delete(roomId);
      }
    });

    // Match Timeout (Client Heartbeat / Notification)
    socket.on('match_timeout', ({ roomId }) => {
      const room = activeRooms.get(roomId);
      if (!room) return;

      const elapsed = Date.now() - (room.startTime || 0);
      // Require at least MATCH_TIMEOUT_MS minus 5s clock tolerance before accepting client-initiated timeout
      if (elapsed < MATCH_TIMEOUT_MS - 5000) {
        console.warn(`[ARENA SECURITY] Premature match_timeout rejected for room ${roomId} from socket ${socket.id} (elapsed: ${Math.round(elapsed / 1000)}s / ${MATCH_DURATION_SECONDS}s)`);
        socket.emit('match_timeout_rejected', {
          error: `Match has not timed out yet. Elapsed: ${Math.round(elapsed / 1000)}s. Required: ${MATCH_DURATION_SECONDS}s.`
        });
        return;
      }

      // Delegate directly to authoritative server timeout logic
      executeMatchTimeout(roomId);
    });

    // Disconnect Handler
    socket.on('disconnect', () => {
      const qIdx = waitingQueue.findIndex((p) => p.socketId === socket.id);
      if (qIdx !== -1) waitingQueue.splice(qIdx, 1);

      activeRooms.forEach((room, rId) => {
        const pIdx = room.players.findIndex((p) => p.socketId === socket.id);
        if (pIdx !== -1) {
          if (room.matchTimeoutTimer) {
            clearTimeout(room.matchTimeoutTimer);
            room.matchTimeoutTimer = null;
          }
          if (room.aiInterval) clearInterval(room.aiInterval);
          socket.to(rId).emit('opponent_disconnected', {
            message: 'Opponent disconnected from battle.'
          });
          activeRooms.delete(rId);
        }
      });
    });
  });

  console.log('⚡ Socket.io Real-Time Multiplayer Engine initialized with anti-cheat & dynamic Elo algorithms.');
  return io;
}
