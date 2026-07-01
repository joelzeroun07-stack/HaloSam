'use client'
import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import DestinationCard from '@/components/DestinationCard'
import { Destination, destinations as allDestinations } from '@/lib/data'
import { formatCurrency, CATEGORY_MAP } from '@/lib/utils'

const CATEGORIES = [
  { key: 'semua', label: 'Semua', icon: 'auto_awesome' },
  { key: 'alam', label: 'Alam', icon: 'forest' },
  { key: 'kuliner', label: 'Kuliner', icon: 'restaurant' },
  { key: 'budaya', label: 'Budaya', icon: 'museum' },
  { key: 'pantai', label: 'Pantai', icon: 'beach_access' },
  { key: 'desa', label: 'Desa Wisata', icon: 'agriculture' },
]

function ExploreContent() {
  const searchParams = useSearchParams()
  const [category, setCategory] = useState('semua')
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [sort, setSort] = useState('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000])
  const [minRating, setMinRating] = useState(0)
  const [crowdFilter, setCrowdFilter] = useState<string[]>([])
  const [compareList, setCompareList] = useState<Destination[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 9

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [category, debouncedSearch, sort, minRating, crowdFilter, priceRange])

  // Filter & sort
  const filtered = useMemo(() => {
    let result = [...allDestinations]

    if (category !== 'semua') {
      result = result.filter(d => d.category === category)
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    if (minRating > 0) {
      result = result.filter(d => d.rating >= minRating)
    }

    if (crowdFilter.length > 0) {
      result = result.filter(d => crowdFilter.includes(d.crowdLevel))
    }

    // Price filter
    result = result.filter(d => {
      const price = d.ticketPrice?.min || d.foodPrice?.min || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Sort
    switch (sort) {
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      case 'price': result.sort((a, b) => (a.ticketPrice?.min || a.foodPrice?.min || 0) - (b.ticketPrice?.min || b.foodPrice?.min || 0)); break
      case 'crowd': {
        const order = { low: 0, medium: 1, high: 2 }
        result.sort((a, b) => order[a.crowdLevel] - order[b.crowdLevel])
        break
      }
      case 'reviews': result.sort((a, b) => b.reviewCount - a.reviewCount); break
    }

    return result
  }, [category, debouncedSearch, sort, minRating, crowdFilter, priceRange])

  const toggleCompare = (d: Destination) => {
    setCompareList(prev => {
      if (prev.find(x => x.id === d.id)) return prev.filter(x => x.id !== d.id)
      if (prev.length >= 3) return prev
      return [...prev, d]
    })
  }

  const toggleCrowd = (level: string) => {
    setCrowdFilter(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level])
  }

  const activeFilterCount = (minRating > 0 ? 1 : 0) + (crowdFilter.length > 0 ? 1 : 0) + (priceRange[1] < 200000 ? 1 : 0)

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)

  const getPageNumbers = () => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <main className="min-h-screen pt-6 pb-28 px-4 md:px-8 lg:px-10 page-enter max-w-[1400px] mx-auto">

      {/* ═══ PAGE HEADER ═══ */}
      <section className="home-section">
        <p className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-accent)' }}>
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          Discover
        </p>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Temukan Sisi Lain Malang
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Jelajahi {allDestinations.length} destinasi kurasi yang kaya pengalaman otentik — dari air terjun tersembunyi hingga kuliner legendaris.
        </p>
      </section>

      {/* ═══ SEARCH + CONTROLS ═══ */}
      <section className="home-section">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="flex items-center glass rounded-2xl px-4 py-3 flex-1" style={{ border: '1px solid var(--border)' }}>
            <span className="material-symbols-outlined text-[18px] mr-3" style={{ color: 'var(--text-accent)' }}>search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm" placeholder="Cari destinasi, tag, atau lokasi..."
              style={{ color: 'var(--text-primary)' }} />
            {search && (
              <button onClick={() => setSearch('')} className="p-1 rounded-lg hover:bg-[var(--bg-card)] transition-colors" aria-label="Hapus pencarian">
                <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-muted)' }}>close</span>
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="glass rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer" style={{ color: 'var(--text-primary)', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <option value="rating">Rating Tertinggi</option>
              <option value="crowd">Paling Sepi</option>
              <option value="price">Harga Termurah</option>
              <option value="reviews">Paling Populer</option>
            </select>

            {/* View toggle */}
            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <button onClick={() => setViewMode('grid')} className={`px-3 py-2 transition-all ${viewMode === 'grid' ? 'btn-grad' : ''}`}
                style={viewMode !== 'grid' ? { background: 'var(--bg-card)', color: 'var(--text-muted)' } : {}}
                aria-label="Grid view">
                <span className="material-symbols-outlined text-[18px]" style={viewMode === 'grid' ? { color: 'white' } : {}}>grid_view</span>
              </button>
              <button onClick={() => setViewMode('list')} className={`px-3 py-2 transition-all ${viewMode === 'list' ? 'btn-grad' : ''}`}
                style={viewMode !== 'list' ? { background: 'var(--bg-card)', color: 'var(--text-muted)' } : {}}
                aria-label="List view">
                <span className="material-symbols-outlined text-[18px]" style={viewMode === 'list' ? { color: 'white' } : {}}>view_list</span>
              </button>
            </div>

            {/* Filter toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`glass px-3 py-2 rounded-xl touch-target relative transition-all ${showFilters ? 'glow-primary' : ''}`}
              style={{ border: showFilters ? '1px solid rgba(31,175,143,0.3)' : '1px solid var(--border)' }} aria-label="Filter">
              <span className="material-symbols-outlined text-[18px]" style={{ color: showFilters ? 'var(--text-accent)' : 'var(--text-muted)' }}>tune</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center text-white" style={{ background: 'var(--primary)' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORY TABS ═══ */}
      <section className="home-section">
        <div className="flex gap-2 overflow-x-auto no-scroll pb-2 scroll-snap-x">
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCategory(c.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all active-scale ${
                category === c.key ? 'btn-grad text-white shadow-md' : 'glass hover:border-[var(--primary)]/20'
              }`}
              style={category !== c.key ? { color: 'var(--text-muted)' } : {}}>
              <span className="material-symbols-outlined text-[15px]">{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* ═══ COMPARE BAR ═══ */}
      {compareList.length > 0 && (
        <section className="home-section">
          <div className="glass rounded-2xl p-4 flex items-center justify-between" style={{ border: '1px solid rgba(31,175,143,0.3)', background: 'rgba(31,175,143,0.03)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(31,175,143,0.12)' }}>
                <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--text-accent)' }}>compare</span>
              </div>
              <div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {compareList.length}/3 destinasi dipilih
                </span>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Pilih minimal 2 untuk membandingkan</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCompare(true)} disabled={compareList.length < 2}
                className="btn-grad px-5 py-2 rounded-xl text-xs text-white font-semibold disabled:opacity-40 transition-opacity">
                Bandingkan
              </button>
              <button onClick={() => setCompareList([])} className="text-xs font-medium px-3 py-2 rounded-xl transition-colors hover:bg-[var(--bg-card)]" style={{ color: 'var(--text-muted)' }}>
                Reset
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Filter Panel */}
        {showFilters && (
          <div className="lg:col-span-3 glass rounded-2xl p-5 sm:p-6 h-fit" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)' }}>filter_list</span>
                Filter Lanjutan
              </h3>
              {activeFilterCount > 0 && (
                <button onClick={() => { setMinRating(0); setCrowdFilter([]); setPriceRange([0, 200000]) }}
                  className="text-[10px] font-medium px-2 py-1 rounded-lg hover:bg-[var(--bg-card)] transition-colors" style={{ color: 'var(--text-accent)' }}>
                  Reset
                </button>
              )}
            </div>

            {/* Rating filter */}
            <div className="mb-6">
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Rating Minimum</p>
              <div className="flex flex-wrap gap-2">
                {[0, 4, 4.3, 4.5, 4.7].map(r => (
                  <button key={r} onClick={() => setMinRating(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${minRating === r ? 'btn-grad text-white' : ''}`}
                    style={minRating !== r ? { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' } : {}}>
                    {r === 0 ? 'Semua' : `${r}+ ★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Crowd filter */}
            <div className="mb-6">
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Tingkat Keramaian</p>
              <div className="space-y-2.5">
                {[
                  { key: 'low', label: 'Sepi', cls: 'crowd-low', icon: 'person' },
                  { key: 'medium', label: 'Sedang', cls: 'crowd-medium', icon: 'group' },
                  { key: 'high', label: 'Ramai', cls: 'crowd-high', icon: 'groups' },
                ].map(c => (
                  <label key={c.key} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
                    <input type="checkbox" checked={crowdFilter.includes(c.key)}
                      onChange={() => toggleCrowd(c.key)} className="accent-[var(--primary)] w-4 h-4" />
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${c.cls}`}>{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Harga Maksimal</p>
              <input type="range" min={0} max={200000} step={5000} value={priceRange[1]}
                onChange={e => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-[var(--primary)]" />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                <span>Gratis</span>
                <span className="font-mono font-bold" style={{ color: 'var(--text-accent)' }}>{formatCurrency(priceRange[1])}</span>
              </div>
            </div>
          </div>
        )}

        {/* Destination Grid/List */}
        <div className={showFilters ? 'lg:col-span-9' : 'lg:col-span-12'}>
          <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{startItem}–{endItem}</strong> dari <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> destinasi
            </p>
            {category !== 'semua' && (
              <button onClick={() => setCategory('semua')} className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: 'var(--text-accent)' }}>
                <span className="material-symbols-outlined text-[14px]">close</span>
                Reset kategori
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="glass rounded-3xl p-16 text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                <span className="material-symbols-outlined text-4xl" style={{ color: '#A78BFA' }}>search_off</span>
              </div>
              <p className="font-display font-semibold mb-2 text-lg" style={{ color: 'var(--text-primary)' }}>Tidak ditemukan</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Coba kata kunci atau filter lain</p>
              <button onClick={() => { setSearch(''); setCategory('semua'); setMinRating(0); setCrowdFilter([]); setPriceRange([0, 200000]) }}
                className="btn-grad px-5 py-2 rounded-xl text-white text-sm font-semibold">
                Reset Semua Filter
              </button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-4 stagger">
              {paginatedItems.map(d => (
                <DestinationCard key={d.id} d={d} hideBookmark onCompare={toggleCompare} isComparing={!!compareList.find(x => x.id === d.id)} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 stagger">
              {paginatedItems.map(d => (
                <DestinationCard key={d.id} d={d} size="compact" hideBookmark />
              ))}
            </div>
          )}

          {/* ═══ PAGINATION ═══ */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Halaman <strong style={{ color: 'var(--text-primary)' }}>{currentPage}</strong> dari <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong>
              </p>
              <div className="flex items-center gap-1.5">
                {/* Previous */}
                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
                  style={{ color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  aria-label="Halaman sebelumnya">
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, i) => (
                  page === '...' ? (
                    <span key={`dots-${i}`} className="px-2 text-sm" style={{ color: 'var(--text-muted)' }}>…</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => { setCurrentPage(page as number); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${currentPage === page ? 'btn-grad text-white shadow-md' : 'hover:bg-[var(--bg-card)]'}`}
                      style={currentPage !== page ? { color: 'var(--text-muted)', border: '1px solid var(--border)' } : {}}
                      aria-label={`Halaman ${page}`}>
                      {page}
                    </button>
                  )
                ))}

                {/* Next */}
                <button
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
                  style={{ color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  aria-label="Halaman berikutnya">
                  <span className="hidden sm:inline">Next</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ COMPARISON MODAL ═══ */}
      {showCompare && compareList.length >= 2 && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 modal-overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-3xl max-h-[80vh] overflow-auto rounded-2xl p-6 sm:p-8 modal-content" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Perbandingan Destinasi</h2>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Membandingkan {compareList.length} destinasi</p>
              </div>
              <button onClick={() => setShowCompare(false)} className="touch-target w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--bg-card)] transition-colors" aria-label="Tutup">
                <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)' }}>close</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-3" style={{ color: 'var(--text-muted)' }}>Kriteria</th>
                    {compareList.map(d => (
                      <th key={d.id} className="text-center py-3 px-3 min-w-[140px]">
                        <img src={d.image} alt={d.name} className="w-16 h-16 rounded-xl object-cover mx-auto mb-2" />
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Rating', render: (d: Destination) => `${d.rating} / 5` },
                    { label: 'Harga', render: (d: Destination) => d.ticketPrice ? formatCurrency(d.ticketPrice.min) : d.foodPrice ? formatCurrency(d.foodPrice.min) : '-' },
                    { label: 'Jarak', render: (d: Destination) => d.distance },
                    { label: 'Keramaian', render: (d: Destination) => d.crowdLevel === 'low' ? 'Sepi' : d.crowdLevel === 'medium' ? 'Sedang' : 'Ramai' },
                    { label: 'Ulasan', render: (d: Destination) => `${d.reviewCount} ulasan` },
                    { label: 'Jam Buka', render: (d: Destination) => d.openHours || '-' },
                    { label: 'Kategori', render: (d: Destination) => CATEGORY_MAP[d.category]?.label || d.category },
                  ].map(row => (
                    <tr key={row.label} style={{ borderTop: '1px solid var(--border)' }}>
                      <td className="py-3 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{row.label}</td>
                      {compareList.map(d => (
                        <td key={d.id} className="py-3 px-3 text-center" style={{ color: 'var(--text-primary)' }}>{row.render(d)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
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
