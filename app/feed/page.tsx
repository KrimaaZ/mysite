'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTheme } from '@/lib/theme'
import { useLang } from '@/lib/lang'

// ─── Types ────────────────────────────────────────────────────────────────────
type Post = {
  id: number
  author: string
  level: number
  time: string
  category: string
  categoryColor: string
  pinned?: boolean
  title?: string
  content: string
  likes: number
  comments: number
  liked: boolean
  commenters: string[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'All',     color: 'rgba(255,255,255,0.9)' },
  { label: 'Trading', color: '#39FF14' },
  { label: 'Workout', color: '#FF2D95' },
  { label: 'Food',    color: '#facc15' },
  { label: 'Routine', color: '#a78bfa' },
  { label: 'Raja',    color: '#fb923c' },
]

const SEED: Post[] = [
  {
    id: 1, author: 'Zakariae', level: 6, time: '2h',
    category: 'Trading', categoryColor: '#39FF14', pinned: true,
    title: 'EUR/USD Setup 4H — Structure bullish',
    content: 'Structure bullish confirmée sur le 4H. Waiting for pullback sur le 1H pour une entrée propre autour du 1.0850. Stop Loss sous le dernier bas, RR visé : 3.5.\n\nSi le prix casse sous 1.0820 avant l\'entrée → setup invalidé.',
    likes: 27, comments: 8, liked: false,
    commenters: ['/icon-192.png', '/icon-192.png', '/icon-192.png'],
  },
  {
    id: 2, author: 'Zakariae', level: 6, time: '1d',
    category: 'Workout', categoryColor: '#FF2D95',
    content: 'Pull day terminé 🔥 — 4 séries de tractions lestées +10kg. Dips +20kg. Progression constante depuis 3 semaines. Le corps s\'adapte, on continue.',
    likes: 35, comments: 12, liked: true,
    commenters: ['/icon-192.png', '/icon-192.png'],
  },
  {
    id: 3, author: 'Zakariae', level: 6, time: '3d',
    category: 'Food', categoryColor: '#facc15', pinned: true,
    title: 'Meal prep de la semaine 🍽️',
    content: 'Riz basmati + poulet grillé + légumes rôtis pour 4 jours. Simple, efficace, macro-friendly. Objectif : 180g protéines/jour. 45 min de prep pour toute la semaine.',
    likes: 19, comments: 5, liked: false,
    commenters: ['/icon-192.png'],
  },
  {
    id: 4, author: 'Zakariae', level: 6, time: '5d',
    category: 'Routine', categoryColor: '#a78bfa',
    content: '12/12 ✅ — Première fois que je complète toute la routine sans sauter une tâche. Waking up 7h → N3AAASS 23h45. La régularité commence à payer. Day streak : 4 🔥',
    likes: 41, comments: 9, liked: false,
    commenters: ['/icon-192.png', '/icon-192.png', '/icon-192.png'],
  },
]

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconPin() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  )
}

function IconThumb({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? '#FF2D95' : 'none'}
      stroke={filled ? '#FF2D95' : 'rgba(255,255,255,0.35)'}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  )
}

function IconComment() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}

