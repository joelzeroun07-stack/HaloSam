'use client'
import { useState, useEffect } from 'react'
import ItineraryCard from '@/components/ItineraryCard'
import { formatCurrency, setLocalStorage, getLocalStorage } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'

const STYLES = [
  { key: 'Petualang', label: 'Petualang', icon: 'hiking', desc: 'Trekking, air terjun, off-road' },
  { key: 'Santai', label: 'Santai', icon: 'spa', desc: 'Rileks, pemandangan, kafe' },
  { key: 'Kuliner', label: 'Kuliner', icon: 'restaurant', desc: 'Street food, warung legendaris' },
  { key: 'Budaya', label: 'Budaya', icon: 'museum', desc: 'Candi, kampung adat, sejarah' },
  { key: 'Foto Estetik', label: 'Foto Estetik', icon: 'photo_camera', desc: 'Spot instagramable, golden hour' },
  { key: 'Keluarga', label: 'Keluarga', icon: 'family_restroom', desc: 'Aman anak, fasilitas lengkap' },
]
const TRANSPORT = [
  { key: 'Motor', icon: 'two_wheeler', desc: 'Fleksibel & murah' },
  { key: 'Mobil', icon: 'directions_car', desc: 'Nyaman untuk keluarga' },
  { key: 'Angkot', icon: 'directions_bus', desc: 'Pengalaman lokal' },
  { key: 'Ojol', icon: 'moped', desc: 'Praktis tanpa pusing' },
]
const CULINARY = [
  { key: 'Halal', icon: 'verified' },
  { key: 'Vegetarian', icon: 'eco' },
  { key: 'Seafood', icon: 'set_meal' },
  { key: 'Lokal', icon: 'storefront' },
  { key: 'Street Food', icon: 'kebab_dining' },
]
const ACCOMMODATION = [
  { key: 'Tanpa Menginap', icon: 'home', desc: 'Day trip saja' },
  { key: 'Guest House (< 300rb)', icon: 'cottage', desc: 'Hemat & cozy' },
  { key: 'Hotel Bintang 3', icon: 'hotel', desc: 'Nyaman & modern' },
  { key: 'Resort', icon: 'villa', desc: 'Premium experience' },
]
const START_POINTS = [
  { key: 'Malang Kota', icon: 'location_city' },
  { key: 'Batu', icon: 'landscape' },
  { key: 'Kepanjen', icon: 'place' },
  { key: 'Singosari', icon: 'place' },
  { key: 'Tumpang', icon: 'place' },
  { key: 'Lawang', icon: 'place' },
]
const LOADING_STEPS = [
  { text: 'Menganalisis preferensi kamu...', icon: 'psychology' },
  { text: 'Memilih destinasi terbaik...', icon: 'travel_explore' },
  { text: 'Menghitung rute optimal...', icon: 'route' },
  { text: 'Memeriksa kondisi keramaian...', icon: 'groups' },
  { text: 'Menyusun budget estimasi...', icon: 'payments' },
  { text: 'Menyiapkan tips perjalanan...', icon: 'tips_and_updates' },
]

const WIZARD_STEPS = [
  { label: 'Dasar', icon: 'tune' },
  { label: 'Gaya', icon: 'style' },
  { label: 'Detail', icon: 'settings' },
  { label: 'Review', icon: 'checklist' },
]

