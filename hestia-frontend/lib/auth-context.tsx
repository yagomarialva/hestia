"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authService, User as ApiUser, LoginData, RegisterData } from './auth-service'
import { apiInterceptor } from './api-interceptor'

interface User {
  id: number
  name: string
  email: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('access_token')
    
    if (storedUser && token && apiInterceptor.isTokenValid()) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
        // Configurar o router no interceptor
        apiInterceptor.setRouter(router)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        handleLogout()
      }
    } else if (storedUser || token) {
      // Token inválido ou expirado
      handleLogout()
    }
  }, []) // Removido router da dependência para evitar loop infinito

  const login = async (credentials: LoginData) => {
    try {
      const token = await authService.login(credentials)
      localStorage.setItem('access_token', token.access_token)
      const userData = await authService.getCurrentUser(token.access_token)
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const userData = await authService.register(data)
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(userData))
      // Após registro bem-sucedido, fazer login automático
      await login({ email: data.email, password: data.password })
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    router.push('/auth/login')
  }

  const logout = () => {
    handleLogout()
  }

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 