import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-[280px]">
        <main className="min-h-screen pt-6 pb-24 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Hero */}
            <div className="glass rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
                <div className="relative flex-shrink-0">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-primary/30">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWtoxROcMHgUeoZf2sW7SCevSVcFVIRxCpponRQK-7acvqsN-U9B_JEDQrmB7DC1In6e3ML7FfN7EC0M2PIjYWVyH0Sr2eka0rW0opT0edC9vQqAdSgBjwb_hlFVYl0R2Dg4lSiYCym77gIACBF4OoADjKbj1nWfH8WU5GoJys4c6brq7H-9uAKRweUP4TPzxNMBIq00MoelCkMsyrwu0qdRG9cFH416w0o0H1XQ5mjQTeQ76zrCtjg7RvKoABdLfum0IjgtmrLA"
                      alt="Sam"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 btn-grad text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                    LVL 42
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h1 className="font-display text-2xl font-bold text-white">Sam Petualang</h1>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs border border-primary/20">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      Pro Explorer
                    </span>
                  </div>
                  <p className="text-muted text-sm max-w-md mb-4 leading-relaxed">
                    Menjelajahi setiap sudut tersembunyi di Malang Raya. Pecinta kopi lokal dan rute trekking pegunungan.
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    {[
                      { icon: 'diamond', label: '32 Hidden Gems', color: 'text-primary' },
                      { icon: 'forum', label: '15 Kontribusi', color: 'text-accent' },
                      { icon: 'map', label: '8 Rencana', color: 'text-yellow-400' },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-1.5 px-3 py-2 bg-white/5 rounded-xl border border-white/5 text-sm">
                        <span className={`material-symbols-outlined text-[16px] ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                        <span className="text-white">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="glass px-4 py-2 rounded-xl text-sm text-muted border border-white/5 hover:text-white flex-shrink-0">
                  Edit Profil
                </button>
              </div>

              {/* XP Bar */}
              <div className="mt-6 pt-5 border-t border-white/5">
                <div className="flex justify-between text-[11px] mb-2">
                  <span className="text-muted">Progress ke Level 43</span>
                  <span className="text-primary font-bold">7,240 / 10,000 XP</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full btn-grad rounded-full" style={{ width: '72.4%', transition: 'width 1s ease' }} />
                </div>
              </div>
            </div>

            {/* Saved Plans */}
            <div>
              <div className="flex items-center gap-6 border-b border-white/5 pb-3 mb-5">
                <button className="font-semibold text-primary text-sm pb-3 -mb-3 border-b-2 border-primary">
                  Rencana Tersimpan
                </button>
                <button className="font-semibold text-muted text-sm hover:text-white transition-colors">
                  Riwayat Kunjungan
                </button>
                <button className="font-semibold text-muted text-sm hover:text-white transition-colors">
                  Wishlist
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                {[
                  {
                    title: 'Rute Air Terjun Tersembunyi',
                    location: 'Pujon · 2 Hari',
                    tag: 'WISATA ALAM',
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVTuLxMTt-1kgig93Ap215-EkKnUWOG-XGA08fTvULlOvxdN24S9h6ClJXjj0_wXLb4Qh1T4GrN9rUnPCV5q771bH834Dx5m-XJ5WPJRZiT4q0PFJUfFCO-RIlQbJ3rdiqEEkzUQmxQqBoSZI96nUKlaQvmb9csZrcgD2K4bLxtITc7etKJRNAjt6zFvEA5oQiVxhBBllzm3w5NZ2SXzy9gBNpwTFGLJIj0T9hQ-KhvD2hWzX3E9n4b3vd7G-c1u5nqeQanmLYAw',
                  },
                  {
                    title: 'Heritage Trail Kota Tua',
                    location: 'Kota Malang · 1 Hari',
                    tag: 'BUDAYA',
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6nvRT9qevJ_cAP60HwiYPEw3QbtFOc_IZGmp0AofS96Hd9mNRFhk-YP8pmKF4dIT-izHMI1o_JncKSHdLMylKS0Q1JU2EmO_rn1qhA1rPqOl5F5aABQVTuaJ5sSASvgHWTZca1x5nhuCYO3ZPlc1kE3EFe666oKP9rz1HIZOYeQgc0x4TqRfG-shqLdMDOBtJVtskw6-Nmv50gZOsFX1G1U5nJJ6MP_GwYR-_ShC2w9qmVM5zgnpdlj81YOa71ipQ9HfFBM5R8w',
                  },
                ].map(plan => (
                  <div key={plan.title} className="glass rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/20 transition-all">
                    <div className="h-36 relative overflow-hidden">
                      <img src={plan.img} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                      <span className="absolute top-3 right-3 bg-primary/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {plan.tag}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-white mb-1">{plan.title}</h4>
                      <p className="text-[11px] text-muted flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                        {plan.location}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Add new */}
                <div className="glass rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 hover:border-primary/30 hover:bg-primary/3 transition-all cursor-pointer min-h-[180px] group">
                  <span className="material-symbols-outlined text-4xl text-muted group-hover:text-primary transition-colors mb-2">add_circle</span>
                  <p className="text-sm text-muted group-hover:text-white transition-colors font-medium">Buat Rencana Baru</p>
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
