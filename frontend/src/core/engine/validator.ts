import type { BasePuzzle } from "../types";

export function validateSolution(
  puzzle: BasePuzzle,
  userAnswer: unknown
): boolean {
  return JSON.stringify(puzzle.solution) === JSON.stringify(userAnswer);
}