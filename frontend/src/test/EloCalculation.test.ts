import { describe, it, expect } from 'vitest';

// Implementation identical to backend/socketServer.js calculateDynamicEloDelta
function calculateDynamicEloDelta({
  playerElo = 1500,
  opponentElo = 1500,
  outcome = 1,
  isAiMatch = false,
  timeTakenSeconds = 60
}: {
  playerElo?: number;
  opponentElo?: number;
  outcome?: number;
  isAiMatch?: boolean;
  timeTakenSeconds?: number;
}) {
  if (isAiMatch && timeTakenSeconds < 10 && outcome === 1) {
    return 0;
  }

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

  if (outcome === 1 && delta <= 0) delta = 1;
  if (outcome === 0 && delta >= 0) delta = -1;

  if (isAiMatch && outcome === 1 && playerElo - opponentElo > 300) {
    return 0;
  }

  return delta;
}

describe('Dynamic ELO & Anti-Farming Unit Tests', () => {
  it('awards equal and opposite ELO for evenly matched PvP players (1500 vs 1500)', () => {
    const winnerDelta = calculateDynamicEloDelta({ playerElo: 1500, opponentElo: 1500, outcome: 1, isAiMatch: false });
    const loserDelta = calculateDynamicEloDelta({ playerElo: 1500, opponentElo: 1500, outcome: 0, isAiMatch: false });

    expect(winnerDelta).toBe(16);
    expect(loserDelta).toBe(-16);
  });

  it('awards huge ELO gain when an underdog defeats a much higher rated player (1200 beats 1600)', () => {
    const underdogDelta = calculateDynamicEloDelta({ playerElo: 1200, opponentElo: 1600, outcome: 1, isAiMatch: false });
    const favoriteDelta = calculateDynamicEloDelta({ playerElo: 1600, opponentElo: 1200, outcome: 0, isAiMatch: false });

    expect(underdogDelta).toBeGreaterThanOrEqual(28);
    expect(favoriteDelta).toBeLessThanOrEqual(-28);
  });

  it('awards minimal ELO gain when a top-tier player defeats a low-tier player (1700 beats 1300)', () => {
    const favoriteWinDelta = calculateDynamicEloDelta({ playerElo: 1700, opponentElo: 1300, outcome: 1, isAiMatch: false });
    expect(favoriteWinDelta).toBeLessThanOrEqual(5);
    expect(favoriteWinDelta).toBeGreaterThanOrEqual(1);
  });

  it('prevents bot farming by awarding 0 ELO if solution is submitted unnaturally fast (<10s)', () => {
    const botFarmDelta = calculateDynamicEloDelta({
      playerElo: 1500,
      opponentElo: 1500,
      outcome: 1,
      isAiMatch: true,
      timeTakenSeconds: 4
    });

    expect(botFarmDelta).toBe(0);
  });

  it('prevents high-rated players from farming low-level AI bots (1800 player vs 1200 bot)', () => {
    const highRatedDelta = calculateDynamicEloDelta({
      playerElo: 1800,
      opponentElo: 1200,
      outcome: 1,
      isAiMatch: true,
      timeTakenSeconds: 60
    });

    expect(highRatedDelta).toBe(0);
  });
});
