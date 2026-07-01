'use client'
import { ReactNode } from 'react'
import { ToastProvider } from '@/hooks/useToast'
import { AuthProvider } from '@/hooks/useAuth'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  )
}
