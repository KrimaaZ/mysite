'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import { useTheme } from '@/lib/theme'
import VaultLoginPopup from '@/components/VaultLoginPopup'

const menuLinks = [
  { href: '/food',     label: 'Food',    emoji: '🍌' },
  { href: '/workout',  label: 'Workout', emoji: '💪' },
  { href: '/notes',    label: 'Spanish', emoji: '🇪🇸' },
  { href: '/trading',  label: 'Trading', emoji: '📈' },
  { href: '/raja',     label: 'Raja',    emoji: '🐾' },
  { href: '/routine',  label: 'Routine', emoji: '📋' },
]

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}

function IconBanana({ active }: { active: boolean }) {
  return (
    <span className="flex items-center justify-center" style={{
      width: 22, height: 22, fontSize: 19, lineHeight: 1,
      filter: active ? 'none' : 'grayscale(1)',
      opacity: active ? 1 : 0.55,
    }}>
      🍌
    </span>
  )
}

function IconDumbbell({ active }: { active: boolean }) {
  const c = active ? 'var(--t-primary)' : '#9ca3af'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h2"/>
      <path d="M5 9v6"/>
      <path d="M7 7v10"/>
      <path d="M7 12h10"/>
      <path d="M17 7v10"/>
      <path d="M19 9v6"/>
      <path d="M20 12h2"/>
    </svg>
  )
}

function IconChart({ active }: { active: boolean }) {
  const c = active ? 'var(--t-primary)' : '#9ca3af'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  )
}

function IconLetterS({ active }: { active: boolean }) {
  const c = active ? 'var(--t-primary)' : '#9ca3af'
  return (
    <span className="flex items-center justify-center"
      style={{ width: 22, height: 22, fontSize: 17, fontWeight: 800, color: c, lineHeight: 1 }}>
      S
    </span>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const { lang, toggle: toggleLang } = useLang()
  const { theme, toggle: toggleTheme, dark, toggleDark } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [vaultOpen, setVaultOpen] = useState(false)

  if (pathname === '/') return null

  const foodActive    = pathname.startsWith('/food')
  const workoutActive = pathname.startsWith('/workout')
  const spanishActive = pathname.startsWith('/notes')
  const tradingActive = pathname.startsWith('/trading')
  const isSB = theme === 'sb'

  return (
    <>
      {/* ── Bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50"
        style={{ backgroundColor: 'var(--t-card-bg)', boxShadow: '0 -1px 0 rgba(0,0,0,0.06), 0 -6px 24px rgba(0,0,0,0.05)' }}>
        <div className="flex h-16 items-center max-w-lg mx-auto px-4">
          <Link href="/food" className="flex-1 flex flex-col items-center justify-center gap-1">
            <IconBanana active={foodActive} />
          </Link>
          <Link href="/workout" className="flex-1 flex flex-col items-center justify-center gap-1">
            <IconDumbbell active={workoutActive} />
          </Link>
          <Link href="/notes" className="flex-1 flex flex-col items-center justify-center gap-1">
            <IconLetterS active={spanishActive} />
          </Link>
          <Link href="/trading" className="flex-1 flex flex-col items-center justify-center gap-1">
            <IconChart active={tradingActive} />
          </Link>
          <div className="flex-1 flex justify-center">
            <button onClick={() => setMenuOpen(m => !m)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--t-fab-from) 0%, var(--t-fab-to) 100%)',
                boxShadow: isSB ? '0 4px 14px rgba(236,72,153,0.4)' : '0 4px 14px rgba(22,163,74,0.4)',
              }}
              aria-label="Menu">
              <IconGrid />
            </button>
          </div>
        </div>
      </div>

      {/* ── Menu popup overlay ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center pb-20"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          onClick={() => setMenuOpen(false)}>
          <div className="w-full max-w-sm rounded-3xl p-5 mx-4"
            style={{ backgroundColor: 'var(--t-card-bg)', border: '1px solid', borderColor: 'var(--t-border-soft)', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}
            onClick={e => e.stopPropagation()}>

            {/* Nav links grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {menuLinks.map(link => {
                const active = pathname.startsWith(link.href)
                return (
                  <Link key={link.href} href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]"
                    style={{
                      backgroundColor: active ? 'var(--t-bg-soft)' : 'var(--t-item-bg)',
                      color: active ? 'var(--t-text-accent)' : 'var(--t-text-main)',
                      border: '1px solid',
                      borderColor: active ? 'var(--t-border)' : 'transparent',
                    }}>
                    <span className="text-lg">{link.emoji}</span>
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Settings row */}
            <div className="flex gap-2 pt-3 border-t" style={{ borderColor: 'var(--t-border-soft)' }}>
              <button onClick={toggleTheme}
                className="flex-1 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-1.5"
                style={{ background: 'linear-gradient(135deg,var(--t-fab-from),var(--t-fab-to))', color: '#fff' }}>
                {isSB ? '🟢 ZK' : '🩷 SB'}
              </button>
              <button onClick={toggleDark}
                className="w-11 h-11 rounded-2xl text-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--t-bg-soft)' }}>
                {dark ? '☀️' : '🌙'}
              </button>
              <button onClick={toggleLang}
                className="w-11 h-11 rounded-2xl text-xs font-bold flex items-center justify-center"
                style={{ backgroundColor: 'var(--t-bg-soft)', color: 'var(--t-text-accent)' }}>
                {lang === 'en' ? 'FR' : 'EN'}
              </button>
              <button onClick={() => { setMenuOpen(false); setVaultOpen(true) }}
                className="w-11 h-11 rounded-2xl text-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--t-bg-soft)' }}>
                🔑
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Vault login popup ── */}
      {vaultOpen && <VaultLoginPopup onClose={() => setVaultOpen(false)} />}
    </>
  )
}
