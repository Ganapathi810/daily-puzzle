// hooks/useAutoSync.ts

import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { syncDailyScores } from "../lib/sync"

export function useAutoSync() {
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    if (!user) return

    const handleOnline = () => {
      syncDailyScores(user.id)
    }

    if (navigator.onLine) {
      handleOnline()
    }

    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }, [user?.id])
}