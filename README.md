**Daily Puzzle** is a logic-based puzzle game designed to improve critical thinking and consistency. Users solve one unique puzzle every day, track their progress, maintain streaks, and compete on leaderboards — all with offline-first support and backend synchronization.

---

## 🔥 Features

* 🧩 **365 Unique Sudoku Puzzles** — Deterministic daily generation of Number Matrix type Sudoku puzzles.
* ✅ **Puzzle Validator** — Automatically verifies whether the user’s solution is correct.
* 📅 **One Puzzle Per Day** — Users can solve only one puzzle per day and cannot replay the same puzzle.
* 🔐 **Secure Authentication** — OAuth login (Google) and Guest login (local storage).
* 📦 **Offline-First Support** — Users can play the game offline and save thier progress which is done by Puzzle progress, daily activity, and achievements stored in IndexedDB.
* 🔥 **Streak Tracking** — Current streak and best streak computed from daily activity.
* 📊 **User Game Stats** — Total Points, Average Solve Time, and Number of Puzzles Solved.
* 💡 **Hint System** — Up to 5 hints available per day.
* 🏆 **Leaderboard**

  * Daily leaderboard (highest score for the day)
  * Lifetime leaderboard (most puzzles solved & highest total score)
* 📈 **Heatmap Activity View** — GitHub-style contributions heatmap showing daily activity.
* 🎯 **Score Calculation Based On**

  * Time Taken
  * Hints Used
  * Difficulty Level
* 📱 **Fully Responsive UI** — Optimized for all screen sizes from mobile to desktop.

---

## 🛠 Tech Stack

### 🎨 Frontend

* React
* TypeScript
* Redux
* Framer Motion
* Styled Components
* IndexedDB
* Day.js

### ⚙️ Backend

* Node.js
* Express
* PostgreSQL (Neon)
* Prisma ORM

### 🚀 Deployment

* Frontend → Vercel
* Backend → Render

---

## 🗂 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Ganapathi810/daily-puzzle.git
cd daily-puzzle
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev
```

---

## ⚙️ Environment Variables

### Frontend (`.env`)

```env
VITE_SERVER_URL="https://your-backend-domain.com"

```

---

### Backend (`.env`)

```env
# Frontend URL
CLIENT_URL="http://localhost:5173"

# Database (PostgreSQL / Neon)
DATABASE_URL="your-postgresql-connection-string"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="https://your-backend-domain.com/auth/google/callback"

# Session & JWT
SESSION_SECRET="your-session-secret"
JWT_SECRET="your-jwt-secret"
```

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| GET    | /auth/google          | Initiate Google OAuth login    |
| GET    | /auth/google/callback | Google OAuth callback handler  |
| GET    | /me                   | Get authenticated user details |

---

### 🏆 Leaderboard

| Method | Endpoint                     | Description                       |
| ------ | ---------------------------- | --------------------------------- |
| GET    | /leaderboard/scores/daily    | Fetch daily leaderboard scores    |
| GET    | /leaderboard/scores/lifetime | Fetch lifetime leaderboard scores |

---

### 🔄 Sync

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| POST   | /sync/daily-scores        | Sync daily scores to backend  |
| POST   | /sync/user-stats-and-user | Sync user stats and user data |

---

Made with 💙 by **Ganapathi Othoju**
