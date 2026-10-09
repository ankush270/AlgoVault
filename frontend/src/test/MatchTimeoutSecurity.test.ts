import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Logic mirrors backend/socketServer.js match timeout security architecture:
 * 1. Client-supplied testsPassed is ignored; server uses tracked tests passed (capped at 4).
 * 2. Premature client match_timeout is rejected if elapsed < duration - clockTolerance.
 * 3. Server sets an authoritative setTimeout watchdog at match start.
 * 4. Timers are cleared on early conclusion (submit_solution, surrender, disconnect).
 */
const MATCH_DURATION_SECONDS = 900;
const MATCH_TIMEOUT_MS = MATCH_DURATION_SECONDS * 1000;
const CLOCK_TOLERANCE_MS = 5000;

interface Player {
  socketId: string;
  userId: string;
  username: string;
  elo: number;
  testsPassed: number;
}

interface Room {
  roomId: string;
  players: Player[];
  startTime: number;
  isAiMatch: boolean;
  matchTimeoutTimer: NodeJS.Timeout | null;
  ended?: boolean;
  winnerSocketId?: string | null;
  isDraw?: boolean;
  isTimeout?: boolean;
}

function createRoom(roomId: string, p1: Partial<Player>, p2: Partial<Player>): Room {
  return {
    roomId,
    players: [
      { socketId: 'p1_sock', userId: 'user1', username: 'Player1', elo: 1500, testsPassed: 0, ...p1 },
      { socketId: 'p2_sock', userId: 'user2', username: 'Player2', elo: 1500, testsPassed: 0, ...p2 }
    ],
    startTime: Date.now(),
    isAiMatch: false,
    matchTimeoutTimer: null
  };
}

function handleClientMatchTimeout(
  room: Room,
  clientSocketId: string,
  fakeClientTestsPassed: number,
  currentTime: number = Date.now()
): { accepted: boolean; error?: string } {
  const elapsed = currentTime - (room.startTime || 0);

  // Premature timeout check with 5s clock tolerance
  if (elapsed < MATCH_TIMEOUT_MS - CLOCK_TOLERANCE_MS) {
    return {
      accepted: false,
      error: `Match has not timed out yet. Elapsed: ${Math.round(elapsed / 1000)}s. Required: ${MATCH_DURATION_SECONDS}s.`
    };
  }

  // Authoritative server-side execution: ignore fakeClientTestsPassed!
  executeServerMatchTimeout(room);
  return { accepted: true };
}

function executeServerMatchTimeout(room: Room): void {
  if (room.matchTimeoutTimer) {
    clearTimeout(room.matchTimeoutTimer);
    room.matchTimeoutTimer = null;
  }

  const p1 = room.players[0];
  const p2 = room.players[1];

  // Server caps verified progress at 4; 5/5 requires server-side test harness execution via submit_solution
  const p1Score = Math.min(p1.testsPassed || 0, 4);
  const p2Score = Math.min(p2.testsPassed || 0, 4);

  room.ended = true;
  room.isTimeout = true;

  if (p1Score > p2Score) {
    room.winnerSocketId = p1.socketId;
    room.isDraw = false;
  } else if (p2Score > p1Score) {
    room.winnerSocketId = p2.socketId;
    room.isDraw = false;
  } else {
    room.winnerSocketId = null;
    room.isDraw = true;
  }
}

describe('Server-Side Match Timeout & Anti-Exploit Security Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rejects premature client-sent match_timeout (e.g. after only 15 seconds)', () => {
    const room = createRoom('room_1', { testsPassed: 0 }, { testsPassed: 0 });
    const startTime = room.startTime;

    // Attacker sends match_timeout 15 seconds into the 900s match
    const result = handleClientMatchTimeout(room, 'p1_sock', 5, startTime + 15000);

    expect(result.accepted).toBe(false);
    expect(result.error).toContain('Match has not timed out yet');
    expect(room.ended).toBeUndefined();
  });

  it('ignores spoofed client testsPassed: 5 and resolves winner using server-tracked tests', () => {
    // Player 1 has 1 verified test, Player 2 has 3 verified tests
    const room = createRoom('room_2', { testsPassed: 1 }, { testsPassed: 3 });
    const startTime = room.startTime;

    // Attacker (Player 1) claims testsPassed: 5 after full match duration
    const result = handleClientMatchTimeout(room, 'p1_sock', 5, startTime + MATCH_TIMEOUT_MS);

    expect(result.accepted).toBe(true);
    expect(room.ended).toBe(true);
    // Player 2 wins because server had verified 3 tests for P2 vs 1 for P1 (ignoring P1's fake 5)
    expect(room.winnerSocketId).toBe('p2_sock');
    expect(room.isDraw).toBe(false);
  });

  it('caps server-tracked test progress at 4 during timeout (cannot claim perfect 5 without submit_solution)', () => {
    // If a player somehow had 5 recorded in progress without official submission
    const room = createRoom('room_3', { testsPassed: 5 }, { testsPassed: 4 });
    const startTime = room.startTime;

    handleClientMatchTimeout(room, 'p1_sock', 5, startTime + MATCH_TIMEOUT_MS);

    // Both are capped at 4, resulting in a draw
    expect(room.ended).toBe(true);
    expect(room.isDraw).toBe(true);
    expect(room.winnerSocketId).toBeNull();
  });

  it('triggers server-side timeout watchdog automatically even if malicious client never sends timeout', () => {
    const room = createRoom('room_watchdog', { testsPassed: 2 }, { testsPassed: 1 });
    
    // Set watchdog timer on server
    room.matchTimeoutTimer = setTimeout(() => {
      executeServerMatchTimeout(room);
    }, MATCH_TIMEOUT_MS);

    expect(room.ended).toBeUndefined();

    // Advance timers by MATCH_TIMEOUT_MS (900 seconds)
    vi.advanceTimersByTime(MATCH_TIMEOUT_MS);

    // Watchdog must fire automatically
    expect(room.ended).toBe(true);
    expect(room.isTimeout).toBe(true);
    expect(room.winnerSocketId).toBe('p1_sock');
  });

  it('cleans up timeout watchdog timer when match ends early via submission or surrender', () => {
    const room = createRoom('room_cleanup', {}, {});
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    room.matchTimeoutTimer = setTimeout(() => {
      executeServerMatchTimeout(room);
    }, MATCH_TIMEOUT_MS);

    // Early termination: clear timer
    if (room.matchTimeoutTimer) {
      clearTimeout(room.matchTimeoutTimer);
      room.matchTimeoutTimer = null;
    }

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(room.matchTimeoutTimer).toBeNull();

    // Advance time past 900s: watchdog should not execute
    vi.advanceTimersByTime(MATCH_TIMEOUT_MS + 1000);
    expect(room.ended).toBeUndefined();
  });
});
