'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

export default function AuthPage() {
  const router = useRouter()
  const { login, register, user } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' })
  const [error, setError] = useState('')

  if (user) {
    router.push('/')
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (tab === 'login') {
      const result = login(form.email, form.password)
      if (result.success) {
        toast.success('Selamat datang kembali! 👋')
        router.push('/')
      } else {
        setError(result.error || 'Login gagal')
      }
    } else {
      const result = register(form)
      if (result.success) {
        toast.success('Akun berhasil dibuat! Selamat datang 🎉')
        router.push('/')
      } else {
        setError(result.error || 'Registrasi gagal')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/HaloSam.png" alt="HaloSam" className="h-16 mx-auto mb-4 pulse-glow" />
          <h1 className="font-display text-2xl font-bold gradient-text">Halo, Sam!</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Platform wisata cerdas Malang Raya
          </p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--bg-card)' }}>
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'btn-grad text-white shadow-md' : ''}`}
                style={tab !== t ? { color: 'var(--text-muted)' } : {}}
              >
                {t === 'login' ? '🔑 Masuk' : '✨ Daftar'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <>
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Nama Lengkap
                  </label>
                  <input id="auth-name" type="text" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--primary)]"
                    style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                    placeholder="Sam Petualang" />
                </div>
                <div>
                  <label htmlFor="auth-city" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Kota Asal
                  </label>
                  <input id="auth-city" type="text" value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--primary)]"
                    style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                    placeholder="Malang" />
                </div>
              </>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Email
              </label>
              <input id="auth-email" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--primary)]"
                style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                placeholder="sam@halosam.com" />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Password
              </label>
              <input id="auth-password" type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--primary)]"
                style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                placeholder="Minimal 6 karakter" />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}

            <button type="submit" className="w-full btn-grad py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg"
              style={{ boxShadow: '0 4px 15px rgba(31,175,143,0.3)' }}>
              {tab === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
            {tab === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <button onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError('') }}
              className="font-semibold" style={{ color: 'var(--text-accent)' }}>
              {tab === 'login' ? 'Daftar sekarang' : 'Masuk di sini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
