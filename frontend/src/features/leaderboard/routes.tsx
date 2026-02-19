import { Route } from 'react-router-dom'
import LeaderboardPage from './pages/LeaderboardPage'

export const leaderboardRoutes = (
    <>
        <Route path="/leaderboard" element={<LeaderboardPage />} />
    </>
)