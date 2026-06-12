import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

const getUserFromResponse = (data) => data?.data ?? data

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data } = await authAPI.getProfile()
      setUser(getUserFromResponse(data))
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials)
    const userData = getUserFromResponse(data)
    setUser(userData)
    return userData
  }

  const register = async (userData) => {
    const { data } = await authAPI.register(userData)
    const newUser = getUserFromResponse(data)
    setUser(newUser)
    return newUser
  }

  const logout = async () => {
    await authAPI.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
