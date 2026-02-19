// routes/sync.routes.ts
import { Router } from "express"
import { syncDailyScores, syncUserStatsAndUser } from "../controllers/sync.controller.js"

const router = Router()

router.post("/daily-scores", syncDailyScores)
router.post("/user-stats-and-user", syncUserStatsAndUser)

export default router
