'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import DestinationCard from '@/components/DestinationCard'
import { Destination } from '@/lib/data'

const CATEGORIES = [
  { key: 'semua', label: 'Semua' },
  { key: 'alam', label: '🌿 Alam' },
  { key: 'kuliner', label: '🍜 Kuliner' },
  { key: 'budaya', label: '🏛 Budaya' },
  { key: 'pantai', label: '🏖 Pantai' },
  { key: 'desa', label: '🌾 Desa Wisata' },
  { key: 'umkm', label: '🛍 UMKM' },
]

const ROUTES = [
  { id: 'spiritual', label: 'THE SPIRITUAL TRAIL', title: 'Candi-Candi Singosari di Kala Senja', stops: 4 },
  { id: 'flavor', label: 'THE FLAVOR CHASE', title: 'Jelajah Warung Kuno Pecinan Malang', stops: 6 },
  { id: 'adventure', label: 'THE WILD TREK', title: 'Puncak-Puncak Tersembunyi Malang', stops: 5 },
]

function ExploreContent() {
  const searchParams = useSearchParams()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('semua')
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [sort, setSort] = useState('rating')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== 'semua') params.set('category', category)
    if (search) params.set('search', search)
    params.set('sort', sort)

    fetch(`/api/destinations?${params}`)
      .then(r => r.json())
      .then(data => {
        setDestinations(data.data)
        setLoading(false)
      })
  }, [category, search, sort])

  return (
    <main className="min-h-screen pt-6 pb-24 px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Discover</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Temukan Sisi Lain Malang</h1>
        <p className="text-muted max-w-2xl text-sm leading-relaxed">
          Jelajahi destinasi kurasi yang jauh dari keramaian namun kaya pengalaman otentik. Setiap tempat punya cerita.
        </p>
      </div>

      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center glass rounded-xl px-4 py-2.5 border border-white/5 flex-1">
          <span className="material-symbols-outlined text-primary text-[18px] mr-2">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-white placeholder-muted flex-1 text-sm"
            placeholder="Cari destinasi, tag, atau lokasi..."
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-muted hover:text-white">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="glass border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white bg-transparent outline-none"
        >
          <option value="rating" className="bg-card">Rating Tertinggi</option>
          <option value="crowd" className="bg-card">Paling Sepi</option>
        </select>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto no-scroll pb-2">
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
              category === c.key
                ? 'bg-primary/10 text-primary border-primary/40'
                : 'border-white/10 text-muted hover:border-white/20 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Destination Grid */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton h-40 rounded-3xl" />
              ))}
            </div>
          ) : destinations.length === 0 ? (
            <div className="glass rounded-3xl p-16 text-center">
              <span className="material-symbols-outlined text-5xl text-muted mb-4 block">search_off</span>
              <p className="text-white font-semibold mb-2">Tidak ditemukan</p>
              <p className="text-muted text-sm">Coba kata kunci atau kategori lain</p>
            </div>
          ) : (
            <div className="space-y-4 stagger">
              {destinations.map(d => (
                <DestinationCard key={d.id} d={d} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Routes */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[18px]">alt_route</span>
              <h3 className="font-semibold text-white">Rute Anti-Mainstream</h3>
            </div>
            <div className="space-y-3">
              {ROUTES.map(r => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl bg-white/3 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <p className="text-[9px] text-primary font-bold uppercase tracking-widest mb-1">{r.label}</p>
                  <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{r.title}</p>
                  <p className="text-[10px] text-muted mt-1">{r.stops} destinasi · Est. 1 hari</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 border border-white/10 py-2.5 rounded-xl text-xs font-bold uppercase text-muted hover:text-white hover:border-white/20 transition-all">
              Lihat Semua Rute
            </button>
          </div>

          {/* Tips Card */}
          <div className="glass rounded-2xl p-5 border border-primary/10 bg-primary/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              <h3 className="font-semibold text-white text-sm">Tip Hari Ini</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Kunjungi destinasi alam di pagi hari (sebelum jam 9) untuk menghindari keramaian dan mendapatkan pencahayaan foto terbaik.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ExploreScreen() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-6 pb-24 px-4"><div className="skeleton h-40 rounded-3xl" /></div>}>
      <ExploreContent />
    </Suspense>
  )
}
