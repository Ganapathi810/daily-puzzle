import type { BasePuzzle } from "../../core/types";
import SudokuBoard from "./components/SudokuBoard";

interface Props {
    puzzle: BasePuzzle<any, any>;
  }
  
  export default function PuzzleRenderer({ puzzle }: Props) {
    switch (puzzle.type) {
      case "number-matrix":
        return <SudokuBoard puzzle={puzzle} />;
      
      default:
        return <div>Unknown puzzle type</div>;
    }
  }
  
