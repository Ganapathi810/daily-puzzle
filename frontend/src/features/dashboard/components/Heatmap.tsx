import { useMemo, useState } from "react"
import {
  generateHeatmapDates,
  groupIntoWeeks,
  getMonthStartColumns,
  getColor,
} from "../lib"
import type { DailyActivity } from "../types"
import HeatmapTooltip from "./HeapmapTooltip"

type HeatmapProps = {
  year: number
  dailyActivity: DailyActivity[]
}

export default function Heatmap({
  year,
  dailyActivity,
}: HeatmapProps) {

  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    date: string
    activity?: DailyActivity
  } | null>(null)

  /* ---------- Convert Array → Map ---------- */

  const activityMap = useMemo(() => {
    const map: Record<string, DailyActivity> = {}
    dailyActivity.forEach(a => {
      map[a.date] = a
    })
    return map
  }, [dailyActivity])

  const dates = generateHeatmapDates(year)
  const weeks = groupIntoWeeks(dates)
  const months = getMonthStartColumns(weeks)

  /* ---------- Heatmap Level ---------- */

  function getHeatmapLevel(activity?: DailyActivity): number {
    if (!activity || !activity.solved) return 0
  
    // 4️⃣ Perfect score (highest priority)
    if (activity.score === 100) return 4
  
    // 3️⃣ Hard difficulty
    if (activity.difficulty === 3) return 3
  
    // 2️⃣ Medium difficulty
    if (activity.difficulty === 2) return 2
  
    // 1️⃣ Just completed
    return 1
  }
  

  return (
    <div className="relative px-5 py-1">

      {/* Month Labels */}
      <div className="flex ml-10 mb-2 text-xs text-white font-semibold gap-[3px]">
        {weeks.map((_, colIndex) => {
          const month = months.find(m => m.col === colIndex)
          return (
            <div key={colIndex} className="w-4 text-center shrink-0">
              {month ? month.month : ""}
            </div>
          )
        })}
      </div>

      <div className="flex">

        {/* Weekday Labels */}
        <div className="flex flex-col text-xs text-white font-semibold mr-2">
          <div className="h-4 " />
          <div className="h-4">Mon</div>
          <div className="h-4" />
          <div className="h-4">Wed</div>
          <div className="h-4" />
          <div className="h-4">Fri</div>
          <div className="h-4" />
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-[3px]">
              {week.map((day, dIndex) => {

                if (!day) {
                  return (
                    <div
                      key={dIndex}
                      className="w-4 h-4"
                    />
                  )
                }

                const dateStr = day.format("YYYY-MM-DD")
                const activity = activityMap[dateStr]
                const level = getHeatmapLevel(activity)

                return (
                  <div
                    key={dIndex}
                    className={`w-4 h-4 rounded-sm ${getColor(level)} cursor-pointer hover:scale-110 transition-transform`}
                    onMouseEnter={(e) =>
                      setTooltip({
                        x: e.clientX,
                        y: e.clientY,
                        date: dateStr,
                        activity,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <HeatmapTooltip
          x={tooltip.x}
          y={tooltip.y}
          date={tooltip.date}
          activity={tooltip.activity}
        />
      )}
    </div>
  )
}
