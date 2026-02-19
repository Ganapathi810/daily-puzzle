import { createSeededRng } from "../engine/seededRng";
import type { BasePuzzle, PuzzleEngine } from "../types";

const SIZE = 9;
const BOX = 3;

export interface SudokuData {
  size: number;
  grid: (number | null)[][];
}

export type SudokuSolution = number[][];

/* -------- Utility -------- */

function shuffle<T>(array: T[], rng: () => number): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function countFilled(grid: (number | null)[][]): number {
  let count = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] !== null) count++;
    }
  }
  return count;
}

/* -------- Base Sudoku Pattern -------- */

function pattern(r: number, c: number): number {
  return (BOX * (r % BOX) + Math.floor(r / BOX) + c) % SIZE;
}

/* -------- Generate Full Valid Board -------- */

function generateFullBoard(rng: () => number): number[][] {
  const numbers = shuffle(
    Array.from({ length: SIZE }, (_, i) => i + 1),
    rng
  );

  const rowGroups = shuffle([0, 1, 2], rng);
  const colGroups = shuffle([0, 1, 2], rng);

  const rows = rowGroups.flatMap(group =>
    shuffle([0, 1, 2], rng).map(r => group * 3 + r)
  );
  const cols = colGroups.flatMap(group =>
    shuffle([0, 1, 2], rng).map(c => group * 3 + c)
  );

  return rows.map(r => cols.map(c => numbers[pattern(r, c)]));
}

/* -------- Sudoku Solver (returns solution count) -------- */

function isValid(board: (number | null)[][], row: number, col: number, num: number): boolean {
  for (let c = 0; c < SIZE; c++) {
    if (board[row][c] === num) return false;
  }
  for (let r = 0; r < SIZE; r++) {
    if (board[r][col] === num) return false;
  }
  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;
  for (let r = 0; r < BOX; r++) {
    for (let c = 0; c < BOX; c++) {
      if (board[boxRow + r][boxCol + c] === num) return false;
    }
  }
  return true;
}

function solve(board: (number | null)[][], stopAtMultiple = true): number {
  const grid = board.map(row => [...row]);
  let count = 0;

  function backtrack(): void {
    let row = -1, col = -1;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === null) {
          row = r;
          col = c;
          break;
        }
      }
      if (row !== -1) break;
    }

    if (row === -1) {
      count++;
      return;
    }

    for (let num = 1; num <= 9; num++) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num;
        backtrack();
        if (stopAtMultiple && count >= 2) {
          grid[row][col] = null;
          return;
        }
        grid[row][col] = null;
      }
    }
  }

  backtrack();
  return count;
}

function hasUniqueSolution(board: (number | null)[][]): boolean {
  return solve(board, true) === 1;
}

/* -------- Density scoring -------- */

function getCellDensityScore(
  grid: (number | null)[][],
  row: number,
  col: number
): number {
  let rowCount = 0;
  for (let c = 0; c < SIZE; c++) {
    if (grid[row][c] !== null) rowCount++;
  }
  let colCount = 0;
  for (let r = 0; r < SIZE; r++) {
    if (grid[r][col] !== null) colCount++;
  }
  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;
  let boxCount = 0;
  for (let r = 0; r < BOX; r++) {
    for (let c = 0; c < BOX; c++) {
      if (grid[boxRow + r][boxCol + c] !== null) boxCount++;
    }
  }
  return Math.max(rowCount, colCount, boxCount);
}

/* -------- Create Puzzle -------- */

function createPuzzle(
  fullBoard: number[][],
  rng: () => number,
  targetGivens: number
): (number | null)[][] {
  const puzzle: (number | null)[][] = fullBoard.map(row => [...row]);

  const cells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      cells.push([r, c]);
    }
  }

  let changed = true;
  while (countFilled(puzzle) > targetGivens && changed) {
    changed = false;

    const candidates = cells
      .filter(([r, c]) => puzzle[r][c] !== null)
      .map(([r, c]) => ({
        r,
        c,
        score: getCellDensityScore(puzzle, r, c),
      }));

    const shuffledCandidates = shuffle(candidates, rng);
    shuffledCandidates.sort((a, b) => b.score - a.score);

    for (const { r, c } of shuffledCandidates) {
      if (countFilled(puzzle) <= targetGivens) break;

      const value = puzzle[r][c];
      puzzle[r][c] = null;

      if (hasUniqueSolution(puzzle)) {
        changed = true;
      } else {
        puzzle[r][c] = value;
      }
    }
  }

  return puzzle;
}

/* -------- Engine -------- */

export const numberMatrixEngine: PuzzleEngine<SudokuData, SudokuSolution> = {
  generate(seed: number, date: string): BasePuzzle<SudokuData, SudokuSolution> {
    const rng = createSeededRng(seed);

    const difficulty = (seed % 3) + 1;
    const targetGivens = difficulty === 1 ? 35 : difficulty === 2 ? 30 : 25;

    const fullBoard = generateFullBoard(rng);
    const puzzleGrid = createPuzzle(fullBoard, rng, targetGivens);

    return {
      id: `sudoku-${seed}`,
      type: "number-matrix",
      difficulty,
      date,
      data: {
        size: SIZE,
        grid: puzzleGrid,
      },
      solution: fullBoard,
    };
  },

  validate(puzzle, userAnswer) {
    const solution = puzzle.solution;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (userAnswer[r][c] !== solution[r][c]) {
          return false;
        }
      }
    }
    return true;
  },
};