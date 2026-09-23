export type LanguageType = 'python' | 'javascript' | 'cpp' | 'java';

export type AiDifficulty = 'apprentice' | 'master' | 'grandmaster';

export interface ProblemTestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface ArenaProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: ProblemTestCase[];
  constraints: string[];
  initialCode: Record<LanguageType, string>;
}

export interface OpponentTelemetry {
  username: string;
  codeLength: number;
  testsPassed: number;
  totalTests: number;
  lastAction?: string;
}

export interface MatchWinnerInfo {
  winnerUsername: string;
  winnerSocketId?: string;
  timeTakenSeconds: number;
  eloDelta: number;
  problemTitle?: string;
}

export interface ArenaChatMessage {
  id: string;
  sender: string;
  text: string;
  isEmoji?: boolean;
  timestamp: string;
}

export interface MatchHistoryItem {
  id: string;
  opponentName: string;
  result: 'WIN' | 'LOSS';
  eloDelta: number;
  timeTakenSeconds: number;
  problemTitle: string;
  date: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  elo: number;
  wins: number;
  losses: number;
  winRate: number;
  badge: string;
}
