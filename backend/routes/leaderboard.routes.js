import express from 'express'
import { getDailyScores, getLifetimeScores } from '../controllers/leaderboard.controller.js';
const router = express.Router()

router.get('/daily', getDailyScores)
router.get('/lifetime', getLifetimeScores)

export default router;
