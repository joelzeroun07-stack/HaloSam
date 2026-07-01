'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import SocialConnect from '@/components/SocialConnect'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { getLocalStorage, setLocalStorage, formatCurrency, formatShortDate, generateReferralCode, LS_KEYS } from '@/lib/utils'
import { BookingRecord } from '@/components/PaymentModal'

const BADGES = [
  { id: 'explorer1', icon: '🗺️', label: 'Penjelajah Pertama', desc: 'Kunjungi 1 destinasi', unlocked: true },
  { id: 'beach3', icon: '🌊', label: 'Pecinta Pantai', desc: 'Kunjungi 3 destinasi pantai', unlocked: false },
  { id: 'mountain5', icon: '🏔️', label: 'Pendaki Tangguh', desc: 'Kunjungi destinasi alam 5x', unlocked: false },
  { id: 'photo10', icon: '📸', label: 'Fotografer Jalanan', desc: 'Unggah 10 foto di komunitas', unlocked: false },
  { id: 'review5', icon: '⭐', label: 'Review Master', desc: 'Tulis 5 ulasan', unlocked: true },
  { id: 'community10', icon: '🤝', label: 'Community Builder', desc: 'Bantu 10 traveler', unlocked: false },
]

const STAMPS = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  unlocked: i < 3,
  icon: ['🏔️', '🌊', '🏛', '🍜', '🌿', '🏖', '🎭', '☕', '🌄', '🏕',
    '🦋', '🌺', '🎪', '🛶', '🧗', '🎨', '🌿', '🗿', '🌸', '🎶',
    '🐒', '🌾', '🍃', '🏯', '✨'][i],
}))

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<'plans' | 'bookings' | 'social' | 'badges'>('plans')
  const [bookingFilter, setBookingFilter] = useState<'all' | 'upcoming' | 'completed'>('all')
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', bio: '', city: '', birthday: '' })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [referralCode] = useState(() => getLocalStorage('halosam_referral', generateReferralCode()))
  const [referralCount] = useState(() => getLocalStorage('halosam_referral_count', 2))

  useEffect(() => {
    setBookings(getLocalStorage<BookingRecord[]>(LS_KEYS.BOOKINGS, []))
    setLocalStorage('halosam_referral', referralCode)
  }, [referralCode])

  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name || '', bio: user.bio || '', city: user.city || '', birthday: user.birthday || '' })
    }
  }, [user])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setAvatarPreview(result)
      updateProfile({ avatar: result })
      toast.success('Foto profil diperbarui!')
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = () => {
    updateProfile(editForm)
    setEditing(false)
    toast.success('Profil berhasil disimpan!')
  }

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'all') return true
    return b.status === bookingFilter
  })

  const copyReferral = () => {
    navigator.clipboard?.writeText(referralCode)
    toast.success('Kode referral disalin!')
  }

  const displayName = user?.name || 'Sam Petualang'
  const displayAvatar = avatarPreview || user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWtoxROcMHgUeoZf2sW7SCevSVcFVIRxCpponRQK-7acvqsN-U9B_JEDQrmB7DC1In6e3ML7FfN7EC0M2PIjYWVyH0Sr2eka0rW0opT0edC9vQqAdSgBjwb_hlFVYl0R2Dg4lSiYCym77gIACBF4OoADjKbj1nWfH8WU5GoJys4c6brq7H-9uAKRweUP4TPzxNMBIq00MoelCkMsyrwu0qdRG9cFH416w0o0H1XQ5mjQTeQ76zrCtjg7RvKoABdLfum0IjgtmrLA'

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-[280px]">
        <main className="min-h-screen pt-6 pb-24 px-4 md:px-6 lg:px-8 page-enter">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Hero */}
            <div className="glass rounded-3xl p-5 md:p-8 relative overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(31,175,143,0.05)' }} />
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden" style={{ border: '2px solid rgba(31,175,143,0.3)' }}>
                    <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 btn-grad rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                    <span className="material-symbols-outlined text-white text-[14px]">edit</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} aria-label="Upload foto profil" />
                  </label>
                  <div className="absolute -bottom-2 -left-2 btn-grad text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">LVL 42</div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  {editing ? (
                    <div className="space-y-3 max-w-sm">
                      <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none" placeholder="Nama"
                        style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
                      <textarea value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" rows={2} placeholder="Bio singkat"
                        style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
                      <div className="flex gap-2">
                        <input value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))}
                          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" placeholder="Kota"
                          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
                        <input type="date" value={editForm.birthday} onChange={e => setEditForm(f => ({ ...f, birthday: e.target.value }))}
                          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleSaveProfile} className="btn-grad px-4 py-2 rounded-lg text-sm text-white font-semibold">Simpan</button>
                        <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--text-muted)' }}>Batal</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h1 className="font-display text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{displayName}</h1>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(31,175,143,0.1)', color: 'var(--text-accent)', border: '1px solid rgba(31,175,143,0.2)' }}>
                          <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          Pro Explorer
                        </span>
                      </div>
                      <p className="text-sm max-w-md mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {user?.bio || 'Menjelajahi setiap sudut tersembunyi di Malang Raya. Pecinta kopi lokal dan rute trekking pegunungan.'}
                      </p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {[
                          { icon: 'diamond', label: '32 Gems', color: 'var(--text-accent)' },
                          { icon: 'forum', label: '15 Post', color: '#60A5FA' },
                          { icon: 'map', label: `${bookings.length} Booking`, color: '#F59E0B' },
                        ].map(s => (
                          <div key={s.label} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1", color: s.color }}>{s.icon}</span>
                            <span style={{ color: 'var(--text-primary)' }}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {!editing && (
                  <button onClick={() => setEditing(true)} className="glass px-4 py-2 rounded-xl text-sm flex-shrink-0 transition-all"
                    style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>Edit Profil</button>
                )}
              </div>

              {/* XP Bar */}
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between text-[11px] mb-2">
                  <span style={{ color: 'var(--text-muted)' }}>Progress ke Level 43</span>
                  <span className="font-bold" style={{ color: 'var(--text-accent)' }}>7,240 / 10,000 XP</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div className="h-full btn-grad rounded-full" style={{ width: '72.4%', transition: 'width 1s ease' }} />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl overflow-x-auto no-scroll" style={{ background: 'var(--bg-card)' }}>
              {[
                { key: 'plans', label: 'Rencana', icon: 'map' },
                { key: 'bookings', label: 'Pemesanan', icon: 'receipt_long' },
                { key: 'social', label: 'Sosial', icon: 'link' },
                { key: 'badges', label: 'Pencapaian', icon: 'emoji_events' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${activeTab === tab.key ? 'btn-grad text-white' : ''}`}
                  style={activeTab !== tab.key ? { color: 'var(--text-muted)' } : {}}>
                  <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'plans' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                {[
                  { title: 'Rute Air Terjun Tersembunyi', location: 'Pujon · 2 Hari', tag: 'WISATA ALAM', img: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&auto=format' },
                  { title: 'Heritage Trail Kota Tua', location: 'Kota Malang · 1 Hari', tag: 'BUDAYA', img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&auto=format' },
                ].map(plan => (
                  <div key={plan.title} className="glass rounded-2xl overflow-hidden group cursor-pointer card-lift" style={{ border: '1px solid var(--border)' }}>
                    <div className="h-32 relative overflow-hidden">
                      <img src={plan.img} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'rgba(31,175,143,0.8)' }}>{plan.tag}</span>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{plan.title}</h4>
                      <p className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <span className="material-symbols-outlined text-[12px]">location_on</span>{plan.location}
                      </p>
                    </div>
                  </div>
                ))}
                <Link href="/planner" className="glass rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer group card-lift min-h-[180px]"
                  style={{ border: '2px dashed var(--border)' }}>
                  <span className="material-symbols-outlined text-4xl mb-2 transition-colors" style={{ color: 'var(--text-muted)' }}>add_circle</span>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Buat Rencana Baru</p>
                </Link>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {(['all', 'upcoming', 'completed'] as const).map(f => (
                    <button key={f} onClick={() => setBookingFilter(f)}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${bookingFilter === f ? 'btn-grad text-white' : 'glass'}`}
                      style={bookingFilter !== f ? { color: 'var(--text-muted)' } : {}}>
                      {f === 'all' ? 'Semua' : f === 'upcoming' ? 'Mendatang' : 'Selesai'}
                    </button>
                  ))}
                </div>
                {filteredBookings.length === 0 ? (
                  <div className="glass rounded-2xl p-12 text-center" style={{ border: '1px solid var(--border)' }}>
                    <span className="material-symbols-outlined text-4xl block mb-3" style={{ color: 'var(--text-muted)' }}>receipt_long</span>
                    <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Belum ada pemesanan</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Pesan tiket pertamamu di halaman destinasi!</p>
                  </div>
                ) : (
                  filteredBookings.map(b => (
                    <Link key={b.bookingId} href={`/profile/booking/${b.bookingId}`}
                      className="glass rounded-2xl overflow-hidden card-lift block transition-all hover:shadow-lg" style={{ border: '1px solid var(--border)' }}>
                      <div className="flex gap-4 p-4">
                        <div className="relative flex-shrink-0">
                          <img src={b.image} alt={b.destination} className="w-20 h-20 rounded-xl object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4
                              className="font-display font-semibold text-sm truncate"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {b.destination}
                            </h4>

                            <span
                              className={`text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${b.status === 'upcoming'
                                ? 'badge-blue'
                                : b.status === 'completed'
                                  ? 'badge-green'
                                  : 'badge-red'
                                }`}
                            >
                              {b.status === 'upcoming'
                                ? 'Aktif'
                                : b.status === 'completed'
                                  ? 'Selesai'
                                  : 'Batal'}
                            </span>
                          </div>

                          {/* Date & Time */}
                          <div
                            className="flex items-center gap-3 text-[11px] mb-2"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">event</span>
                              {b.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">schedule</span>
                              {b.time}
                            </span>
                          </div>

                          {/* Bottom info */}
                          <div className="flex items-center justify-between">
                            <span
                              className="text-[9px] font-mono px-2 py-0.5 rounded"
                              style={{
                                color: 'var(--text-muted)',
                                background: 'var(--bg-card)',
                              }}
                            >
                              ID: {b.bookingId}
                            </span>

                            <span
                              className="text-sm font-bold font-mono"
                              style={{ color: 'var(--text-accent)' }}
                            >
                              {formatCurrency(b.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Dipesan {formatShortDate(b.createdAt)}</span>
                        <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: 'var(--text-accent)' }}>
                          Lihat Detail
                          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Hubungkan Akun Media Sosial</h3>
                  <SocialConnect />
                </div>

                {/* Referral */}
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <h3 className="font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>🎁 Program Referral</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Ajak teman dan dapatkan reward!</p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 px-4 py-3 rounded-xl font-mono font-bold text-center tracking-widest" style={{ background: 'var(--bg-card)', color: 'var(--text-accent)', border: '1px solid var(--border)' }}>
                      {referralCode}
                    </div>
                    <button onClick={copyReferral} className="btn-grad px-4 py-3 rounded-xl text-white text-sm font-semibold">📋 Salin</button>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'var(--text-muted)' }}>Teman diundang</span>
                    <span className="font-bold" style={{ color: 'var(--text-accent)' }}>{referralCount}/10</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full btn-grad rounded-full transition-all" style={{ width: `${(referralCount / 10) * 100}%` }} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="space-y-6">
                {/* Badges */}
                <div>
                  <h3 className="font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🏆 Pencapaian</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {BADGES.map(badge => (
                      <div key={badge.id} className={`glass rounded-xl p-4 text-center transition-all ${badge.unlocked ? 'card-lift' : ''}`}
                        style={{ border: '1px solid var(--border)', opacity: badge.unlocked ? 1 : 0.4, filter: badge.unlocked ? 'none' : 'grayscale(1)' }}>
                        <span className="text-3xl block mb-2">{badge.icon}</span>
                        <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{badge.label}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{badge.desc}</p>
                        {badge.unlocked ? (
                          <span className="badge badge-green text-[9px] mt-2">Unlocked ✓</span>
                        ) : (
                          <span className="material-symbols-outlined text-[14px] mt-2" style={{ color: 'var(--text-muted)' }}>lock</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stamp Book */}
                <div>
                  <h3 className="font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>📖 Buku Prangko Digital</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                    {STAMPS.filter(s => s.unlocked).length}/25 prangko dikumpulkan
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {STAMPS.map(stamp => (
                      <div key={stamp.id}
                        className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${stamp.unlocked ? 'stamp-flip' : ''}`}
                        style={{
                          background: stamp.unlocked ? 'rgba(31,175,143,0.1)' : 'var(--bg-card)',
                          border: stamp.unlocked ? '2px solid rgba(31,175,143,0.3)' : '1px dashed var(--border)',
                          filter: stamp.unlocked ? 'none' : 'grayscale(1)',
                          opacity: stamp.unlocked ? 1 : 0.3,
                        }}>
                        {stamp.unlocked ? stamp.icon : '❓'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
