'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import DestinationCard from '@/components/DestinationCard'
import { destinations } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

const CATEGORY_TABS = [
  { key: 'semua', label: 'Semua', icon: 'auto_awesome' },
  { key: 'alam', label: 'Alam', icon: 'forest' },
  { key: 'kuliner', label: 'Kuliner', icon: 'restaurant' },
  { key: 'budaya', label: 'Budaya', icon: 'museum' },
  { key: 'pantai', label: 'Pantai', icon: 'beach_access' },
  { key: 'desa', label: 'Desa', icon: 'agriculture' },
]

const PROMO_SLIDES = [
  { title: 'Flash Sale Bromo Trip!', subtitle: 'Diskon 30% untuk paket sunrise tour', gradient: 'from-emerald-600 to-cyan-600', tag: 'FLASH SALE', icon: 'local_fire_department' },
  { title: 'Weekend Getaway Batu', subtitle: 'Nikmati 2H1M di Kota Batu mulai 350rb', gradient: 'from-violet-600 to-purple-600', tag: 'PROMO', icon: 'weekend' },
  { title: 'Pantai Malang Selatan', subtitle: 'Eksplorasi 5 pantai eksotis dalam 1 hari', gradient: 'from-blue-600 to-sky-500', tag: 'PAKET BARU', icon: 'surfing' },
]

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null)
  const [searchVal, setSearchVal] = useState('')
  const [time, setTime] = useState('')
  const [activeCategory, setActiveCategory] = useState('semua')
  const [promoIndex, setPromoIndex] = useState(0)
  const [flashDealEnd, setFlashDealEnd] = useState(() => {
    const end = new Date()
    end.setHours(23, 59, 59, 0)
    return end.getTime()
  })
  const [flashCountdown, setFlashCountdown] = useState('')

  useEffect(() => {
    fetch('/api/weather').then(r => r.json()).then(setWeather).catch(() => {})
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const id = setInterval(updateTime, 1000)
    return () => clearInterval(id)
  }, [])

  // Promo auto-advance
  useEffect(() => {
    const id = setInterval(() => setPromoIndex(i => (i + 1) % PROMO_SLIDES.length), 4000)
    return () => clearInterval(id)
  }, [])

  // Flash deal countdown
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, flashDealEnd - Date.now())
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setFlashCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [flashDealEnd])

  const featured = destinations.filter(d => d.matchScore).slice(0, 2)
  const trending = destinations.slice(2, 5)
  const nearYou = destinations.filter(d => parseInt(d.distance) <= 30).slice(0, 8)
  const flashDeals = destinations.filter(d => d.ticketPrice && d.ticketPrice.min > 0).slice(0, 4)
  const filteredTrending = activeCategory === 'semua' ? trending : destinations.filter(d => d.category === activeCategory).slice(0, 6)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 11) return 'Selamat Pagi'
    if (h < 15) return 'Selamat Siang'
    if (h < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  return (
    <main className="min-h-screen pt-6 pb-28 px-4 md:px-8 lg:px-10 page-enter max-w-[1400px] mx-auto">

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative rounded-3xl overflow-hidden home-section h-[280px] sm:h-[360px] md:h-[440px]">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvy4W5qIFnb_BmrObX6EAMG3o_kdFLXfKj39T0ft7gkBM-xKGG4yYJ5F132KcGedbXV3Rz28C6uKdDO96oalpHH29dEi3T4GSAk5JZgAic2LwM7aumIghYa29T_tqOpolzLUBRIy3S48UuboBksfSozK_DFvkJkSf9q2rfpzz222ddK0D6pzmm9R-jpyMEngsjXqgMEBhP2qsUu8qrvkOv2mwHQ70rdHLEfD1LU7g3xIsK9kXFaeKeJMDgtTNetboU4UdpHWYkNQ"
          alt="Pemandangan indah Malang"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)]/70 to-transparent" />

        {/* Time badge */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 glass px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm font-mono flex items-center gap-2" style={{ color: 'var(--text-accent)' }}>
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          {time}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8">
          <p className="text-xs sm:text-sm font-semibold mb-1 uppercase tracking-widest" style={{ color: 'var(--text-accent)' }}>
            {greeting()}, Sam! 👋
          </p>
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-3 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Siap Menjelajahi<br />Malang Hari Ini?
          </h1>
          <p className="mb-5 max-w-lg text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Temukan permata tersembunyi yang jauh dari keramaian, dipilih khusus oleh AI untukmu.
          </p>

          {/* Search bar */}
          <div className="flex items-center glass rounded-2xl p-1.5 max-w-lg" style={{ border: '1px solid var(--border)' }}>
            <span className="material-symbols-outlined px-3" style={{ color: 'var(--text-accent)' }}>search</span>
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm py-2"
              style={{ color: 'var(--text-primary)' }}
              placeholder="Cari destinasi, kuliner, atau aktivitas..."
            />
            <Link href={`/explore?q=${searchVal}`} className="btn-grad text-white px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap">
              Cari
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ STATS ROW ═══ */}
      <section className="home-section">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 stagger">
          <div className="glass rounded-2xl p-4 sm:p-5 text-center group hover:glow-primary transition-all">
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgba(31,175,143,0.12)' }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>travel_explore</span>
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-accent)' }}>120+</p>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>Hidden Gems</p>
          </div>
          <div className="glass rounded-2xl p-4 sm:p-5 text-center group hover:glow-accent transition-all">
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)' }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color: '#60A5FA', fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold" style={{ color: '#60A5FA' }}>4.8★</p>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>Rating Rata-rata</p>
          </div>
          <div className="glass rounded-2xl p-4 sm:p-5 text-center group hover:glow-primary transition-all">
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)' }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color: '#A78BFA', fontVariationSettings: "'FILL' 1" }}>groups</span>
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>12K+</p>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>Traveler Aktif</p>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORY TABS ═══ */}
      <section className="home-section">
        <div className="flex gap-2 overflow-x-auto no-scroll pb-2 scroll-snap-x">
          {CATEGORY_TABS.map(c => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all active-scale ${
                activeCategory === c.key ? 'btn-grad text-white shadow-md' : 'glass hover:border-[var(--primary)]/20'
              }`}
              style={activeCategory !== c.key ? { color: 'var(--text-muted)' } : {}}
            >
              <span className="material-symbols-outlined text-[15px]">{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* ═══ PROMO CAROUSEL ═══ */}
      <section className="home-section">
        <div className="relative rounded-2xl overflow-hidden h-40 sm:h-48">
          {PROMO_SLIDES.map((slide, i) => (
            <div key={i} className={`absolute inset-0 transition-all duration-700 flex items-center p-6 sm:p-8 bg-gradient-to-r ${slide.gradient} ${
              i === promoIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}>
              <div className="flex-1">
                <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full text-white mb-2 inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>{slide.icon}</span>
                  {slide.tag}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-1 mt-2">{slide.title}</h3>
                <p className="text-sm text-white/80 max-w-md">{slide.subtitle}</p>
              </div>
              <div className="hidden sm:flex w-20 h-20 rounded-2xl bg-white/10 items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-4xl text-white/60" style={{ fontVariationSettings: "'FILL' 1" }}>{slide.icon}</span>
              </div>
            </div>
          ))}
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {PROMO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setPromoIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === promoIndex ? 'w-7 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                aria-label={`Promo ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FLASH DEAL ═══ */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h3 className="text-lg sm:text-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--error)', fontVariationSettings: "'FILL' 1" }}>bolt</span>
              Flash Deal
            </h3>
            <p className="text-xs">Berakhir dalam</p>
          </div>
          <div className="flex items-center gap-1.5">
            {flashCountdown.split(':').map((segment, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-bold px-2.5 py-1.5 rounded-lg" style={{ background: 'var(--bg-card)', color: 'var(--error)', border: '1px solid var(--border)' }}>
                  {segment}
                </span>
                {i < 2 && <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>:</span>}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 stagger">
          {flashDeals.map(d => (
            <Link key={d.id} href={`/destinations/${d.slug}`} className="block">
              <div className="glass rounded-2xl overflow-hidden group card-lift cursor-pointer">
                <div className="h-28 sm:h-36 overflow-hidden relative">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute top-2.5 left-2.5 badge badge-red text-[9px]">-30%</span>
                </div>
                <div className="p-3 sm:p-4">
                  <h4 className="text-xs sm:text-sm font-semibold truncate mb-1.5" style={{ color: 'var(--text-primary)' }}>{d.name}</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] line-through" style={{ color: 'var(--text-muted)' }}>{formatCurrency((d.ticketPrice?.min || 25000) * 1.3)}</span>
                    <span className="text-xs font-bold font-mono" style={{ color: 'var(--text-accent)' }}>{formatCurrency(d.ticketPrice?.min || 25000)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ WEATHER + TRAFFIC INFO ═══ */}
      <section className="home-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Weather Card */}
          <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-widest mb-1 font-medium" style={{ color: 'var(--text-muted)' }}>Cuaca Batu</p>
                {weather ? (
                  <div className="flex items-end gap-1.5">
                    <p className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{weather.weather.batu.temp}°</p>
                    <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{weather.weather.batu.condition}</p>
                  </div>
                ) : (
                  <div className="skeleton w-20 h-8 rounded-lg" />
                )}
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1", color: '#F59E0B' }}>
                  partly_cloudy_day
                </span>
              </div>
            </div>
            {weather && (
              <>
                <div className="flex gap-4 text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">water_drop</span>
                    {weather.weather.batu.humidity}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">air</span>
                    {weather.weather.batu.wind} km/h
                  </span>
                </div>
                {/* 5-day forecast */}
                {weather.weather.batu.forecast && (
                  <div className="flex justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                    {weather.weather.batu.forecast.map((f: any) => (
                      <div key={f.day} className="text-center">
                        <p className="text-[10px] mb-1 font-medium" style={{ color: 'var(--text-muted)' }}>{f.day}</p>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1", color: f.icon === 'rain' ? '#60A5FA' : '#F59E0B' }}>
                          {f.icon === 'rain' ? 'rainy' : f.icon === 'cloudy' ? 'cloud' : 'wb_sunny'}
                        </span>
                        <p className="text-[10px] font-mono font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{f.temp}°</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Traffic Card */}
          <div className="glass rounded-2xl p-5 sm:p-6 md:col-span-2" style={{ border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-widest mb-1 font-medium" style={{ color: 'var(--text-muted)' }}>Info Lalu Lintas</p>
                {weather?.trafficAlerts?.[0] && (
                  <p className="font-semibold text-sm" style={{ color: 'var(--error)' }}>{weather.trafficAlerts[0].route}</p>
                )}
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full animate-pulse"
                style={{ color: 'var(--error)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--error)' }} />
                Live
              </span>
            </div>
            <div className="space-y-2">
              {weather?.trafficAlerts?.map((a: any) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[var(--bg-card)]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0`} style={{ background: a.severity === 'high' ? 'var(--error)' : 'var(--primary)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{a.route}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.description}</p>
                  </div>
                  <span className="material-symbols-outlined text-[16px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ NEAR YOU — Horizontal Scroll ═══ */}
      {nearYou.length > 0 && (
        <section className="home-section">
          <div className="section-header">
            <div>
              <h3 className="text-lg sm:text-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>near_me</span>
                Dekat Kamu
              </h3>
              <p className="text-xs">Radius 30 km dari Kota Malang</p>
            </div>
            <Link href="/explore" className="text-sm font-medium flex items-center gap-1 hover:underline flex-shrink-0" style={{ color: 'var(--text-accent)' }}>
              Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scroll pb-2 scroll-snap-x">
            {nearYou.map(d => (
              <div key={d.id} className="flex-shrink-0 w-[220px] sm:w-[260px]">
                <DestinationCard d={d} size="compact" hideBookmark />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ RECOMMENDATIONS ═══ */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h3 className="text-lg sm:text-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Rekomendasi untuk Kamu
            </h3>
            <p className="text-sm">Dipilih AI berdasarkan preferensimu</p>
          </div>
          <Link href="/explore" className="text-sm font-medium flex items-center gap-1 hover:underline flex-shrink-0" style={{ color: 'var(--text-accent)' }}>
            Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger">
          {featured.map(d => (
            <DestinationCard key={d.id} d={d} hideBookmark />
          ))}
        </div>
      </section>

      {/* ═══ TRENDING ═══ */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h3 className="text-lg sm:text-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]" style={{ color: '#F59E0B', fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              Sedang Trending
            </h3>
            <p className="text-sm">Paling banyak dikunjungi minggu ini</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {filteredTrending.map(d => (
            <DestinationCard key={d.id} d={d} size="compact" hideBookmark />
          ))}
        </div>
      </section>

      {/* ═══ AI CTA BANNER ═══ */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 gradient-border">
        <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(31,175,143,0.08), transparent, rgba(59,130,246,0.08))' }} />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl btn-grad flex items-center justify-center flex-shrink-0 shadow-lg" style={{ boxShadow: '0 4px 20px rgba(31,175,143,0.3)' }}>
            <span className="material-symbols-outlined text-3xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-display text-lg sm:text-xl font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>AI Planner Siap Membantumu</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>Ceritakan preferensimu, AI kami akan merancang itinerary sempurna dalam hitungan detik.</p>
          </div>
          <Link href="/planner" className="btn-grad px-7 py-3.5 rounded-xl text-white font-semibold text-sm flex-shrink-0 shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </main>
  )
}
