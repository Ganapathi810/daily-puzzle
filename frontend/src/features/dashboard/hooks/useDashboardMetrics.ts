import type { DailyActivity } from "../types"

export const useDashboardMetrics = (
  dailyActivity: DailyActivity[]
) => {
  const solved = dailyActivity.filter(d => d.solved)

  const totalPoints = solved.reduce(
    (sum, d) => sum + d.score,
    0
  )

  const puzzlesSolved = solved.length

  const averageSolveTime =
    solved.length > 0
      ? Math.floor(
          solved.reduce(
            (sum, d) => sum + d.timeTaken,
            0
          ) / solved.length
        )
      : 0

  return {
    totalPoints,
    puzzlesSolved,
    averageSolveTime,
  }
}
