'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/lib/lang'
import { useTheme } from '@/lib/theme'

// ── Static seed posts ──────────────────────────────────────────────────────
type Post = {
  id: number
  author: string
  avatar: string
  time: string
  category: string
  categoryColor: string
  title?: string
  content: string
  likes: number
  comments: number
  liked: boolean
  image?: string
}

const SEED_POSTS: Post[] = [
  {
    id: 1,
    author: 'Zakariae',
    avatar: '/icon-192.png',
    time: '2h',
    category: '📈 Trading',
    categoryColor: '#39FF14',
    title: 'EUR/USD Setup 4H',
    content: 'Structure bullish confirmée sur le 4H. Waiting for pullback sur le 1H pour une entrée propre autour du 1.0850. RR visé : 3.5.',
    likes: 14,
    comments: 3,
    liked: false,
  },
  {
    id: 2,
    author: 'Zakariae',
    avatar: '/icon-192.png',
    time: '1d',
    category: '💪 Workout',
    categoryColor: '#FF2D95',
    content: 'Pull day terminé 🔥 — 4 séries de tractions lestées à +10kg. Progression constante depuis 3 semaines.',
    likes: 27,
    comments: 6,
    liked: true,
  },
  {
    id: 3,
    author: 'Zakariae',
    avatar: '/icon-192.png',
    time: '3d',
    category: '🍌 Food',
    categoryColor: '#facc15',
    title: 'Meal prep semaine',
    content: 'Riz basmati + poulet grillé + légumes rôtis pour 4 jours. Simple, efficace, macro-friendly. 180g protéines/jour.',
    likes: 19,
    comments: 2,
    liked: false,
  },
  {
    id: 4,
    author: 'Zakariae',
    avatar: '/icon-192.png',
    time: '5d',
    category: '📋 Routine',
    categoryColor: '#a78bfa',
    content: '12/12 ✅ — Première fois que je complète toute la routine sans sauter une tâche. La régularité commence à payer.',
    likes: 41,
    comments: 9,
    liked: false,
  },
]

const CATEGORIES = [
  { label: 'All', color: '#fff' },
  { label: '📈 Trading', color: '#39FF14' },
  { label: '💪 Workout', color: '#FF2D95' },
  { label: '🍌 Food', color: '#facc15' },
  { label: '📋 Routine', color: '#a78bfa' },
  { label: '🐾 Raja', color: '#fb923c' },
]

// ── Icons ──────────────────────────────────────────────────────────────────
function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  )
}

function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function IconHeart({ filled }: { filled: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24"
      fill={filled ? '#FF2D95' : 'none'}
      stroke={filled ? '#FF2D95' : 'rgba(255,255,255,0.4)'}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function IconComment() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function IconPen() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  )
}

// ── Component ──────────────────────────────────────────────────────────────
export default function FeedPage() {
  const { lang, toggle: toggleLang } = useLang()
  const { theme, toggle: toggleTheme, dark, toggleDark } = useTheme()
  const isSB = theme === 'sb'

  const [posts, setPosts] = useState<Post[]>(SEED_POSTS)
  const [activeCategory, setActiveCategory] = useState('All')
  const [composing, setComposing] = useState(false)
  const [draft, setDraft] = useState('')
  const [draftCategory, setDraftCategory] = useState('📈 Trading')

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  const toggleLike = (id: number) => {
    setPosts(ps => ps.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ))
  }

  const submitPost = () => {
    if (!draft.trim()) return
    const newPost: Post = {
      id: Date.now(),
      author: isSB ? 'SB' : 'ZK',
      avatar: '/icon-192.png',
      time: 'now',
      category: draftCategory,
      categoryColor: CATEGORIES.find(c => c.label === draftCategory)?.color ?? '#fff',
      content: draft.trim(),
      likes: 0,
      comments: 0,
      liked: false,
    }
    setPosts(ps => [newPost, ...ps])
    setDraft('')
    setComposing(false)
  }

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>

      {/* ── Sticky top header ── */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: '#000', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Brand */}
        <button onClick={toggleTheme}
          className="font-black leading-none select-none"
          style={{ fontSize: '2rem', color: '#fff' }}>
          {isSB ? 'S' : 'Z'}
        </button>
        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button onClick={toggleDark}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
            {dark ? <IconSun /> : <IconMoon />}
          </button>
          <button onClick={toggleLang}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
            {lang === 'en' ? 'FR' : 'EN'}
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden ml-1" style={{ border: '2px solid #FF2D95' }}>
            <Image src="/icon-192.png" alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-2xl mx-auto px-3 pb-36 pt-4">

        {/* ── Compose box ── */}
        <div className="rounded-2xl p-3 mb-4"
          style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
          {composing ? (
            <div className="flex flex-col gap-3">
              <textarea
                className="w-full bg-transparent outline-none resize-none text-sm"
                style={{ color: '#fff', minHeight: 80 }}
                placeholder="Partage quelque chose..."
                value={draft}
                onChange={e => setDraft(e.target.value)}
                autoFocus
              />
              {/* Category picker */}
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORIES.filter(c => c.label !== 'All').map(c => (
                  <button key={c.label}
                    onClick={() => setDraftCategory(c.label)}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: draftCategory === c.label ? c.color + '22' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${draftCategory === c.label ? c.color + '66' : 'transparent'}`,
                      color: draftCategory === c.label ? c.color : 'rgba(255,255,255,0.5)',
                    }}>
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setComposing(false); setDraft('') }}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
                  Annuler
                </button>
                <button onClick={submitPost}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold"
                  style={{ backgroundColor: '#FF2D95', color: '#fff' }}>
                  Publier
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setComposing(true)}
              className="w-full flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                <Image src="/icon-192.png" alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <IconPen />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Partage quelque chose...
                </span>
              </div>
            </button>
          )}
        </div>

        {/* ── Category chips ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 no-scrollbar">
          {CATEGORIES.map(c => {
            const active = activeCategory === c.label
            return (
              <button key={c.label}
                onClick={() => setActiveCategory(c.label)}
                className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  backgroundColor: active ? c.color + '18' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${active ? c.color + '55' : 'rgba(255,255,255,0.08)'}`,
                  color: active ? c.color : 'rgba(255,255,255,0.5)',
                }}>
                {c.label}
              </button>
            )
          })}
        </div>

        {/* ── Posts ── */}
        <div className="flex flex-col gap-3">
          {filtered.map(post => (
            <div key={post.id} className="rounded-2xl p-4"
              style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0" style={{ border: '2px solid rgba(255,255,255,0.1)' }}>
                  <Image src={post.avatar} alt={post.author} width={36} height={36} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: '#fff' }}>{post.author}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{post.time}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: post.categoryColor }}>
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              {post.title && (
                <p className="font-bold mb-1.5" style={{ color: '#fff', fontSize: '0.95rem' }}>{post.title}</p>
              )}
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {post.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-1.5 transition-all active:scale-90">
                  <IconHeart filled={post.liked} />
                  <span className="text-xs font-semibold" style={{ color: post.liked ? '#FF2D95' : 'rgba(255,255,255,0.4)' }}>
                    {post.likes}
                  </span>
                </button>
                <button className="flex items-center gap-1.5">
                  <IconComment />
                  <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {post.comments}
                  </span>
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.2)' }}>
              <p className="text-3xl mb-2">✦</p>
              <p className="text-sm font-semibold">Aucun post dans cette catégorie</p>
            </div>
          )}
        </div>
      </div>

      {/* Hide scrollbar utility */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  )
}
