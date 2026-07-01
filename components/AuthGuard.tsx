'use client'
import { ReactNode, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback?: 'modal' | 'redirect'
  message?: string
}

export default function AuthGuard({ children, fallback = 'modal', message }: AuthGuardProps) {
  const { user, login, register } = useAuth()
  const [show, setShow] = useState(false)
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' })
  const [error, setError] = useState('')

  if (user) return <>{children}</>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (tab === 'login') {
      const result = login(form.email, form.password)
      if (!result.success) setError(result.error || 'Login gagal')
    } else {
      const result = register(form)
      if (!result.success) setError(result.error || 'Registrasi gagal')
    }
  }

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="btn-grad px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
        aria-label="Login untuk melanjutkan"
      >
        {message || 'Login untuk Melanjutkan'}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 modal-overlay" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 modal-content" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {tab === 'login' ? 'Masuk' : 'Daftar'}
          </h2>
          <button onClick={() => setShow(false)} className="touch-target" aria-label="Tutup">
            <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)' }}>close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: 'var(--bg-card)' }}>
          {(['login', 'register'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'btn-grad text-white' : ''}`}
              style={tab !== t ? { color: 'var(--text-muted)' } : {}}
            >
              {t === 'login' ? 'Masuk' : 'Daftar'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <>
              <div>
                <label htmlFor="auth-name" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nama Lengkap</label>
                <input id="auth-name" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                  placeholder="Nama lengkap kamu" />
              </div>
              <div>
                <label htmlFor="auth-city" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Kota Asal</label>
                <input id="auth-city" type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                  placeholder="Malang, Batu, dll" />
              </div>
            </>
          )}
          <div>
            <label htmlFor="auth-email" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
            <input id="auth-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              placeholder="email@contoh.com" />
          </div>
          <div>
            <label htmlFor="auth-password" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Password</label>
            <input id="auth-password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              placeholder="Minimal 6 karakter" />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button type="submit" className="w-full btn-grad py-3 rounded-xl text-white font-semibold text-sm">
            {tab === 'login' ? 'Masuk' : 'Daftar Sekarang'}
          </button>
        </form>
      </div>
    </div>
  )
}
