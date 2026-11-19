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
]

export default function LandingPage() {
  const { lang, toggle } = useLang()
  const { theme, toggle: toggleTheme, dark, toggleDark } = useTheme()
  const isSB = theme === 'sb'

  const accent       = isSB ? '#FF2D95' : (dark ? '#00D995' : '#00B978')
  const accentGlow   = isSB ? 'rgba(255,45,149,0.18)' : (dark ? 'rgba(0,217,149,0.15)' : 'rgba(0,185,120,0.15)')
  const accentBorder = isSB ? 'rgba(255,45,149,0.35)' : (dark ? 'rgba(0,217,149,0.35)' : 'rgba(0,185,120,0.3)')

  const bgDark  = isSB
    ? `radial-gradient(circle at 20% 10%, rgba(255,45,149,0.13) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,45,149,0.08) 0%, transparent 45%), #000`
    : `radial-gradient(circle at 15% 15%, rgba(0,107,70,0.5) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(5,39,24,0.8) 0%, transparent 50%), #020A08`
  const bgLight = isSB
    ? '#fdf2f8'
    : `radial-gradient(circle at 20% 10%, rgba(184,245,222,0.6) 0%, transparent 50%), #F7FBF9`
  const bg = dark ? bgDark : bgLight

  const textPrimary = dark ? '#F5F7F6' : '#052718'
  const textSub     = dark ? '#B8FFB4' : '#006B46'
  const textMuted   = dark ? 'rgba(245,247,246,0.4)' : 'rgba(5,39,24,0.45)'
  const cardBg      = dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'
  const cardBorder  = dark ? 'rgba(0,217,149,0.15)'   : 'rgba(0,185,120,0.2)'

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
    <div
      className="min-h-svh transition-colors duration-300"
      style={{ background: bg, color: textPrimary }}
    >
      {/* ── Centered container ── */}
      <div className="mx-auto px-5 max-w-sm md:max-w-5xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between pt-14 md:pt-16">
          <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: textSub }}>
            {lang === 'en' ? 'Welcome 👋' : 'Bienvenue 👋'}
          </p>
          <div className="flex items-center gap-2">
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

        {/* ── Desktop 2-col / Mobile single-col ── */}
        <div className="md:grid md:grid-cols-2 md:gap-12 md:items-center md:min-h-[calc(100svh-120px)]">

          {/* ── LEFT: Date + Search + Chips ── */}
          <div>
            {/* Date */}
            <div className="mt-6 md:mt-0">
              <p style={{ margin: '0 0 3px', fontSize: 12, fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {weekday}
              </p>
              <h1 style={{ margin: 0, fontSize: 'clamp(2.4rem, 8vw, 4rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                {monthDay}
              </h1>
            </div>

            {/* Search */}
            <div className="mt-5">
              <div style={{ ...glass, borderRadius: 14, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: textMuted, display: 'flex' }}><IconSearch /></span>
                <span style={{ color: textMuted, fontSize: 14 }}>
                  {lang === 'en' ? 'Search sections…' : 'Rechercher…'}
                </span>
              </div>
            </div>

            {/* Chips — scroll on mobile, 2×2 grid on desktop */}
            <div className="mt-5 md:hidden overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              <div style={{ display: 'flex', gap: 10, width: 'max-content' }}>
                {CHIPS.map(chip => (
                  <Link key={chip.href} href={chip.href} style={{ textDecoration: 'none' }}>
                    <div style={{ ...glass, borderRadius: 18, padding: '14px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, minWidth: 78 }}>
                      <span style={{ fontSize: 26 }}>{chip.icon}</span>
                      <span style={{ fontSize: 12, color: textSub, fontWeight: 500 }}>{chip.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Chips — 2×2 grid on desktop */}
            <div className="hidden md:grid grid-cols-2 gap-3 mt-5">
              {CHIPS.map(chip => (
                <Link key={chip.href} href={chip.href} style={{ textDecoration: 'none' }}>
                  <div style={{ ...glass, borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, transition: 'opacity 0.15s' }}>
                    <span style={{ fontSize: 28 }}>{chip.icon}</span>
                    <span style={{ fontSize: 14, color: textSub, fontWeight: 600 }}>{chip.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Featured banner ── */}
          <div className="mt-5 md:mt-0">
            <Link href="/trading" style={{ textDecoration: 'none' }}>
              <div style={{
                background: accentGlow,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${accentBorder}`,
                borderRadius: 22,
                padding: '28px 26px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* glow blob */}
                <div style={{
                  position: 'absolute', top: -40, right: -40,
                  width: 160, height: 160, borderRadius: '50%',
                  background: accentGlow, filter: 'blur(40px)',
                  pointerEvents: 'none',
                }} />

                <span style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 7, padding: '3px 9px',
                  fontSize: 11, color: '#888', marginBottom: 14,
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                }}>
                  📌 Today&apos;s Focus
                </span>

                <h2 style={{ margin: '0 0 6px', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, color: textPrimary }}>
                  Trading <span style={{ color: accent }}>Session</span>
                </h2>
                <p style={{ margin: '0 0 22px', fontSize: 14, color: textMuted }}>
                  Checklist · Journal
                </p>

                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: accent, borderRadius: 11,
                  padding: '11px 22px', color: '#fff', fontWeight: 600, fontSize: 14,
                }}>
                  Open →
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>

      {/* safe area bottom */}
      <div className="h-16 md:h-8" />
    </div>
  )
}
