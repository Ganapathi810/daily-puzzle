import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Card } from "../../../components/ui/Card";
import { generateDailyPuzzle } from "../../../core/engine/puzzleEngine";
import PuzzleRenderer from "../puzzleRenderer";
import type { BasePuzzle } from "../../../core/types";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function PlayPage() {
  const [puzzle, setPuzzle] = useState<BasePuzzle<any, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPuzzle() {
      try {
        setLoading(true);
        const dailyPuzzle = await generateDailyPuzzle(dayjs());
        setPuzzle(dailyPuzzle);
        setError(null);
      } catch (err) {
        setError("Failed to load puzzle. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPuzzle();
  }, []);

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8 h-screen w-screen">
          <LoadingSpinner text="Loading today's puzzle..." />
        </div>
      </Card>
    );
  }

  if (error || !puzzle) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <p className="text-red-500">{error || "Puzzle not available"}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="h-[85vh] w-screen">
        <PuzzleRenderer puzzle={puzzle} />
    </div>
  );
}