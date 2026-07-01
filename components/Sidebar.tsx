'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

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
    <aside className="hidden md:flex fixed left-3 top-3 bottom-3 z-40 w-64 flex-col rounded-2xl glass shadow-2xl"
      style={{ boxShadow: '0 25px 50px var(--shadow)' }}>
      {/* Logo */}
      <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="block flex justify-center">
          <img
            src="HaloSam.png"
            alt="Halo Sam! Logo"
            className="h-20 w-auto object-contain pulse-glow"
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
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                ${active
                  ? 'text-white'
                  : 'hover:bg-[var(--bg-card)]'
                }
              `}
              style={active ? {
                background: 'linear-gradient(135deg, rgba(31,175,143,0.15), rgba(59,130,246,0.1))',
                borderLeft: '3px solid var(--primary)',
                color: 'var(--text-accent)',
              } : {
                color: 'var(--text-muted)',
              }}
            >
              <span
                className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110"
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium transition-transform group-hover:translate-x-0.5">{item.label}</span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="px-3 pb-2">
        <ThemeToggle />
      </div>

      {/* CTA */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <Link href="/planner" className="block w-full btn-grad p-3 rounded-xl text-center text-white text-sm font-semibold shadow-lg mb-4"
          style={{ boxShadow: '0 4px 15px rgba(31,175,143,0.3)' }}>
          <span className="material-symbols-outlined text-[16px] mr-1.5 align-middle" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          Rencanakan Perjalanan
        </Link>

        {/* User card */}
        <Link href="/profile" className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-[var(--bg-card)]"
          style={{ background: 'var(--border)' }}>
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ border: '2px solid rgba(31,175,143,0.3)' }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWtoxROcMHgUeoZf2sW7SCevSVcFVIRxCpponRQK-7acvqsN-U9B_JEDQrmB7DC1In6e3ML7FfN7EC0M2PIjYWVyH0Sr2eka0rW0opT0edC9vQqAdSgBjwb_hlFVYl0R2Dg4lSiYCym77gIACBF4OoADjKbj1nWfH8WU5GoJys4c6brq7H-9uAKRweUP4TPzxNMBIq00MoelCkMsyrwu0qdRG9cFH416w0o0H1XQ5mjQTeQ76zrCtjg7RvKoABdLfum0IjgtmrLA"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>Sam Petualang</p>
            <p className="text-[10px]" style={{ color: 'var(--text-accent)' }}>Pro Explorer · Lv 42</p>
          </div>
          <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-muted)' }}>settings</span>
        </Link>
      </div>
    </aside>
  )
}
