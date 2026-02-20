export interface User {
  id: string;
  name: string;
  // other fields from your schema (optional for this component)
}

export interface DailyScoreEntry {
  userId: string;
  name: string;
  email: string;
  score: number;
  timeTaken: number; // in seconds
  createdAt: string; // ISO date
}

export interface LifetimeScoreEntry {
  userId: string;
  name: string;
  email: string;
  totalPoints: number;
  puzzlesSolved: number;
  avgSolveTime: number;
}

export type LeaderboardEntry = DailyScoreEntry | LifetimeScoreEntry;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type FilterType = 'daily' | 'lifetime';
