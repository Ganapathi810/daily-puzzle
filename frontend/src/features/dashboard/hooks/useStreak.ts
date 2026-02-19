// useStreak.ts

import { useMemo } from "react"
import dayjs from "dayjs"
import type { DailyActivity } from "../types"

export const useStreak = (activityList: DailyActivity[]) => {

  const currentStreak = useMemo(() => {
    if (activityList.length === 0) return 0

    const map: Record<string, DailyActivity> = {}
    activityList.forEach(a => {
      map[a.date] = a
    })

    let streak = 0
    let currentDate = dayjs().startOf("day")

    if (!map[currentDate.format("YYYY-MM-DD")]?.solved) {
      currentDate = currentDate.subtract(1, "day")
    }

    while (true) {
      const key = currentDate.format("YYYY-MM-DD")
      const activity = map[key]

      if (!activity || !activity.solved) break

      streak++
      currentDate = currentDate.subtract(1, "day")
    }

    return streak
  }, [activityList])


  const bestStreak = useMemo(() => {
    if (activityList.length === 0) return 0

    const solvedDays = activityList
      .filter(day => day.solved)
      .sort((a, b) =>
        dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
      )

    let best = 0
    let current = 0
    let previousDate: dayjs.Dayjs | null = null

    for (const day of solvedDays) {
      const currentDate = dayjs(day.date)

      if (!previousDate) {
        current = 1
      } else {
        const diff = currentDate.diff(previousDate, "day")

        if (diff === 1) {
          current++
        } else {
          current = 1
        }
      }

      best = Math.max(best, current)
      previousDate = currentDate
    }

    return best
  }, [activityList])

  return { currentStreak, bestStreak }
}
