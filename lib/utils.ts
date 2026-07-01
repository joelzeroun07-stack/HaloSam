// lib/utils.ts — Shared utility functions

/**
 * Format number as Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID')
}

/**
 * Format a Date or string to Indonesian locale date
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format short date: "Sel, 10 Jun 2025"
 */
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Generate a random alphanumeric Booking ID like "HS-A3K7XM"
 */
export function generateBookingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'HS-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate a random 16-digit Virtual Account number
 */
export function generateVirtualAccount(): string {
  let result = ''
  for (let i = 0; i < 16; i++) {
    result += Math.floor(Math.random() * 10).toString()
  }
  return result
}

/**
 * Generate a random referral code like "SAM-XKQP"
 */
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = 'SAM-'
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * SSR-safe localStorage getter
 */
export function getLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = window.localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

/**
 * SSR-safe localStorage setter
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage full or unavailable
  }
}

/**
 * Remove item from localStorage (SSR-safe)
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Category display map
 */
export const CATEGORY_MAP: Record<string, { label: string; icon: string; class: string }> = {
  alam: { label: 'Alam', icon: 'forest', class: 'cat-alam' },
  kuliner: { label: 'Kuliner', icon: 'restaurant', class: 'cat-kuliner' },
  budaya: { label: 'Budaya', icon: 'museum', class: 'cat-budaya' },
  pantai: { label: 'Pantai', icon: 'beach_access', class: 'cat-pantai' },
  desa: { label: 'Desa Wisata', icon: 'agriculture', class: 'cat-desa' },
  umkm: { label: 'UMKM', icon: 'storefront', class: 'cat-umkm' },
}

/**
 * LocalStorage keys — central reference
 */
export const LS_KEYS = {
  USER: 'halosam_user',
  BOOKINGS: 'halosam_bookings',
  SOCIAL_LINKS: 'halosam_social_links',
  BOOKMARKS: 'halosam_bookmarks',
  THEME: 'halosam_theme',
} as const
