import { Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import OAuthCallback from './pages/OAuthCallbackPage'

export const authRoutes = (
    <>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
    </>
)