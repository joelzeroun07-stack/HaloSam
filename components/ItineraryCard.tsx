'use client'
import { formatCurrency } from '@/lib/utils'

interface Activity {
  // New format
  time: string
  type?: 'transport' | 'meal' | 'destination' | 'rest' | 'shopping'
  name: string
  address?: string
  location?: string
  duration: number | string
  cost?: { min: number; max: number }
  description?: string
  tips?: string
  tip?: string
  photoSpot?: string | null
  mustTry?: string | null
  crowdLevel?: 'sepi' | 'sedang' | 'ramai' | 'rendah'
  weatherAlternative?: string | null
  image?: string
}

interface DayPlan {
  day: number
  date?: string
  title?: string
  theme?: string
  weather?: string
  activities: Activity[]
  dailyBudget?: { min: number; max: number }
  dailyCost?: number
  highlights?: string[]
}

interface ItineraryCardProps {
  dayPlan: DayPlan
}

const TYPE_ICONS: Record<string, { icon: string; bg: string }> = {
  transport: { icon: 'directions_car', bg: 'rgba(59,130,246,0.15)' },
  meal: { icon: 'restaurant', bg: 'rgba(245,158,11,0.15)' },
  destination: { icon: 'landscape', bg: 'rgba(31,175,143,0.15)' },
  rest: { icon: 'coffee', bg: 'rgba(139,92,246,0.15)' },
  shopping: { icon: 'shopping_bag', bg: 'rgba(236,72,153,0.15)' },
}

const CROWD_STYLE: Record<string, { label: string; cls: string }> = {
  sepi: { label: 'Sepi', cls: 'crowd-low' },
  rendah: { label: 'Sepi', cls: 'crowd-low' },
  sedang: { label: 'Sedang', cls: 'crowd-medium' },
  ramai: { label: 'Ramai', cls: 'crowd-high' },
}

export default function ItineraryCard({ dayPlan }: ItineraryCardProps) {
  const budgetDisplay = dayPlan.dailyBudget
    ? `${formatCurrency(dayPlan.dailyBudget.min)} - ${formatCurrency(dayPlan.dailyBudget.max)}`
    : dayPlan.dailyCost
      ? formatCurrency(dayPlan.dailyCost)
      : null

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      {/* Day Header */}
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            Hari {dayPlan.day} — <span style={{ color: 'var(--text-accent)' }}>{dayPlan.date || dayPlan.title || dayPlan.theme || ''}</span>
          </h3>
          {dayPlan.weather && (
            <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <span className="material-symbols-outlined text-[12px]">cloud</span> {dayPlan.weather}
            </p>
          )}
        </div>
        {budgetDisplay && (
          <div className="flex items-center gap-2">
            <span className="badge badge-green text-[10px]">
              {budgetDisplay}
            </span>
          </div>
        )}
      </div>

      {/* Activities Timeline */}
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {dayPlan.activities.map((act, i) => {
          const typeInfo = act.type ? (TYPE_ICONS[act.type] || TYPE_ICONS.destination) : TYPE_ICONS.destination
          const crowd = act.crowdLevel ? (CROWD_STYLE[act.crowdLevel] || CROWD_STYLE.sedang) : null

          const costDisplay = act.cost
            ? (act.cost.max > act.cost.min
              ? `${formatCurrency(act.cost.min)} - ${formatCurrency(act.cost.max)}`
              : formatCurrency(act.cost.min))
            : null

          const durationDisplay = typeof act.duration === 'number' ? `${act.duration} menit` : act.duration
          const locationDisplay = act.address || act.location || ''

          return (
            <div key={i} className="flex gap-3 p-4 hover:bg-[var(--border)] transition-colors">
              {/* Time column */}
              <div className="text-right min-w-[48px] flex-shrink-0">
                <p className="font-mono text-xs font-bold" style={{ color: 'var(--text-accent)' }}>{act.time}</p>
              </div>

              {/* Timeline icon */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                {act.type ? (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: typeInfo.bg }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)' }}>{typeInfo.icon}</span>
                  </div>
                ) : act.image ? (
                  <img src={act.image} alt={act.name} className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: typeInfo.bg }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)' }}>place</span>
                  </div>
                )}
                {i < dayPlan.activities.length - 1 && (
                  <div className="flex-1 w-px min-h-[20px]" style={{ background: 'var(--border)' }} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{act.name}</h4>
                  {crowd && (
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 border ${crowd.cls}`}>
                      {crowd.label}
                    </span>
                  )}
                </div>

                {locationDisplay && (
                  <p className="text-[11px] flex items-center gap-1 mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    <span className="material-symbols-outlined text-[12px]">location_on</span> {locationDisplay}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[11px]">schedule</span> {durationDisplay}
                  </span>
                  {costDisplay && (
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[11px]">payments</span> {costDisplay}
                    </span>
                  )}
                </div>

                {act.description && (
                  <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{act.description}</p>
                )}

                {(act.tips || act.tip) && (
                  <p className="text-[11px] flex items-start gap-1 mb-1" style={{ color: 'var(--text-accent)' }}>
                    <span className="material-symbols-outlined text-[12px] flex-shrink-0 mt-px">lightbulb</span>
                    <span>{act.tips || act.tip}</span>
                  </p>
                )}

                {act.photoSpot && (
                  <p className="text-[11px] flex items-start gap-1 mb-1" style={{ color: '#60A5FA' }}>
                    <span className="material-symbols-outlined text-[12px] flex-shrink-0 mt-px">photo_camera</span>
                    <span>{act.photoSpot}</span>
                  </p>
                )}

                {act.mustTry && (
                  <p className="text-[11px] flex items-start gap-1" style={{ color: '#F59E0B' }}>
                    <span className="material-symbols-outlined text-[12px] flex-shrink-0 mt-px">restaurant</span>
                    <span>Wajib coba: {act.mustTry}</span>
                  </p>
                )}

                {act.weatherAlternative && (
                  <p className="text-[11px] flex items-start gap-1 mt-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(59,130,246,0.08)', color: '#60A5FA' }}>
                    <span className="material-symbols-outlined text-[12px] flex-shrink-0 mt-px">water_drop</span>
                    <span>Jika hujan: {act.weatherAlternative}</span>
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Day highlights */}
      {dayPlan.highlights && dayPlan.highlights.length > 0 && (
        <div className="px-5 py-3 flex flex-wrap gap-2" style={{ borderTop: '1px solid var(--border)' }}>
          {dayPlan.highlights.map((h, i) => (
            <span key={i} className="badge badge-blue text-[10px]">{h}</span>
          ))}
        </div>
      )}
    </div>
  )
}
