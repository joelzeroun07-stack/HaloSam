'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import DestinationCard from '@/components/DestinationCard'
import { destinations } from '@/lib/data'

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null)
  const [searchVal, setSearchVal] = useState('')
  const [time, setTime] = useState('')

  useEffect(() => {
    fetch('/api/weather').then(r => r.json()).then(setWeather)
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const id = setInterval(updateTime, 1000)
    return () => clearInterval(id)
  }, [])

  const featured = destinations.filter(d => d.matchScore).slice(0, 2)
  const trending = destinations.slice(2, 5)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 11) return 'Selamat Pagi'
    if (h < 15) return 'Selamat Siang'
    if (h < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  return (
    <main className="min-h-screen pt-6 pb-24 px-4 md:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden mb-8 h-[420px] md:h-[480px]">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvy4W5qIFnb_BmrObX6EAMG3o_kdFLXfKj39T0ft7gkBM-xKGG4yYJ5F132KcGedbXV3Rz28C6uKdDO96oalpHH29dEi3T4GSAk5JZgAic2LwM7aumIghYa29T_tqOpolzLUBRIy3S48UuboBksfSozK_DFvkJkSf9q2rfpzz222ddK0D6pzmm9R-jpyMEngsjXqgMEBhP2qsUu8qrvkOv2mwHQ70rdHLEfD1LU7g3xIsK9kXFaeKeJMDgtTNetboU4UdpHWYkNQ"
          alt="Malang"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/60 to-transparent" />

        {/* Time badge */}
        <div className="absolute top-5 right-5 glass px-4 py-2 rounded-xl text-sm font-mono text-primary">
          {time}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <p className="text-primary text-sm font-medium mb-1 uppercase tracking-widest">{greeting()}, Sam!</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            Siap Menjelajahi<br />Malang Hari Ini?
          </h2>
          <p className="text-muted mb-6 max-w-lg">Temukan permata tersembunyi yang jauh dari keramaian, dipilih khusus oleh AI untukmu.</p>

          {/* Search */}
          <div className="flex items-center glass rounded-2xl p-1.5 max-w-lg border border-white/10">
            <span className="material-symbols-outlined text-primary px-3">search</span>
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-muted flex-1 text-sm py-2"
              placeholder="Cari destinasi, kuliner, atau aktivitas..."
            />
            <Link href={`/explore?q=${searchVal}`} className="btn-grad text-white px-5 py-2 rounded-xl text-sm font-medium">
              Cari
            </Link>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8 stagger">
        <div className="glass rounded-2xl p-4 text-center">
          <p className="font-display text-2xl font-bold text-primary">120+</p>
          <p className="text-[10px] text-muted mt-1">Hidden Gems</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <p className="font-display text-2xl font-bold text-accent">4.8★</p>
          <p className="text-[10px] text-muted mt-1">Rating Rata-rata</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <p className="font-display text-2xl font-bold text-white">12K+</p>
          <p className="text-[10px] text-muted mt-1">Traveler Aktif</p>
        </div>
      </div>

      {/* Weather + Traffic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="glass rounded-2xl p-5 border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[11px] text-muted uppercase tracking-widest mb-1">Cuaca Batu</p>
              {weather ? (
                <div className="flex items-end gap-1">
                  <p className="font-display text-3xl font-bold text-white">{weather.weather.batu.temp}°</p>
                  <p className="text-sm text-muted mb-1">{weather.weather.batu.condition}</p>
                </div>
              ) : (
                <div className="skeleton w-20 h-8 rounded-lg" />
              )}
            </div>
            <span className="material-symbols-outlined text-4xl text-primary/70" style={{ fontVariationSettings: "'FILL' 1" }}>
              partly_cloudy_day
            </span>
          </div>
          {weather && (
            <div className="flex gap-4 text-[11px] text-muted">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">water_drop</span>
                {weather.weather.batu.humidity}%
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">air</span>
                {weather.weather.batu.wind} km/h
              </span>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5 md:col-span-2 border border-white/5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[11px] text-muted uppercase tracking-widest mb-1">Info Lalu Lintas</p>
              {weather?.trafficAlerts?.[0] && (
                <p className="text-red-400 font-semibold">{weather.trafficAlerts[0].route}</p>
              )}
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Live
            </span>
          </div>
          {weather?.trafficAlerts?.map((a: any) => (
            <div key={a.id} className="flex items-center gap-3 mt-2 p-2.5 rounded-xl bg-white/3 border border-white/5">
              <span className={`w-2 h-2 rounded-full ${a.severity === 'high' ? 'bg-red-400' : 'bg-primary'}`} />
              <div>
                <p className="text-xs font-medium text-white">{a.route}</p>
                <p className="text-[10px] text-muted">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <section className="mb-10">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h3 className="font-display text-xl font-bold text-white">Rekomendasi untuk Kamu</h3>
            <p className="text-sm text-muted mt-0.5">Dipilih AI berdasarkan preferensimu</p>
          </div>
          <Link href="/explore" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger">
          {featured.map(d => (
            <DestinationCard key={d.id} d={d} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="mb-10">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h3 className="font-display text-xl font-bold text-white">Sedang Trending</h3>
            <p className="text-sm text-muted mt-0.5">Paling banyak dikunjungi minggu ini</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {trending.map(d => (
            <DestinationCard key={d.id} d={d} size="compact" />
          ))}
        </div>
      </section>

      {/* AI CTA Banner */}
      <section className="relative overflow-hidden rounded-3xl p-6 md:p-8 gradient-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl btn-grad flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-2xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-display text-xl font-bold text-white mb-1">AI Planner Siap Membantumu</h3>
            <p className="text-muted text-sm">Ceritakan preferensimu, AI kami akan merancang itinerary sempurna dalam hitungan detik.</p>
          </div>
          <Link href="/planner" className="btn-grad px-6 py-3 rounded-xl text-white font-semibold text-sm flex-shrink-0 shadow-lg">
            Mulai Sekarang →
          </Link>
        </div>
      </section>
    </main>
  )
}
