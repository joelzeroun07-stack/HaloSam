'use client'
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
  id: string
  type: ToastType
  message: string
}

interface ToastContextType {
  toasts: ToastItem[]
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
  remove: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    setToasts(prev => [...prev, { id, type, message }])
    // auto-dismiss
    setTimeout(() => remove(id), 3200)
  }, [remove])

  const value: ToastContextType = {
    toasts,
    success: (msg) => add('success', msg),
    error: (msg) => add('error', msg),
    info: (msg) => add('info', msg),
    warning: (msg) => add('warning', msg),
    remove,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  )
}

// ═══════════════════════════════════════════
// TOAST CONTAINER & ITEM UI
// ═══════════════════════════════════════════

const ICONS: Record<ToastType, { icon: string; color: string; bg: string }> = {
  success: { icon: 'check_circle', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  error: { icon: 'error', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  info: { icon: 'info', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  warning: { icon: 'warning', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
}

function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-sm:left-4 max-sm:right-4 max-sm:items-center" role="alert" aria-live="polite">
      {toasts.map(t => (
        <ToastItemUI key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItemUI({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
  const cfg = ICONS[toast.type]
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-lg min-w-[280px] max-w-sm transition-all duration-300"
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${cfg.color}33`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(20px)',
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1", color: cfg.color }}
          >
            {cfg.icon}
          </span>
        </div>
        <p className="text-sm font-medium flex-1" style={{ color: 'var(--text-primary)' }}>{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Tutup notifikasi"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 w-full" style={{ background: `${cfg.color}20` }}>
        <div className="h-full toast-progress" style={{ background: cfg.color }} />
      </div>
    </div>
  )
}
