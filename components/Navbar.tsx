'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/lib/lang'
import { useTheme } from '@/lib/theme'

// ── Navigation links ───────────────────────────────────────────────────────
const menuLinks = [
  { href: '/food',      label: 'Food',      emoji: '🥗' },
  { href: '/workout',   label: 'Workout',   emoji: '💪' },
  { href: '/trading',   label: 'Trading',   emoji: '📈' },
  { href: '/notes',     label: 'Spanish',   emoji: '🇪🇸' },
  { href: '/pomodoro',  label: 'Pomodoro',  emoji: '🍅' },
]

// ── Default daily tasks (from the board screenshot) ───────────────────────
type Task = { id: string; label: string; time: string; done: boolean }

const DEFAULT_TASKS: Task[] = [
  { id: '1',  label: 'Waking up early',           time: '7h',           done: false },
  { id: '2',  label: 'Breakfast Made Home',        time: '7h20',         done: false },
  { id: '3',  label: 'Shower Morning',             time: '7h40',         done: false },
  { id: '4',  label: 'Walking to work',            time: '8h',           done: false },
  { id: '5',  label: 'Work',                       time: '8h30 → 16h',   done: false },
  { id: '6',  label: 'Cooking lunch',              time: '16h40',        done: false },
  { id: '7',  label: 'Workout',                    time: '17h → 18h30',  done: false },
  { id: '8',  label: 'Shower + Eat lunch',         time: '18h45 → 19h30',done: false },
  { id: '9',  label: 'Time ON PC',                 time: '20h → 23h',    done: false },
  { id: '10', label: 'Cooking snacks for work',    time: '23h30',        done: false },
  { id: '11', label: 'Cleaning dishes',            time: '23h45',        done: false },
  { id: '12', label: 'N3AAAAAAAAASS ZERWAAAAAT',   time: '',             done: false },
]

const STORAGE_KEY = 'daily-checklist-v1'

function today() { return new Date().toISOString().split('T')[0] }

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_TASKS
    const data = JSON.parse(raw)
    // daily reset
    if (data.date !== today()) {
      const reset = data.tasks.map((t: Task) => ({ ...t, done: false }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today(), tasks: reset }))
      return reset
    }
    return data.tasks
  } catch { return DEFAULT_TASKS }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today(), tasks }))
}

