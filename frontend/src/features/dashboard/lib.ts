import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import weekOfYear from "dayjs/plugin/weekOfYear"
import isLeapYear from "dayjs/plugin/isLeapYear"
import type { DailyActivity } from "./types"
import { getAllAchievements, saveAchievement } from "../../core/persistance/db"
import { BADGE_CONFIG } from "./achievementsConfig"

dayjs.extend(weekday)
dayjs.extend(weekOfYear)
dayjs.extend(isLeapYear)



export const generateHeatmapDates = (year: number) => {
    const start = dayjs(`${year}-01-01`)
  const end = dayjs(`${year}-12-31`)

  const daysInYear = end.diff(start, "day") + 1

  const dates: dayjs.Dayjs[] = []

  for (let i = 0; i < daysInYear; i++) {
    dates.push(start.add(i, "day"))
  }

  return dates
  }

export const groupIntoWeeks = (dates: dayjs.Dayjs[]) => {
    const weeks: (dayjs.Dayjs | null)[][] = []

  let currentWeek: (dayjs.Dayjs | null)[] = new Array(7).fill(null)

  dates.forEach((date, index) => {
    const dayIndex = date.day() // 0=Sun, 1=Mon ...

    currentWeek[dayIndex] = date

    if (dayIndex === 6 || index === dates.length - 1) {
      weeks.push(currentWeek)
      currentWeek = new Array(7).fill(null)
    }
  })

  return weeks
  }

export const getMonthStartColumns = (weeks: (dayjs.Dayjs | null)[][]) => {
    const monthLabels: { month: string; col: number }[] = []
  
    weeks.forEach((week, colIndex) => {
      week.forEach((day) => {
        if (day && day.date() === 1) {
          monthLabels.push({
            month: day.format("MMM"),
            col: colIndex,
          })
        }
      })
    })
  
    return monthLabels
  }
  
  
  
export const getColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-gray-200"
      case 1:
        return "bg-green-200"
      case 2:
        return "bg-green-400"
      case 3:
        return "bg-green-600"
      case 4:
        return "bg-green-800"
      default:
        return "bg-gray-200"
    }
  }

export const calculateDashboardMetrics = (dailyActivity: DailyActivity[]) => {
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

  export const calculateCurrentStreak = (
    dailyActivity: DailyActivity[]
  ) => {
    const map: Record<string, DailyActivity> = {}
  
    dailyActivity.forEach(a => {
      map[a.date] = a
    })
  
    let streak = 0
    let current = dayjs().startOf("day")
  
    if (!map[current.format("YYYY-MM-DD")]?.solved) {
      current = current.subtract(1, "day")
    }
  
    while (true) {
      const key = current.format("YYYY-MM-DD")
      const activity = map[key]
  
      if (!activity || !activity.solved) break
  
      streak++
      current = current.subtract(1, "day")
    }
  
    return streak
  }
  


  export const calculateBestStreak = (
    activityList: DailyActivity[]
  ) => {
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
  }


  export const evaluateAchievements = async (
    bestStreak: number,
    userId: string
  ) => {
    const earned = await getAllAchievements(userId)
    const earnedIds = earned.map(a => a.id)
  
    for (const [batchId, value] of Object.entries(BADGE_CONFIG)) {
      if (
        bestStreak >= value.threshold &&
        !earnedIds.includes(batchId)
      ) {
        await saveAchievement({
          userId,
          id: batchId,
          title: value.title,
          earnedAt: dayjs().toISOString(),
        })
      }
    }
  }