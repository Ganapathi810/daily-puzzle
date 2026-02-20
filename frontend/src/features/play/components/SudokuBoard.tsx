import { useEffect, useState, useRef, useCallback } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { formatTime } from "../../../lib/formatTime";

import type { SudokuData, SudokuSolution } from "../../../core/puzzles/NumberMatrix";
import type { BasePuzzle, PuzzleProgress } from "../../../core/types";
import { 
  getPuzzleProgress, 
  savePuzzleProgress, 
  saveDailyActivity 
} from "../../../core/persistance/db";
import type { DailyActivity } from "../../dashboard/types";
import { Card } from "../../../components/ui/Card";
import { Check, Lightbulb, Pause, Timer } from "lucide-react";
import { Cell, Overlay, OverlayForAlreadySolved, StyledGrid } from "./SudokuBoard.styles";
import { useAppSelector } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { calculateScore } from "../lib";
import type { DifficultyLevel } from "../types";

const MAX_HINTS_PER_DAY = 5; // configurable


/* ---------------- Component ---------------- */

interface Props {
  puzzle: BasePuzzle<any, any>;
}

export default function SudokuBoard({ puzzle }: Props) {

  
  if (puzzle.type !== "number-matrix") {
    return <div>Invalid puzzle type</div>;
  }

  const sudokuPuzzle = puzzle as BasePuzzle<SudokuData, SudokuSolution>;
  const today = dayjs().format("YYYY-MM-DD");

  /* ---------------- State ---------------- */

  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { user } = useAppSelector(
      (state) => state.auth
    );
  const [alreadySolved, setAlreadySolved] = useState(false);
  const navigate = useNavigate();

  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [grid, setGrid] = useState<(number | null)[][]>(
    sudokuPuzzle.data.grid.map(row => [...row])
  );
  const [completed, setCompleted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  /* ---------------- Load Progress ---------------- */

  useEffect(() => {
    async function load() {
      const progress = await getPuzzleProgress(user?.id ?? "", today);
      if (progress && progress.puzzleId === sudokuPuzzle.id) {
        // Merge saved grid with original fixed cells
        const mergedGrid = sudokuPuzzle.data.grid.map((row, r) =>
          row.map((cell, c) => {
            if (cell !== null) return cell; // keep original fixed
            return progress.currentGrid?.[r]?.[c] ?? null;
          })
        );
        setGrid(mergedGrid);
        setElapsedTime(progress.elapsedTime);
        setCompleted(progress.completed);
        setHintsUsed(progress.hintsUsed ?? 0);
      } else {
        setGrid(sudokuPuzzle.data.grid.map(row => [...row]));
        setHintsUsed(0);
      }
      setLoading(false);
    }
    load();
  }, [today, sudokuPuzzle.id, sudokuPuzzle.data.grid]);

  useEffect(() => {
    if (!loading) {
      if (completed) {
        setAlreadySolved(true);
      }
    }
  },[loading])

  /* ---------------- Timer ---------------- */

  useEffect(() => {
    if (isPlaying && !isPaused && !completed) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPaused, completed]);

  function startGame() {
    setIsPlaying(true);
    setIsPaused(false);
  }

  function pauseGame() {
    setIsPaused(true);
  }

  function resumeGame() {
    setIsPaused(false);
  }

  /* ---------------- Auto Save ---------------- */

  useEffect(() => {
    if (loading) return;
    async function autoSave() {
      const progress: PuzzleProgress = {
        userId: user?.id ?? "",
        date: today,
        puzzleId: sudokuPuzzle.id,
        currentGrid: grid,
        elapsedTime,
        completed,
        hintsUsed,
      };
      await savePuzzleProgress(progress);
    }
    autoSave();
  }, [grid, elapsedTime, completed, hintsUsed, today, sudokuPuzzle.id, loading]);

  /* ---------------- Candidate Generation ---------------- */

  const computeCandidates = useCallback((): Set<number>[][] => {
    const candidates: Set<number>[][] = Array(9).fill(null).map(() => Array(9).fill(null));
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] !== null) continue; // fixed or filled cell

        const possible = new Set<number>([1,2,3,4,5,6,7,8,9]);

        // Remove numbers in same row
        for (let col = 0; col < 9; col++) {
          const val = grid[r][col];
          if (val !== null) possible.delete(val);
        }
        // Remove numbers in same column
        for (let row = 0; row < 9; row++) {
          const val = grid[row][c];
          if (val !== null) possible.delete(val);
        }
        // Remove numbers in same 3x3 box
        const boxRow = Math.floor(r / 3) * 3;
        const boxCol = Math.floor(c / 3) * 3;
        for (let dr = 0; dr < 3; dr++) {
          for (let dc = 0; dc < 3; dc++) {
            const val = grid[boxRow + dr][boxCol + dc];
            if (val !== null) possible.delete(val);
          }
        }
        candidates[r][c] = possible;
      }
    }
    return candidates;
  }, [grid]);

  /* ---------------- Hint Detection Functions ---------------- */

  // Find a row, column, or box with exactly one empty cell (Full House)
  const findFullHouse = useCallback((): string | null => {
    // Check rows
    for (let r = 0; r < 9; r++) {
      const emptyCols: number[] = [];
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === null) emptyCols.push(c);
      }
      if (emptyCols.length === 1) {
        const col = emptyCols[0];
        return `Look at row ${r+1}. Only one cell is empty (column ${col+1}). Which number must go there?`;
      }
    }
    // Check columns
    for (let c = 0; c < 9; c++) {
      const emptyRows: number[] = [];
      for (let r = 0; r < 9; r++) {
        if (grid[r][c] === null) emptyRows.push(r);
      }
      if (emptyRows.length === 1) {
        const row = emptyRows[0];
        return `Look at column ${c+1}. Only one cell is empty (row ${row+1}). Which number must go there?`;
      }
    }
    // Check boxes
    for (let box = 0; box < 9; box++) {
      const startRow = Math.floor(box / 3) * 3;
      const startCol = (box % 3) * 3;
      const emptyCells: { r: number; c: number }[] = [];
      for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
          const r = startRow + dr;
          const c = startCol + dc;
          if (grid[r][c] === null) emptyCells.push({ r, c });
        }
      }
      if (emptyCells.length === 1) {
        const cell = emptyCells[0];
        return `Look at the 3x3 box starting at row ${startRow+1}, col ${startCol+1}. Only one cell is empty (row ${cell.r+1}, col ${cell.c+1}). Which number must go there?`;
      }
    }
    return null;
  }, [grid]);

  // Find a cell with exactly one candidate (Naked Single)
  const findNakedSingle = useCallback((candidates: Set<number>[][]): string | null => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] !== null) continue;
        const possible = candidates[r][c];
        if (possible && possible.size === 1) {
          const num = Array.from(possible)[0];
          return `Cell (row ${r+1}, col ${c+1}) can only be ${num}. Check its row, column, and box.`;
        }
      }
    }
    return null;
  }, [grid]);

  // Find a hidden single: a digit that can only go in one cell of a unit
  const findHiddenSingle = useCallback((candidates: Set<number>[][]): string | null => {
    // Helper to check a set of cells (unit)
    const checkUnit = (cells: { r: number; c: number }[], unitName: string): string | null => {
      for (let num = 1; num <= 9; num++) {
        const possibleCells: { r: number; c: number }[] = [];
        for (const { r, c } of cells) {
          if (grid[r][c] !== null) continue;
          if (candidates[r][c].has(num)) possibleCells.push({ r, c });
        }
        if (possibleCells.length === 1) {
          const cell = possibleCells[0];
          return `In ${unitName}, the digit ${num} can only go in cell (row ${cell.r+1}, col ${cell.c+1}).`;
        }
      }
      return null;
    };

    // Check rows
    for (let r = 0; r < 9; r++) {
      const cells = Array.from({ length: 9 }, (_, c) => ({ r, c }));
      const hint = checkUnit(cells, `row ${r+1}`);
      if (hint) return hint;
    }
    // Check columns
    for (let c = 0; c < 9; c++) {
      const cells = Array.from({ length: 9 }, (_, r) => ({ r, c }));
      const hint = checkUnit(cells, `column ${c+1}`);
      if (hint) return hint;
    }
    // Check boxes
    for (let box = 0; box < 9; box++) {
      const startRow = Math.floor(box / 3) * 3;
      const startCol = (box % 3) * 3;
      const cells: { r: number; c: number }[] = [];
      for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
          cells.push({ r: startRow + dr, c: startCol + dc });
        }
      }
      const hint = checkUnit(cells, `box starting at (${startRow+1},${startCol+1})`);
      if (hint) return hint;
    }
    return null;
  }, [grid]);

  // Find a naked pair: two cells in a unit with identical candidate sets of size 2
  const findNakedPair = useCallback((candidates: Set<number>[][]): string | null => {
    const checkUnit = (cells: { r: number; c: number }[], unitName: string): string | null => {
      // Collect all empty cells and their candidates
      const emptyCells = cells.filter(({ r, c }) => grid[r][c] === null);
      for (let i = 0; i < emptyCells.length; i++) {
        for (let j = i+1; j < emptyCells.length; j++) {
          const cellA = emptyCells[i];
          const cellB = emptyCells[j];
          const candA = candidates[cellA.r][cellA.c];
          const candB = candidates[cellB.r][cellB.c];
          if (candA.size === 2 && candB.size === 2 && 
              Array.from(candA).every(n => candB.has(n)) &&
              Array.from(candB).every(n => candA.has(n))) {
            // Found a naked pair
            const pair = Array.from(candA).join(' and ');
            return `In ${unitName}, cells (${cellA.r+1},${cellA.c+1}) and (${cellB.r+1},${cellB.c+1}) form a naked pair {${pair}}. You can eliminate ${pair} from other cells in this unit.`;
          }
        }
      }
      return null;
    };

    // Check rows
    for (let r = 0; r < 9; r++) {
      const cells = Array.from({ length: 9 }, (_, c) => ({ r, c }));
      const hint = checkUnit(cells, `row ${r+1}`);
      if (hint) return hint;
    }
    // Check columns
    for (let c = 0; c < 9; c++) {
      const cells = Array.from({ length: 9 }, (_, r) => ({ r, c }));
      const hint = checkUnit(cells, `column ${c+1}`);
      if (hint) return hint;
    }
    // Check boxes
    for (let box = 0; box < 9; box++) {
      const startRow = Math.floor(box / 3) * 3;
      const startCol = (box % 3) * 3;
      const cells: { r: number; c: number }[] = [];
      for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
          cells.push({ r: startRow + dr, c: startCol + dc });
        }
      }
      const hint = checkUnit(cells, `box starting at (${startRow+1},${startCol+1})`);
      if (hint) return hint;
    }
    return null;
  }, [grid]);

  // Find a hidden pair: two numbers that appear only in two cells of a unit
  const findHiddenPair = useCallback((candidates: Set<number>[][]): string | null => {
    const checkUnit = (cells: { r: number; c: number }[], unitName: string): string | null => {
      // For each pair of digits 1-9, find which empty cells contain them
      for (let a = 1; a <= 9; a++) {
        for (let b = a+1; b <= 9; b++) {
          const cellsWithA: { r: number; c: number }[] = [];
          const cellsWithB: { r: number; c: number }[] = [];
          for (const { r, c } of cells) {
            if (grid[r][c] !== null) continue;
            if (candidates[r][c].has(a)) cellsWithA.push({ r, c });
            if (candidates[r][c].has(b)) cellsWithB.push({ r, c });
          }
          // Hidden pair condition: both numbers appear in exactly the same two cells
          if (cellsWithA.length === 2 && cellsWithB.length === 2) {
            // Check if they are the same two cells
            const cell1 = cellsWithA[0];
            const cell2 = cellsWithA[1];
            const same = cellsWithB.some(cell => cell.r === cell1.r && cell.c === cell1.c) &&
                         cellsWithB.some(cell => cell.r === cell2.r && cell.c === cell2.c);
            if (same) {
              return `In ${unitName}, digits ${a} and ${b} appear only in cells (${cell1.r+1},${cell1.c+1}) and (${cell2.r+1},${cell2.c+1}). This is a hidden pair – you can remove other candidates from these two cells.`;
            }
          }
        }
      }
      return null;
    };

    // Check rows
    for (let r = 0; r < 9; r++) {
      const cells = Array.from({ length: 9 }, (_, c) => ({ r, c }));
      const hint = checkUnit(cells, `row ${r+1}`);
      if (hint) return hint;
    }
    // Check columns
    for (let c = 0; c < 9; c++) {
      const cells = Array.from({ length: 9 }, (_, r) => ({ r, c }));
      const hint = checkUnit(cells, `column ${c+1}`);
      if (hint) return hint;
    }
    // Check boxes
    for (let box = 0; box < 9; box++) {
      const startRow = Math.floor(box / 3) * 3;
      const startCol = (box % 3) * 3;
      const cells: { r: number; c: number }[] = [];
      for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
          cells.push({ r: startRow + dr, c: startCol + dc });
        }
      }
      const hint = checkUnit(cells, `box starting at (${startRow+1},${startCol+1})`);
      if (hint) return hint;
    }
    return null;
  }, [grid]);

  /* ---------------- Main Hint Handler ---------------- */

  const handleHint = useCallback(() => {
    if (completed || !isPlaying || isPaused) {
      alert("You can only use hints while playing.");
      return;
    }

    if (hintsUsed >= MAX_HINTS_PER_DAY) {
      alert(`You've used all ${MAX_HINTS_PER_DAY} hints for today.`);
      return;
    }

    const candidates = computeCandidates();

    // Ordered from simplest to most complex
    const fullHouse = findFullHouse();
    if (fullHouse) {
      setHintsUsed(prev => prev + 1);
      alert(`💡 Hint: ${fullHouse} (${hintsUsed+1}/${MAX_HINTS_PER_DAY} used)`);
      return;
    }

    const nakedSingle = findNakedSingle(candidates);
    if (nakedSingle) {
      setHintsUsed(prev => prev + 1);
      alert(`💡 Hint: ${nakedSingle} (${hintsUsed+1}/${MAX_HINTS_PER_DAY} used)`);
      return;
    }

    const hiddenSingle = findHiddenSingle(candidates);
    if (hiddenSingle) {
      setHintsUsed(prev => prev + 1);
      alert(`💡 Hint: ${hiddenSingle} (${hintsUsed+1}/${MAX_HINTS_PER_DAY} used)`);
      return;
    }

    const nakedPair = findNakedPair(candidates);
    if (nakedPair) {
      setHintsUsed(prev => prev + 1);
      alert(`💡 Hint: ${nakedPair} (${hintsUsed+1}/${MAX_HINTS_PER_DAY} used)`);
      return;
    }

    const hiddenPair = findHiddenPair(candidates);
    if (hiddenPair) {
      setHintsUsed(prev => prev + 1);
      alert(`💡 Hint: ${hiddenPair} (${hintsUsed+1}/${MAX_HINTS_PER_DAY} used)`);
      return;
    }

    // No hint found
    alert("No hint available for the current position. Try looking for more complex patterns (X-Wing, Swordfish, etc.) or continue solving.");
  }, [completed, isPlaying, isPaused, hintsUsed, computeCandidates, findFullHouse, findNakedSingle, findHiddenSingle, findNakedPair, findHiddenPair]);

  /* ---------------- Submit with Score Calculation ---------------- */

  async function handleSubmit() {
    if (completed) return;

    const solution = sudokuPuzzle.solution;
    console.log(solution)
    const isCorrect = solution.every((row, r) =>
      row.every((value, c) => value === grid[r][c])
    );

    if (!isCorrect) {
      alert("❌ Incorrect. Keep trying!");
      return;
    }

    setCompleted(true);

    // Score calculation


    const score = calculateScore(elapsedTime, hintsUsed, sudokuPuzzle.difficulty as DifficultyLevel);

    if (!user) {
      alert("🎉 Sudoku Completed, But as you are guest, you cannot save your score. Please log in.");
      return;
    }
    const record: DailyActivity = {
      userId: user?.id,
      date: today,
      solved: true,
      score,
      timeTaken: elapsedTime,
      difficulty: sudokuPuzzle.difficulty ?? 2,
      synced: false,
    };

    await saveDailyActivity(record);
    alert(`🎉 Sudoku Completed! Score: ${score}`);
  }

  /* ---------------- Keyboard Input (Numbers + Arrow Navigation) ---------------- */

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isPlaying || isPaused || completed) return;

      // Handle arrow keys for navigation
      if (e.key.startsWith("Arrow")) {
        e.preventDefault(); // prevent page scrolling
        if (!selected) {
          setSelected({ row: 0, col: 0 });
          return;
        }

        let newRow = selected.row;
        let newCol = selected.col;

        switch (e.key) {
          case "ArrowUp":
            newRow = Math.max(0, selected.row - 1);
            break;
          case "ArrowDown":
            newRow = Math.min(8, selected.row + 1);
            break;
          case "ArrowLeft":
            newCol = Math.max(0, selected.col - 1);
            break;
          case "ArrowRight":
            newCol = Math.min(8, selected.col + 1);
            break;
        }

        if (newRow !== selected.row || newCol !== selected.col) {
          setSelected({ row: newRow, col: newCol });
        }
        return;
      }

      // Handle number input and backspace (only if a cell is selected)
      if (!selected) return;

      const { row, col } = selected;
      // Fixed cells cannot be edited
      if (sudokuPuzzle.data.grid[row][col] !== null) return;

      if (e.key >= "1" && e.key <= "9") {
        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = Number(e.key);
        setGrid(newGrid);
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = null;
        setGrid(newGrid);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isPaused, completed, selected, grid, sudokuPuzzle.data.grid]);


  const renderTimeElapsedAndHintsUsed = (
    <div className="flex justify-around w-full">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Timer className="text-blue-900 size-7"/> 
          <span className="text-white font-semibold">Time Elapsed</span>
        </div>
        <span className="text-blue-600 text-center font-semibold">{formatTime(elapsedTime)}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Lightbulb className="text-blue-900 size-7"/> 
          <span className="text-white font-semibold">Hints Used</span>
        </div>
        <span className="text-blue-600 text-center font-semibold">{hintsUsed}/{MAX_HINTS_PER_DAY}</span>
      </div>
    </div>
  )


  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 lg:gap-6 h-full">

      {alreadySolved && (
          <OverlayForAlreadySolved>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <Check className="text-(--bg-surface) size-6 font-bold"/>
                <span>You have already solved today's puzzle, come back tomorrow.</span>
              </div>
              <button onClick={() => navigate("/")} className=" cursor-pointer px-6 py-2 bg-(--bg-surface) text-white rounded-lg">Go to Dashboard</button>
            </div>
          </OverlayForAlreadySolved>
        )}

      <section className="flex items-start md:items-center justify-center w-full">
        <div className="flex flex-col items-center gap-3 w-full">

          <h2 className="font-semibold text-2xl text-white mt-2">Sudoku Puzzle</h2>

          <div className="md:hidden w-full p-2 flex justify-center">
            {renderTimeElapsedAndHintsUsed}
          </div>

          <Card>
            <StyledGrid>
                {(!isPlaying || isPaused) && !completed && (
                  <Overlay>
                    {!isPlaying ? (
                      <button
                        onClick={startGame}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg"
                      >
                        ▶ Play
                      </button>
                    ) : (
                      <button
                        onClick={resumeGame}
                        className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg"
                      >
                        ▶ Resume
                      </button>
                    )}
                  </Overlay>
                )}

                {grid.map((row, r) =>
                  row.map((cell, c) => {
                    const isFixed = sudokuPuzzle.data.grid[r][c] !== null;
                    const isSelected = selected?.row === r && selected?.col === c;

                    return (
                      <Cell
                        key={`${r}-${c}`}
                        selected={isSelected}
                        isFixed={isFixed}
                        onClick={() => {
                          if (!isFixed && isPlaying && !isPaused && !completed) {
                            setSelected({ row: r, col: c });
                          }
                        }}
                      >
                        {cell ?? ""}
                      </Cell>
                    );
                  })
                )}
            </StyledGrid>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4 justify-start md:justify-center pb-5">
        <div className="hidden md:block w-full">
          {renderTimeElapsedAndHintsUsed}
        </div>

        <div className="flex gap-4 mt-4 flex-wrap justify-around">
          {isPlaying && !isPaused && !completed && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ boxShadow: "4px 4px 2px 2px rgba(219, 100, 20, 0.5)"}}
                onClick={pauseGame}
                className="cursor-pointer flex items-center gap-2 text-white rounded-lg bg-orange-500 px-5 py-2 md:px-10 md:py-3"
                >
                <Pause className="size-5 md:size-6 text-white"/> 
                <span className="text-white font-semibold">Pause</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ boxShadow: "4px 4px 2px 2px rgba(194, 37, 152, 0.5)"}}
                onClick={handleHint}
                className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white rounded-lg bg-pink-500 px-5 py-2 md:px-10 md:py-3"
                disabled={hintsUsed >= MAX_HINTS_PER_DAY}
              >
                <Lightbulb className="size-5 md:size-6 text-white"/> 
                <span className="text-white font-semibold">Hint</span>
              </motion.button>
            </>
          )}
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ boxShadow: "4px 4px 2px 2px rgba(0, 255, 0, 0.5)"}}
            disabled={isPlaying ? false : true}
            className="px-5 py-2 md:px-10 md:py-3 cursor-pointer text-white font-semibold rounded-lg bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </motion.button>
        </div>
      </section>
    </div>
  );
}