'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import { useTheme } from '@/lib/theme'
import VaultLoginPopup from '@/components/VaultLoginPopup'

const quickLinks = [
  { href: '/food',     label: '🍌 Food'     },
  { href: '/workout',  label: '💪 Workout'  },
  { href: '/notes',    label: '🇪🇸 Spanish' },
  { href: '/trading',  label: '📈 Trading'  },
  { href: '/raja',     label: '🐾 Raja'     },
  { href: '/pomodoro', label: '🍅 Pomodoro' },
]

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

function IconKey() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  )
}

function IconHome({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? '#fff' : 'none'}
      stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function IconGrid({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={active ? '#fff' : 'rgba(255,255,255,0.6)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}

export default function WelcomePage() {
  const { lang, t, toggle } = useLang()
  const { theme, toggle: toggleTheme, dark, toggleDark } = useTheme()
  const [vaultOpen, setVaultOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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
          style={{ background: '#7c3aed', filter: 'blur(90px)' }} />
      </div>

      {/* ── Top bar ── */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-8">
        <button onClick={toggleTheme}
          className="font-black text-3xl leading-none"
          style={{ color: '#fff' }}
          title="Switch profile">
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

      {/* ── Center content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 gap-6">
        {/* Logo */}
        <div
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center overflow-hidden"
          style={{
            background: 'rgba(45,106,79,0.35)',
            border: '1px solid rgba(116,198,157,0.3)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          {isSB ? (
            <span className="font-bold text-4xl tracking-tighter" style={{ color: '#74c69d' }}>SB</span>
          ) : (
            <Image src="/icon-512.png" alt="ZK" width={128} height={128} className="w-full h-full object-cover" priority />
          )}
        </div>

        {/* Enter button — half width, centered */}
        <Link
          href="/raja"
          className="px-10 py-3.5 rounded-full text-sm font-semibold transition-transform active:scale-[0.97]"
          style={{ backgroundColor: '#6d28d9', color: '#fff', boxShadow: '0 6px 24px rgba(109,40,217,0.45)' }}
        >
          {t.enter}
        </Link>
      </div>

      {/* ── Menu popup overlay ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center pb-28"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={() => setMenuOpen(false)}>
          <div
            className="w-full max-w-sm rounded-3xl p-5 mx-4"
            style={{ backgroundColor: 'rgba(30,30,35,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={e => e.stopPropagation()}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-center"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              {t.menu}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map(item => (
                <Link key={item.href} href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: '#fff' }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom pill nav: Home | 🔑 | Menu ── */}
      <div className="relative z-20 flex justify-center pb-8 px-6">
        <div className="flex rounded-full p-1 gap-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          {/* Home */}
          <button onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={{ backgroundColor: !menuOpen ? 'rgba(255,255,255,0.18)' : 'transparent', color: '#fff' }}>
            <IconHome active={!menuOpen} />
            {t.home}
          </button>

          {/* Vault key — centre */}
          <button onClick={() => setVaultOpen(true)}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'linear-gradient(135deg,var(--t-fab-from),var(--t-fab-to))', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}
            title="Vault">
            <IconKey />
          </button>

          {/* Menu */}
          <button onClick={() => setMenuOpen(m => !m)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={{ backgroundColor: menuOpen ? 'rgba(255,255,255,0.18)' : 'transparent', color: menuOpen ? '#fff' : 'rgba(255,255,255,0.65)' }}>
            <IconGrid active={menuOpen} />
            {t.menu}
          </button>
        </div>
      </div>

      {/* ── Vault login popup ── */}
      {vaultOpen && <VaultLoginPopup onClose={() => setVaultOpen(false)} />}
    </div>
  )
}
