'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const items = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/explore', icon: 'explore', label: 'Explore' },
  { path: '/planner', icon: 'auto_awesome', label: 'Planner', isFab: true },
  { path: '/community', icon: 'forum', label: 'Community', badge: 3 },
  { path: '/profile', icon: 'person', label: 'Profil' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass pb-safe"
      style={{ borderTop: '1px solid var(--border)' }}>
      <div className="flex justify-around items-end h-16 px-1">
        {items.map((item) => {
          const active = pathname === item.path

          // FAB for AI Planner
          if (item.isFab) {
            return (
              <Link key={item.path} href={item.path}
                className="flex flex-col items-center justify-center -mt-5 relative"
                aria-label="AI Planner">
                <div className="w-12 h-12 rounded-2xl btn-grad flex items-center justify-center shadow-lg active-scale"
                  style={{ boxShadow: '0 4px 15px rgba(31,175,143,0.4)' }}>
                  <span className="material-symbols-outlined text-white text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    {item.icon}
                  </span>
                </div>
                <span className="text-[8px] font-medium mt-1" style={{ color: 'var(--text-accent)' }}>{item.label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all active-scale relative"
              aria-label={item.label}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined transition-all ${active ? 'text-[22px]' : 'text-[20px]'}`}
                  style={{
                    fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                    color: active ? 'var(--text-accent)' : 'var(--text-muted)',
                  }}
                >
                  {item.icon}
                </span>
                {/* Notification badge */}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center text-white"
                    style={{ background: 'var(--error)' }}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-medium transition-all`}
                style={{ color: active ? 'var(--text-accent)' : 'var(--text-muted)' }}>
                {item.label}
              </span>
              {active && <div className="absolute bottom-1 w-1 h-1 rounded-full" style={{ background: 'var(--text-accent)' }} />}
            </Link>
          )
        })}
      </div>
      {/* Theme toggle compact - top right corner */}
      <div className="absolute top-1.5 right-2">
        <ThemeToggle variant="compact" />
      </div>
    </nav>
  )
}
