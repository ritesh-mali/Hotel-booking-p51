import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '../types/user'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: 'Test User',
      email,
      phone: '+1 (555) 123-4567',
      address: '',
      city: '',
      country: '',
    }
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const signup = async (name: string, email: string, password: string) => {
    // Mock authentication
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone: '',
      address: '',
      city: '',
      country: '',
    }
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
