import dotenv from 'dotenv'
dotenv.config() 

import express from 'express'
import cors from 'cors'
import session from 'express-session'
import authRoutes from './routes/auth.routes.js'
import syncRoutes from './routes/sync.routes.js'
import leaderboardRoutes from './routes/leaderboard.routes.js'
import pgSession from 'connect-pg-simple'
import pkg from 'pg'

const app = express()
const PORT = process.env.PORT || 3000

app.set('trust proxy', 1)

const { Pool } = pkg;

const PostgresStore = pgSession(session);

const  pool = new Pool({
  connectionString: process.env.DATABASE_URL
})


pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})


console.log(process.env.CLIENT_URL)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)


app.use(express.json())

app.use(
  session({
    store: new PostgresStore({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    name: 'dailypuzzle.sid',
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true, // true in production (cookie is sent only over https), false in localhost (cookie is sent over http and https) to work locally as well
      sameSite: 'none', // true in production (cookie is sent only over https), false in localhost (cookie is sent over http and https) to work locally as well
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
)

app.use('/auth', authRoutes)
app.use('/sync', syncRoutes)
app.use('/leaderboard/scores', leaderboardRoutes)

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})
