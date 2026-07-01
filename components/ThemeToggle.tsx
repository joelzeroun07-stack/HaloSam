'use client'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

interface ThemeToggleProps {
  variant?: 'default' | 'compact'
}

export default function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className={`${variant === 'compact' ? 'w-9 h-9' : 'w-full h-10'} rounded-xl bg-white/5`} />
    )
  }

  const isDark = theme === 'dark'

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="touch-target w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-all active-scale"
        aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      >
        <span
          className="material-symbols-outlined text-[18px] transition-transform duration-500"
          style={{
            fontVariationSettings: "'FILL' 1",
            transform: isDark ? 'rotate(0deg)' : 'rotate(360deg)',
            color: isDark ? 'var(--text-muted)' : 'var(--warning)',
          }}
        >
          {isDark ? 'dark_mode' : 'light_mode'}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <span
          className="material-symbols-outlined text-[20px] absolute inset-0 transition-all duration-500"
          style={{
            fontVariationSettings: "'FILL' 1",
            transform: isDark ? 'translateY(0) rotate(0deg)' : 'translateY(-24px) rotate(90deg)',
            opacity: isDark ? 1 : 0,
          }}
        >
          dark_mode
        </span>
        <span
          className="material-symbols-outlined text-[20px] absolute inset-0 transition-all duration-500"
          style={{
            fontVariationSettings: "'FILL' 1",
            color: 'var(--warning)',
            transform: isDark ? 'translateY(24px) rotate(-90deg)' : 'translateY(0) rotate(0deg)',
            opacity: isDark ? 0 : 1,
          }}
        >
          light_mode
        </span>
      </div>
      <span className="text-sm font-medium">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
      {/* Toggle Switch */}
      <div
        className="ml-auto w-10 h-5 rounded-full relative transition-colors duration-300"
        style={{
          background: isDark ? 'rgba(31,175,143,0.3)' : 'rgba(245,158,11,0.3)',
        }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 shadow-md"
          style={{
            left: isDark ? '2px' : '22px',
            background: isDark ? 'var(--primary)' : 'var(--warning)',
          }}
        />
      </div>
    </button>
  )
}
