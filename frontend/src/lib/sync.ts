import axios from "axios"
import { getUnsyncedDailyActivity, markEntriesAsSynced } from "../core/persistance/db"

let isSyncing = false

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export async function syncDailyScores(userId: string) {

  if (isSyncing) return
  if (!navigator.onLine) return
  if(!userId) return

  const unsynced = await getUnsyncedDailyActivity(userId)

  if (unsynced.length === 0) return

  try {
    isSyncing = true

    await axios.post(`${SERVER_URL}/sync/daily-scores`, {
      entries: unsynced.map(entry => ({
        date: entry.date,
        score: entry.score,
        timeTaken: entry.timeTaken,
      })),
    }, {
        withCredentials: true
    })

    await markEntriesAsSynced(unsynced)


  } catch (error) {
    console.error("Sync failed:", error)
  } finally {
    isSyncing = false
  }
}

export async function syncUserStatsAndUser(totalPoints: number, puzzlesSolved: number, averageSolveTime: number) {
  if (isSyncing) return
  if (!navigator.onLine) return

  try {
    isSyncing = true

    await axios.post(`${SERVER_URL}/sync/user-stats-and-user`, {
      totalPoints,
      puzzlesSolved,
      averageSolveTime,
    }, {
        withCredentials: true
    })

  } catch (error) {
    console.error("Sync failed:", error)
  } finally {
    isSyncing = false
  }
}
