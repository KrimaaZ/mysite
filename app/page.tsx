'use client'

import Link from 'next/link'
import { useLang } from '@/lib/lang'
import { useTheme } from '@/lib/theme'

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  )
}

function IconSun() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  )
}

function IconMoon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

const CHIPS = [
  { label: 'Trading', icon: '📈', href: '/trading' },
  { label: 'Food',    icon: '🍽️', href: '/food'    },
  { label: 'Vault',   icon: '🔐', href: '/vault'   },
  { label: 'Routine', icon: '⚡', href: '/routine' },
]

export default function LandingPage() {
  const { lang, toggle } = useLang()
  const { theme, toggle: toggleTheme, dark, toggleDark } = useTheme()
  const isSB = theme === 'sb'

  const accent      = isSB ? '#FF2D95' : '#16a34a'
  const accentGlow  = isSB ? 'rgba(255,45,149,0.18)' : 'rgba(22,163,74,0.15)'
  const accentBorder= isSB ? 'rgba(255,45,149,0.35)' : 'rgba(22,163,74,0.35)'

  const bgDark  = `radial-gradient(circle at 20% 10%, ${isSB ? 'rgba(255,45,149,0.13)' : 'rgba(34,197,94,0.11)'} 0%, transparent 45%), radial-gradient(circle at 80% 80%, ${isSB ? 'rgba(255,45,149,0.08)' : 'rgba(34,197,94,0.07)'} 0%, transparent 45%), #000`
  const bgLight = isSB ? '#fdf2f8' : '#f4f9f5'
  const bg      = dark ? bgDark : bgLight

  const textPrimary = dark ? '#fff' : '#0f172a'
  const textSub     = dark ? '#ccc' : '#374151'
  const textMuted   = dark ? '#555' : '#9ca3af'
  const cardBg      = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
  const cardBorder  = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'

  const now     = new Date()
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' })
  const monthDay= now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  const glass = {
    background: cardBg,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${cardBorder}`,
  } as React.CSSProperties

  const btnGlass = {
    ...glass,
    width: 36, height: 36, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: dark ? '#aaa' : '#555',
  } as React.CSSProperties

  return (
    <div style={{ minHeight: '100svh', background: bg, color: textPrimary, maxWidth: 480, margin: '0 auto', transition: 'background 0.3s, color 0.3s' }}>

      {/* ── Header ── */}
      <div style={{ padding: '56px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: textSub }}>
          {lang === 'en' ? 'Hi, Zak 👋' : 'Salut, Zak 👋'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={toggleDark} style={btnGlass}>
            {dark ? <IconSun /> : <IconMoon />}
          </button>
          <button onClick={toggle} style={{ ...btnGlass, fontSize: 18 }}>
            {lang === 'en' ? '🇫🇷' : '🇺🇸'}
          </button>
          <button onClick={toggleTheme}
            style={{ ...btnGlass, background: accent, border: `1px solid ${accent}`, color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.03em' }}>
            {isSB ? 'SB' : 'ZK'}
          </button>
        </div>
      </div>

      {/* ── Date ── */}
      <div style={{ padding: '22px 20px 0' }}>
        <p style={{ margin: '0 0 3px', fontSize: 12, fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {weekday}
        </p>
        <h1 style={{ margin: 0, fontSize: 'clamp(2.4rem, 10vw, 3.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
          {monthDay}
        </h1>
      </div>

      {/* ── Search ── */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ ...glass, borderRadius: 14, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: textMuted, display: 'flex' }}><IconSearch /></span>
          <span style={{ color: textMuted, fontSize: 14 }}>{lang === 'en' ? 'Search sections…' : 'Rechercher…'}</span>
        </div>
      </div>

      {/* ── Category chips ── */}
      <div style={{ padding: '20px 0 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 10, padding: '0 20px', width: 'max-content' }}>
          {CHIPS.map(chip => (
            <Link key={chip.href} href={chip.href} style={{ textDecoration: 'none' }}>
              <div style={{ ...glass, borderRadius: 18, padding: '14px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, minWidth: 78, transition: 'opacity 0.15s' }}>
                <span style={{ fontSize: 26 }}>{chip.icon}</span>
                <span style={{ fontSize: 12, color: textSub, fontWeight: 500 }}>{chip.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Featured banner ── */}
      <div style={{ padding: '20px 20px 0' }}>
        <Link href="/trading" style={{ textDecoration: 'none' }}>
          <div style={{
            background: accentGlow,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${accentBorder}`,
            borderRadius: 22,
            padding: '22px 22px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* subtle glow blob */}
            <div style={{
              position: 'absolute', top: -30, right: -30,
              width: 120, height: 120,
              borderRadius: '50%',
              background: accentGlow,
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }} />

            <span style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(8px)',
              borderRadius: 7,
              padding: '3px 9px',
              fontSize: 11,
              color: '#888',
              marginBottom: 12,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}>
              📌 Today&apos;s Focus
            </span>

            <h2 style={{ margin: '0 0 5px', fontSize: 22, fontWeight: 700, color: textPrimary }}>
              Trading <span style={{ color: accent }}>Session</span>
            </h2>
            <p style={{ margin: '0 0 18px', fontSize: 13, color: textMuted }}>
              Checklist · Journal · Backtest
            </p>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: accent,
              borderRadius: 11,
              padding: '10px 20px',
              color: '#fff', fontWeight: 600, fontSize: 13,
            }}>
              Open →
            </div>
          </div>
        </Link>
      </div>

      {/* bottom padding for safe area */}
      <div style={{ height: 60 }} />
    </div>
  )
}
