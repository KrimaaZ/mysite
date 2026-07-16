'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLang } from '@/lib/lang'
import { useTheme } from '@/lib/theme'

function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  )
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

const BG = `
  radial-gradient(circle at 50% 15%, #063A2C 0%, transparent 45%),
  radial-gradient(circle at 15% 80%, #4D1734 0%, transparent 35%),
  radial-gradient(circle at 85% 85%, #5A2508 0%, transparent 35%),
  #050505
`.trim()

const GLASS: React.CSSProperties = {
  background: 'rgba(22,22,22,0.75)',
  backdropFilter: 'blur(25px)',
  WebkitBackdropFilter: 'blur(25px)',
  border: '1px solid rgba(255,255,255,0.12)',
}

export default function WelcomePage() {
  const { lang, t, toggle } = useLang()
  const { theme, toggle: toggleTheme, dark, toggleDark } = useTheme()
  const isSB = theme === 'sb'

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: BG }}>

      {/* ── Top bar ── */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-8">
        <button
          onClick={toggleTheme}
          className="font-black leading-none select-none"
          style={{ color: '#fff', fontSize: 'clamp(3rem, 12vw, 5rem)' }}
          title="Switch profile"
        >
          {isSB ? 'S' : 'Z'}
        </button>
        <div className="flex items-center gap-2">
          <button onClick={toggleDark}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ ...GLASS }}>
            {dark ? <IconSun /> : <IconMoon />}
          </button>
          <button onClick={toggle}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
            style={{ ...GLASS, color: '#fff' }}>
            {lang === 'en' ? 'FR' : 'EN'}
          </button>
        </div>
      </div>

      {/* ── Center: Logo ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl flex items-center justify-center overflow-hidden"
          style={{
            background: 'rgba(6,58,44,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          }}
        >
          {isSB ? (
            <span className="font-bold text-4xl tracking-tighter" style={{ color: '#74c69d' }}>SB</span>
          ) : (
            <Image src="/icon-512.png" alt="ZK" width={160} height={160} className="w-full h-full object-cover" priority />
          )}
        </div>
      </div>

      {/* ── Floating glass dock ── */}
      <div className="relative z-20 flex justify-center pb-8 px-6">
        <div className="w-full max-w-xs rounded-2xl p-2" style={GLASS}>
          <Link
            href="/raja"
            className="flex items-center justify-center w-full rounded-xl text-base font-bold transition-opacity active:opacity-80"
            style={{
              height: 48,
              background: 'linear-gradient(90deg, #76FF03, #FF2E88)',
              color: '#fff',
              letterSpacing: '0.06em',
            }}
          >
            {t.enter}
          </Link>
        </div>
      </div>
    </div>
  )
}
