'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/explore', icon: 'explore', label: 'Explore' },
  { path: '/planner', icon: 'auto_awesome', label: 'Planner' },
  { path: '/community', icon: 'forum', label: 'Community' },
  { path: '/profile', icon: 'person', label: 'Profil' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 px-2 pb-safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => {
          const active = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                active ? 'text-primary' : 'text-muted'
              }`}
            >
              <span
                className={`material-symbols-outlined transition-all ${active ? 'text-[22px]' : 'text-[20px]'}`}
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className={`text-[9px] font-medium transition-all ${active ? 'text-primary' : 'text-muted'}`}>
                {item.label}
              </span>
              {active && <div className="absolute bottom-2 w-1 h-1 rounded-full bg-primary" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
