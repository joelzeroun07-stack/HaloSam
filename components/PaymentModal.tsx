'use client'
import { useState, useEffect, useCallback } from 'react'
import { formatCurrency, generateBookingId, generateVirtualAccount, getLocalStorage, setLocalStorage, LS_KEYS } from '@/lib/utils'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  destination: {
    name: string
    slug: string
    image: string
    ticketPrice?: { min: number; max: number }
    foodPrice?: { min: number; max: number }
  }
  onSuccess?: () => void
}

interface BookingItem {
  id: string
  label: string
  price: number
  qty: number
}

export interface BookingRecord {
  bookingId: string
  destination: string
  slug: string
  image: string
  date: string
  time: string
  guestName: string
  phone: string
  items: BookingItem[]
  total: number
  paymentMethod: string
  status: 'upcoming' | 'completed' | 'cancelled'
  createdAt: string
}

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
    { id: 'linkaja', name: 'LinkAja', icon: 'wallet' },
  ]},
  { group: 'Lainnya', items: [
    { id: 'qris', name: 'QRIS', icon: 'qr_code_2' },
    { id: 'cc', name: 'Kartu Kredit/Debit', icon: 'credit_card' },
    { id: 'kredivo', name: 'Kredivo', icon: 'credit_score' },
    { id: 'akulaku', name: 'Akulaku', icon: 'credit_score' },
  ]},
]

