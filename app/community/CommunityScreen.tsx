'use client'
import { useState, useEffect } from 'react'
import { Post, CrowdReport } from '@/lib/data'
import Link from 'next/link'

const COMMUNITY_STATS = [
  { label: 'Travelers Aktif', value: '12.4K', icon: 'groups', color: '#1FAF8F' },
  { label: 'Hidden Gems Ditemukan', value: '347', icon: 'travel_explore', color: '#3B82F6' },
  { label: 'Tips Dibagikan', value: '2.1K', icon: 'tips_and_updates', color: '#F59E0B' },
]

const FEATURED_EXPLORERS = [
  { name: 'Sam_Ganteng', level: 42, badge: 'Local Expert', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWtoxROcMHgUeoZf2sW7SCevSVcFVIRxCpponRQK-7acvqsN-U9B_JEDQrmB7DC1In6e3ML7FfN7EC0M2PIjYWVyH0Sr2eka0rW0opT0edC9vQqAdSgBjwb_hlFVYl0R2Dg4lSiYCym77gIACBF4OoADjKbj1nWfH8WU5GoJys4c6brq7H-9uAKRweUP4TPzxNMBIq00MoelCkMsyrwu0qdRG9cFH416w0o0H1XQ5mjQTeQ76zrCtjg7RvKoABdLfum0IjgtmrLA', gems: 28, posts: 156 },
  { name: 'Dewi_Malang', level: 38, badge: 'Foodie', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWtoxROcMHgUeoZf2sW7SCevSVcFVIRxCpponRQK-7acvqsN-U9B_JEDQrmB7DC1In6e3ML7FfN7EC0M2PIjYWVyH0Sr2eka0rW0opT0edC9vQqAdSgBjwb_hlFVYl0R2Dg4lSiYCym77gIACBF4OoADjKbj1nWfH8WU5GoJys4c6brq7H-9uAKRweUP4TPzxNMBIq00MoelCkMsyrwu0qdRG9cFH416w0o0H1XQ5mjQTeQ76zrCtjg7RvKoABdLfum0IjgtmrLA', gems: 19, posts: 89 },
  { name: 'TrekkingBro', level: 35, badge: 'Adventurer', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWtoxROcMHgUeoZf2sW7SCevSVcFVIRxCpponRQK-7acvqsN-U9B_JEDQrmB7DC1In6e3ML7FfN7EC0M2PIjYWVyH0Sr2eka0rW0opT0edC9vQqAdSgBjwb_hlFVYl0R2Dg4lSiYCym77gIACBF4OoADjKbj1nWfH8WU5GoJys4c6brq7H-9uAKRweUP4TPzxNMBIq00MoelCkMsyrwu0qdRG9cFH416w0o0H1XQ5mjQTeQ76zrCtjg7RvKoABdLfum0IjgtmrLA', gems: 31, posts: 203 },
]

const BADGE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  'Local Expert': { bg: 'rgba(31,175,143,0.1)', color: 'var(--text-accent)', border: '1px solid rgba(31,175,143,0.2)' },
  'Foodie': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' },
  'Adventurer': { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)' },
  'default': { bg: 'rgba(139,92,246,0.1)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' },
}

const CATEGORY_ICONS: Record<string, string> = {
  'Tips Lokal': 'lightbulb',
  'Kuliner': 'restaurant',
  'Petualangan': 'hiking',
  'Review': 'rate_review',
}

export default function CommunityScreen() {
  const [data, setData] = useState<{ posts: Post[]; crowdReports: CrowdReport[] } | null>(null)
  const [votes, setVotes] = useState<Record<string, number>>({})
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({})
  const [activeFilter, setActiveFilter] = useState('semua')
  const [newPostText, setNewPostText] = useState('')
  const [activeTab, setActiveTab] = useState<'feed' | 'crowd'>('feed')

  useEffect(() => {
    fetch('/api/community').then(r => r.json()).then(d => {
      setData(d)
      const initial: Record<string, number> = {}
      d.posts.forEach((p: Post) => { initial[p.id] = p.votes })
      setVotes(initial)
    })
  }, [])

  const vote = (id: string, direction: 'up' | 'down') => {
    const current = userVotes[id]
    if (current === direction) {
      // Undo vote
      setUserVotes(v => ({ ...v, [id]: null }))
      setVotes(v => ({ ...v, [id]: (v[id] || 0) + (direction === 'up' ? -1 : 1) }))
    } else {
      // New vote or change direction
      const delta = direction === 'up' ? 1 : -1
      const undoPrev = current === 'up' ? -1 : current === 'down' ? 1 : 0
      setUserVotes(v => ({ ...v, [id]: direction }))
      setVotes(v => ({ ...v, [id]: (v[id] || 0) + delta + undoPrev }))
    }
  }

  const crowdColor: Record<string, string> = {
    rendah: '#1FAF8F',
    sedang: '#EAB308',
    padat: '#EF4444',
    lancar: '#1FAF8F',
  }

  const crowdIcon: Record<string, string> = {
    rendah: 'sentiment_satisfied',
    sedang: 'sentiment_neutral',
    padat: 'sentiment_dissatisfied',
    lancar: 'check_circle',
  }

  const filters = [
    { key: 'semua', label: 'Semua', icon: 'auto_awesome' },
    { key: 'Tips Lokal', label: 'Tips Lokal', icon: 'lightbulb' },
    { key: 'Kuliner', label: 'Kuliner', icon: 'restaurant' },
    { key: 'Petualangan', label: 'Petualangan', icon: 'hiking' },
    { key: 'Review', label: 'Review', icon: 'rate_review' },
  ]

  return (
    <main className="min-h-screen pt-6 pb-28 px-4 md:px-8 lg:px-10 page-enter max-w-[1400px] mx-auto">

      {/* ═══ PAGE HEADER ═══ */}
      <section className="home-section">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-accent)' }}>
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
              Komunitas
            </p>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Komunitas Explorer
            </h1>
            <p className="max-w-xl text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Berbagi pengalaman, temukan hidden gem baru, dan terhubung dengan sesama traveler & backpacker Malang Raya.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'feed' ? 'btn-grad text-white shadow-md' : 'glass'}`}
              style={activeTab !== 'feed' ? { color: 'var(--text-muted)' } : {}}>
              <span className="material-symbols-outlined text-[16px]">dynamic_feed</span>
              Feed
            </button>
            <button onClick={() => setActiveTab('crowd')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'crowd' ? 'btn-grad text-white shadow-md' : 'glass'}`}
              style={activeTab !== 'crowd' ? { color: 'var(--text-muted)' } : {}}>
              <span className="material-symbols-outlined text-[16px]">sensors</span>
              Live Report
            </button>
          </div>
        </div>
      </section>

      {/* ═══ COMMUNITY STATS ═══ */}
      <section className="home-section">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 stagger">
          {COMMUNITY_STATS.map(stat => (
            <div key={stat.label} className="glass rounded-2xl p-4 sm:p-5 text-center group hover:glow-primary transition-all">
              <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <span className="material-symbols-outlined text-[20px]" style={{ color: stat.color, fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
              </div>
              <p className="font-display text-xl sm:text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {activeTab === 'feed' ? (
        <>
          {/* ═══ CATEGORY FILTERS ═══ */}
          <section className="home-section">
            <div className="flex gap-2 overflow-x-auto no-scroll pb-2 scroll-snap-x">
              {filters.map(f => (
                <button key={f.key} onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all active-scale ${activeFilter === f.key ? 'btn-grad text-white shadow-md' : 'glass hover:border-[var(--primary)]/20'
                    }`}
                  style={activeFilter !== f.key ? { color: 'var(--text-muted)' } : {}}>
                  <span className="material-symbols-outlined text-[15px]">{f.icon}</span> {f.label}
                </button>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ═══ MAIN FEED ═══ */}
            <div className="lg:col-span-8 space-y-5">

              {/* Post Composer */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ border: '2px solid rgba(31,175,143,0.3)' }}>
                    <img src={FEATURED_EXPLORERS[0].avatar} alt="You" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPostText}
                      onChange={e => setNewPostText(e.target.value)}
                      className="w-full bg-transparent rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors min-h-[80px]"
                      style={{ color: 'var(--text-primary)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                      placeholder="Bagikan pengalaman, tips, atau hidden gem yang kamu temukan..."
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--bg-card)]" style={{ color: 'var(--text-muted)' }}>
                          <span className="material-symbols-outlined text-[16px]">image</span> Foto
                        </button>
                        <button className="flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--bg-card)]" style={{ color: 'var(--text-muted)' }}>
                          <span className="material-symbols-outlined text-[16px]">location_on</span> Lokasi
                        </button>
                        <button className="flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--bg-card)]" style={{ color: 'var(--text-muted)' }}>
                          <span className="material-symbols-outlined text-[16px]">tag</span> Tag
                        </button>
                      </div>
                      <button className="btn-grad px-5 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-1.5" disabled={!newPostText.trim()}>
                        <span className="material-symbols-outlined text-[16px]">send</span>
                        Kirim
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              {data ? (
                <div className="space-y-5 stagger">
                  {data.posts
                    .filter(p => activeFilter === 'semua' || p.category === activeFilter)
                    .map(post => {
                      const badgeStyle = BADGE_STYLES[post.badge] || BADGE_STYLES['default']
                      return (
                        <article key={post.id} className="glass rounded-2xl overflow-hidden transition-all card-lift" style={{ border: '1px solid var(--border)' }}>
                          <div className="p-5 sm:p-6">
                            {/* Author row */}
                            <div className="flex items-center gap-3 mb-4">
                              <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover flex-shrink-0" style={{ border: '2px solid var(--border)' }} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{post.author}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: badgeStyle.bg, color: badgeStyle.color, border: badgeStyle.border }}>{post.badge}</span>
                                </div>
                                <p className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                                  {post.time}
                                </p>
                              </div>
                              <span className="text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', border: '1px solid rgba(59,130,246,0.2)' }}>
                                <span className="material-symbols-outlined text-[12px]">{CATEGORY_ICONS[post.category] || 'label'}</span>
                                {post.category}
                              </span>
                            </div>

                            {/* Content */}
                            <h3 className="font-display text-lg font-semibold mb-2 leading-snug" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
                            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{post.body}</p>

                            {/* Image */}
                            {post.image && (
                              <div className="rounded-xl overflow-hidden mb-4 aspect-video">
                                <img src={post.image} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                              </div>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map(t => (
                                <span key={t} className="text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors hover:bg-[var(--border)] cursor-pointer" style={{ color: 'var(--text-accent)', background: 'var(--bg-card)' }}>#{t}</span>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                              {/* Votes */}
                              <div className="flex items-center glass rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                                <button onClick={() => vote(post.id, 'up')}
                                  className="px-3 py-2 transition-colors hover:bg-[var(--bg-card)]"
                                  style={{ color: userVotes[post.id] === 'up' ? 'var(--primary)' : 'var(--text-muted)' }}>
                                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: userVotes[post.id] === 'up' ? "'FILL' 1" : "'FILL' 0" }}>thumb_up</span>
                                </button>
                                <span className="text-sm font-bold px-2 min-w-[40px] text-center" style={{ color: 'var(--text-primary)' }}>{(votes[post.id] || 0).toLocaleString()}</span>
                                <button onClick={() => vote(post.id, 'down')}
                                  className="px-3 py-2 transition-colors hover:bg-[var(--bg-card)]"
                                  style={{ color: userVotes[post.id] === 'down' ? 'var(--error)' : 'var(--text-muted)' }}>
                                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: userVotes[post.id] === 'down' ? "'FILL' 1" : "'FILL' 0" }}>thumb_down</span>
                                </button>
                              </div>

                              <button className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl transition-colors hover:bg-[var(--bg-card)]" style={{ color: 'var(--text-muted)' }}>
                                <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                                <span className="font-medium">{post.comments}</span>
                              </button>

                              <button className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl transition-colors hover:bg-[var(--bg-card)] ml-auto" style={{ color: 'var(--text-muted)' }}>
                                <span className="material-symbols-outlined text-[18px]">share</span>
                                <span className="hidden sm:inline font-medium">Share</span>
                              </button>

                              <button className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl transition-colors hover:bg-[var(--bg-card)]" style={{ color: 'var(--text-muted)' }}>
                                <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                </div>
              ) : (
                <div className="space-y-5">
                  {[1, 2].map(i => <div key={i} className="skeleton h-52 rounded-2xl" />)}
                </div>
              )}
            </div>

            {/* ═══ RIGHT SIDEBAR ═══ */}
            <div className="lg:col-span-4 space-y-5">

              {/* Featured Explorers */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="section-header" style={{ marginBottom: '1rem', paddingBottom: '0.75rem' }}>
                  <h3 className="text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: '#F59E0B', fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                    Top Explorers
                  </h3>
                </div>
                <div className="space-y-3">
                  {FEATURED_EXPLORERS.map((u, i) => {
                    const badgeStyle = BADGE_STYLES[u.badge] || BADGE_STYLES['default']
                    return (
                      <div key={u.name} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[var(--bg-card)]" style={{ background: i === 0 ? 'rgba(245,158,11,0.03)' : 'transparent' }}>
                        <span className="text-sm font-bold w-5 text-center" style={{
                          color: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7F32' : 'var(--text-muted)'
                        }}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                        </span>
                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" style={{ border: '2px solid var(--border)' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: badgeStyle.bg, color: badgeStyle.color, border: badgeStyle.border }}>{u.badge}</span>
                            <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Lv {u.level}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] font-bold" style={{ color: 'var(--text-accent)' }}>{u.gems} gems</p>
                          <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{u.posts} posts</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Achievements */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="section-header" style={{ marginBottom: '1rem', paddingBottom: '0.75rem' }}>
                  <h3 className="text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                    Pencapaianmu
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: 'diamond', label: 'Hidden Gem Hunter', desc: '10 lokasi rahasia ditemukan', progress: 70, gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
                    { icon: 'local_fire_department', label: 'Hot Contributor', desc: 'Postingan viral 3x berturut', progress: 100, gradient: 'linear-gradient(135deg, #EF4444, #EC4899)' },
                    { icon: 'explore', label: 'Malang Explorer', desc: 'Kunjungi 20+ destinasi', progress: 45, gradient: 'linear-gradient(135deg, #1FAF8F, #3B82F6)' },
                  ].map(a => (
                    <div key={a.label} className="p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.gradient }}>
                          <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{a.label}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
                        </div>
                        {a.progress === 100 && (
                          <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>verified</span>
                        )}
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${a.progress}%`, background: a.gradient }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Topics */}
              <div className="glass rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="section-header" style={{ marginBottom: '1rem', paddingBottom: '0.75rem' }}>
                  <h3 className="text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: '#EF4444', fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                    Trending Topics
                  </h3>
                </div>
                <div className="space-y-1">
                  {[
                    { tag: '#SunriseBromo', posts: 85, trend: 'up' },
                    { tag: '#KulinerKotaTua', posts: 73, trend: 'up' },
                    { tag: '#PantaiMalangSelatan', posts: 61, trend: 'stable' },
                    { tag: '#HiddenGemsMalang', posts: 49, trend: 'up' },
                    { tag: '#BackpackerBatu', posts: 37, trend: 'down' },
                  ].map((item, i) => (
                    <div key={item.tag} className="flex items-center justify-between py-2.5 px-2 rounded-lg transition-colors hover:bg-[var(--bg-card)] cursor-pointer" style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold w-4 text-center" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-accent)' }}>{item.tag}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.posts} posts</span>
                        <span className="material-symbols-outlined text-[12px]" style={{ color: item.trend === 'up' ? 'var(--primary)' : item.trend === 'down' ? 'var(--error)' : 'var(--text-muted)' }}>
                          {item.trend === 'up' ? 'trending_up' : item.trend === 'down' ? 'trending_down' : 'trending_flat'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA: Jadi Explorer */}
              <div className="relative overflow-hidden rounded-2xl p-5 gradient-border">
                <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(31,175,143,0.08), transparent, rgba(59,130,246,0.08))' }} />
                <div className="relative text-center">
                  <div className="w-12 h-12 rounded-xl btn-grad flex items-center justify-center mx-auto mb-3" style={{ boxShadow: '0 4px 15px rgba(31,175,143,0.3)' }}>
                    <span className="material-symbols-outlined text-2xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>backpack</span>
                  </div>
                  <h4 className="font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Jadi Top Explorer</h4>
                  <p className="text-[11px] mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>Bagikan hidden gems, kumpulkan poin, dan naik peringkat!</p>
                  <Link href="/explore" className="btn-grad px-5 py-2 rounded-xl text-white text-xs font-semibold inline-flex items-center gap-1">
                    Mulai Eksplorasi
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ═══ CROWD REPORT TAB ═══ */
        <section>
          <div className="section-header">
            <div>
              <h3 className="text-lg sm:text-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--text-accent)', fontVariationSettings: "'FILL' 1" }}>sensors</span>
                Laporan Keramaian Real-Time
              </h3>
              <p className="text-xs">Data dari laporan komunitas traveler</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full animate-pulse"
              style={{ color: 'var(--error)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--error)' }} />
              LIVE
            </span>
          </div>

          {data ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              {data.crowdReports.map(r => (
                <div key={r.name} className="glass rounded-2xl p-5 transition-all card-lift" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Update terakhir: 5 menit lalu</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${crowdColor[r.level]}15` }}>
                      <span className="material-symbols-outlined text-[20px]" style={{ color: crowdColor[r.level], fontVariationSettings: "'FILL' 1" }}>
                        {crowdIcon[r.level] || 'info'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: crowdColor[r.level], boxShadow: `0 0 8px ${crowdColor[r.level]}` }} />
                    <span className="text-base font-bold capitalize" style={{ color: crowdColor[r.level] }}>{r.level}</span>
                    <span className="ml-auto material-symbols-outlined text-[16px]" style={{ color: crowdColor[r.level] }}>
                      {r.trend === 'up' ? 'trending_up' : r.trend === 'down' ? 'trending_down' : 'trending_flat'}
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: crowdColor[r.level] }}>
                      {r.trend === 'up' ? 'Meningkat' : r.trend === 'down' ? 'Menurun' : 'Stabil'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
            </div>
          )}
        </section>
      )}
    </main>
  )
}
