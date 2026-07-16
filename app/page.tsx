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

export default function WelcomePage() {
  const { lang, t, toggle } = useLang()
  const { theme, toggle: toggleTheme, dark, toggleDark } = useTheme()
  const isSB = theme === 'sb'

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: isSB
          ? 'radial-gradient(ellipse at 50% 0%, #2a0f1f 0%, #1a0a16 35%, #1f1410 70%, #0d0805 100%)'
          : 'radial-gradient(ellipse at 50% 0%, #102a1f 0%, #0c1e16 35%, #1f1410 70%, #0d0805 100%)',
      }}
    >
      {/* Ambient blur orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full opacity-25"
          style={{ background: isSB ? '#ec4899' : '#40916c', filter: 'blur(90px)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-72 rounded-full opacity-30"
          style={{ background: '#c2410c', filter: 'blur(100px)' }} />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full opacity-20"
          style={{ background: '#ec4899', filter: 'blur(90px)' }} />
      </div>

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
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}
            title={dark ? 'Mode clair' : 'Mode sombre'}>
            {dark ? <IconSun /> : <IconMoon />}
          </button>
          <button onClick={toggle}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', color: '#fff' }}>
            {lang === 'en' ? 'FR' : 'EN'}
          </button>
        </div>
      </div>

      {/* ── Center: Logo ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl flex items-center justify-center overflow-hidden"
          style={{
            background: 'rgba(45,106,79,0.35)',
            border: '1px solid rgba(116,198,157,0.3)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          {isSB ? (
            <span className="font-bold text-4xl tracking-tighter" style={{ color: '#74c69d' }}>SB</span>
          ) : (
            <Image src="/icon-512.png" alt="ZK" width={160} height={160} className="w-full h-full object-cover" priority />
          )}
        </div>
      </div>

      {/* ── Bottom Enter bar — replaces navbar ── */}
      <div className="relative z-20 w-full">
        <Link
          href="/raja"
          className="flex items-center justify-center w-full text-base font-bold transition-opacity active:opacity-80"
          style={{ height: 64, backgroundColor: '#ec4899', color: '#fff', letterSpacing: '0.05em' }}
        >
          {t.enter}
        </Link>
      </div>
    </div>
  )
}
