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
    // Mock role mapping
    let newUser: User;
    if (email === 'admin@hotel.com') {
      newUser = {
        id: 'admin_1',
        name: 'Central Admin',
        email,
        phone: '+1 (555) 999-9999',
        address: 'Headquarters',
        city: 'New York',
        country: 'USA',
        role: 'admin',
      }
    } else if (email === 'paris@hotel.com') {
      newUser = {
        id: 'mgr_paris',
        name: 'Paris Manager',
        email,
        phone: '+33 1 42 68 53 00',
        address: 'Rue Cambon',
        city: 'Paris',
        country: 'France',
        role: 'manager',
        managedBranchId: 'h1',
      }
    } else if (email === 'dubai@hotel.com') {
      newUser = {
        id: 'mgr_dubai',
        name: 'Dubai Manager',
        email,
        phone: '+971 4 301 7777',
        address: 'Jumeirah 1',
        city: 'Dubai',
        country: 'UAE',
        role: 'manager',
        managedBranchId: 'h2',
      }
    } else {
      newUser = {
        id: `user_${Date.now()}`,
        name: 'John Customer',
        email,
        phone: '+1 (555) 123-4567',
        address: '123 Guest St',
        city: 'San Francisco',
        country: 'USA',
        role: 'customer',
      }
    }

    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const signup = async (name: string, email: string, password: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone: '',
      address: '',
      city: '',
      country: '',
      role: 'customer',
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
