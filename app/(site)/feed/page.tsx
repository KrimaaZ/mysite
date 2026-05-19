'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/lang'
import { useTheme } from '@/lib/theme'

type FeedItem = {
  id: number
  category: string
  title: string
  excerpt: string
  date: string
  href: string
}

const QUICK_LINKS = [
  { href: '/food',     label: 'Food',    emoji: '🥗',  bg: '#dcfce7', color: '#15803d' },
  { href: '/workout',  label: 'Workout', emoji: '💪',  bg: '#fef3c7', color: '#92400e' },
  { href: '/valorant', label: 'Valorant',emoji: '🎮',  bg: '#fee2e2', color: '#991b1b' },
  { href: '/trading',  label: 'Trading', emoji: '📈',  bg: '#fef9c3', color: '#854d0e' },
  { href: '/notes',    label: 'Spanish', emoji: '🇪🇸', bg: '#dbeafe', color: '#1e40af' },
]

const CAT_STYLE: Record<string, { bg: string; color: string; border: string; emoji: string }> = {
  food:     { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0', emoji: '🥗' },
  workout:  { bg: '#fef3c7', color: '#92400e', border: '#fde68a', emoji: '💪' },
  valorant: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5', emoji: '🎮' },
  trading:  { bg: '#fef9c3', color: '#854d0e', border: '#fde047', emoji: '📈' },
  backtest: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7', emoji: '📊' },
  spanish:  { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd', emoji: '🇪🇸' },
  videos:   { bg: '#f3f4f6', color: '#374151', border: '#d1d5db', emoji: '🎬' },
}

const ALL_CATS = Object.keys(CAT_STYLE)

function noteKey(theme: string) { return `hero-note-${theme}` }
function dateKey(theme: string) { return `hero-date-${theme}` }

export default function FeedPage() {
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)
  const { t } = useLang()
  const { theme, toggle: toggleTheme, dark, toggleDark } = useTheme()

  // Per-theme personal note
  const [noteText, setNoteText] = useState('')
  const [noteDate, setNoteDate] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load note from localStorage when theme changes
  useEffect(() => {
    const saved = localStorage.getItem(noteKey(theme)) ?? ''
    const savedDate = localStorage.getItem(dateKey(theme)) ?? ''
    setNoteText(saved)
    setNoteDate(savedDate)
    setEditing(false)
  }, [theme])

  const startEdit = () => {
    setDraft(noteText)
    setEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const saveNote = () => {
    const now = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    localStorage.setItem(noteKey(theme), draft)
    localStorage.setItem(dateKey(theme), now)
    setNoteText(draft)
    setNoteDate(now)
    setEditing(false)
  }

  useEffect(() => {
    fetch('/api/feed')
      .then(r => r.json())
      .then(d => { setFeed(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter ? feed.filter(i => i.category === filter) : feed

  return (
    <div>

      {/* ── Greeting ── */}
      <div className="flex items-center justify-between mb-5 pt-1">
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--t-text-muted)' }}>Bienvenue 👋</p>
          <h1 className="text-xl font-bold" style={{ color: 'var(--t-text-main)' }}>{theme === 'sb' ? 'SB' : 'ZK'} Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all active:scale-90 hover:scale-110"
            style={{
              background: dark ? 'rgba(148,163,184,0.15)' : 'rgba(0,0,0,0.07)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
            title={dark ? 'Mode clair' : 'Mode sombre'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm tracking-widest transition-all active:scale-90 hover:scale-110"
            style={{
              background: 'linear-gradient(135deg,var(--t-fab-from),var(--t-fab-to))',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            }}
            title="Switch theme"
          >
            {theme === 'sb' ? 'SB' : 'ZK'}
          </button>
        </div>
      </div>

      {/* ── Hero — personal note ── */}
      {(
        <div className="rounded-2xl p-5 mb-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--t-hero-from) 0%, var(--t-hero-mid) 55%, var(--t-hero-to) 100%)' }}>
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />
          <div className="absolute right-4 -bottom-6 w-24 h-24 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />

          {/* Pencil edit btn */}
          {!editing && (
            <button
              onClick={startEdit}
              className="absolute top-3 right-3 text-base leading-none opacity-70 hover:opacity-100 transition-opacity"
              title="Modifier"
            >✏️</button>
          )}

          <span className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'var(--t-hero-text)' }}>
            📌 Note personnelle
          </span>

          {editing ? (
            <>
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={3}
                className="w-full rounded-xl px-3 py-2 text-sm resize-none outline-none mb-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                placeholder="Écris quelque chose..."
              />
              <div className="flex gap-2">
                <button
                  onClick={saveNote}
                  className="flex-1 py-2 rounded-xl text-xs font-bold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
                >✓ Sauvegarder</button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ backgroundColor: 'rgba(0,0,0,0.15)', color: '#fff' }}
                >✕</button>
              </div>
            </>
          ) : (
            <>
              <p className="text-white text-sm leading-relaxed min-h-[48px]">
                {noteText || <span className="opacity-50 italic">Aucune note — clique sur ✏️ pour écrire</span>}
              </p>
              {noteDate && (
                <p className="text-xs mt-3 font-medium" style={{ color: 'var(--t-primary-pale)' }}>{noteDate}</p>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Quick links ── */}
      <div
        className="flex gap-5 overflow-x-auto px-4 py-5 mb-6 rounded-2xl"
        style={{
          scrollbarWidth: 'none',
          background: theme === 'sb'
            ? 'linear-gradient(135deg,#f472b6,#be185d)'
            : 'linear-gradient(135deg,#f59e0b,#d97706)',
        }}
      >
        {QUICK_LINKS.map(item => (
          <Link key={item.href} href={item.href}
            className="flex-shrink-0 flex flex-col items-center transition-all active:scale-90"
            style={{ minWidth: 68 }}>
            {/* Bulle + label superposé */}
            <div className="relative flex items-center justify-center" style={{ width: 78, height: 82 }}>
              {/* Bulle organique blanche */}
              <div
                className="flex items-center justify-center text-3xl"
                style={{
                  width: 68,
                  height: 68,
                  background: '#fff',
                  borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.1)',
                  border: '2.5px solid rgba(255,255,255,0.9)',
                  paddingBottom: 12,
                }}
              >
                {item.emoji}
              </div>
              {/* Label — capsule en bas de la bulle */}
              <span
                className="absolute bottom-0 left-1/2 text-xs font-bold text-center leading-tight px-2 py-0.5 rounded-full whitespace-nowrap"
                style={{
                  transform: 'translateX(-50%)',
                  background: '#fff',
                  color: '#000',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                }}
              >
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Activities header ── */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold" style={{ color: 'var(--t-text-main)' }}>{t.latestActivity}</h2>
        <span className="text-xs font-semibold" style={{ color: 'var(--t-primary)' }}>{feed.length} entrées</span>
      </div>

      {/* ── Filter pills ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setFilter(null)}
          className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{ backgroundColor: filter === null ? 'var(--t-primary)' : 'var(--t-item-bg)', color: filter === null ? '#fff' : 'var(--t-text-muted)' }}
        >
          Tout ({feed.length})
        </button>
        {ALL_CATS.map(cat => {
          const s = CAT_STYLE[cat]
          const count = feed.filter(i => i.category === cat).length
          if (count === 0) return null
          return (
            <button key={cat}
              onClick={() => setFilter(filter === cat ? null : cat)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1"
              style={{ backgroundColor: filter === cat ? s.color : 'var(--t-item-bg)', color: filter === cat ? '#fff' : 'var(--t-text-muted)' }}
            >
              {s.emoji} {cat} ({count})
            </button>
          )
        })}
      </div>

      {/* ── Feed items ── */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-2xl h-24 animate-pulse" style={{ backgroundColor: 'var(--t-border-soft)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
          <p className="text-5xl mb-4">🌱</p>
          <p className="text-lg font-semibold mb-1">{t.nothingYet}</p>
          <p className="text-sm">{t.nothingYetSub}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(item => {
            const s = CAT_STYLE[item.category] || CAT_STYLE.food
            return (
              <Link key={`${item.category}-${item.id}`} href={item.href}
                className="flex gap-4 items-start bg-white rounded-2xl p-4 shadow-sm transition-all active:scale-[0.98] hover:shadow-md"
                style={{ borderLeft: `4px solid ${s.border}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
                  style={{ backgroundColor: dark ? 'var(--t-item-bg)' : s.bg }}>
                  {s.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: s.color }}>
                      {item.category}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--t-text-soft)' }}>{item.date}</span>
                  </div>
                  <p className="font-semibold text-sm leading-snug line-clamp-1" style={{ color: 'var(--t-text-main)' }}>{item.title}</p>
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--t-text-muted)' }}>{item.excerpt}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
