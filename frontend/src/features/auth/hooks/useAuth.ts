import { useEffect, useState } from 'react'

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export function useAuth() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`/api/auth/me`, {
          credentials: 'include',
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data)
          setIsAuthenticated(true)
        } else {
          // fallback to guest
          const isGuest =
            localStorage.getItem('authMode') === 'guest'

          setIsAuthenticated(isGuest)
        }
      } catch {
        const isGuest =
          localStorage.getItem('authMode') === 'guest'

        setIsAuthenticated(isGuest)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { loading, isAuthenticated, user }
}