// ── SVG icons ──────────────────────────────────────────────────────────────
function IconHome({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={active ? 'var(--t-primary)' : '#9ca3af'}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function IconStar({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24"
      fill={active ? 'var(--t-primary)' : 'none'}
      stroke={active ? 'var(--t-primary)' : '#9ca3af'}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function IconGrid() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}

// ── Daily checklist panel ─────────────────────────────────────────────────
function Checklist() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editTime, setEditTime] = useState('')
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newTime, setNewTime] = useState('')
  const addRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTasks(loadTasks())
  }, [])

  const toggle = (id: string) => {
    const next = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    setTasks(next); saveTasks(next)
  }

  const startEdit = (t: Task) => {
    setEditingId(t.id); setEditLabel(t.label); setEditTime(t.time)
  }

  const saveEdit = () => {
    if (!editLabel.trim()) return
    const next = tasks.map(t => t.id === editingId ? { ...t, label: editLabel.trim(), time: editTime.trim() } : t)
    setTasks(next); saveTasks(next); setEditingId(null)
  }

  const deleteTask = (id: string) => {
    const next = tasks.filter(t => t.id !== id)
    setTasks(next); saveTasks(next)
  }

  const addTask = () => {
    if (!newLabel.trim()) return
    const next = [...tasks, { id: Date.now().toString(), label: newLabel.trim(), time: newTime.trim(), done: false }]
    setTasks(next); saveTasks(next)
    setNewLabel(''); setNewTime(''); setAdding(false)
  }

  const done = tasks.filter(t => t.done).length
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Progress bar */}
      <div className="px-4 pb-3 shrink-0">
        <div className="flex justify-between text-xs font-semibold mb-1.5" style={{ color: 'var(--t-text-muted)' }}>
          <span>Ma journée</span>
          <span style={{ color: 'var(--t-primary)' }}>{done}/{tasks.length} · {pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--t-item-bg)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--t-fab-from), var(--t-fab-to))' }} />
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 flex flex-col gap-2 pb-24">
        {tasks.map(t => (
          <div key={t.id}>
            {editingId === t.id ? (
              <div className="rounded-2xl p-3 flex flex-col gap-2" style={{ backgroundColor: 'var(--t-bg-soft)' }}>
                <input value={editLabel} onChange={e => setEditLabel(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl text-sm outline-none border"
                  style={{ borderColor: 'var(--t-border)', color: '#111827' }}
                  placeholder="Tâche..." autoFocus />
                <input value={editTime} onChange={e => setEditTime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl text-xs outline-none border"
                  style={{ borderColor: 'var(--t-border)', color: '#6b7280' }}
                  placeholder="Horaire (ex: 7h → 8h)" />
                <div className="flex gap-2">
                  <button onClick={saveEdit}
                    className="flex-1 py-1.5 rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: 'var(--t-primary)' }}>✓ OK</button>
                  <button onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold"
                    style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>✕</button>
                  <button onClick={() => deleteTask(t.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold"
                    style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>🗑</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all"
                style={{ backgroundColor: t.done ? 'var(--t-bg-soft)' : 'var(--t-card-bg)', border: '1px solid', borderColor: t.done ? 'var(--t-border)' : 'var(--t-border-soft)' }}>
                {/* Checkbox */}
                <button onClick={() => toggle(t.id)}
                  className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                  style={{ borderColor: t.done ? 'var(--t-primary)' : '#d1d5db', backgroundColor: t.done ? 'var(--t-primary)' : 'transparent' }}>
                  {t.done && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>}
                </button>
                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight"
                    style={{ color: t.done ? 'var(--t-text-soft)' : 'var(--t-text-main)', textDecoration: t.done ? 'line-through' : 'none' }}>
                    {t.label}
                  </p>
                  {t.time && <p className="text-xs mt-0.5" style={{ color: 'var(--t-primary)' }}>{t.time}</p>}
                </div>
                {/* Edit pencil */}
                <button onClick={() => startEdit(t)} className="text-sm opacity-40 hover:opacity-80 shrink-0">✏️</button>
              </div>
            )}
          </div>
        ))}

        {/* Add task */}
        {adding ? (
          <div className="rounded-2xl p-3 flex flex-col gap-2" style={{ backgroundColor: 'var(--t-bg-soft)' }}>
            <input ref={addRef} value={newLabel} onChange={e => setNewLabel(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl text-sm outline-none border"
              style={{ borderColor: 'var(--t-border)', color: '#111827' }}
              placeholder="Nouvelle tâche..." autoFocus
              onKeyDown={e => { if (e.key === 'Enter') addTask() }} />
            <input value={newTime} onChange={e => setNewTime(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl text-xs outline-none border"
              style={{ borderColor: 'var(--t-border)', color: '#6b7280' }}
              placeholder="Horaire (optionnel)"
              onKeyDown={e => { if (e.key === 'Enter') addTask() }} />
            <div className="flex gap-2">
              <button onClick={addTask}
                className="flex-1 py-1.5 rounded-xl text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--t-primary)' }}>+ Ajouter</button>
              <button onClick={() => setAdding(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>✕</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)}
            className="w-full py-2.5 rounded-2xl text-xs font-bold border-2 border-dashed transition-all"
            style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-accent)' }}>
            + Ajouter une tâche
          </button>
        )}
      </div>
    </div>
  )
}

// ── Vault login popup ─────────────────────────────────────────────────────
function VaultLoginPopup({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/vault/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    })
    setLoading(false)
    if (res.ok) {
      sessionStorage.setItem('vault-token', 'vault-session-ok')
      onClose()
      router.push('/vault')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-80 rounded-3xl p-6 shadow-2xl"
        style={{ backgroundColor: 'var(--t-card-bg)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black" style={{ color: 'var(--t-text-main)' }}>🔑 Vault</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
            style={{ color: 'var(--t-text-muted)', backgroundColor: 'var(--t-item-bg)' }}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            value={login} onChange={e => setLogin(e.target.value)}
            placeholder="Login" autoFocus autoComplete="username"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none border"
            style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-bg-soft)' }} />
          <input
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" type="password" autoComplete="current-password"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none border"
            style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-bg-soft)' }} />
          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-2xl text-sm font-bold text-white mt-1"
            style={{ background: 'linear-gradient(135deg,var(--t-fab-from),var(--t-fab-to))', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main Navbar ────────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname()
  const { lang, toggle: toggleLang } = useLang()
  const { theme, toggle: toggleTheme, dark, toggleDark } = useTheme()
  const [open, setOpen] = useState(false)
  const [drawerTab, setDrawerTab] = useState<'menu' | 'day'>('menu')
  const [vaultOpen, setVaultOpen] = useState(false)

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (pathname === '/') return null

  const feedActive = pathname === '/feed' || pathname.startsWith('/feed/')
  const rajaActive = pathname.startsWith('/raja')
  const isSB = theme === 'sb'

  return (
    <>
      {/* ── Bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50"
        style={{ backgroundColor: 'var(--t-card-bg)', boxShadow: '0 -1px 0 rgba(0,0,0,0.06), 0 -6px 24px rgba(0,0,0,0.05)' }}>
        <div className="flex h-16 items-center max-w-lg mx-auto px-6">
          {/* Feed */}
          <Link href="/feed" className="flex-1 flex flex-col items-center justify-center gap-0.5">
            <IconHome active={feedActive} />
            <span className="text-xs font-semibold" style={{ color: feedActive ? 'var(--t-primary)' : '#9ca3af' }}>Feed</span>
          </Link>

          {/* FAB — centre */}
          <div className="flex-1 flex justify-center">
            <button onClick={() => { setOpen(true); setDrawerTab('menu') }}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-90 hover:scale-105"
              style={{
                marginBottom: '28px',
                background: 'linear-gradient(135deg, var(--t-fab-from) 0%, var(--t-fab-to) 100%)',
                boxShadow: isSB ? '0 8px 32px rgba(236,72,153,0.45)' : '0 8px 32px rgba(22,163,74,0.45)',
              }}
              aria-label="Ma journée">
              <IconGrid />
            </button>
          </div>

          {/* Raja */}
          <Link href="/raja" className="flex-1 flex flex-col items-center justify-center gap-0.5">
            <IconStar active={rajaActive} />
            <span className="text-xs font-semibold" style={{ color: rajaActive ? 'var(--t-primary)' : '#9ca3af' }}>Raja</span>
          </Link>
        </div>
      </div>

      {/* ── Vault login popup ── */}
      {vaultOpen && <VaultLoginPopup onClose={() => setVaultOpen(false)} />}

      {/* ── Drawer ── */}
      {open && (
        <div className="fixed inset-0 z-[100] flex justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}>
          <div className="h-full w-80 flex flex-col shadow-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--t-card-bg)' }}
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-12 pb-3 border-b" style={{ borderColor: 'var(--t-border-soft)' }}>
              <span className="font-black text-base tracking-widest" style={{ color: 'var(--t-primary)' }}>
                {isSB ? 'SB' : 'ZK'}
              </span>
              <button onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ color: 'var(--t-text-muted)', backgroundColor: 'var(--t-item-bg)' }}>×</button>
            </div>

            {/* Tabs */}
            <div className="flex mx-4 mt-3 mb-2 rounded-2xl p-1 gap-1" style={{ backgroundColor: 'var(--t-item-bg)' }}>
              <button onClick={() => setDrawerTab('menu')}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                style={{ backgroundColor: drawerTab === 'menu' ? 'var(--t-card-bg)' : 'transparent', color: drawerTab === 'menu' ? 'var(--t-primary)' : 'var(--t-text-soft)', boxShadow: drawerTab === 'menu' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                📌 Menu
              </button>
              <button onClick={() => setDrawerTab('day')}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                style={{ backgroundColor: drawerTab === 'day' ? 'var(--t-card-bg)' : 'transparent', color: drawerTab === 'day' ? 'var(--t-primary)' : 'var(--t-text-soft)', boxShadow: drawerTab === 'day' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                📋 Ma journée
              </button>
            </div>

            {/* Tab content — takes remaining height, must not overflow drawer */}
            <div className="flex-1 flex flex-col min-h-0">
            {drawerTab === 'menu' ? (
              <>
                <nav className="flex flex-col gap-1 p-4 flex-1">
                  {menuLinks.map(link => {
                    const active = pathname.startsWith(link.href)
                    return (
                      <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all"
                        style={{ backgroundColor: active ? 'var(--t-bg-soft)' : 'transparent', color: active ? 'var(--t-text-accent)' : 'var(--t-text-main)' }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--t-item-bg)' }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
                        <span className="text-xl w-8 text-center">{link.emoji}</span>
                        <span>{link.label}</span>
                        {active && <span className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--t-primary)' }} />}
                      </Link>
                    )
                  })}
                </nav>
                <div className="p-4 border-t flex flex-col gap-2" style={{ borderColor: 'var(--t-bg)' }}>
                  <div className="flex gap-2">
                    <button onClick={toggleTheme}
                      className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg,var(--t-fab-from),var(--t-fab-to))', color: '#fff' }}>
                      {isSB ? '🟢 ZK' : '🩷 SB'}
                    </button>
                    <button onClick={toggleDark}
                      className="w-12 py-3 rounded-2xl text-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--t-bg-soft)', color: 'var(--t-text-accent)' }}
                      title={dark ? 'Mode clair' : 'Mode sombre'}>
                      {dark ? '☀️' : '🌙'}
                    </button>
                    <button onClick={() => { setOpen(false); setVaultOpen(true) }}
                      className="w-12 py-3 rounded-2xl text-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--t-bg-soft)', color: 'var(--t-text-accent)' }}
                      title="Vault">
                      🔑
                    </button>
                  </div>
                  <button onClick={toggleLang}
                    className="w-full py-3 rounded-2xl text-sm font-bold"
                    style={{ backgroundColor: 'var(--t-bg-soft)', color: 'var(--t-text-accent)' }}>
                    {lang === 'en' ? '🇫🇷 Français' : '🇬🇧 English'}
                  </button>
                </div>
              </>
            ) : (
              <Checklist />
            )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
