'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import { useTheme } from '@/lib/theme'
import VaultLoginPopup from '@/components/VaultLoginPopup'

const quickLinks = [
  { href: '/food',     label: '🍌 Food',     cls: 'btn-glass-green'   },
  { href: '/workout',  label: '💪 Workout',  cls: 'btn-glass-brown'   },
  { href: '/notes',    label: '🇪🇸 Spanish', cls: 'btn-glass-red'     },
  { href: '/trading',  label: '📈 Trading',  cls: 'btn-glass-gold'    },
  { href: '/raja',     label: '🐾 Raja',     cls: 'btn-glass-neutral' },
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  )
}

function IconHomeFilled() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
      <path d="m12 3 9 8h-2v9h-5v-6H10v6H5v-9H3z"/>
    </svg>
  )
}

function IconGridSmall({ active }: { active: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke={active ? '#fff' : 'rgba(255,255,255,0.55)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}

function IconScan() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V4a1 1 0 0 1 1-1h3M3 17v3a1 1 0 0 0 1 1h3M21 7V4a1 1 0 0 0-1-1h-3M21 17v3a1 1 0 0 1-1 1h-3"/>
      <path d="M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0"/>
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
      {/* Ambient blur orbs to fake a moody background photo */}
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
          <button onClick={() => setVaultOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}
            title="Vault">
            <IconKey />
          </button>
          <button onClick={toggle}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', color: '#fff' }}>
            {lang === 'en' ? 'FR' : 'EN'}
          </button>
        </div>
      </div>

      {/* ── Center content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center mb-7 overflow-hidden"
          style={{
            background: 'rgba(45,106,79,0.35)',
            border: '1px solid rgba(116,198,157,0.3)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          {isSB ? (
            <span className="font-bold text-4xl tracking-tighter" style={{ color: '#74c69d' }}>SB</span>
          ) : (
            <Image src="/icon-512.png" alt="ZK" width={112} height={112} className="w-full h-full object-cover" priority />
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2" style={{ color: '#fff' }}>
          « {t.tagline} »
        </h1>
        <p className="text-sm sm:text-base" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {t.subtitle}
        </p>
      </div>

      {/* ── Quick links sheet (toggled by Menu tab) ── */}
      {menuOpen && (
        <div className="relative z-20 flex flex-wrap justify-center gap-2 px-6 pb-4">
          {quickLinks.map(item => (
            <Link key={item.href} href={item.href}
              className={`btn-glass ${item.cls} px-4 py-2.5 rounded-xl text-sm font-medium`}>
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* ── CTA row ── */}
      <div className="relative z-20 flex items-center gap-3 px-6 pb-5">
        <Link
          href="/raja"
          className="flex-1 text-center py-4 rounded-full text-base font-semibold transition-transform active:scale-[0.98]"
          style={{ backgroundColor: '#6d28d9', color: '#fff', boxShadow: '0 8px 28px rgba(109,40,217,0.45)' }}
        >
          {t.enter}
        </Link>
        <button
          onClick={() => setVaultOpen(true)}
          className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}
          title="Vault">
          <IconScan />
        </button>
      </div>

      {/* ── Bottom pill nav ── */}
      <div className="relative z-20 flex justify-center pb-8 px-6">
        <div className="flex rounded-full p-1 gap-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
          <button onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={{ backgroundColor: !menuOpen ? 'rgba(255,255,255,0.18)' : 'transparent', color: '#fff' }}>
            <IconHomeFilled />
            {t.home}
          </button>
          <button onClick={() => setMenuOpen(m => !m)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={{ backgroundColor: menuOpen ? 'rgba(255,255,255,0.18)' : 'transparent', color: menuOpen ? '#fff' : 'rgba(255,255,255,0.75)' }}>
            <IconGridSmall active={menuOpen} />
            {t.menu}
          </button>
        </div>
      </div>

      {/* ── Vault login popup ── */}
      {vaultOpen && <VaultLoginPopup onClose={() => setVaultOpen(false)} />}
    </div>
  )
}
