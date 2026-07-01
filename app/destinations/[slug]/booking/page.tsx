'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { destinations } from '@/lib/data'
import { formatCurrency, generateBookingId, generateVirtualAccount, getLocalStorage, setLocalStorage, LS_KEYS, CATEGORY_MAP } from '@/lib/utils'
import { BookingRecord } from '@/components/PaymentModal'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import { useToast } from '@/hooks/useToast'

const PAYMENT_METHODS = [
  { group: 'Transfer Bank', items: [
    { id: 'bca', name: 'BCA', icon: 'account_balance' },
    { id: 'bni', name: 'BNI', icon: 'account_balance' },
    { id: 'mandiri', name: 'Mandiri', icon: 'account_balance' },
    { id: 'bri', name: 'BRI', icon: 'account_balance' },
  ]},
  { group: 'E-Wallet', items: [
    { id: 'gopay', name: 'GoPay', icon: 'wallet' },
    { id: 'ovo', name: 'OVO', icon: 'wallet' },
    { id: 'dana', name: 'Dana', icon: 'wallet' },
    { id: 'shopeepay', name: 'ShopeePay', icon: 'wallet' },
  ]},
  { group: 'Lainnya', items: [
    { id: 'qris', name: 'QRIS', icon: 'qr_code_2' },
    { id: 'cc', name: 'Kartu Kredit/Debit', icon: 'credit_card' },
  ]},
]

const VISIT_TIMES = ['06:00', '08:00', '10:00', '13:00', '15:00', '17:00']

interface BookingItem {
  id: string
  label: string
  price: number
  qty: number
  icon: string
}

