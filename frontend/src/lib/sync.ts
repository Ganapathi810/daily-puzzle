import axios from "axios"
import { getUnsyncedDailyActivity, markEntriesAsSynced } from "../core/persistance/db"
import { toast } from "react-toastify"

let isSyncing = false

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export async function syncDailyScores(userId: string) {
  console.log("Syncing daily scores")

  if (isSyncing) return
  if (!navigator.onLine) return
  if(!userId) return

  console.log("navigator.onLine in syncDailyScores")

  const unsynced = await getUnsyncedDailyActivity(userId)

  if (unsynced.length === 0) return

  try {
    isSyncing = true

    const response = await axios.post(`${SERVER_URL}/sync/daily-scores`, {
      entries: unsynced.map(entry => ({
        date: entry.date,
        score: entry.score,
        timeTaken: entry.timeTaken,
      })),
    })

    if(response.data.success){
      await markEntriesAsSynced(unsynced)
    }

    toast.success("Daily scores synced successfully")

  } catch (error) {
    console.error("Sync failed:", error)
    toast.error("Failed to sync daily scores")
  } finally {
    isSyncing = false
  }
}

export async function syncUserStatsAndUser(totalPoints: number, puzzlesSolved: number, averageSolveTime: number) {
  console.log("Syncing user stats and user")
  if (isSyncing) return
  if (!navigator.onLine) return

  console.log("navigator.onLine in syncUserStatsAndUser")

  try {
    isSyncing = true

    const response = await axios.post(`${SERVER_URL}/sync/user-stats-and-user`, {
      totalPoints,
      puzzlesSolved,
      averageSolveTime,
    })

    if(response.data.success){
      console.log("User stats and user synced successfully")
      toast.success("User stats and user synced successfully")
    }

  } catch (error) {
    console.error("Sync failed:", error)
    toast.error("Failed to sync user stats and user")
  } finally {
    isSyncing = false
  }
}
