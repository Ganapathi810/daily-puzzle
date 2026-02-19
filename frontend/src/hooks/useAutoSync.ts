// hooks/useAutoSync.ts

import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { syncDailyScores } from "../lib/sync"

export function useAutoSync() {

  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {

    

    async function handleOnline() {
      if (!user) return
      await syncDailyScores(user.id)
    }

    // Run once on mount if already online
    if (navigator.onLine) {
      if (!user) return
      syncDailyScores(user.id)
    }

    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("online", handleOnline)
    }

  }, [user])
}