function IconPen() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeedPage() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang } = useLang()
  const isSB = theme === 'sb'

  const [posts, setPosts] = useState<Post[]>(SEED)
  const [activeTab, setActiveTab] = useState('All')
  const [composing, setComposing] = useState(false)
  const [draft, setDraft] = useState('')
  const [draftCat, setDraftCat] = useState('Trading')

  const filtered = activeTab === 'All' ? posts : posts.filter(p => p.category === activeTab)

  const toggleLike = (id: number) =>
    setPosts(ps => ps.map(p => p.id === id
      ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
      : p))

  const publish = () => {
    if (!draft.trim()) return
    const cat = CATEGORIES.find(c => c.label === draftCat)!
    setPosts(ps => [{
      id: Date.now(), author: isSB ? 'SB' : 'ZK', level: 6,
      time: 'now', category: cat.label, categoryColor: cat.color,
      content: draft.trim(), likes: 0, comments: 0, liked: false, commenters: [],
    }, ...ps])
    setDraft(''); setComposing(false)
  }

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', paddingBottom: 120 }}>

      {/* ── Top header ── */}
      <div className="sticky top-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-black text-lg"
            style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', color: '#39FF14' }}>
            {isSB ? 'S' : 'Z'}
          </button>
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
            <IconSearch />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>Search…</span>
          </div>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center relative"
            style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
            <IconBell />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#FF2D95' }} />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0" style={{ border: '2px solid #FF2D95' }}>
            <Image src="/icon-192.png" alt="me" width={36} height={36} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Category tab nav */}
        <div className="flex px-2 max-w-2xl mx-auto overflow-x-auto no-scrollbar">
          {CATEGORIES.map(c => (
            <button key={c.label} onClick={() => setActiveTab(c.label)}
              className="shrink-0 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap"
              style={{
                borderColor: activeTab === c.label ? c.color : 'transparent',
                color: activeTab === c.label ? c.color : 'rgba(255,255,255,0.35)',
              }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Feed content ── */}
      <div className="max-w-2xl mx-auto px-3 pt-4 flex flex-col gap-3">

        {/* Compose */}
        <div className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
          {composing ? (
            <div className="p-4 flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                  <Image src="/icon-192.png" alt="me" width={36} height={36} className="w-full h-full object-cover" />
                </div>
                <textarea autoFocus
                  className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed"
                  style={{ color: '#fff', minHeight: 80 }}
                  placeholder="Share something…"
                  value={draft} onChange={e => setDraft(e.target.value)} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.filter(c => c.label !== 'All').map(c => (
                  <button key={c.label} onClick={() => setDraftCat(c.label)}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: draftCat === c.label ? c.color + '22' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${draftCat === c.label ? c.color + '77' : 'rgba(255,255,255,0.08)'}`,
                      color: draftCat === c.label ? c.color : 'rgba(255,255,255,0.4)',
                    }}>
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 justify-end pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => { setComposing(false); setDraft('') }}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>Cancel</button>
                <button onClick={publish}
                  className="px-5 py-1.5 rounded-xl text-xs font-bold"
                  style={{ backgroundColor: '#FF2D95', color: '#fff' }}>Post</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setComposing(true)} className="w-full flex items-center gap-3 p-4 text-left">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                <Image src="/icon-192.png" alt="me" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <IconPen />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>Write something…</span>
              </div>
            </button>
          )}
        </div>

        {/* Post cards */}
        {filtered.map(post => (
          <div key={post.id} className="rounded-2xl"
            style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>

            {/* Header */}
            <div className="flex items-start justify-between gap-3 p-4 pb-3">
              <div className="flex items-start gap-3">
                {/* Avatar + level */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden"
                    style={{ border: '2px solid rgba(255,255,255,0.1)' }}>
                    <Image src="/icon-192.png" alt={post.author} width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
                    style={{ backgroundColor: '#FF2D95', color: '#fff' }}>
                    {post.level}
                  </div>
                </div>
                {/* Name / time / category */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: '#fff' }}>{post.author}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{post.time}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: post.categoryColor + '18', color: post.categoryColor, border: `1px solid ${post.categoryColor}33` }}>
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
              {post.pinned && (
                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  <IconPin />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Pinned</span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="px-4 pb-4">
              {post.title && (
                <p className="font-bold mb-2 leading-snug" style={{ color: '#fff', fontSize: '0.95rem' }}>
                  {post.title}
                </p>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: 'rgba(255,255,255,0.6)' }}>
                {post.content}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button onClick={() => toggleLike(post.id)}
                className="flex items-center gap-1.5 active:scale-90 transition-transform">
                <IconThumb filled={post.liked} />
                <span className="text-xs font-semibold"
                  style={{ color: post.liked ? '#FF2D95' : 'rgba(255,255,255,0.4)' }}>
                  {post.likes}
                </span>
              </button>

              <button className="flex items-center gap-1.5">
                <IconComment />
                <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {post.comments}
                </span>
              </button>

              {post.commenters.length > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <div className="flex">
                    {post.commenters.slice(0, 3).map((src, i) => (
                      <div key={i} className="w-5 h-5 rounded-full overflow-hidden"
                        style={{ marginLeft: i === 0 ? 0 : -6, border: '1.5px solid #111' }}>
                        <Image src={src} alt="" width={20} height={20} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    New comment {post.time} ago
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.18)' }}>
            <p className="text-4xl mb-3">✦</p>
            <p className="text-sm font-semibold">No posts in this category</p>
          </div>
        )}
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  )
}