const WIZARD_STEPS = [
  { label: 'Tiket', icon: 'confirmation_number' },
  { label: 'Data', icon: 'person' },
  { label: 'Bayar', icon: 'payments' },
  { label: 'Selesai', icon: 'check_circle' },
]

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const slug = params.slug as string
  const dest = destinations.find(d => d.slug === slug)

  const [step, setStep] = useState(1)
  const [items, setItems] = useState<BookingItem[]>([])
  const [guestName, setGuestName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [visitTime, setVisitTime] = useState('08:00')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [vaNumber] = useState(generateVirtualAccount())
  const [bookingId] = useState(generateBookingId())
  const [countdown, setCountdown] = useState(86400)
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Initialize items
  useEffect(() => {
    if (!dest) return
    if (dest.foodPrice) {
      setItems([
        { id: 'food1', label: 'Paket Makan Utama', price: dest.foodPrice.min, qty: 1, icon: 'restaurant' },
        { id: 'food2', label: 'Paket Makan Premium', price: dest.foodPrice.max, qty: 0, icon: 'dining' },
        { id: 'drink', label: 'Paket Minuman', price: 10000, qty: 0, icon: 'local_cafe' },
      ])
    } else {
      const tp = dest.ticketPrice || { min: 25000, max: 75000 }
      setItems([
        { id: 'adult', label: 'Tiket Dewasa', price: tp.min, qty: 1, icon: 'person' },
        { id: 'child', label: 'Tiket Anak (3-12 thn)', price: Math.round(tp.min * 0.6), qty: 0, icon: 'child_care' },
        { id: 'guide', label: 'Paket Guide + Foto', price: tp.max, qty: 0, icon: 'photo_camera' },
        { id: 'gear', label: 'Sewa Peralatan', price: 50000, qty: 0, icon: 'backpack' },
      ])
    }
  }, [dest])

  // Countdown for payment step
  useEffect(() => {
    if (step !== 3 || !paymentMethod) return
    const timer = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [step, paymentMethod])

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ))
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const serviceFee = Math.round(subtotal * 0.05)
  const total = subtotal + serviceFee

  const canStep1 = items.some(i => i.qty > 0)
  const canStep2 = guestName.length >= 2 && phone.length >= 8 && visitDate && agreeTerms
  const canStep3 = paymentMethod !== ''

  const formatCD = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const handleConfirmPaid = useCallback(() => {
    if (!dest) return
    const record: BookingRecord = {
      bookingId,
      destination: dest.name,
      slug: dest.slug,
      image: dest.image,
      date: visitDate,
      time: visitTime,
      guestName,
      phone,
      items: items.filter(i => i.qty > 0),
      total,
      paymentMethod,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    }
    const bookings = getLocalStorage<BookingRecord[]>(LS_KEYS.BOOKINGS, [])
    bookings.unshift(record)
    setLocalStorage(LS_KEYS.BOOKINGS, bookings)
    setStep(4)
    toast.success('Pemesanan berhasil! 🎉')
  }, [bookingId, dest, visitDate, visitTime, guestName, phone, items, total, paymentMethod, toast])

  if (!dest) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <div className="md:pl-[280px]">
          <main className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl mb-4 block" style={{ color: 'var(--text-muted)' }}>location_off</span>
              <h1 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Destinasi Tidak Ditemukan</h1>
              <Link href="/explore" className="btn-grad px-6 py-3 rounded-xl text-white font-semibold text-sm">← Kembali ke Explore</Link>
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    )
  }

  const price = dest.foodPrice || dest.ticketPrice
  const cat = CATEGORY_MAP[dest.category]

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-[280px]">
        <main className="min-h-screen pt-6 pb-28 px-4 md:px-8 lg:px-10 page-enter max-w-[1100px] mx-auto">

          {/* ═══ HEADER ═══ */}
          <section className="home-section">
            <div className="flex items-center gap-1.5 text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>
              <Link href="/explore" className="hover:underline">Explore</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <Link href={`/destinations/${slug}`} className="hover:underline">{dest.name}</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span style={{ color: 'var(--text-primary)' }}>Pemesanan</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5" style={{ color: 'var(--text-accent)' }}>
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                  Pemesanan Tiket
                </p>
                <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{dest.name}</h1>
              </div>
              <Link href={`/destinations/${slug}`} className="glass px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 flex-shrink-0"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span className="hidden sm:inline">Kembali</span>
              </Link>
            </div>
          </section>

          {/* ═══ PROGRESS STEPPER ═══ */}
          <section className="home-section">
            <div className="flex items-center justify-between gap-1">
              {WIZARD_STEPS.map((ws, i) => (
                <div key={ws.label} className="flex-1 flex flex-col items-center gap-1.5 relative">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                    i + 1 < step ? 'btn-grad shadow-md' : ''
                  }`} style={
                    i + 1 === step ? { background: 'var(--primary)', boxShadow: '0 4px 15px rgba(31,175,143,0.3)' }
                    : i + 1 > step ? { background: 'var(--bg-card)', border: '1px solid var(--border)' } : {}
                  }>
                    <span className="material-symbols-outlined text-[16px]"
                      style={{ color: i + 1 <= step ? 'white' : 'var(--text-muted)', fontVariationSettings: i + 1 <= step ? "'FILL' 1" : "'FILL' 0" }}>
                      {i + 1 < step ? 'check' : ws.icon}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-semibold" style={{ color: i + 1 <= step ? 'var(--text-accent)' : 'var(--text-muted)' }}>
                    {ws.label}
                  </span>
                  {i < WIZARD_STEPS.length - 1 && (
                    <div className="absolute top-4 sm:top-5 left-[calc(50%+22px)] right-[calc(-50%+22px)] h-0.5 rounded-full" style={{
                      background: i + 1 < step ? 'var(--primary)' : 'var(--border)'
                    }} />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ═══ CONTENT GRID ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left: Form */}
            <div className="lg:col-span-7">

              {/* ── STEP 1: Select Tickets ── */}
              {step === 1 && (
                <div className="space-y-5 stagger">
                  <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(31,175,143,0.12)' }}>
                        <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                      </div>
                      <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Pilih Paket & Jumlah</h3>
                    </div>

                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl transition-all" style={{
                          background: item.qty > 0 ? 'rgba(31,175,143,0.04)' : 'var(--bg-card)',
                          border: item.qty > 0 ? '1.5px solid rgba(31,175,143,0.2)' : '1px solid var(--border)'
                        }}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.qty > 0 ? 'rgba(31,175,143,0.12)' : 'var(--border)' }}>
                              <span className="material-symbols-outlined text-[16px]" style={{ color: item.qty > 0 ? 'var(--text-accent)' : 'var(--text-muted)' }}>{item.icon}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                              <p className="text-xs font-mono" style={{ color: 'var(--text-accent)' }}>{formatCurrency(item.price)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(item.id, -1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--border)]"
                              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                              <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-muted)' }}>remove</span>
                            </button>
                            <span className="font-mono font-bold w-6 text-center text-sm" style={{ color: 'var(--text-primary)' }}>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center btn-grad shadow-sm">
                              <span className="material-symbols-outlined text-[16px] text-white">add</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => setStep(2)} disabled={!canStep1}
                    className="w-full btn-grad py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                    style={{ boxShadow: canStep1 ? '0 6px 20px rgba(31,175,143,0.3)' : 'none' }}>
                    Lanjut ke Data Pengunjung
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              )}

              {/* ── STEP 2: Visitor Data ── */}
              {step === 2 && (
                <div className="space-y-5 stagger">
                  <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)' }}>
                        <span className="material-symbols-outlined text-[16px]" style={{ color: '#3B82F6', fontVariationSettings: "'FILL' 1" }}>person</span>
                      </div>
                      <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Data Pengunjung</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Nama Lengkap *</label>
                        <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors" placeholder="Masukkan nama sesuai KTP"
                          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: guestName.length >= 2 ? '1.5px solid rgba(31,175,143,0.3)' : '1px solid var(--border)' }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors" placeholder="email@contoh.com (opsional)"
                          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Nomor HP / WhatsApp *</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors" placeholder="08xxxxxxxxxx"
                          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: phone.length >= 8 ? '1.5px solid rgba(31,175,143,0.3)' : '1px solid var(--border)' }} />
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
                        <span className="material-symbols-outlined text-[16px]" style={{ color: '#F59E0B', fontVariationSettings: "'FILL' 1" }}>event</span>
                      </div>
                      <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Jadwal Kunjungan</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Tanggal Kunjungan *</label>
                        <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none" min={new Date().toISOString().split('T')[0]}
                          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: visitDate ? '1.5px solid rgba(31,175,143,0.3)' : '1px solid var(--border)' }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Jam Kunjungan</label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {VISIT_TIMES.map(t => (
                            <button key={t} onClick={() => setVisitTime(t)}
                              className={`py-2.5 rounded-xl text-sm font-mono font-medium transition-all ${visitTime === t ? 'btn-grad text-white shadow-md' : ''}`}
                              style={visitTime !== t ? { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' } : {}}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Catatan Khusus</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none min-h-[70px]"
                          placeholder="Contoh: Ada lansia, butuh kursi roda, dll (opsional)"
                          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl glass" style={{ border: '1px solid var(--border)' }}>
                    <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="accent-[var(--primary)] mt-0.5 w-4 h-4" />
                    <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      Saya menyetujui <span style={{ color: 'var(--text-accent)' }}>syarat dan ketentuan</span> serta <span style={{ color: 'var(--text-accent)' }}>kebijakan privasi</span> HaloSam.
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="glass px-5 py-3.5 rounded-xl text-sm font-medium flex items-center gap-1.5"
                      style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[16px]">chevron_left</span> Kembali
                    </button>
                    <button onClick={() => { setCountdown(86400); setStep(3) }} disabled={!canStep2}
                      className="flex-1 btn-grad py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
                      Lanjut ke Pembayaran
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Payment ── */}
              {step === 3 && (
                <div className="space-y-5 stagger">
                  <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)' }}>
                        <span className="material-symbols-outlined text-[16px]" style={{ color: '#A78BFA', fontVariationSettings: "'FILL' 1" }}>payments</span>
                      </div>
                      <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Metode Pembayaran</h3>
                    </div>

                    <div className="space-y-5">
                      {PAYMENT_METHODS.map(group => (
                        <div key={group.group}>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>{group.group}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {group.items.map(pm => (
                              <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                                style={{
                                  background: paymentMethod === pm.id ? 'rgba(31,175,143,0.08)' : 'var(--bg-card)',
                                  border: paymentMethod === pm.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                                  color: paymentMethod === pm.id ? 'var(--text-accent)' : 'var(--text-primary)',
                                }}>
                                <span className="material-symbols-outlined text-[18px]" style={{ color: paymentMethod === pm.id ? 'var(--text-accent)' : 'var(--text-muted)' }}>{pm.icon}</span>
                                {pm.name}
                                {paymentMethod === pm.id && <span className="ml-auto material-symbols-outlined text-[14px]" style={{ color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* VA + Timer (shown when method selected) */}
                  {paymentMethod && (
                    <div className="glass rounded-2xl p-5 sm:p-6 space-y-4" style={{ border: '1px solid var(--border)' }}>
                      <div className="text-center p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <p className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Nomor Virtual Account</p>
                        <p className="font-mono text-xl font-bold tracking-widest" style={{ color: 'var(--text-primary)' }}>
                          {vaNumber.replace(/(.{4})/g, '$1 ').trim()}
                        </p>
                        <button onClick={() => { navigator.clipboard?.writeText(vaNumber); toast.success('Nomor VA disalin!') }}
                          className="mt-2 text-xs font-medium flex items-center gap-1 mx-auto" style={{ color: 'var(--text-accent)' }}>
                          <span className="material-symbols-outlined text-[14px]">content_copy</span> Salin
                        </button>
                      </div>
                      <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <p className="text-[10px] mb-0.5" style={{ color: '#F59E0B' }}>Batas Pembayaran</p>
                        <p className="font-mono text-lg font-bold" style={{ color: '#F59E0B' }}>{formatCD(countdown)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="glass px-5 py-3.5 rounded-xl text-sm font-medium flex items-center gap-1.5"
                      style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[16px]">chevron_left</span> Kembali
                    </button>
                    <button onClick={handleConfirmPaid} disabled={!canStep3}
                      className="flex-1 btn-grad py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      Konfirmasi Bayar {formatCurrency(total)}
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Success ── */}
              {step === 4 && (
                <div className="space-y-5 stagger">
                  <div className="glass rounded-2xl p-6 sm:p-8 text-center" style={{ border: '1px solid var(--border)' }}>
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                      <svg className="w-10 h-10" viewBox="0 0 52 52">
                        <path className="checkmark-path" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M14 27l7 7 16-16" />
                      </svg>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Pemesanan Berhasil!</h2>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>E-Ticket kamu sudah siap digunakan</p>

                    <div className="p-5 rounded-xl text-left space-y-3 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      {[
                        { icon: 'tag', label: 'Booking ID', value: bookingId, accent: true },
                        { icon: 'place', label: 'Destinasi', value: dest.name },
                        { icon: 'event', label: 'Tanggal', value: `${visitDate} · ${visitTime}` },
                        { icon: 'person', label: 'Nama', value: guestName },
                        { icon: 'phone', label: 'Telepon', value: phone },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between py-1">
                          <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <span className="material-symbols-outlined text-[14px]">{row.icon}</span>
                            {row.label}
                          </span>
                          <span className={`text-xs font-medium ${row.accent ? 'font-mono' : ''}`} style={{ color: row.accent ? 'var(--text-accent)' : 'var(--text-primary)' }}>{row.value}</span>
                        </div>
                      ))}
                      <div className="pt-3 flex justify-between items-baseline" style={{ borderTop: '2px solid var(--border)' }}>
                        <span className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Total Bayar</span>
                        <span className="font-bold font-mono text-lg" style={{ color: 'var(--text-accent)' }}>{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <button onClick={() => window.print()} className="py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
                        style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        E-Ticket
                      </button>
                      <button onClick={() => {
                        const text = `Booking Berhasil!\n\nDestinasi: ${dest.name}\nTanggal: ${visitDate} pukul ${visitTime}\nID: ${bookingId}\nTotal: ${formatCurrency(total)}\n\nDipesan via HaloSam`
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                      }} className="py-3 rounded-xl text-sm font-semibold btn-grad text-white flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">share</span>
                        WhatsApp
                      </button>
                    </div>
                    <Link href={`/destinations/${slug}`} className="text-xs font-medium block" style={{ color: 'var(--text-muted)' }}>
                      ← Kembali ke halaman destinasi
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right Sidebar: Order Summary ── */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-6 space-y-5">

                {/* Destination Preview */}
                <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <div className="relative h-36">
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-display font-bold text-sm">{dest.name}</p>
                      <p className="text-white/70 text-[10px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>{dest.location}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-yellow-400 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{dest.rating}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>({dest.reviewCount})</span>
                    </div>
                    {cat && <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${cat.class}`}>{cat.icon} {cat.label}</span>}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                    <h3 className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Ringkasan Pesanan</h3>
                  </div>

                  <div className="space-y-2.5 mb-4">
                    {items.filter(i => i.qty > 0).length === 0 ? (
                      <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>Belum ada item dipilih</p>
                    ) : (
                      items.filter(i => i.qty > 0).map(i => (
                        <div key={i.id} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                            <span className="material-symbols-outlined text-[13px]">{i.icon}</span>
                            <span className="text-xs">{i.label} <span className="font-mono">×{i.qty}</span></span>
                          </span>
                          <span className="font-mono text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(i.price * i.qty)}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {subtotal > 0 && (
                    <>
                      <div className="flex justify-between text-xs py-1.5" style={{ color: 'var(--text-muted)' }}>
                        <span>Subtotal</span>
                        <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs py-1.5" style={{ color: 'var(--text-muted)' }}>
                        <span>Biaya layanan (5%)</span>
                        <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatCurrency(serviceFee)}</span>
                      </div>
                      <div className="pt-3 mt-2 flex justify-between items-baseline" style={{ borderTop: '2px solid var(--border)' }}>
                        <div>
                          <span className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Total</span>
                        </div>
                        <span className="font-bold font-mono text-lg" style={{ color: 'var(--text-accent)' }}>{formatCurrency(total)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Visit Info (if filled) */}
                {(visitDate || guestName) && (
                  <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: '#3B82F6', fontVariationSettings: "'FILL' 1" }}>event_available</span>
                      <h3 className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Detail Kunjungan</h3>
                    </div>
                    <div className="space-y-2">
                      {guestName && (
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: 'var(--text-muted)' }}>Nama</span>
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{guestName}</span>
                        </div>
                      )}
                      {visitDate && (
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: 'var(--text-muted)' }}>Tanggal</span>
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{visitDate}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: 'var(--text-muted)' }}>Jam</span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{visitTime}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 py-2">
                  {[
                    { icon: 'verified_user', label: 'Aman' },
                    { icon: 'lock', label: 'Terenkripsi' },
                    { icon: 'support_agent', label: 'CS 24/7' },
                  ].map(badge => (
                    <span key={badge.label} className="flex items-center gap-1 text-[9px]" style={{ color: 'var(--text-muted)' }}>
                      <span className="material-symbols-outlined text-[12px]" style={{ color: 'var(--text-accent)' }}>{badge.icon}</span>
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
