'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { getLocalStorage, setLocalStorage, removeLocalStorage, LS_KEYS } from '@/lib/utils'

export interface User {
  id: string
  name: string
  email: string
  city: string
  bio?: string
  birthday?: string
  avatar?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  register: (data: { name: string; email: string; password: string; city: string }) => { success: boolean; error?: string }
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = getLocalStorage<User | null>(LS_KEYS.USER, null)
    setUser(stored)
    setIsLoading(false)
  }, [])

  const login = useCallback((email: string, password: string) => {
    if (!email || !password) return { success: false, error: 'Email dan password wajib diisi' }
    if (password.length < 6) return { success: false, error: 'Password minimal 6 karakter' }

    // Check if user exists in localStorage registry
    const users = getLocalStorage<Record<string, { user: User; password: string }>>(
      'halosam_users_registry', {}
    )
    const entry = users[email.toLowerCase()]
    if (!entry) return { success: false, error: 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.' }
    if (entry.password !== password) return { success: false, error: 'Password salah' }

    setUser(entry.user)
    setLocalStorage(LS_KEYS.USER, entry.user)
    return { success: true }
  }, [])

  const register = useCallback((data: { name: string; email: string; password: string; city: string }) => {
    if (!data.name || !data.email || !data.password) {
      return { success: false, error: 'Semua field wajib diisi' }
    }
    if (data.password.length < 6) return { success: false, error: 'Password minimal 6 karakter' }
    if (!data.email.includes('@')) return { success: false, error: 'Format email tidak valid' }

    const users = getLocalStorage<Record<string, { user: User; password: string }>>(
      'halosam_users_registry', {}
    )
    if (users[data.email.toLowerCase()]) {
      return { success: false, error: 'Email sudah terdaftar' }
    }

    const newUser: User = {
      id: Date.now().toString(36),
      name: data.name,
      email: data.email,
      city: data.city,
      createdAt: new Date().toISOString(),
    }

    users[data.email.toLowerCase()] = { user: newUser, password: data.password }
    setLocalStorage('halosam_users_registry', users)
    setUser(newUser)
    setLocalStorage(LS_KEYS.USER, newUser)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    removeLocalStorage(LS_KEYS.USER)
  }, [])

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...data }
      setLocalStorage(LS_KEYS.USER, updated)
      // Also update the registry
      const users = getLocalStorage<Record<string, { user: User; password: string }>>(
        'halosam_users_registry', {}
      )
      if (users[prev.email.toLowerCase()]) {
        users[prev.email.toLowerCase()].user = updated
        setLocalStorage('halosam_users_registry', users)
      }
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
