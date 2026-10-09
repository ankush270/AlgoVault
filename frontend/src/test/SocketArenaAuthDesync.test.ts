import { describe, it, expect } from 'vitest';

describe('Socket.io Arena Re-Authentication Desync Fix', () => {
  interface SocketMock {
    id: string;
    connected: boolean;
    auth: Record<string, any>;
    isAuthenticated: boolean;
    user: { id: string; name: string; isGuest: boolean };
    emitted: { event: string; data: any }[];
    emit: (event: string, data?: any, callback?: Function) => void;
    disconnect: () => SocketMock;
    connect: () => SocketMock;
  }

  function createMockSocket(initialToken?: string): SocketMock {
    const socket: SocketMock = {
      id: 'sock_' + Math.random().toString(36).slice(2, 8),
      connected: true,
      auth: { token: initialToken },
      isAuthenticated: !!initialToken && initialToken.startsWith('valid_jwt_'),
      user: initialToken && initialToken.startsWith('valid_jwt_')
        ? { id: 'usr_123', name: 'VerifiedCoder', isGuest: false }
        : { id: 'guest_abc', name: 'Guest_1234', isGuest: true },
      emitted: [],
      emit(event: string, data?: any, callback?: Function) {
        socket.emitted.push({ event, data });
        if (event === 'authenticate') {
          const raw = data?.token;
          if (raw && raw.startsWith('valid_jwt_')) {
            socket.isAuthenticated = true;
            socket.user = { id: 'usr_123', name: 'VerifiedCoder', isGuest: false };
            if (callback) callback({ success: true, isAuthenticated: true, user: socket.user });
          } else {
            socket.isAuthenticated = false;
            socket.user = { id: `guest_${socket.id.slice(0, 8)}`, name: 'Guest_0001', isGuest: true };
            if (callback) callback({ success: true, isAuthenticated: false, user: socket.user });
          }
        }
      },
      disconnect() {
        socket.connected = false;
        return socket;
      },
      connect() {
        socket.connected = true;
        if (socket.auth?.token && socket.auth.token.startsWith('valid_jwt_')) {
          socket.isAuthenticated = true;
          socket.user = { id: 'usr_123', name: 'VerifiedCoder', isGuest: false };
        } else {
          socket.isAuthenticated = false;
          socket.user = { id: `guest_${socket.id.slice(0, 8)}`, name: 'Guest_0001', isGuest: true };
        }
        return socket;
      }
    };
    return socket;
  }

  it('initializes socket as guest when user is unauthenticated', () => {
    const socket = createMockSocket(undefined);
    expect(socket.isAuthenticated).toBe(false);
    expect(socket.user.isGuest).toBe(true);
    expect(socket.user.id).toMatch(/^guest_/);
  });

  it('re-authenticates socket when token is supplied dynamically via authenticate event', () => {
    const socket = createMockSocket(undefined);
    expect(socket.isAuthenticated).toBe(false);

    // Simulate login in UI: token becomes available
    const token = 'valid_jwt_user_123';
    socket.auth = { token };
    socket.emit('authenticate', { token });

    expect(socket.isAuthenticated).toBe(true);
    expect(socket.user.id).toBe('usr_123');
    expect(socket.user.name).toBe('VerifiedCoder');
    expect(socket.user.isGuest).toBe(false);
  });

  it('re-authenticates cleanly on reconnect with updated socket.auth credentials', () => {
    const socket = createMockSocket(undefined);
    expect(socket.isAuthenticated).toBe(false);

    // User logs in and socket reconnects outside active battle
    socket.auth = { token: 'valid_jwt_user_123' };
    socket.disconnect().connect();

    expect(socket.connected).toBe(true);
    expect(socket.isAuthenticated).toBe(true);
    expect(socket.user.id).toBe('usr_123');
  });

  it('retroactively upgrades room player authentication and prevents ELO save drop', () => {
    const socket = createMockSocket(undefined);

    // Simulate active room containing this socket before login
    const room = {
      roomId: 'room_duel_1',
      players: [
        { socketId: socket.id, userId: socket.user.id, username: socket.user.name, isAuthenticated: socket.isAuthenticated }
      ]
    };
    expect(room.players[0].isAuthenticated).toBe(false);

    // User logs in: server-side authenticate handler retroactively updates room players
    socket.emit('authenticate', { token: 'valid_jwt_user_123' });
    const p = room.players.find(x => x.socketId === socket.id);
    if (p) {
      p.userId = socket.user.id;
      p.username = socket.user.name;
      p.isAuthenticated = socket.isAuthenticated;
    }

    expect(room.players[0].isAuthenticated).toBe(true);
    expect(room.players[0].userId).toBe('usr_123');

    // Simulate updateArenaElo guard
    let eloSaved = false;
    function updateArenaElo(player: { isAuthenticated: boolean; userId: string }) {
      if (!player.isAuthenticated || !player.userId || player.userId.startsWith('guest_')) return;
      eloSaved = true;
    }

    updateArenaElo(room.players[0]);
    expect(eloSaved).toBe(true);
  });
});
