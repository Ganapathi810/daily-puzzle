import type { DailyActivity } from "../types"
import { calculateDashboardMetrics } from "../lib"

export const useDashboardMetrics = (
  dailyActivity: DailyActivity[]
) => {
  return calculateDashboardMetrics(dailyActivity)
}
