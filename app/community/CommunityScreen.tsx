'use client'
import { useState, useEffect } from 'react'
import { Post, CrowdReport } from '@/lib/data'

export default function CommunityScreen() {
  const [data, setData] = useState<{ posts: Post[]; crowdReports: CrowdReport[] } | null>(null)
  const [votes, setVotes] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/api/community').then(r => r.json()).then(d => {
      setData(d)
      const initial: Record<string, number> = {}
      d.posts.forEach((p: Post) => { initial[p.id] = p.votes })
      setVotes(initial)
    })
  }, [])

  const vote = (id: string, delta: number) => {
    setVotes(v => ({ ...v, [id]: (v[id] || 0) + delta }))
  }

  const crowdColor: Record<string, string> = {
    rendah: '#1FAF8F',
    sedang: '#EAB308',
    padat: '#EF4444',
    lancar: '#1FAF8F',
  }

  return (
    <main className="min-h-screen pt-6 pb-24 px-4 md:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Komunitas</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Diskusi Hangat</h1>
        <p className="text-muted text-sm">Suara real-time dari traveler di Malang Raya</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main feed */}
        <div className="lg:col-span-8 space-y-4">
          {/* Crowd report */}
          {data && (
            <div className="glass rounded-2xl p-5 border border-primary/15 bg-primary/3">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
                <h2 className="text-primary text-xs font-bold uppercase tracking-widest">Laporan Keramaian Real-Time</h2>
                <span className="ml-auto flex items-center gap-1 text-[9px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />LIVE
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {data.crowdReports.map(r => (
                  <div key={r.name} className="bg-white/3 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-muted mb-1.5">{r.name}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: crowdColor[r.level] || '#888', boxShadow: `0 0 6px ${crowdColor[r.level] || '#888'}` }}
                      />
                      <span className="text-sm font-semibold capitalize" style={{ color: crowdColor[r.level] }}>
                        {r.level}
                      </span>
                      <span className="ml-auto text-[10px]" style={{ color: crowdColor[r.level] }}>
                        {r.trend === 'up' ? '↑' : r.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post button */}
          <div className="glass rounded-2xl p-4 border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-muted text-[18px]">person</span>
            </div>
            <div className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-sm text-muted cursor-pointer hover:bg-white/8 transition-colors border border-white/5">
              Share pengalaman perjalananmu...
            </div>
            <button className="btn-grad px-4 py-2 rounded-xl text-white text-sm font-semibold flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>

          {/* Posts */}
          {data ? (
            <div className="space-y-4 stagger">
              {data.posts.map(post => (
                <article key={post.id} className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all">
                  <div className="p-5">
                    {/* Author */}
                    <div className="flex items-center gap-3 mb-4">
                      <img src={post.avatar} alt={post.author} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{post.author}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20">{post.badge}</span>
                        </div>
                        <p className="text-[11px] text-muted">{post.time}</p>
                      </div>
                      <span className="ml-auto text-[10px] px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-white mb-2">{post.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-4">{post.body}</p>

                    {post.image && (
                      <div className="rounded-xl overflow-hidden mb-4 aspect-video">
                        <img src={post.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(t => (
                        <span key={t} className="text-[10px] text-muted bg-white/5 px-2.5 py-1 rounded-full">#{t}</span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => vote(post.id, 1)} className="text-muted hover:text-primary transition-colors p-1">
                          <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                        </button>
                        <span className="text-sm font-bold text-white min-w-[36px] text-center">{(votes[post.id] || 0).toLocaleString()}</span>
                        <button onClick={() => vote(post.id, -1)} className="text-muted hover:text-red-400 transition-colors p-1">
                          <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                        </button>
                      </div>
                      <button className="flex items-center gap-1.5 text-muted hover:text-white transition-colors text-sm">
                        <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-1.5 text-muted hover:text-white transition-colors text-sm ml-auto">
                        <span className="material-symbols-outlined text-[18px]">share</span>
                        Share
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Achievements */}
          <div className="glass rounded-2xl p-5 border border-white/5">
            <h3 className="font-semibold text-white mb-4">Pencapaianmu</h3>
            <div className="space-y-3">
              {[
                { icon: 'diamond', label: 'Hidden Gem Hunter', desc: '10 lokasi rahasia ditemukan', color: 'from-yellow-400 to-orange-500' },
                { icon: 'local_fire_department', label: 'Hot Contributor', desc: 'Postingan viral 3x berturut', color: 'from-red-400 to-pink-600' },
                { icon: 'explore', label: 'Malang Explorer', desc: 'Kunjungi 20+ destinasi', color: 'from-primary to-accent' },
              ].map(a => (
                <div key={a.label} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{a.label}</p>
                    <p className="text-[10px] text-muted">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="glass rounded-2xl p-5 border border-white/5">
            <h3 className="font-semibold text-white mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {['Sam_Ganteng', 'Dewi_Malang', 'TrekkingBro', 'Kopi_Hitam', 'VisitMalang'].map((u, i) => (
                <div key={u} className="flex items-center gap-3">
                  <span className={`text-sm font-bold w-5 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-muted'}`}>
                    {i + 1}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[11px] font-bold text-white">
                    {u[0]}
                  </div>
                  <span className="flex-1 text-sm text-white">{u}</span>
                  <span className="text-[10px] text-primary">{(1200 - i * 150).toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
