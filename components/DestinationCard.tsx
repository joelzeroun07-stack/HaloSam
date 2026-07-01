'use client'
import { useState } from 'react'
import { Destination } from '@/lib/data'
import { formatCurrency, getLocalStorage, setLocalStorage, LS_KEYS, CATEGORY_MAP } from '@/lib/utils'
import Link from 'next/link'

const crowdMap = {
  low: { label: 'Sepi', cls: 'crowd-low' },
  medium: { label: 'Sedang', cls: 'crowd-medium' },
  high: { label: 'Ramai', cls: 'crowd-high' },
}

interface DestinationCardProps {
  d: Destination
  size?: 'default' | 'compact' | 'horizontal'
  onCompare?: (d: Destination) => void
  isComparing?: boolean
  hideBookmark?: boolean
}

export default function DestinationCard({ d, size = 'default', onCompare, isComparing, hideBookmark = false }: DestinationCardProps) {
  const crowd = crowdMap[d.crowdLevel]
  const category = CATEGORY_MAP[d.category]
  const [bookmarked, setBookmarked] = useState(() => {
    if (typeof window === 'undefined') return false
    const bm = getLocalStorage<string[]>(LS_KEYS.BOOKMARKS, [])
    return bm.includes(d.id)
  })

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const bm = getLocalStorage<string[]>(LS_KEYS.BOOKMARKS, [])
    const updated = bookmarked ? bm.filter(id => id !== d.id) : [...bm, d.id]
    setLocalStorage(LS_KEYS.BOOKMARKS, updated)
    setBookmarked(!bookmarked)
  }

  const priceDisplay = d.foodPrice
    ? `${formatCurrency(d.foodPrice.min)}`
    : d.ticketPrice
      ? d.ticketPrice.min === 0 ? 'Gratis' : `${formatCurrency(d.ticketPrice.min)}`
      : null

  const ratingStars = (rating: number) => {
    const full = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <span key={i} className="material-symbols-outlined text-yellow-400 text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        ))}
        {hasHalf && <span className="material-symbols-outlined text-yellow-400 text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>}
      </div>
    )
  }

  // ═══ COMPACT SIZE ═══
  if (size === 'compact') {
    return (
      <Link href={`/destinations/${d.slug}`} className="block">
        <div className="glass rounded-2xl overflow-hidden group hover:border-[var(--primary)]/30 border border-transparent transition-all duration-300 cursor-pointer card-lift">
          <div className="h-44 overflow-hidden relative">
            <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
              <span className="text-white text-xs font-semibold px-3 py-1.5 btn-grad rounded-full">Lihat Detail →</span>
            </div>
            <div className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border ${crowd.cls}`}>
              {crowd.label.toUpperCase()}
            </div>
            {category && (
              <div className={`absolute top-3 ${hideBookmark ? 'right-3' : 'right-12'} text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${category.class}`}>
                <span className="material-symbols-outlined text-[11px]">{category.icon}</span> {category.label}
              </div>
            )}
            {!hideBookmark && (
              <button onClick={toggleBookmark} className="absolute top-3 right-3 touch-target w-7 h-7 rounded-full flex items-center justify-center transition-all"
                style={{ background: bookmarked ? 'var(--primary)' : 'rgba(0,0,0,0.4)' }}
                aria-label={bookmarked ? 'Hapus dari simpanan' : 'Simpan destinasi'}>
                <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0" }}>
                  bookmark
                </span>
              </button>
            )}
          </div>
          <div className="p-4">
            <h4 className="font-display text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{d.name}</h4>
            <p className="text-[11px] mb-3 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{d.description}</p>
            <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex items-center gap-1">
                {ratingStars(d.rating)}
                <span className="text-xs font-semibold ml-0.5" style={{ color: 'var(--text-primary)' }}>{d.rating}</span>
              </div>
              {priceDisplay && (
                <span className="text-xs font-bold font-mono" style={{ color: 'var(--text-accent)' }}>
                  {priceDisplay}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // ═══ HORIZONTAL SIZE ═══
  if (size === 'horizontal') {
    return (
      <Link href={`/destinations/${d.slug}`} className="block">
        <div className="glass rounded-xl p-3 flex gap-3 group hover:border-[var(--primary)]/20 border border-transparent transition-all card-lift cursor-pointer">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h4 className="font-display text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{d.name}</h4>
              <p className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <span className="material-symbols-outlined text-[12px]">location_on</span>
                {d.location}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-yellow-400 text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>{d.rating}</span>
              </div>
              {priceDisplay && <span className="text-[11px] font-mono font-bold" style={{ color: 'var(--text-accent)' }}>{priceDisplay}</span>}
            </div>
          </div>
          {!hideBookmark && (
            <button onClick={toggleBookmark} className="self-start touch-target" aria-label={bookmarked ? 'Hapus bookmark' : 'Tambah bookmark'}>
              <span className="material-symbols-outlined text-[18px] transition-colors"
                style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0", color: bookmarked ? 'var(--primary)' : 'var(--text-muted)' }}>
                bookmark
              </span>
            </button>
          )}
        </div>
      </Link>
    )
  }

  // ═══ DEFAULT (FULL) SIZE ═══
  return (
    <Link href={`/destinations/${d.slug}`} className="block">
      <div className="glass rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 group hover:glow-primary hover:border-[var(--primary)]/20 border border-transparent transition-all duration-300 cursor-pointer card-lift relative">
        {/* Compare checkbox */}
        {onCompare && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCompare(d) }}
            className="absolute top-3 right-3 z-10 w-6 h-6 rounded-md flex items-center justify-center transition-all"
            style={{
              background: isComparing ? 'var(--primary)' : 'var(--bg-card)',
              border: isComparing ? '2px solid var(--primary)' : '2px solid var(--border)',
            }}
            aria-label={isComparing ? 'Hapus dari perbandingan' : 'Bandingkan destinasi'}
          >
            {isComparing && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
          </button>
        )}

        <div className="w-full sm:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 relative">
          <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {!hideBookmark && (
            <button onClick={toggleBookmark} className="absolute top-3 right-3 touch-target w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ background: bookmarked ? 'var(--primary)' : 'rgba(0,0,0,0.4)' }}
              aria-label={bookmarked ? 'Hapus dari simpanan' : 'Simpan destinasi'}>
              <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0" }}>
                bookmark
              </span>
            </button>
          )}
        </div>
        <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
          <div>
            <div className="flex gap-2 flex-wrap mb-2.5">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${crowd.cls}`}>
                {crowd.label.toUpperCase()}
              </span>
              {category && (
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-0.5 ${category.class}`}>
                  <span className="material-symbols-outlined text-[11px]"></span> {category.label}
                </span>
              )}
              {d.matchScore && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  {d.matchScore}% Match
                </span>
              )}
            </div>
            <h4 className="font-display text-xl font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{d.name}</h4>
            <p className="text-sm flex items-center gap-1 mb-2" style={{ color: 'var(--text-muted)' }}>
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {d.location}
            </p>
            <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>{d.description}</p>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {ratingStars(d.rating)}
                <span className="text-sm font-semibold ml-0.5" style={{ color: 'var(--text-primary)' }}>{d.rating}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({d.reviewCount})</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {priceDisplay && (
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--text-accent)' }}>
                  {priceDisplay}
                </span>
              )}
              <span className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: 'var(--text-accent)' }}>
                Detail <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
