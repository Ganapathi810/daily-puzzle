// hooks/useAutoSync.ts

import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { syncDailyScores } from "../lib/sync"

export function useAutoSync() {
  console.log("useAutoSync")
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    if (!user) return

    console.log("user exists in useAutoSync")

    const handleOnline = () => {
      console.log("handleOnline")
      syncDailyScores(user.id)
    }

    if (navigator.onLine) {
      console.log("navigator.onLine")
      handleOnline()
    }

    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }, [user])
}