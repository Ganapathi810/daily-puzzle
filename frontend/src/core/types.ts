export type PuzzleType = "number-matrix";

export interface BasePuzzle<TData = unknown, TSolution = unknown> {
  id: string;
  type: PuzzleType;
  difficulty: number;
  date: string;
  data: TData;
  solution: TSolution;
}

export interface PuzzleEngine<TData = unknown, TSolution = unknown> {
  generate(seed: number, date: string): BasePuzzle<TData, TSolution>;
  validate(
    puzzle: BasePuzzle<TData, TSolution>,
    userAnswer: TSolution
  ): boolean;
}


export interface PuzzleProgress {
  userId: string;
  date: string;              // YYYY-MM-DD
  puzzleId: string;          // unique ID of the puzzle
  currentGrid: (number | null)[][]; // user's current entries
  elapsedTime: number;       // seconds spent so far
  completed: boolean;     
  hintsUsed: number;   // whether puzzle is solved
}