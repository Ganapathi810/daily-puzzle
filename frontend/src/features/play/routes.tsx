import { Route } from 'react-router-dom'
import PlayPage from './pages/PlayPage'

export const playRoutes = (
    <>
        <Route path="/play" element={<PlayPage />} />
    </>
)