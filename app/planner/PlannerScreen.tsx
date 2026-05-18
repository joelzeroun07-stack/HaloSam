'use client'
import { useState } from 'react'

const STYLES = ['Petualang', 'Santai', 'Kuliner', 'Budaya', 'Foto Estetik', 'Keluarga']

export default function PlannerScreen() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input')
  const [duration, setDuration] = useState(2)
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Petualang'])
  const [crowd, setCrowd] = useState<'sepi' | 'normal' | 'ramai'>('sepi')
  const [budget, setBudget] = useState<'hemat' | 'standard' | 'premium'>('standard')
  const [itinerary, setItinerary] = useState<any>(null)

  const toggleStyle = (s: string) => {
    setSelectedStyles(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const generate = async () => {
    setStep('loading')
    const res = await fetch('/api/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        duration,
        style: selectedStyles.map(s => s.toLowerCase()),
        crowdTolerance: crowd,
        budget,
      }),
    })
    const data = await res.json()
    setItinerary(data.itinerary)
    setStep('result')
  }

  const formatRp = (n: number) =>
    'Rp ' + n.toLocaleString('id-ID')

  return (
    <main className="min-h-screen pt-6 pb-24 px-4 md:px-6 lg:px-8">
      {step === 'input' && (
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">AI Planner</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              Rencanakan Petualanganmu
            </h1>
            <p className="text-muted text-sm max-w-lg">
              Ceritakan preferensimu, AI kami akan merancang itinerary terbaik dalam hitungan detik.
            </p>
          </div>

          <div className="space-y-5">
            {/* Duration */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <div className="flex justify-between mb-4">
                <label className="font-semibold text-white">Durasi Perjalanan</label>
                <span className="font-display text-2xl font-bold text-primary">{duration} Hari</span>
              </div>
              <input
                type="range" min="1" max="7" value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-white/10 accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted mt-1.5">
                <span>1 Hari</span><span>7 Hari</span>
              </div>
            </div>

            {/* Style */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <label className="font-semibold text-white block mb-4">Gaya Traveling</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleStyle(s)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${
                      selectedStyles.includes(s)
                        ? 'bg-primary/10 text-primary border-primary/40'
                        : 'border-white/10 text-muted hover:border-white/20'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Crowd + Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="glass rounded-2xl p-5 border border-white/5">
                <label className="font-semibold text-white block mb-4">Toleransi Keramaian</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['sepi', 'normal', 'ramai'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setCrowd(c)}
                      className={`py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${
                        crowd === c
                          ? 'bg-primary/10 text-primary border-primary/40'
                          : 'border-white/10 text-muted hover:border-white/20'
                      }`}
                    >
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-5 border border-white/5">
                <label className="font-semibold text-white block mb-4">Budget</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    ['hemat', '< 500k'],
                    ['standard', '500k–1.5jt'],
                    ['premium', '1.5jt+'],
                  ] as const).map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => setBudget(k)}
                      className={`py-2.5 rounded-xl border text-[11px] font-medium transition-all ${
                        budget === k
                          ? 'bg-primary/10 text-primary border-primary/40'
                          : 'border-white/10 text-muted hover:border-white/20'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={generate}
              disabled={selectedStyles.length === 0}
              className="w-full btn-grad py-4 rounded-2xl text-white font-bold text-base shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Rancang Itinerary Sekarang
            </button>
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="max-w-3xl mx-auto py-20 text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl btn-grad flex items-center justify-center mx-auto shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-4xl text-white animate-spin">sync</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">AI Sedang Meramu Itinerary...</h2>
          <p className="text-muted">Menganalisis keramaian, cuaca, dan preferensimu</p>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`skeleton h-20 rounded-2xl`} style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      )}

      {step === 'result' && itinerary && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Result header */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Rencana Teroptimasi AI</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">{itinerary.title}</h2>
              <p className="text-muted text-sm mt-1">{itinerary.duration} hari · {itinerary.style.join(', ')}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep('input')} className="glass px-4 py-2 rounded-xl text-sm text-muted hover:text-white border border-white/5 transition-all">
                ← Ubah
              </button>
              <button className="btn-grad px-5 py-2 rounded-xl text-sm text-white font-semibold">
                Simpan Rencana
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Days */}
            <div className="lg:col-span-8 space-y-6">
              {itinerary.days.map((day: any) => (
                <div key={day.day} className="glass rounded-2xl overflow-hidden border border-white/5">
                  <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-display font-bold text-white">
                      Hari {day.day} — <span className="text-primary">{day.title}</span>
                    </h3>
                    <span className="text-[11px] text-muted">Est. {formatRp(day.dailyCost)}</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {day.activities.map((act: any, i: number) => (
                      <div key={i} className="flex gap-4 p-4 hover:bg-white/3 transition-colors">
                        <div className="text-right min-w-[48px]">
                          <p className="text-primary text-[11px] font-bold">{act.time}</p>
                        </div>
                        <div className="w-px bg-white/10 self-stretch mx-1" />
                        <img
                          src={act.image}
                          alt={act.name}
                          className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <h4 className="font-semibold text-white text-sm">{act.name}</h4>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                              act.crowdLevel === 'rendah' ? 'crowd-low' : 'crowd-medium'
                            }`}>
                              {act.crowdLevel.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">location_on</span>
                            {act.location} · {act.duration}
                          </p>
                          <p className="text-[11px] text-primary mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px]">lightbulb</span>
                            {act.tip}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="glass rounded-2xl p-5 border border-white/5">
                <h3 className="font-semibold text-white mb-4">Estimasi Biaya</h3>
                <div className="space-y-2.5">
                  {[
                    ['Transportasi', itinerary.summary.transport],
                    ['Tiket & Aktivitas', itinerary.summary.activities],
                    ['Makan & Minum', itinerary.summary.food],
                  ].map(([label, val]) => (
                    <div key={label as string} className="flex justify-between text-sm">
                      <span className="text-muted">{label as string}</span>
                      <span className="text-white">{formatRp(val as number)}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2.5 flex justify-between">
                    <span className="font-bold text-white">Total</span>
                    <span className="font-bold text-primary">{formatRp(itinerary.summary.total)}</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-5 border border-primary/10 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
                  <h3 className="font-semibold text-white text-sm">Tips dari AI</h3>
                </div>
                <ul className="space-y-2.5">
                  {itinerary.aiTips.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                      <span className="text-primary mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full btn-grad py-3 rounded-xl text-white font-semibold text-sm shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[16px] mr-1.5 align-middle">share</span>
                Bagikan Rencana
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
