'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/explore', label: 'Explore', icon: 'explore' },
  { path: '/planner', label: 'AI Planner', icon: 'auto_awesome' },
  { path: '/community', label: 'Community', icon: 'forum' },
  { path: '/profile', label: 'Profil', icon: 'person' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex fixed left-3 top-3 bottom-3 z-40 w-64 flex-col rounded-2xl glass border border-white/5 shadow-2xl shadow-black/50">
      {/* Logo */}
      <div className="px-6 pt-6 pb-4 border-b border-white/5">
        <Link href="/" className="block flex justify-center">
          <img
            src="HaloSam.png"
            alt="Halo Sam! Logo"
            className="h-20 w-auto object-contain drop-shadow-lg"
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${active
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted hover:text-white hover:bg-white/5'
                }
              `}
            >
              <span
                className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110"
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* CTA */}
      <div className="p-4 border-t border-white/5">
        <Link href="/planner" className="block w-full btn-grad p-3 rounded-xl text-center text-white text-sm font-semibold shadow-lg shadow-primary/20 mb-4">
          <span className="material-symbols-outlined text-[16px] mr-1.5 align-middle" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          Rencanakan Perjalanan
        </Link>

        {/* User card */}
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/30 flex-shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBx9RRZfW5AQu2mXgxSOHG6fvOKFXRjbBMTOqhuhnXwHlGC1ziB7rp1SCcL5KMdnwSO9TVnz9DGFzBRoftPYjbfs6UdWDDuTQaXHHdhjA8uLyW7vzGgdmgRREAa93UHR687dx1jo3CT6QjU2_r3NpgNEiXcrb2EeRdn7pey_pJn28bHgfMt30HtED7KT6qWZYb7OmwTTwWLlS7LbMmIXJquNhK_6xdrDy0EV8o5TpQGQrZe-5NzeBoT5B-k0mxY4U_govx_gBcgg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Sam Petualang</p>
            <p className="text-[10px] text-primary">Pro Explorer · Lv 42</p>
          </div>
          <span className="material-symbols-outlined text-muted text-[16px]">settings</span>
        </div>
      </div>
    </aside>
  )
}
