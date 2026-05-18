import { Destination } from '@/lib/data'
import Link from 'next/link'

const crowdMap = {
  low: { label: 'Sepi', cls: 'crowd-low' },
  medium: { label: 'Sedang', cls: 'crowd-medium' },
  high: { label: 'Ramai', cls: 'crowd-high' },
}

export default function DestinationCard({ d, size = 'default' }: { d: Destination; size?: 'default' | 'compact' }) {
  const crowd = crowdMap[d.crowdLevel]

  if (size === 'compact') {
    return (
      <div className="glass rounded-2xl overflow-hidden group hover:border-primary/30 border border-transparent transition-all duration-300 cursor-pointer">
        <div className="h-40 overflow-hidden relative">
          <img
            src={d.image}
            alt={d.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border ${crowd.cls}`}>
            {crowd.label.toUpperCase()}
          </div>
          {d.matchScore && (
            <div className="absolute top-3 right-3 bg-primary/20 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary/30">
              {d.matchScore}% Match
            </div>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-display text-base font-semibold text-white mb-1">{d.name}</h4>
          <p className="text-[11px] text-muted mb-3 line-clamp-2">{d.description}</p>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-primary">{d.tags[0]}</span>
            <span className="text-muted">{d.distance}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-3xl p-4 flex flex-col sm:flex-row gap-5 group hover:glow-primary hover:border-primary/20 border border-transparent transition-all duration-300 cursor-pointer">
      <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden flex-shrink-0">
        <img
          src={d.image}
          alt={d.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="flex flex-col justify-between py-1 flex-1">
        <div>
          <div className="flex gap-2 flex-wrap mb-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${crowd.cls}`}>
              {crowd.label.toUpperCase()}
            </span>
            {d.matchScore && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                {d.matchScore}% Match
              </span>
            )}
          </div>
          <h4 className="font-display text-xl font-semibold text-white mb-1">{d.name}</h4>
          <p className="text-sm text-muted flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            {d.location}
          </p>
          <p className="text-sm text-muted/80 line-clamp-2">{d.description}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-yellow-400">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-sm font-semibold">{d.rating}</span>
            <span className="text-muted text-xs">({d.reviewCount})</span>
          </div>
          <span className="text-primary text-sm font-medium flex items-center gap-1">
            Detail <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </span>
        </div>
      </div>
    </div>
  )
}
