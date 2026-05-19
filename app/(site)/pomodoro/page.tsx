'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/lib/theme'

type Mode = 'work' | 'short' | 'long'

const MODES: Record<Mode, { label: string; seconds: number; color: string; emoji: string }> = {
  work:  { label: 'Focus',       seconds: 45 * 60, color: '#e84057', emoji: '🍅' },
  short: { label: 'Short Break', seconds:  5 * 60, color: '#22c55e', emoji: '☕' },
  long:  { label: 'Long Break',  seconds: 15 * 60, color: '#3b82f6', emoji: '🛌' },
}

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

export default function PomodoroPage() {
  const { dark } = useTheme()
  const [mode, setMode] = useState<Mode>('work')
  const [timeLeft, setTimeLeft] = useState(MODES.work.seconds)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const cfg = MODES[mode]
  const total = cfg.seconds
  const pct = ((total - timeLeft) / total) * 100

  // Switch mode
  const switchMode = (m: Mode) => {
    setMode(m)
    setTimeLeft(MODES[m].seconds)
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  // Timer tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            if (mode === 'work') setSessions(s => s + 1)
            // Auto notify
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification(mode === 'work' ? '🍅 Focus terminé !' : '☕ Break terminé !', {
                body: mode === 'work' ? 'Prends une pause !' : 'Retour au focus !',
              })
            }
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, mode])

  const toggle = () => setRunning(r => !r)
  const reset = () => { setTimeLeft(cfg.seconds); setRunning(false) }

  const requestNotif = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission()
    }
  }

  // Circular progress
  const r = 110
  const circ = 2 * Math.PI * r
  const dash = circ - (pct / 100) * circ

  return (
    <div className="min-h-screen flex flex-col" style={{ background: dark ? 'var(--t-bg)' : '#fdf6f0' }}>
      <div className="max-w-sm mx-auto w-full px-4 pt-8 pb-28 flex flex-col items-center gap-6">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--t-text-main)' }}>🍅 Pomodoro</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--t-text-muted)' }}>Sessions complétées : <strong style={{ color: cfg.color }}>{sessions}</strong></p>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 w-full">
          {(Object.entries(MODES) as [Mode, typeof MODES[Mode]][]).map(([key, val]) => (
            <button key={key} onClick={() => switchMode(key)}
              className="flex-1 py-2 rounded-2xl text-xs font-bold transition-all"
              style={{
                backgroundColor: mode === key ? cfg.color : (dark ? 'var(--t-item-bg)' : '#f3f4f6'),
                color: mode === key ? '#fff' : 'var(--t-text-muted)',
                boxShadow: mode === key ? `0 4px 14px ${cfg.color}55` : 'none',
              }}>
              {val.emoji} {val.label}
            </button>
          ))}
        </div>

        {/* Circular timer */}
        <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
          <svg width="260" height="260" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
            {/* Track */}
            <circle cx="130" cy="130" r={r} fill="none"
              stroke={dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}
              strokeWidth="12" />
            {/* Progress */}
            <circle cx="130" cy="130" r={r} fill="none"
              stroke={cfg.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          {/* Time display */}
          <div className="flex flex-col items-center">
            <span className="text-6xl font-black tabular-nums" style={{ color: 'var(--t-text-main)', letterSpacing: '-2px' }}>
              {fmt(timeLeft)}
            </span>
            <span className="text-sm font-semibold mt-1" style={{ color: cfg.color }}>{cfg.label}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 w-full">
          <button onClick={reset}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all active:scale-90"
            style={{ backgroundColor: dark ? 'var(--t-item-bg)' : '#f3f4f6', color: 'var(--t-text-muted)' }}>
            ↺
          </button>
          <button onClick={toggle}
            className="flex-1 h-12 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{
              background: running
                ? (dark ? 'var(--t-item-bg)' : '#f3f4f6')
                : `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`,
              color: running ? 'var(--t-text-main)' : '#fff',
              boxShadow: running ? 'none' : `0 6px 20px ${cfg.color}55`,
            }}>
            {running ? '⏸ Pause' : '▶ Démarrer'}
          </button>
          <button onClick={requestNotif}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all active:scale-90"
            style={{ backgroundColor: dark ? 'var(--t-item-bg)' : '#f3f4f6' }}
            title="Activer les notifications">
            🔔
          </button>
        </div>

        {/* Session dots */}
        <div className="flex gap-2 flex-wrap justify-center">
          {[...Array(Math.max(sessions, 4))].map((_, i) => (
            <div key={i}
              className="w-4 h-4 rounded-full transition-all"
              style={{ backgroundColor: i < sessions ? cfg.color : (dark ? 'var(--t-item-bg)' : '#e5e7eb') }} />
          ))}
        </div>

        {/* Tips */}
        <div className="w-full rounded-2xl p-4 text-sm" style={{ backgroundColor: dark ? 'var(--t-item-bg)' : '#fff', color: 'var(--t-text-muted)' }}>
          <p className="font-bold mb-2" style={{ color: 'var(--t-text-main)' }}>💡 Technique Pomodoro</p>
          <ul className="flex flex-col gap-1 text-xs">
            <li>🍅 <strong>25 min</strong> de focus intense</li>
            <li>☕ <strong>5 min</strong> de pause courte</li>
            <li>🛌 <strong>15 min</strong> de pause longue après 4 sessions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
