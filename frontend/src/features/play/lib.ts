import type { DifficultyLevel } from "./types";


const DIFFICULTY_MULTIPLIER: Record<DifficultyLevel, number> = {
  1: 1,     // easy
  2: 1.3,   // medium
  3: 1.7,   // hard
};

export function calculateScore(
  elapsedTime: number,   // seconds
  hintsUsed: number,
  difficulty: DifficultyLevel
) {
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty];

  const baseScore = 100 * multiplier;

  const minutesTaken = Math.floor(elapsedTime / 60);

  // Grace period increases with difficulty
  const graceMinutes =
    difficulty === 1 ? 3 :
    difficulty === 2 ? 4 :
    5;

  const effectiveMinutes = Math.max(0, minutesTaken - graceMinutes);

  const timePenalty = effectiveMinutes * 4 * multiplier;

  const hintPenalty = hintsUsed * 6 * multiplier;

  const rawScore = baseScore - timePenalty - hintPenalty;

  return Math.max(50 * multiplier, Math.floor(rawScore));
}
