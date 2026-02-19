// useDailyActivity.ts

import { useEffect, useState, useCallback } from "react"
import type { DailyActivity } from "../types"
import { getAllDailyActivity } from "../../../core/persistance/db"
import { useAppSelector } from "../../../app/hooks"

export const useDailyActivity = () => {
  const [data, setData] = useState<DailyActivity[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAppSelector(
      (state) => state.auth
    )
  

  const load = useCallback(async () => {
    setLoading(true)
    const result = await getAllDailyActivity(user?.id || "")
    setData(result)
    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
  }, [load, user])

  return {
    dailyActivity: data,
    loading,
    reload: load,
  }
}
