import dotenv from 'dotenv'
dotenv.config() 

import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import syncRoutes from './routes/sync.routes.js'
import leaderboardRoutes from './routes/leaderboard.routes.js'
import { authMiddleware } from './middlewares/auth.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'
import cookieParser from 'cookie-parser';

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)


app.use(express.json())

app.use(cookieParser(process.env.SESSION_SECRET)); 


app.use('/auth', authRoutes)
app.use('/leaderboard/scores', leaderboardRoutes) //everyone can see leaderboard

app.use(authMiddleware)

app.use('/sync', syncRoutes)

// Global Error Handler
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})
