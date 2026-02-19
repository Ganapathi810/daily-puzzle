import { Route, Routes } from "react-router-dom";
import { authRoutes } from "../features/auth/routes";
import { dashboardRoutes } from "../features/dashboard/routes";
import { playRoutes } from "../features/play/routes";
import ProtectedLayout from "../features/auth/components/ProtectedLayout";
import { leaderboardRoutes } from "../features/leaderboard/routes";

export default function AppRouter() {
    return (
        <Routes>
            {authRoutes}
      
            <Route element={<ProtectedLayout />}>
                {dashboardRoutes}
                {playRoutes}
                {leaderboardRoutes}
            </Route>
      </Routes>
    )
}