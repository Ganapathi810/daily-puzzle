import dayjs from "dayjs"
import type { DailyActivity } from "../types"
import { formatTime } from "../../../lib/formatTime"

type HeatmapTooltipProps = {
  x: number
  y: number
  date: string
  activity?: DailyActivity
}

export default function HeatmapTooltip({
  x,
  y,
  date,
  activity,
}: HeatmapTooltipProps) {
  return (
    <div
      className="fixed z-50 bg-[#03162c] text-white text-xs px-3 py-2 rounded-md shadow-lg pointer-events-none"
      style={{
        top: y + 15,
        left: x + 15,
      }}
    >
      {/* Date */}
      <div className="font-semibold">
        {dayjs(date).format("dddd, MMM D, YYYY")}
      </div>

      {/* Not Played */}
      {!activity || !activity.solved ? (
        <div className="mt-1 text-neutral-400">
          Not played
        </div>
      ) : (
        <>
          <div className="mt-1 text-neutral-300">
            Score: {activity.score}
          </div>

          <div className="text-neutral-300">
            Time: {formatTime(activity.timeTaken)}
          </div>

          <div className="text-neutral-300">
            Difficulty: {formatDifficulty(activity.difficulty)}
          </div>
        </>
      )}
    </div>
  )
}



function formatDifficulty(level: number) {
  switch (level) {
    case 1:
      return "Easy"
    case 2:
      return "Medium"
    case 3:
      return "Hard"
    case 4:
      return "Expert"
    default:
      return level
  }
}
