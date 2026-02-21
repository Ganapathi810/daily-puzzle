import { useEffect, useState } from "react"
import type { Achievement } from "../types"
import { evaluateAchievements } from "../lib"
import { getAllAchievements } from "../../../core/persistance/db"

export function useAchievements(
  bestStreak: number,
  userId: string
): Achievement[] {
  const [achievements, setAchievements] = useState<Achievement[]>([])


  useEffect(() => {
    async function run() {
      await evaluateAchievements(bestStreak, userId)
      const all = await getAllAchievements(userId)
      setAchievements(all)
    }

    run()
  }, [bestStreak, userId])

  return achievements
}
