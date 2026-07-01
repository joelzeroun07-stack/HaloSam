'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import { useToast } from '@/hooks/useToast'
import { getLocalStorage, setLocalStorage, formatCurrency, formatDate, formatShortDate, LS_KEYS } from '@/lib/utils'
import { BookingRecord } from '@/components/PaymentModal'

const STATUS_CONFIG = {
  upcoming: { label: 'Aktif', icon: 'event_available', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  completed: { label: 'Selesai', icon: 'check_circle', color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  cancelled: { label: 'Dibatalkan', icon: 'cancel', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
}

export default function BookingDetailPage() {
  const params = useParams()
  const toast = useToast()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<BookingRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bookings = getLocalStorage<BookingRecord[]>(LS_KEYS.BOOKINGS, [])
    const found = bookings.find(b => b.bookingId === bookingId)
    setBooking(found || null)
    setLoading(false)
  }, [bookingId])

  const handleCancelBooking = () => {
    if (!booking) return
    const bookings = getLocalStorage<BookingRecord[]>(LS_KEYS.BOOKINGS, [])
    const updated = bookings.map(b => b.bookingId === bookingId ? { ...b, status: 'cancelled' as const } : b)
    setLocalStorage(LS_KEYS.BOOKINGS, updated)
    setBooking(prev => prev ? { ...prev, status: 'cancelled' } : null)
    toast.success('Pemesanan berhasil dibatalkan')
  }

  const handleCompleteBooking = () => {
    if (!booking) return
    const bookings = getLocalStorage<BookingRecord[]>(LS_KEYS.BOOKINGS, [])
    const updated = bookings.map(b => b.bookingId === bookingId ? { ...b, status: 'completed' as const } : b)
    setLocalStorage(LS_KEYS.BOOKINGS, updated)
    setBooking(prev => prev ? { ...prev, status: 'completed' } : null)
    toast.success('Kunjungan ditandai selesai! 🎉')
  }

  const handleShare = () => {
    if (!booking) return
    const text = `E-Ticket HaloSam\n\nDestinasi: ${booking.destination}\nTanggal: ${booking.date} · ${booking.time}\nBooking ID: ${booking.bookingId}\nTotal: ${formatCurrency(booking.total)}\n\n— HaloSam Hidden Gem Travel`
    if (navigator.share) {
      navigator.share({ title: `Booking ${booking.destination}`, text })
    } else {
      navigator.clipboard?.writeText(text)
      toast.success('Detail booking disalin!')
    }
  }

  const handleWhatsApp = () => {
    if (!booking) return
    const text = `E-Ticket HaloSam ✈️\n\nDestinasi: ${booking.destination}\nTanggal: ${booking.date} · ${booking.time}\nBooking ID: ${booking.bookingId}\nNama: ${booking.guestName}\nTotal: ${formatCurrency(booking.total)}\n\nDipesan via HaloSam`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <div className="md:pl-[280px]">
          <main className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-center">
              <span className="material-symbols-outlined text-4xl block mb-2" style={{ color: 'var(--text-muted)' }}>hourglass_top</span>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Memuat detail pesanan...</p>
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <div className="md:pl-[280px]">
          <main className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <span className="material-symbols-outlined text-4xl" style={{ color: '#EF4444' }}>receipt_long</span>
              </div>
              <h1 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Pesanan Tidak Ditemukan</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Booking ID &ldquo;{bookingId}&rdquo; tidak ditemukan.</p>
              <Link href="/profile" className="btn-grad px-6 py-3 rounded-xl text-white font-semibold text-sm inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Kembali ke Profil
              </Link>
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    )
  }

  const status = STATUS_CONFIG[booking.status]
  const serviceFee = Math.round(booking.total / 1.05 * 0.05)
  const subtotal = booking.total - serviceFee

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-[280px]">
        <main className="min-h-screen pt-6 pb-28 px-4 md:px-8 lg:px-10 page-enter max-w-[1100px] mx-auto">

          {/* ═══ HEADER ═══ */}
          <section className="home-section">
            <div className="flex items-center gap-1.5 text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>
              <Link href="/profile" className="hover:underline">Profil</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="hover:underline cursor-pointer" onClick={() => history.back()}>Pemesanan</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span style={{ color: 'var(--text-primary)' }}>{booking.bookingId}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Detail Pemesanan</h1>
                <p className="text-sm flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-mono font-medium" style={{ color: 'var(--text-accent)' }}>{booking.bookingId}</span>
                  <span>·</span>
                  <span>Dipesan {formatShortDate(booking.createdAt)}</span>
                </p>
              </div>
              <Link href="/profile" className="glass px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 flex-shrink-0"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span className="hidden sm:inline">Kembali</span>
              </Link>
            </div>
          </section>

          {/* ═══ STATUS BANNER ═══ */}
          <section className="home-section">
            <div className="glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ border: `1px solid ${status.border}`, background: status.bg }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: status.bg }}>
                  <span className="material-symbols-outlined text-[24px]" style={{ color: status.color, fontVariationSettings: "'FILL' 1" }}>{status.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: status.color }}>
                    Status: {status.label}
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {booking.status === 'upcoming' && 'Tiket kamu aktif dan siap digunakan pada tanggal yang dipilih.'}
                    {booking.status === 'completed' && 'Kunjungan telah selesai. Terima kasih sudah menggunakan HaloSam!'}
                    {booking.status === 'cancelled' && 'Pemesanan ini sudah dibatalkan.'}
                  </p>
                </div>
              </div>
              {booking.status === 'upcoming' && (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={handleCompleteBooking} className="btn-grad px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center gap-1.5 shadow-md">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Tandai Selesai
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ═══ MAIN CONTENT GRID ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── Left: Booking Details ── */}
            <div className="lg:col-span-7 space-y-5">

              {/* Destination Card */}
              <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative h-44 sm:h-52">
                  <img src={booking.image} alt={booking.destination} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">{booking.destination}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/80 text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">event</span>
                        {formatDate(booking.date)}
                      </span>
                      <span className="text-white/60">·</span>
                      <span className="text-white/80 text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {booking.time} WIB
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
                  <Link href={`/destinations/${booking.slug}`} className="text-xs font-semibold flex items-center gap-1 transition-colors hover:underline" style={{ color: 'var(--text-accent)' }}>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    Lihat Halaman Destinasi
                  </Link>
                  <a href={`https://www.google.com/maps/search/${encodeURIComponent(booking.destination)}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <span className="material-symbols-outlined text-[14px]">map</span>
                    Buka Maps
                  </a>
                </div>
              </div>

              {/* Booking Info */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-5 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>person</span>
                  <h3 className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Informasi Pengunjung</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: 'badge', label: 'Nama Lengkap', value: booking.guestName, color: '#1FAF8F' },
                    { icon: 'phone', label: 'Nomor HP', value: booking.phone, color: '#3B82F6' },
                    { icon: 'event', label: 'Tanggal Kunjungan', value: formatDate(booking.date), color: '#F59E0B' },
                    { icon: 'schedule', label: 'Jam Kunjungan', value: `${booking.time} WIB`, color: '#A78BFA' },
                  ].map(info => (
                    <div key={info.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${info.color}15` }}>
                        <span className="material-symbols-outlined text-[16px]" style={{ color: info.color, fontVariationSettings: "'FILL' 1" }}>{info.icon}</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{info.label}</p>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Ordered */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-5 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                  <h3 className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Item yang Dipesan</h3>
                </div>
                <div className="space-y-3">
                  {booking.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(31,175,143,0.1)' }}>
                          <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)' }}>confirmation_number</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatCurrency(item.price)} × {item.qty}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  ))}

                  {/* Totals */}
                  <div className="pt-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                      <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Biaya layanan (5%)</span>
                      <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatCurrency(serviceFee)}</span>
                    </div>
                    <div className="pt-3 flex justify-between items-baseline" style={{ borderTop: '2px solid var(--border)' }}>
                      <span className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>Total Bayar</span>
                      <span className="font-bold font-mono text-xl" style={{ color: 'var(--text-accent)' }}>{formatCurrency(booking.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Sidebar ── */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-6 space-y-5">

                {/* E-Ticket Card */}
                <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <div className="p-5 sm:p-6 text-center" style={{ background: booking.status === 'upcoming' ? 'rgba(31,175,143,0.04)' : 'transparent' }}>
                    <div className="flex items-center justify-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>qr_code_2</span>
                      <h3 className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>E-Ticket</h3>
                    </div>

                    {/* QR Code placeholder */}
                    <div className="w-40 h-40 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-card)', border: '2px dashed var(--border)' }}>
                      <div className="text-center">
                        <span className="material-symbols-outlined text-5xl block mb-1" style={{ color: booking.status === 'cancelled' ? 'var(--text-muted)' : 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>
                          {booking.status === 'cancelled' ? 'block' : 'qr_code_2'}
                        </span>
                        {booking.status === 'cancelled' && (
                          <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Tiket tidak valid</p>
                        )}
                      </div>
                    </div>

                    <p className="font-mono text-lg font-bold tracking-widest mb-1" style={{ color: booking.status === 'cancelled' ? 'var(--text-muted)' : 'var(--text-accent)', textDecoration: booking.status === 'cancelled' ? 'line-through' : 'none' }}>
                      {booking.bookingId}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      Tunjukkan kode ini saat check-in
                    </p>
                  </div>

                  {/* Ticket divider */}
                  <div className="relative h-6 flex items-center" style={{ background: 'var(--bg-card)' }}>
                    <div className="absolute -left-3 w-6 h-6 rounded-full" style={{ background: 'var(--bg)' }} />
                    <div className="absolute -right-3 w-6 h-6 rounded-full" style={{ background: 'var(--bg)' }} />
                    <div className="flex-1 border-dashed" style={{ borderBottom: '2px dashed var(--border)' }} />
                  </div>

                  <div className="p-4 space-y-2" style={{ background: 'var(--bg-card)' }}>
                    {[
                      { label: 'Destinasi', value: booking.destination },
                      { label: 'Tanggal', value: `${booking.date} · ${booking.time}` },
                      { label: 'Nama', value: booking.guestName },
                      { label: 'Metode Bayar', value: booking.paymentMethod.toUpperCase() },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between text-xs">
                        <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                        <span className="font-medium text-right" style={{ color: 'var(--text-primary)' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="glass rounded-2xl p-5 sm:p-6 space-y-3" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-2 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>widgets</span>
                    <h3 className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Aksi</h3>
                  </div>

                  <button onClick={() => window.print()} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-sm"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(31,175,143,0.12)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)' }}>download</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Download E-Ticket</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Simpan sebagai PDF</p>
                    </div>
                    <span className="material-symbols-outlined text-[16px] ml-auto" style={{ color: 'var(--text-muted)' }}>chevron_right</span>
                  </button>

                  <button onClick={handleWhatsApp} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-sm"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(37,211,102,0.12)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: '#25D366' }}>chat</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Kirim via WhatsApp</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Bagikan ke teman perjalanan</p>
                    </div>
                    <span className="material-symbols-outlined text-[16px] ml-auto" style={{ color: 'var(--text-muted)' }}>chevron_right</span>
                  </button>

                  <button onClick={handleShare} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-sm"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)' }}>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: '#3B82F6' }}>share</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Salin Detail Booking</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Copy ke clipboard</p>
                    </div>
                    <span className="material-symbols-outlined text-[16px] ml-auto" style={{ color: 'var(--text-muted)' }}>chevron_right</span>
                  </button>

                  {booking.status === 'upcoming' && (
                    <button onClick={handleCancelBooking} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-sm"
                      style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)' }}>
                        <span className="material-symbols-outlined text-[16px]" style={{ color: '#EF4444' }}>cancel</span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium" style={{ color: '#EF4444' }}>Batalkan Pesanan</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Pembatalan tidak dapat diurungkan</p>
                      </div>
                      <span className="material-symbols-outlined text-[16px] ml-auto" style={{ color: 'var(--text-muted)' }}>chevron_right</span>
                    </button>
                  )}
                </div>

                {/* Help */}
                <div className="relative overflow-hidden glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(31,175,143,0.05), transparent, rgba(59,130,246,0.05))' }} />
                  <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(31,175,143,0.12)' }}>
                      <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Butuh Bantuan?</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Hubungi customer support kami 24/7</p>
                    </div>
                  </div>
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