export default function PlannerScreen() {
  const toast = useToast()
  const [phase, setPhase] = useState<'input' | 'loading' | 'result'>('input')
  const [wizardStep, setWizardStep] = useState(0)

  // Step 1: Basics
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startPoint, setStartPoint] = useState('Malang Kota')
  const [participants, setParticipants] = useState(2)
  const [hasChildren, setHasChildren] = useState(false)

  // Compute duration from date range
  const duration = (() => {
    if (!startDate || !endDate) return 2
    const diff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1
    return Math.max(1, Math.min(7, diff))
  })()
  const todayStr = new Date().toISOString().split('T')[0]

  // Step 2: Style
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Petualang'])
  const [crowd, setCrowd] = useState<'sepi' | 'normal' | 'ramai'>('sepi')
  const [budget, setBudget] = useState<'hemat' | 'standard' | 'premium'>('standard')
  const [timePreference, setTimePreference] = useState<'early' | 'normal' | 'late'>('normal')

  // Step 3: Details
  const [transport, setTransport] = useState('Mobil')
  const [culinaryPrefs, setCulinaryPrefs] = useState<string[]>(['Lokal'])
  const [accommodation, setAccommodation] = useState('Tanpa Menginap')
  const [avoidCrowd, setAvoidCrowd] = useState(true)
  const [avoidSteep, setAvoidSteep] = useState(false)
  const [avoidPaid, setAvoidPaid] = useState(false)
  const [specialRequest, setSpecialRequest] = useState('')

  // Results
  const [itinerary, setItinerary] = useState<any>(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [isShared, setIsShared] = useState(false)

  const toggleStyle = (s: string) => {
    setSelectedStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }
  const toggleCulinary = (c: string) => {
    setCulinaryPrefs(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  // Loading animation
  useEffect(() => {
    if (phase !== 'loading') return
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length)
    }, 800)
    return () => clearInterval(interval)
  }, [phase])

  const generate = async () => {
    setPhase('loading')
    setLoadingStep(0)
    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration,
          style: selectedStyles.map(s => s.toLowerCase()),
          crowdTolerance: crowd,
          budget,
          participants,
          hasChildren,
          transport,
          culinaryPrefs,
          accommodation,
          startPoint,
          timePreference,
          specialRequest,
          avoid: [avoidCrowd && 'keramaian', avoidSteep && 'tanjakan', avoidPaid && 'berbayar'].filter(Boolean),
        }),
      })
      const data = await res.json()
      setItinerary(data.itinerary)
      setPhase('result')
    } catch {
      toast.error('Gagal membuat itinerary. Coba lagi.')
      setPhase('input')
    }
  }

  const handleSave = () => {
    const plans = getLocalStorage<any[]>('halosam_plans', [])
    plans.unshift({ ...itinerary, savedAt: new Date().toISOString() })
    setLocalStorage('halosam_plans', plans)
    setIsSaved(true)
    toast.success('Rencana berhasil disimpan!')
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleShare = () => {
    const url = `${window.location.origin}/planner?shared=${Date.now().toString(36)}`
    navigator.clipboard?.writeText(url).then(() => {
      setIsShared(true)
      toast.success('Link itinerary disalin!')
      setTimeout(() => setIsShared(false), 3000)
    }).catch(() => {
      toast.success('Link itinerary disalin!')
    })
  }

  const canProceed = () => {
    if (wizardStep === 0) return true
    if (wizardStep === 1) return selectedStyles.length > 0
    if (wizardStep === 2) return true
    return true
  }

  const budgetLabels = { hemat: '< 500K', standard: '500K–1.5Jt', premium: '1.5Jt+' }
  const budgetIcons = { hemat: 'savings', standard: 'account_balance_wallet', premium: 'diamond' }
  const crowdLabels = { sepi: 'Sepi', normal: 'Normal', ramai: 'Ramai' }
  const crowdIcons = { sepi: 'person', normal: 'group', ramai: 'groups' }
  const timeLabels = { early: 'Early Bird', normal: 'Normal', late: 'Night Owl' }
  const timeIcons = { early: 'wb_sunny', normal: 'wb_twilight', late: 'dark_mode' }
  const timeDescs = { early: 'Mulai pukul 05:00', normal: 'Mulai pukul 08:00', late: 'Mulai pukul 10:00+' }

  // ═══════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════

  return (
    <main className="min-h-screen pt-6 pb-28 px-4 md:px-8 lg:px-10 page-enter max-w-[1400px] mx-auto">

      {/* ═══ INPUT PHASE: WIZARD ═══ */}
      {phase === 'input' && (
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <section className="home-section">
            <p className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-accent)' }}>
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              AI Planner
            </p>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Rencanakan Petualanganmu
            </h1>
            <p className="text-sm max-w-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Sesuaikan preferensimu selengkap mungkin. AI kami akan merancang itinerary terbaik khusus untukmu.
            </p>
          </section>

          {/* Progress Steps */}
          <section className="home-section">
            <div className="flex items-center justify-between gap-2">
              {WIZARD_STEPS.map((ws, i) => (
                <button key={ws.label} onClick={() => i <= wizardStep && setWizardStep(i)}
                  className="flex-1 flex flex-col items-center gap-1.5 relative group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${i < wizardStep ? 'btn-grad shadow-md' : i === wizardStep ? 'shadow-md' : ''
                    }`} style={
                      i === wizardStep ? { background: 'var(--primary)', boxShadow: '0 4px 15px rgba(31,175,143,0.3)' }
                        : i > wizardStep ? { background: 'var(--bg-card)', border: '1px solid var(--border)' } : {}
                    }>
                    <span className="material-symbols-outlined text-[18px]"
                      style={{ color: i <= wizardStep ? 'white' : 'var(--text-muted)', fontVariationSettings: i <= wizardStep ? "'FILL' 1" : "'FILL' 0" }}>
                      {i < wizardStep ? 'check' : ws.icon}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: i <= wizardStep ? 'var(--text-accent)' : 'var(--text-muted)' }}>
                    {ws.label}
                  </span>
                  {/* Connector line */}
                  {i < WIZARD_STEPS.length - 1 && (
                    <div className="absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 rounded-full" style={{
                      background: i < wizardStep ? 'var(--primary)' : 'var(--border)'
                    }} />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ═══ STEP 1: BASICS ═══ */}
          {wizardStep === 0 && (
            <div className="space-y-5 stagger">
              {/* Duration — Date Range */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(31,175,143,0.12)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
                  </div>
                  <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Tanggal Perjalanan</label>
                  {startDate && endDate && (
                    <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(31,175,143,0.1)', color: 'var(--text-accent)', border: '1px solid rgba(31,175,143,0.2)' }}>{duration} Hari</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Tanggal Mulai</label>
                    <input type="date" value={startDate} min={todayStr}
                      onChange={e => { setStartDate(e.target.value); if (endDate && e.target.value > endDate) setEndDate('') }}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
                      style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: startDate ? '1.5px solid rgba(31,175,143,0.3)' : '1px solid var(--border)' }} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Tanggal Selesai</label>
                    <input type="date" value={endDate} min={startDate || todayStr}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
                      style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: endDate ? '1.5px solid rgba(31,175,143,0.3)' : '1px solid var(--border)' }} />
                  </div>
                </div>
                {startDate && endDate && (
                  <p className="text-[10px] mt-2 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <span className="material-symbols-outlined text-[12px]" style={{ color: 'var(--text-accent)' }}>info</span>
                    {new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} — {new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} ({duration} hari)
                  </p>
                )}
              </div>

              {/* Start Point */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: '#3B82F6', fontVariationSettings: "'FILL' 1" }}>pin_drop</span>
                  </div>
                  <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Titik Keberangkatan</label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {START_POINTS.map(sp => (
                    <button key={sp.key} onClick={() => setStartPoint(sp.key)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${startPoint === sp.key ? 'btn-grad text-white shadow-md' : 'hover:border-[var(--primary)]/20'}`}
                      style={startPoint !== sp.key ? { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' } : {}}>
                      <span className="material-symbols-outlined text-[14px]">{sp.icon}</span>
                      {sp.key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Participants + Children (inline) */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: '#A78BFA', fontVariationSettings: "'FILL' 1" }}>groups</span>
                  </div>
                  <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Jumlah Peserta</label>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setParticipants(Math.max(1, participants - 1))}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-[var(--border)]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--text-muted)' }}>remove</span>
                    </button>
                    <span className="font-display text-3xl font-bold min-w-[40px] text-center" style={{ color: 'var(--text-accent)' }}>{participants}</span>
                    <button onClick={() => setParticipants(Math.min(10, participants + 1))}
                      className="w-10 h-10 rounded-xl btn-grad flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-white text-[18px]">add</span>
                    </button>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>orang</span>
                  </div>
                  <button onClick={() => setHasChildren(!hasChildren)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
                    style={{
                      background: hasChildren ? 'rgba(31,175,143,0.08)' : 'var(--bg-card)',
                      border: hasChildren ? '1.5px solid rgba(31,175,143,0.3)' : '1px solid var(--border)',
                      color: hasChildren ? 'var(--text-accent)' : 'var(--text-muted)',
                    }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: hasChildren ? "'FILL' 1" : "'FILL' 0" }}>child_care</span>
                    Bawa Anak
                    {hasChildren && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                </div>
                {hasChildren && (
                  <div
                    className="mt-4 flex items-start gap-2 rounded-xl px-3 py-2"
                    style={{
                      background: 'rgba(31,175,143,0.06)',
                      border: '1px solid rgba(31,175,143,0.15)',
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[16px] mt-0.5"
                      style={{ color: 'var(--text-accent)' }}
                    >
                      info
                    </span>
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Rute akan disesuaikan agar ramah anak
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ STEP 2: STYLE ═══ */}
          {wizardStep === 1 && (
            <div className="space-y-5 stagger">
              {/* Travel Style */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(31,175,143,0.12)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>style</span>
                  </div>
                  <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Gaya Traveling</label>
                </div>
                <p className="text-[11px] mb-4 ml-10" style={{ color: 'var(--text-muted)' }}>Pilih satu atau lebih gaya yang kamu inginkan</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {STYLES.map(s => (
                    <button key={s.key} onClick={() => toggleStyle(s.key)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all ${selectedStyles.includes(s.key) ? 'shadow-md' : 'hover:border-[var(--primary)]/20'}`}
                      style={selectedStyles.includes(s.key)
                        ? { background: 'rgba(31,175,143,0.1)', border: '2px solid var(--primary)', color: 'var(--text-accent)' }
                        : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '2px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[24px]" style={{
                        fontVariationSettings: selectedStyles.includes(s.key) ? "'FILL' 1" : "'FILL' 0",
                        color: selectedStyles.includes(s.key) ? 'var(--text-accent)' : 'var(--text-muted)'
                      }}>{s.icon}</span>
                      <span className="text-xs font-semibold">{s.label}</span>
                      <span className="text-[9px] leading-tight" style={{ color: 'var(--text-muted)' }}>{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Preference */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: '#F59E0B', fontVariationSettings: "'FILL' 1" }}>schedule</span>
                  </div>
                  <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Preferensi Waktu</label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(['early', 'normal', 'late'] as const).map(t => (
                    <button key={t} onClick={() => setTimePreference(t)}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-xl transition-all ${timePreference === t ? 'shadow-md' : ''}`}
                      style={timePreference === t
                        ? { background: 'rgba(31,175,143,0.1)', border: '2px solid var(--primary)' }
                        : { background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[22px]" style={{
                        color: timePreference === t ? 'var(--text-accent)' : 'var(--text-muted)',
                        fontVariationSettings: "'FILL' 1"
                      }}>{timeIcons[t]}</span>
                      <span className="text-xs font-semibold" style={{ color: timePreference === t ? 'var(--text-accent)' : 'var(--text-primary)' }}>{timeLabels[t]}</span>
                      <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{timeDescs[t]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crowd + Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: '#A78BFA', fontVariationSettings: "'FILL' 1" }}>groups</span>
                    </div>
                    <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Toleransi Keramaian</label>
                  </div>
                  <div className="space-y-2">
                    {(['sepi', 'normal', 'ramai'] as const).map(c => (
                      <button key={c} onClick={() => setCrowd(c)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all ${crowd === c ? 'shadow-md' : ''}`}
                        style={crowd === c
                          ? { background: 'rgba(31,175,143,0.1)', border: '2px solid var(--primary)', color: 'var(--text-accent)' }
                          : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '2px solid var(--border)' }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: crowd === c ? "'FILL' 1" : "'FILL' 0" }}>{crowdIcons[c]}</span>
                        {crowdLabels[c]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: '#F59E0B', fontVariationSettings: "'FILL' 1" }}>payments</span>
                    </div>
                    <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Budget per Orang</label>
                  </div>
                  <div className="space-y-2">
                    {(['hemat', 'standard', 'premium'] as const).map(b => (
                      <button key={b} onClick={() => setBudget(b)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${budget === b ? 'shadow-md' : ''}`}
                        style={budget === b
                          ? { background: 'rgba(31,175,143,0.1)', border: '2px solid var(--primary)', color: 'var(--text-accent)' }
                          : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '2px solid var(--border)' }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: budget === b ? "'FILL' 1" : "'FILL' 0" }}>{budgetIcons[b]}</span>
                        <span className="capitalize">{b}</span>
                        <span className="ml-auto text-[10px] font-mono">{budgetLabels[b]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ STEP 3: DETAILS ═══ */}
          {wizardStep === 2 && (
            <div className="space-y-5 stagger">
              {/* Transport */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: '#3B82F6', fontVariationSettings: "'FILL' 1" }}>directions_car</span>
                  </div>
                  <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Transportasi</label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TRANSPORT.map(t => (
                    <button key={t.key} onClick={() => setTransport(t.key)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${transport === t.key ? 'shadow-md' : ''}`}
                      style={transport === t.key
                        ? { background: 'rgba(31,175,143,0.1)', border: '2px solid var(--primary)' }
                        : { background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[22px]" style={{
                        color: transport === t.key ? 'var(--text-accent)' : 'var(--text-muted)',
                        fontVariationSettings: "'FILL' 1"
                      }}>{t.icon}</span>
                      <span className="text-xs font-semibold" style={{ color: transport === t.key ? 'var(--text-accent)' : 'var(--text-primary)' }}>{t.key}</span>
                      <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Culinary + Accommodation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: '#F59E0B', fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                    </div>
                    <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Preferensi Kuliner</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CULINARY.map(c => (
                      <button key={c.key} onClick={() => toggleCulinary(c.key)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${culinaryPrefs.includes(c.key) ? 'btn-grad text-white shadow-md' : 'hover:border-[var(--primary)]/20'}`}
                        style={!culinaryPrefs.includes(c.key) ? { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' } : {}}>
                        <span className="material-symbols-outlined text-[13px]">{c.icon}</span>
                        {c.key}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: '#A78BFA', fontVariationSettings: "'FILL' 1" }}>hotel</span>
                    </div>
                    <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Akomodasi</label>
                  </div>
                  <div className="space-y-2">
                    {ACCOMMODATION.map(a => (
                      <button key={a.key} onClick={() => setAccommodation(a.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${accommodation === a.key ? 'shadow-sm' : ''}`}
                        style={accommodation === a.key
                          ? { background: 'rgba(31,175,143,0.1)', border: '2px solid var(--primary)', color: 'var(--text-accent)' }
                          : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '2px solid var(--border)' }}>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: accommodation === a.key ? "'FILL' 1" : "'FILL' 0" }}>{a.icon}</span>
                        <div className="text-left">
                          <span className="block">{a.key}</span>
                          <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{a.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Avoid toggles */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: '#EF4444', fontVariationSettings: "'FILL' 1" }}>block</span>
                  </div>
                  <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Hindari</label>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Keramaian', desc: 'Hindari tempat yang biasanya padat', icon: 'groups', state: avoidCrowd, set: setAvoidCrowd },
                    { label: 'Tanjakan Curam', desc: 'Hindari rute menanjak berat', icon: 'terrain', state: avoidSteep, set: setAvoidSteep },
                    { label: 'Tiket Masuk Berbayar', desc: 'Hanya destinasi gratis', icon: 'money_off', state: avoidPaid, set: setAvoidPaid },
                  ].map(toggle => (
                    <div key={toggle.label} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[var(--bg-card)]">
                      <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--text-muted)' }}>{toggle.icon}</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{toggle.label}</span>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{toggle.desc}</p>
                      </div>
                      <div className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                        style={{ background: toggle.state ? 'rgba(31,175,143,0.3)' : 'var(--border)' }}
                        onClick={() => toggle.set(!toggle.state)}>
                        <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all shadow-md"
                          style={{ left: toggle.state ? '22px' : '2px', background: toggle.state ? 'var(--primary)' : 'var(--text-muted)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Request */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(31,175,143,0.12)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>edit_note</span>
                  </div>
                  <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Permintaan Khusus</label>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', border: '1px solid rgba(59,130,246,0.2)' }}>Opsional</span>
                </div>
                <textarea
                  value={specialRequest}
                  onChange={e => setSpecialRequest(e.target.value)}
                  className="w-full bg-transparent rounded-xl px-4 py-3 text-sm outline-none resize-none min-h-[100px] transition-colors"
                  style={{ color: 'var(--text-primary)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  placeholder="Contoh: Ingin mampir ke kebun apel, ada anggota yang pakai kursi roda, ingin cari spot sunrise terbaik, dll..."
                />
              </div>
            </div>
          )}

          {/* ═══ STEP 4: REVIEW ═══ */}
          {wizardStep === 3 && (
            <div className="space-y-5 stagger">
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(31,175,143,0.12)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>fact_check</span>
                  </div>
                  <label className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Ringkasan Preferensi</label>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Durasi', value: `${duration} Hari`, icon: 'calendar_month', color: '#1FAF8F' },
                    { label: 'Dari', value: startPoint, icon: 'pin_drop', color: '#3B82F6' },
                    { label: 'Peserta', value: `${participants} orang${hasChildren ? ' (ada anak)' : ''}`, icon: 'groups', color: '#A78BFA' },
                    { label: 'Gaya', value: selectedStyles.join(', '), icon: 'style', color: '#1FAF8F' },
                    { label: 'Waktu', value: timeLabels[timePreference], icon: timeIcons[timePreference], color: '#F59E0B' },
                    { label: 'Keramaian', value: crowdLabels[crowd], icon: crowdIcons[crowd], color: '#A78BFA' },
                    { label: 'Budget', value: `${budget.charAt(0).toUpperCase() + budget.slice(1)} (${budgetLabels[budget]})`, icon: budgetIcons[budget], color: '#F59E0B' },
                    { label: 'Transportasi', value: transport, icon: TRANSPORT.find(t => t.key === transport)?.icon || 'directions_car', color: '#3B82F6' },
                    { label: 'Kuliner', value: culinaryPrefs.join(', '), icon: 'restaurant', color: '#F59E0B' },
                    { label: 'Akomodasi', value: accommodation, icon: ACCOMMODATION.find(a => a.key === accommodation)?.icon || 'hotel', color: '#A78BFA' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                      <span className="text-xs font-medium w-24 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                    </div>
                  ))}

                  {/* Avoid */}
                  {(avoidCrowd || avoidSteep || avoidPaid) && (
                    <div className="flex items-start gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: '#EF4444', fontVariationSettings: "'FILL' 1" }}>block</span>
                      <span className="text-xs font-medium w-24 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Hindari</span>
                      <div className="flex flex-wrap gap-1.5">
                        {avoidCrowd && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>Keramaian</span>}
                        {avoidSteep && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>Tanjakan</span>}
                        {avoidPaid && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>Berbayar</span>}
                      </div>
                    </div>
                  )}

                  {specialRequest && (
                    <div className="flex items-start gap-3 py-2">
                      <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>edit_note</span>
                      <span className="text-xs font-medium w-24 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Khusus</span>
                      <span className="text-sm italic" style={{ color: 'var(--text-primary)' }}>&ldquo;{specialRequest}&rdquo;</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══ WIZARD NAVIGATION ═══ */}
          <div className="flex gap-3 mt-6">
            {wizardStep > 0 && (
              <button onClick={() => setWizardStep(wizardStep - 1)}
                className="glass px-5 py-3.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-1.5"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                Kembali
              </button>
            )}
            {wizardStep < 3 ? (
              <button onClick={() => setWizardStep(wizardStep + 1)} disabled={!canProceed()}
                className="flex-1 btn-grad py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ boxShadow: '0 6px 20px rgba(31,175,143,0.3)' }}>
                Lanjut ke {WIZARD_STEPS[wizardStep + 1].label}
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            ) : (
              <button onClick={generate} disabled={selectedStyles.length === 0}
                className="flex-1 btn-grad py-4 rounded-2xl text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ boxShadow: '0 8px 25px rgba(31,175,143,0.3)' }}>
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                Rancang Itinerary Sekarang
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══ LOADING PHASE ═══ */}
      {phase === 'loading' && (
        <div className="max-w-lg mx-auto py-16 text-center space-y-8">
          <div className="w-20 h-20 rounded-2xl btn-grad flex items-center justify-center mx-auto shadow-lg" style={{ boxShadow: '0 8px 25px rgba(31,175,143,0.3)' }}>
            <span className="material-symbols-outlined text-4xl text-white animate-spin">sync</span>
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>AI Sedang Meramu Itinerary...</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Ini mungkin memakan waktu beberapa detik</p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full btn-grad transition-all duration-700" style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }} />
          </div>

          <div className="space-y-2.5 text-left">
            {LOADING_STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all"
                style={{ background: i <= loadingStep ? 'rgba(31,175,143,0.06)' : 'transparent', opacity: i <= loadingStep ? 1 : 0.3 }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                  background: i < loadingStep ? 'rgba(31,175,143,0.15)' : i === loadingStep ? 'rgba(31,175,143,0.1)' : 'var(--bg-card)'
                }}>
                  <span className="material-symbols-outlined text-[14px]"
                    style={{ color: i < loadingStep ? 'var(--success)' : i === loadingStep ? 'var(--text-accent)' : 'var(--text-muted)', fontVariationSettings: "'FILL' 1" }}>
                    {i < loadingStep ? 'check_circle' : i === loadingStep ? 'pending' : s.icon}
                  </span>
                </div>
                <span className="text-xs" style={{ color: i <= loadingStep ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ RESULT PHASE ═══ */}
      {phase === 'result' && itinerary && (
        <div className="max-w-5xl mx-auto">

          {/* ── Result Header ── */}
          <section className="home-section">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5" style={{ color: 'var(--text-accent)' }}>
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  Rencana Teroptimasi AI
                </p>
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{itinerary.title}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { icon: 'calendar_month', text: `${itinerary.duration} Hari` },
                    { icon: 'pin_drop', text: startPoint },
                    { icon: 'groups', text: `${participants} Orang` },
                    { icon: 'style', text: itinerary.style?.join(', ') },
                  ].map(tag => (
                    <span key={tag.text} className="text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[12px]">{tag.icon}</span>
                      {tag.text}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap items-start flex-shrink-0">
                <button onClick={() => { setPhase('input'); setWizardStep(0) }} className="glass px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-1.5 hover:bg-[var(--bg-card)]"
                  style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Ubah Preferensi
                </button>
                <button onClick={generate} className="glass px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 hover:bg-[var(--bg-card)]"
                  style={{ color: 'var(--text-accent)', border: '1px solid rgba(31,175,143,0.3)' }}>
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  Regenerate
                </button>
              </div>
            </div>
          </section>

          {/* ── Trip Overview Stats ── */}
          <section className="home-section">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Durasi', value: `${itinerary.duration} Hari`, icon: 'calendar_month', color: '#1FAF8F' },
                { label: 'Total Destinasi', value: `${itinerary.days?.reduce((sum: number, d: any) => sum + (d.activities?.filter((a: any) => a.type === 'destination').length || 0), 0) || itinerary.days?.length * 2} Tempat`, icon: 'place', color: '#3B82F6' },
                { label: 'Estimasi Budget', value: formatCurrency(itinerary.summary?.total || itinerary.totalBudget?.max || 0), icon: 'payments', color: '#F59E0B' },
                { label: 'Jarak Tempuh', value: `~${itinerary.duration * 45} km`, icon: 'route', color: '#A78BFA' },
              ].map(stat => (
                <div key={stat.label} className="glass rounded-2xl p-4 text-center" style={{ border: '1px solid var(--border)' }}>
                  <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: stat.color, fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                  </div>
                  <p className="font-display text-base sm:text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Action Buttons (Save/Share) ── */}
          <section className="home-section">
            <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ border: '1px solid var(--border)', background: 'rgba(31,175,143,0.02)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(31,175,143,0.12)' }}>
                  <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Itinerary siap digunakan!</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Simpan atau bagikan rencana perjalananmu</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="glass px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5"
                  style={{ color: isSaved ? 'var(--success)' : 'var(--text-accent)', border: isSaved ? '1px solid var(--success)' : '1px solid rgba(31,175,143,0.3)' }}>
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>{isSaved ? 'check_circle' : 'bookmark'}</span>
                  {isSaved ? 'Tersimpan!' : 'Simpan Rencana'}
                </button>
                <button onClick={handleShare} className="btn-grad px-5 py-2.5 rounded-xl text-sm text-white font-semibold flex items-center gap-1.5 shadow-md">
                  <span className="material-symbols-outlined text-[16px]">{isShared ? 'check' : 'share'}</span>
                  {isShared ? 'Link Disalin!' : 'Bagikan'}
                </button>
              </div>
            </div>
          </section>

          {/* ── Main Content Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">

            {/* ── Day Itinerary Cards ── */}
            <div className="lg:col-span-8">
              <div className="section-header mb-5">
                <h3 className="text-base sm:text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>event_note</span>
                  Jadwal Perjalanan
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{itinerary.days?.length || 0} hari, {itinerary.days?.reduce((sum: number, d: any) => sum + (d.activities?.length || 0), 0) || 0} aktivitas</p>
              </div>

              <div className="space-y-5 stagger">
                {itinerary.days?.map((day: any) => (
                  <ItineraryCard key={day.day} dayPlan={day} />
                ))}
                {/* Fallback for old format */}
                {!itinerary.days?.[0]?.activities?.[0]?.type && itinerary.days?.map((day: any) => (
                  <div key={day.day} className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    <div className="px-5 py-3 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)' }}>
                      <h3 className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                        Hari {day.day} — <span style={{ color: 'var(--text-accent)' }}>{day.title || day.theme}</span>
                      </h3>
                      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        Est. {formatCurrency(day.dailyCost || day.dailyBudget?.min || 0)}
                      </span>
                    </div>
                    <div style={{ borderColor: 'var(--border)' }}>
                      {day.activities?.map((act: any, i: number) => (
                        <div key={i} className="flex gap-4 p-4 transition-colors" style={{ borderBottom: i < day.activities.length - 1 ? '1px solid var(--border)' : 'none' }}>
                          <div className="text-right min-w-[48px]">
                            <p className="text-[11px] font-bold font-mono" style={{ color: 'var(--text-accent)' }}>{act.time}</p>
                          </div>
                          <div className="w-px self-stretch mx-1" style={{ background: 'var(--border)' }} />
                          {act.image && <img src={act.image} alt={act.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{act.name}</h4>
                            <p className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                              {act.location || act.address} · {act.duration}
                            </p>
                            {act.tip && (
                              <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: 'var(--text-accent)' }}>
                                {act.tip || act.tips}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Langkah Selanjutnya ── */}
              <div className="mt-8">
                <div className="section-header mb-5">
                  <h3 className="text-base sm:text-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]" style={{ color: '#3B82F6', fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                    Langkah Selanjutnya
                  </h3>
                </div>
                <div className="glass rounded-2xl p-5 sm:p-6 space-y-4" style={{ border: '1px solid var(--border)' }}>
                  {[
                    { step: 1, title: 'Simpan Rencana', desc: 'Simpan itinerary ini agar bisa diakses kapan saja, bahkan saat offline.', icon: 'bookmark', color: '#1FAF8F', action: handleSave, actionLabel: isSaved ? 'Tersimpan ✓' : 'Simpan Sekarang' },
                    { step: 2, title: 'Bagikan ke Teman', desc: 'Kirim link rencana ke teman perjalananmu agar semua satu halaman.', icon: 'group_add', color: '#3B82F6', action: handleShare, actionLabel: isShared ? 'Link Disalin ✓' : 'Salin Link' },
                    { step: 3, title: 'Cek Cuaca & Keramaian', desc: 'Pantau kondisi cuaca dan keramaian real-time sebelum berangkat.', icon: 'cloud', color: '#F59E0B' },
                    { step: 4, title: 'Siapkan Perlengkapan', desc: 'Lihat packing list dan pastikan semua kebutuhan sudah siap.', icon: 'backpack', color: '#A78BFA' },
                  ].map(item => (
                    <div key={item.step} className="flex items-start gap-4 p-3 rounded-xl transition-colors hover:bg-[var(--bg-card)]">
                      <div className="flex-shrink-0 relative">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}15` }}>
                          <span className="material-symbols-outlined text-[18px]" style={{ color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                        </div>
                        <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: item.color }}>{item.step}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                      </div>
                      {item.action && (
                        <button onClick={item.action} className="flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:shadow-sm"
                          style={{ color: item.color, background: `${item.color}10`, border: `1px solid ${item.color}30` }}>
                          {item.actionLabel}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Summary Sidebar ── */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-6 space-y-5">

                {/* Trip Summary */}
                <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>info</span>
                    <h3 className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Ringkasan Trip</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Dari', value: startPoint, icon: 'pin_drop' },
                      { label: 'Peserta', value: `${participants} orang${hasChildren ? ' + anak' : ''}`, icon: 'groups' },
                      { label: 'Transportasi', value: transport, icon: TRANSPORT.find(t => t.key === transport)?.icon || 'directions_car' },
                      { label: 'Akomodasi', value: accommodation, icon: ACCOMMODATION.find(a => a.key === accommodation)?.icon || 'hotel' },
                      { label: 'Keramaian', value: crowdLabels[crowd], icon: crowdIcons[crowd] },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between text-sm py-1">
                        <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                          {item.label}
                        </span>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                    <h3 className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Estimasi Biaya</h3>
                  </div>
                  <div className="space-y-3">
                    {itinerary.summary && [
                      { label: 'Transportasi', val: itinerary.summary.transport, icon: 'directions_car', color: '#3B82F6' },
                      { label: 'Tiket & Aktivitas', val: itinerary.summary.activities, icon: 'confirmation_number', color: '#1FAF8F' },
                      { label: 'Makan & Minum', val: itinerary.summary.food, icon: 'restaurant', color: '#F59E0B' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between text-sm py-1.5">
                        <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                          <span className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `${item.color}12` }}>
                            <span className="material-symbols-outlined text-[12px]" style={{ color: item.color }}>{item.icon}</span>
                          </span>
                          <span className="text-xs">{item.label}</span>
                        </span>
                        <span className="font-mono font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{formatCurrency(item.val)}</span>
                      </div>
                    ))}
                    <div className="pt-3 mt-1 flex justify-between items-baseline" style={{ borderTop: '2px solid var(--border)' }}>
                      <div>
                        <span className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Total</span>
                        <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>untuk {participants} orang</p>
                      </div>
                      <span className="font-bold font-mono text-lg" style={{ color: 'var(--text-accent)' }}>
                        {formatCurrency(itinerary.summary?.total || itinerary.totalBudget?.max || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Tips */}
                <div className="glass rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(31,175,143,0.03)', border: '1px solid rgba(31,175,143,0.15)' }}>
                  <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(31,175,143,0.15)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
                    <h3 className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Tips dari AI</h3>
                  </div>
                  <ul className="space-y-3">
                    {(itinerary.aiTips || itinerary.importantNotes || []).map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(31,175,143,0.12)' }}>
                          <span className="material-symbols-outlined text-[11px]" style={{ color: 'var(--text-accent)' }}>lightbulb</span>
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Packing List */}
                {itinerary.packingList && (
                  <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: '#3B82F6', fontVariationSettings: "'FILL' 1" }}>backpack</span>
                      <h3 className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Packing List</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.packingList.map((item: string, i: number) => (
                        <span key={i} className="text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)' }}>
                          <span className="material-symbols-outlined text-[10px]">check</span>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share CTA */}
                <div className="relative overflow-hidden rounded-2xl p-5 gradient-border">
                  <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(31,175,143,0.08), transparent, rgba(59,130,246,0.08))' }} />
                  <div className="relative text-center">
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Ajak temanmu jalan!</p>
                    <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>Bagikan rencana ini ke grup WhatsApp atau sosmed kamu</p>
                    <button onClick={handleShare} className="w-full btn-grad py-3 rounded-xl text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">share</span>
                      {isShared ? 'Link Disalin!' : 'Bagikan Rencana'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
