import React, { createContext, useContext, useState } from 'react'
import type { User } from '../types'


interface AuthContextType {
  user:User | null
  isAuthenticated:boolean
  login:(user:User) => void
  logout:() => void
}
const AuthContext = createContext<AuthContextType | null>(null)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const isAuthenticated = user !== null

  const login = (user: User) => {
    debugger;
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}