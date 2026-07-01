'use client'
import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { destinations } from '@/lib/data'
import { formatCurrency, CATEGORY_MAP } from '@/lib/utils'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import DestinationCard from '@/components/DestinationCard'

const CROWD_HOURS = [
  { hour: '06', label: '06:00', level: 1 },
  { hour: '08', label: '08:00', level: 2 },
  { hour: '10', label: '10:00', level: 4 },
  { hour: '12', label: '12:00', level: 5 },
  { hour: '14', label: '14:00', level: 4 },
  { hour: '16', label: '16:00', level: 3 },
  { hour: '18', label: '18:00', level: 1 },
]

const crowdMap = {
  low: { label: 'Sepi', cls: 'crowd-low', icon: 'sentiment_satisfied', color: '#1FAF8F' },
  medium: { label: 'Sedang', cls: 'crowd-medium', icon: 'sentiment_neutral', color: '#EAB308' },
  high: { label: 'Ramai', cls: 'crowd-high', icon: 'sentiment_dissatisfied', color: '#EF4444' },
}

export default function DestinationDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'foto' | 'ulasan' | 'tips'>('deskripsi')
  const [isSaved, setIsSaved] = useState(false)

  const dest = destinations.find(d => d.slug === slug)

  const related = useMemo(() => {
    if (!dest) return []
    return destinations.filter(d => d.category === dest.category && d.id !== dest.id).slice(0, 3)
  }, [dest])

  if (!dest) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <div className="md:pl-[280px]">
          <main className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                <span className="material-symbols-outlined text-4xl" style={{ color: '#A78BFA' }}>location_off</span>
              </div>
              <h1 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Destinasi Tidak Ditemukan</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Sepertinya destinasi ini belum terdaftar.</p>
              <Link href="/explore" className="btn-grad px-6 py-3 rounded-xl text-white font-semibold text-sm inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Kembali ke Explore
              </Link>
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    )
  }

  const crowd = crowdMap[dest.crowdLevel]
  const cat = CATEGORY_MAP[dest.category]
  const price = dest.foodPrice || dest.ticketPrice
  const priceLabel = dest.foodPrice ? 'Harga Makanan' : 'Harga Tiket'
  const isFree = !price || price.min === 0

  const dummyReviews = [
    { name: 'Andi M.', rating: 5, text: 'Tempat yang luar biasa! Sangat direkomendasikan untuk dikunjungi bersama keluarga. Pemandangannya indah dan udara sejuk.', time: '2 minggu lalu', avatar: 'A' },
    { name: 'Sarah K.', rating: 4, text: 'View-nya bagus banget, tapi akses jalan agak sulit. Tetap worth it! Bawa sepatu yang nyaman.', time: '1 bulan lalu', avatar: 'S' },
    { name: 'Budi W.', rating: 5, text: 'Hidden gem yang sebenarnya! Gak terlalu ramai dan sangat bersih. Cocok untuk healing weekend.', time: '2 bulan lalu', avatar: 'B' },
    { name: 'Lisa R.', rating: 4, text: 'Tempatnya sangat instagramable! Cocok buat foto-foto. Datang pagi biar lebih sepi.', time: '3 bulan lalu', avatar: 'L' },
  ]

  const facilities = [
    { icon: 'local_parking', label: 'Parkir', available: true },
    { icon: 'wc', label: 'Toilet', available: true },
    { icon: 'mosque', label: 'Mushola', available: true },
    { icon: 'restaurant', label: 'Warung', available: true },
    { icon: 'signal_wifi_4_bar', label: 'WiFi', available: false },
    { icon: 'accessible', label: 'Akses Difabel', available: false },
  ]

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-[280px]">
        <main className="min-h-screen pb-24 page-enter">

          {/* ═══ HERO IMAGE ═══ */}
          <div className="relative h-[280px] sm:h-[360px] md:h-[420px]">
            <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.1) 100%)' }} />

            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
              <Link href="/explore" className="glass w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md" aria-label="Kembali">
                <span className="material-symbols-outlined text-[20px]" style={{ color: 'white' }}>arrow_back</span>
              </Link>
              <div className="flex gap-2">
                <button onClick={() => setIsSaved(!isSaved)} className="glass w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md" aria-label="Simpan">
                  <span className="material-symbols-outlined text-[20px]" style={{ color: isSaved ? '#F59E0B' : 'white', fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
                </button>
                <button className="glass w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md" aria-label="Share">
                  <span className="material-symbols-outlined text-[20px]" style={{ color: 'white' }}>share</span>
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-6 lg:px-8 -mt-16 relative z-10 max-w-[1200px] mx-auto">

            {/* ═══ MAIN INFO CARD ═══ */}
            <div className="glass rounded-3xl p-5 sm:p-6 md:p-8 mb-6" style={{ border: '1px solid var(--border)' }}>
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
                <Link href="/explore" className="hover:underline">Explore</Link>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="capitalize">{dest.category}</span>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span style={{ color: 'var(--text-primary)' }}>{dest.name}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${crowd.cls}`}>{crowd.label}</span>
                {cat && <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cat.class}`}>{cat.icon} {cat.label}</span>}
                {isFree && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(31,175,143,0.1)', color: 'var(--text-accent)', border: '1px solid rgba(31,175,143,0.2)' }}>Gratis</span>}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{dest.name}</h1>
              <p className="text-sm flex items-center gap-1.5 mb-5" style={{ color: 'var(--text-muted)' }}>
                <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)' }}>location_on</span>
                {dest.location} · {dest.distance}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-yellow-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{dest.rating}</span>
                  </div>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{dest.reviewCount} ulasan</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: crowd.color, fontVariationSettings: "'FILL' 1" }}>{crowd.icon}</span>
                    <span className="font-display text-sm font-bold" style={{ color: crowd.color }}>{crowd.label}</span>
                  </div>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Saat ini</p>
                </div>
                {price && (
                  <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <p className="font-mono font-bold text-sm mb-1" style={{ color: 'var(--text-accent)' }}>
                      {price.min === 0 ? 'Gratis' : formatCurrency(price.min)}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{priceLabel}</p>
                  </div>
                )}
                {dest.openHours && (
                  <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <p className="font-mono font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      {dest.openHours.split(' - ')[0] || dest.openHours.split('(')[0]}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Jam Buka</p>
                  </div>
                )}
              </div>
            </div>

            {/* ═══ MAIN CONTENT GRID ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* ── Left: Main Content ── */}
              <div className="lg:col-span-8 space-y-6">

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl overflow-x-auto no-scroll" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {([
                    { key: 'deskripsi', label: 'Deskripsi', icon: 'description' },
                    { key: 'foto', label: 'Galeri', icon: 'photo_library' },
                    { key: 'ulasan', label: `Ulasan (${dest.reviewCount})`, icon: 'reviews' },
                    { key: 'tips', label: 'Tips Lokal', icon: 'lightbulb' },
                  ] as const).map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${activeTab === tab.key ? 'btn-grad text-white shadow-md' : ''}`}
                      style={activeTab !== tab.key ? { color: 'var(--text-muted)' } : {}}>
                      <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="glass rounded-2xl p-5 sm:p-6 page-enter" style={{ border: '1px solid var(--border)' }}>
                  {activeTab === 'deskripsi' && (
                    <div className="space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>info</span>
                          Tentang Destinasi
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{dest.description}</p>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {dest.openHours && (
                          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(31,175,143,0.12)' }}>
                              <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)' }}>schedule</span>
                            </div>
                            <div>
                              <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Jam Operasional</p>
                              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{dest.openHours}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.12)' }}>
                            <span className="material-symbols-outlined text-[16px]" style={{ color: '#3B82F6' }}>map</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Koordinat</p>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{dest.coordinates.lat.toFixed(4)}, {dest.coordinates.lng.toFixed(4)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.12)' }}>
                            <span className="material-symbols-outlined text-[16px]" style={{ color: '#F59E0B' }}>directions_car</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Jarak</p>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{dest.distance}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${crowd.color}18` }}>
                            <span className="material-symbols-outlined text-[16px]" style={{ color: crowd.color }}>{crowd.icon}</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Tingkat Keramaian</p>
                            <p className="text-sm font-semibold" style={{ color: crowd.color }}>{crowd.label}</p>
                          </div>
                        </div>
                      </div>

                      {/* Facilities */}
                      <div>
                        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>verified</span>
                          Fasilitas
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {facilities.map(f => (
                            <div key={f.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', opacity: f.available ? 1 : 0.35 }}>
                              <span className="material-symbols-outlined text-[20px]" style={{ color: f.available ? 'var(--text-accent)' : 'var(--text-muted)', fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                              <span className="text-[9px] font-medium text-center" style={{ color: 'var(--text-muted)' }}>{f.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <h3 className="font-display font-bold text-base mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>tag</span>
                          Kategori & Tag
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {dest.tags.map(tag => (
                            <span key={tag} className="text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors hover:bg-[var(--border)] cursor-pointer" style={{ color: 'var(--text-accent)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'foto' && (
                    <div>
                      <h3 className="font-display font-bold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>photo_library</span>
                        Galeri Foto
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[dest.image, dest.image, dest.image, dest.image, dest.image, dest.image].map((img, i) => (
                          <div key={i} className={`rounded-xl overflow-hidden ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                            <img src={img} alt={`${dest.name} foto ${i + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                              style={{ filter: i > 0 ? `hue-rotate(${i * 25}deg) saturate(${1 + i * 0.1})` : 'none' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'ulasan' && (
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-display font-bold text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>reviews</span>
                          Ulasan Pengunjung
                        </h3>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-yellow-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>{dest.rating}</span>
                          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>({dest.reviewCount})</span>
                        </div>
                      </div>

                      {/* Rating Breakdown */}
                      <div className="p-4 rounded-xl mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        {[5, 4, 3, 2, 1].map(stars => {
                          const pct = stars === 5 ? 68 : stars === 4 ? 22 : stars === 3 ? 7 : stars === 2 ? 2 : 1
                          return (
                            <div key={stars} className="flex items-center gap-2 mb-1.5 last:mb-0">
                              <span className="text-[11px] font-medium w-3" style={{ color: 'var(--text-muted)' }}>{stars}</span>
                              <span className="material-symbols-outlined text-yellow-400 text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#F59E0B' }} />
                              </div>
                              <span className="text-[10px] w-8 text-right" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                            </div>
                          )
                        })}
                      </div>

                      <div className="space-y-4">
                        {dummyReviews.map((review, i) => (
                          <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white btn-grad">{review.avatar}</div>
                                <div>
                                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{review.name}</p>
                                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{review.time}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: review.rating }).map((_, j) => (
                                  <span key={j} className="material-symbols-outlined text-yellow-400 text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{review.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'tips' && (
                    <div>
                      <h3 className="font-display font-bold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
                        Tips & Panduan
                      </h3>
                      <div className="space-y-3">
                        {[
                          { icon: 'lightbulb', title: 'Tips dari Lokal', text: dest.tips, bg: 'rgba(31,175,143,0.08)', border: 'rgba(31,175,143,0.15)', color: 'var(--text-accent)' },
                          { icon: 'backpack', title: 'Yang Perlu Dibawa', text: 'Sunscreen, air minum minimal 1 liter, kamera, sepatu hiking yang nyaman, dan jaket tipis untuk antisipasi angin.', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', color: '#60A5FA' },
                          { icon: 'schedule', title: 'Waktu Terbaik Berkunjung', text: 'Pagi hari (06:00-09:00) untuk menghindari keramaian dan terik matahari. Hari kerja lebih sepi dibanding weekend.', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
                          { icon: 'directions_car', title: 'Akses & Transportasi', text: `Bisa dijangkau dengan motor atau mobil dari Kota Malang. Jalan menuju lokasi sebagian besar sudah beraspal. Jarak tempuh sekitar ${dest.distance.split(' ')[0]} km.`, bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.15)', color: '#A78BFA' },
                        ].map(tip => (
                          <div key={tip.title} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: tip.bg, border: `1px solid ${tip.border}` }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: tip.bg }}>
                              <span className="material-symbols-outlined text-[18px]" style={{ color: tip.color, fontVariationSettings: "'FILL' 1" }}>{tip.icon}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold mb-1" style={{ color: tip.color }}>{tip.title}</p>
                              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{tip.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Crowd Prediction */}
                <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                      Prediksi Keramaian Hari Ini
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ color: '#1FAF8F', background: 'rgba(31,175,143,0.1)', border: '1px solid rgba(31,175,143,0.2)' }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#1FAF8F' }} /> Live
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-32 mb-2">
                    {CROWD_HOURS.map(h => (
                      <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-lg transition-all hover:opacity-80 cursor-pointer" style={{
                          height: `${h.level * 20}%`,
                          background: h.level >= 4 ? 'linear-gradient(to top, rgba(239,68,68,0.7), rgba(239,68,68,0.2))' :
                            h.level >= 3 ? 'linear-gradient(to top, rgba(234,179,8,0.7), rgba(234,179,8,0.2))' :
                              'linear-gradient(to top, rgba(31,175,143,0.7), rgba(31,175,143,0.2))',
                          minHeight: '8px',
                          borderRadius: '6px 6px 2px 2px',
                        }} />
                        <span className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>{h.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-5 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <span className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}><span className="w-2.5 h-2.5 rounded" style={{ background: 'rgba(31,175,143,0.6)' }} />Sepi</span>
                    <span className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}><span className="w-2.5 h-2.5 rounded" style={{ background: 'rgba(234,179,8,0.6)' }} />Sedang</span>
                    <span className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}><span className="w-2.5 h-2.5 rounded" style={{ background: 'rgba(239,68,68,0.6)' }} />Ramai</span>
                  </div>
                </div>
              </div>

              {/* ── Right Sidebar ── */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-6 space-y-5">

                  {/* Booking Card */}
                  <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {price && price.min > 0 ? (
                          <>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Mulai dari</p>
                            <p className="font-display text-2xl font-bold" style={{ color: 'var(--text-accent)' }}>{formatCurrency(price.min)}</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>per orang</p>
                          </>
                        ) : (
                          <>
                            <p className="font-display text-2xl font-bold" style={{ color: 'var(--text-accent)' }}>Gratis</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Tidak ada biaya masuk</p>
                          </>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(31,175,143,0.12)' }}>
                        <span className="material-symbols-outlined text-[24px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                      </div>
                    </div>

                    <Link href={`/destinations/${slug}/booking`}
                      className="w-full btn-grad py-3.5 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 mb-3"
                      style={{ boxShadow: '0 6px 20px rgba(31,175,143,0.3)' }}>
                      <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                      Pesan Sekarang
                    </Link>
                    <p className="text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>Konfirmasi instan · Bisa reschedule</p>
                  </div>

                  {/* Quick Info */}
                  <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>info</span>
                      <h3 className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Info Cepat</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { icon: 'wb_sunny', label: 'Cuaca', value: 'Cerah, 24°C', color: '#F59E0B' },
                        { icon: 'schedule', label: 'Waktu Terbaik', value: '06:00 - 09:00', color: '#3B82F6' },
                        { icon: 'signal_cellular_alt', label: 'Sinyal', value: 'Cukup Baik', color: '#1FAF8F' },
                        { icon: 'terrain', label: 'Medan', value: 'Mudah-Sedang', color: '#A78BFA' },
                      ].map(info => (
                        <div key={info.label} className="flex items-center justify-between py-1">
                          <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <span className="material-symbols-outlined text-[14px]" style={{ color: info.color, fontVariationSettings: "'FILL' 1" }}>{info.icon}</span>
                            {info.label}
                          </span>
                          <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{info.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    <div className="h-40 flex items-center justify-center" style={{ background: 'var(--bg-card)' }}>
                      <div className="text-center">
                        <span className="material-symbols-outlined text-3xl mb-1 block" style={{ color: 'var(--text-muted)', fontVariationSettings: "'FILL' 1" }}>map</span>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{dest.coordinates.lat.toFixed(4)}, {dest.coordinates.lng.toFixed(4)}</p>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Lihat di peta</span>
                      <a href={`https://www.google.com/maps?q=${dest.coordinates.lat},${dest.coordinates.lng}`} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] font-semibold flex items-center gap-1" style={{ color: 'var(--text-accent)' }}>
                        Google Maps
                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      </a>
                    </div>
                  </div>

                  {/* Related */}
                  {related.length > 0 && (
                    <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                        <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>explore</span>
                        <h3 className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Destinasi Serupa</h3>
                      </div>
                      <div className="space-y-3">
                        {related.map(d => (
                          <DestinationCard key={d.id} d={d} size="horizontal" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 px-4 pb-2">
        <Link href={`/destinations/${slug}/booking`}
          className="w-full btn-grad py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
          style={{ boxShadow: '0 8px 25px rgba(31,175,143,0.3)' }}>
          <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
          Pesan Sekarang — {price && price.min > 0 ? `Mulai ${formatCurrency(price.min)}` : 'Gratis'}
        </Link>
      </div>
    </div>
  )
}