export default function PaymentModal({ isOpen, onClose, destination, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState(1)
  const [items, setItems] = useState<BookingItem[]>([])
  const [guestName, setGuestName] = useState('')
  const [phone, setPhone] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [visitTime, setVisitTime] = useState('08:00')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [vaNumber] = useState(generateVirtualAccount())
  const [bookingId] = useState(generateBookingId())
  const [countdown, setCountdown] = useState(86400)

  // Initialize items based on destination type
  useEffect(() => {
    if (!isOpen) return
    if (destination.foodPrice) {
      setItems([
        { id: 'food1', label: 'Paket Makan Utama', price: destination.foodPrice.min, qty: 1 },
        { id: 'food2', label: 'Paket Makan Premium', price: destination.foodPrice.max, qty: 0 },
        { id: 'drink', label: 'Minuman', price: 10000, qty: 1 },
      ])
    } else {
      const tp = destination.ticketPrice || { min: 25000, max: 75000 }
      setItems([
        { id: 'adult', label: 'Tiket Masuk Dewasa', price: tp.min, qty: 1 },
        { id: 'child', label: 'Tiket Masuk Anak', price: Math.round(tp.min * 0.6), qty: 0 },
        { id: 'guide', label: 'Paket Foto + Guide', price: tp.max, qty: 0 },
        { id: 'gear', label: 'Sewa Peralatan', price: 50000, qty: 0 },
      ])
    }
    setStep(1)
    setGuestName('')
    setPhone('')
    setVisitDate('')
    setVisitTime('08:00')
    setPaymentMethod('')
  }, [isOpen, destination])

  // Countdown timer for step 4
  useEffect(() => {
    if (step !== 4) return
    const timer = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [step])

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ))
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const serviceFee = Math.round(subtotal * 0.05)
  const total = subtotal + serviceFee

  const canProceedStep1 = items.some(i => i.qty > 0)
  const canProceedStep2 = guestName.length >= 2 && phone.length >= 8 && visitDate
  const canProceedStep3 = paymentMethod !== ''

  const formatCountdown = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
  }

  const handleConfirmPaid = useCallback(() => {
    const record: BookingRecord = {
      bookingId,
      destination: destination.name,
      slug: destination.slug,
      image: destination.image,
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
    setStep(5)
    onSuccess?.()
  }, [bookingId, destination, visitDate, visitTime, guestName, phone, items, total, paymentMethod, onSuccess])

  const handleShareWhatsApp = () => {
    const text = `Booking Berhasil!\n\nDestinasi: ${destination.name}\nTanggal: ${visitDate} pukul ${visitTime}\nID: ${bookingId}\nTotal: ${formatCurrency(total)}\n\nDipesan via HaloSam`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center modal-overlay" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl modal-content no-scroll"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            {step > 1 && step < 5 && (
              <button onClick={() => setStep(s => s - 1)} className="touch-target" aria-label="Kembali">
                <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--text-muted)' }}>arrow_back</span>
              </button>
            )}
            <div>
              <h3 className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                {step === 1 && 'Pilih Paket'}
                {step === 2 && 'Data Pengunjung'}
                {step === 3 && 'Metode Pembayaran'}
                {step === 4 && 'Instruksi Bayar'}
                {step === 5 && 'Pemesanan Berhasil!'}
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Langkah {step} dari 5</p>
            </div>
          </div>
          <button onClick={onClose} className="touch-target" aria-label="Tutup">
            <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)' }}>close</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1" style={{ background: 'var(--border)' }}>
          <div className="h-full btn-grad transition-all duration-500" style={{ width: `${step * 20}%` }} />
        </div>

        <div className="p-5">
          {/* ═══ STEP 1: Package Selection ═══ */}
          {step === 1 && (
            <div className="slide-in-right space-y-4">
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
                <img src={destination.image} alt={destination.name} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{destination.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{destination.foodPrice ? 'Kuliner' : 'Wisata'}</p>
                </div>
              </div>

              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                    <p className="text-xs font-mono" style={{ color: 'var(--text-accent)' }}>{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQty(item.id, -1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: 'var(--border)' }}
                      aria-label={`Kurangi ${item.label}`}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-muted)' }}>remove</span>
                    </button>
                    <span className="font-mono font-bold w-6 text-center" style={{ color: 'var(--text-primary)' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center btn-grad"
                      aria-label={`Tambah ${item.label}`}>
                      <span className="material-symbols-outlined text-[16px] text-white">add</span>
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-3 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span className="font-display font-bold text-lg" style={{ color: 'var(--text-accent)' }}>{formatCurrency(subtotal)}</span>
              </div>

              <button onClick={() => setStep(2)} disabled={!canProceedStep1}
                className="w-full btn-grad py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Lanjutkan →
              </button>
            </div>
          )}

          {/* ═══ STEP 2: Visitor Data ═══ */}
          {step === 2 && (
            <div className="slide-in-right space-y-4">
              <div>
                <label htmlFor="pay-name" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nama Lengkap</label>
                <input id="pay-name" type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" placeholder="Masukkan nama lengkap"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
              </div>
              <div>
                <label htmlFor="pay-phone" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nomor HP</label>
                <input id="pay-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" placeholder="08xxxxxxxxxx"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
              </div>
              <div>
                <label htmlFor="pay-date" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Tanggal Kunjungan</label>
                <input id="pay-date" type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" min={new Date().toISOString().split('T')[0]}
                  style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
              </div>
              <div>
                <label htmlFor="pay-time" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Jam Kunjungan</label>
                <div className="grid grid-cols-4 gap-2">
                  {['08:00', '10:00', '13:00', '15:00'].map(t => (
                    <button key={t} onClick={() => setVisitTime(t)}
                      className={`py-2.5 rounded-xl text-sm font-mono font-medium transition-all ${visitTime === t ? 'btn-grad text-white' : ''}`}
                      style={visitTime !== t ? { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' } : {}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(3)} disabled={!canProceedStep2}
                className="w-full btn-grad py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Lanjutkan →
              </button>
            </div>
          )}

          {/* ═══ STEP 3: Payment Method ═══ */}
          {step === 3 && (
            <div className="slide-in-right space-y-5">
              {PAYMENT_METHODS.map(group => (
                <div key={group.group}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>{group.group}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map(pm => (
                      <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                        className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: paymentMethod === pm.id ? 'rgba(31,175,143,0.1)' : 'var(--bg-card)',
                          border: paymentMethod === pm.id ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                          color: paymentMethod === pm.id ? 'var(--text-accent)' : 'var(--text-primary)',
                        }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--text-accent)' }}>{pm.icon}</span>
                        {pm.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button onClick={() => { setCountdown(86400); setStep(4) }} disabled={!canProceedStep3}
                className="w-full btn-grad py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Bayar {formatCurrency(total)} →
              </button>
            </div>
          )}

          {/* ═══ STEP 4: Payment Instructions ═══ */}
          {step === 4 && (
            <div className="slide-in-right space-y-4">
              <div className="text-center p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Nomor Virtual Account</p>
                <p className="font-mono text-xl font-bold tracking-widest" style={{ color: 'var(--text-primary)' }}>
                  {vaNumber.replace(/(.{4})/g, '$1 ').trim()}
                </p>
                <button onClick={() => { navigator.clipboard?.writeText(vaNumber) }} className="mt-2 text-xs font-medium" style={{ color: 'var(--text-accent)' }}>
                  <span className="material-symbols-outlined text-[14px] align-middle mr-1">content_copy</span> Salin Nomor
                </button>
              </div>

              <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--warning)' }}>Batas Waktu Pembayaran</p>
                <p className="font-mono text-2xl font-bold" style={{ color: 'var(--warning)' }}>{formatCountdown(countdown)}</p>
              </div>

              <div className="space-y-2 p-4 rounded-xl" style={{ background: 'var(--bg-card)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Rincian Tagihan</p>
                {items.filter(i => i.qty > 0).map(i => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>{i.label} x{i.qty}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(i.price * i.qty)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Biaya layanan (5%)</span>
                  <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(serviceFee)}</span>
                </div>
                <div className="pt-2 mt-2 flex justify-between font-bold" style={{ borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Total</span>
                  <span style={{ color: 'var(--text-accent)' }}>{formatCurrency(total)}</span>
                </div>
              </div>

              <button onClick={handleConfirmPaid} className="w-full btn-grad py-3.5 rounded-xl text-white font-semibold text-sm">
                Saya Sudah Bayar
              </button>
            </div>
          )}

          {/* ═══ STEP 5: Success ═══ */}
          {step === 5 && (
            <div className="slide-in-right text-center space-y-5">
              {/* Animated checkmark */}
              <div className="flex justify-center">
                <div className="checkmark-circle w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                  <svg className="w-10 h-10" viewBox="0 0 52 52">
                    <path className="checkmark-path" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M14 27l7 7 16-16" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Pemesanan Berhasil!</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>E-Ticket kamu sudah siap</p>
              </div>

              <div className="p-4 rounded-xl text-left space-y-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Booking ID</span>
                  <span className="font-mono font-bold" style={{ color: 'var(--text-accent)' }}>{bookingId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Destinasi</span>
                  <span style={{ color: 'var(--text-primary)' }}>{destination.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Tanggal</span>
                  <span style={{ color: 'var(--text-primary)' }}>{visitDate} · {visitTime}</span>
                </div>
                <div className="flex justify-between text-sm pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Total</span>
                  <span className="font-bold" style={{ color: 'var(--text-accent)' }}>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => window.print()} className="py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                  <span className="material-symbols-outlined text-[14px] align-middle mr-1">print</span> Download E-Ticket
                </button>
                <button onClick={handleShareWhatsApp} className="py-3 rounded-xl text-sm font-semibold btn-grad text-white">
                  <span className="material-symbols-outlined text-[14px] align-middle mr-1">share</span> Bagikan WhatsApp
                </button>
              </div>

              <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Kembali ke Destinasi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
