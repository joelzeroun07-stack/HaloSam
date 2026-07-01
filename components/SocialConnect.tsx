'use client'
import { useState, useEffect } from 'react'
import { getLocalStorage, setLocalStorage, LS_KEYS } from '@/lib/utils'

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E1306C', placeholder: '@username' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#010101', placeholder: '@username' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#FF0000', placeholder: 'channel URL' },
  { id: 'twitter', name: 'X (Twitter)', icon: '𝕏', color: '#1DA1F2', placeholder: '@username' },
  { id: 'facebook', name: 'Facebook', icon: '👤', color: '#1877F2', placeholder: 'facebook.com/...' },
  { id: 'threads', name: 'Threads', icon: '🧵', color: '#000000', placeholder: '@username' },
]

interface SocialLink {
  platformId: string
  username: string
  connected: boolean
}

export default function SocialConnect() {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [inputVal, setInputVal] = useState('')

  useEffect(() => {
    const saved = getLocalStorage<SocialLink[]>(LS_KEYS.SOCIAL_LINKS, [])
    setLinks(saved)
  }, [])

  const save = (updated: SocialLink[]) => {
    setLinks(updated)
    setLocalStorage(LS_KEYS.SOCIAL_LINKS, updated)
  }

  const handleConnect = (platformId: string) => {
    if (!inputVal.trim()) return
    const existing = links.filter(l => l.platformId !== platformId)
    const updated = [...existing, { platformId, username: inputVal.trim(), connected: true }]
    save(updated)
    setEditingId(null)
    setInputVal('')
  }

  const handleDisconnect = (platformId: string) => {
    const updated = links.filter(l => l.platformId !== platformId)
    save(updated)
  }

  const getLink = (platformId: string) => links.find(l => l.platformId === platformId)

  const getProfileUrl = (platformId: string, username: string) => {
    const u = username.replace('@', '')
    switch (platformId) {
      case 'instagram': return `https://instagram.com/${u}`
      case 'tiktok': return `https://tiktok.com/@${u}`
      case 'youtube': return username.startsWith('http') ? username : `https://youtube.com/@${u}`
      case 'twitter': return `https://x.com/${u}`
      case 'facebook': return username.startsWith('http') ? username : `https://facebook.com/${u}`
      case 'threads': return `https://threads.net/@${u}`
      default: return '#'
    }
  }

  return (
    <div className="space-y-3">
      {SOCIAL_PLATFORMS.map(platform => {
        const link = getLink(platform.id)
        const isEditing = editingId === platform.id

        return (
          <div
            key={platform.id}
            className="flex items-center gap-3 p-4 rounded-xl transition-all"
            style={{
              background: 'var(--bg-card)',
              border: link?.connected ? `1.5px solid ${platform.color}33` : '1px solid var(--border)',
            }}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: `${platform.color}20` }}
            >
              {platform.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {platform.name}
                </p>
                {link?.connected && (
                  <span className="badge badge-green text-[9px]">Terhubung</span>
                )}
              </div>

              {link?.connected && !isEditing && (
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{link.username}</p>
              )}

              {isEditing && (
                <div className="flex gap-2 mt-1.5">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder={platform.placeholder}
                    className="flex-1 px-3 py-1.5 rounded-lg text-xs outline-none min-w-0"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleConnect(platform.id)}
                  />
                  <button
                    onClick={() => handleConnect(platform.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium btn-grad text-white"
                  >
                    OK
                  </button>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {link?.connected && (
                <>
                  <a
                    href={getProfileUrl(platform.id, link.username)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-target text-xs font-medium"
                    style={{ color: 'var(--text-accent)' }}
                    aria-label={`Lihat profil ${platform.name}`}
                  >
                    Lihat
                  </a>
                  <button
                    onClick={() => handleDisconnect(platform.id)}
                    className="touch-target text-xs font-medium"
                    style={{ color: 'var(--error)' }}
                    aria-label={`Putuskan ${platform.name}`}
                  >
                    Putus
                  </button>
                </>
              )}
              {!link?.connected && !isEditing && (
                <button
                  onClick={() => { setEditingId(platform.id); setInputVal(link?.username || '') }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-accent)', border: '1px solid var(--border)' }}
                  aria-label={`Hubungkan ${platform.name}`}
                >
                  Hubungkan
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
