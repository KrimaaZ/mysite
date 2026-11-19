'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import { useTheme } from '@/lib/theme'
import VaultLoginPopup from '@/components/VaultLoginPopup'

const NAV_ITEMS = [
  { href: '/',        emoji: '🏠', label: 'Home'    },
  { href: '/trading', emoji: '📈', label: 'Trading' },
  { href: '/food',    emoji: '🍽️', label: 'Food'    },
  { href: '/vault',   emoji: '🔐', label: 'Vault'   },
]

const MENU_LINKS = [
  { href: '/',        emoji: '🏠', label: 'Home'    },
  { href: '/trading', emoji: '📈', label: 'Trading' },
  { href: '/food',    emoji: '🍽️', label: 'Food'    },
  { href: '/vault',   emoji: '🔐', label: 'Vault'   },
]

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const { lang, toggle: toggleLang } = useLang()
  const { theme, toggle: toggleTheme, dark, toggleDark } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [vaultOpen, setVaultOpen] = useState(false)

  if (pathname === '/') return null

  const isSB = theme === 'sb'
  const accent = isSB ? '#FF2D95' : 'var(--t-primary)'
  const accentGlow = isSB ? 'rgba(255,45,149,0.4)' : 'rgba(0,217,149,0.3)'

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/* ── Floating glass dock ── */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
        <div
          className="flex items-center rounded-2xl px-3 py-2.5 gap-1"
          style={{
            background: dark
              ? 'rgba(2,10,8,0.75)'
              : 'rgba(247,251,249,0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${dark ? 'rgba(0,217,149,0.15)' : 'rgba(0,185,120,0.2)'}`,
            boxShadow: `0 8px 32px ${dark ? 'rgba(0,0,0,0.5)' : 'rgba(0,107,70,0.1)'}`,
          }}
        >
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="w-11 h-11 flex items-center justify-center rounded-xl transition-all active:scale-90"
                style={{
                  background: active
                    ? (dark ? 'rgba(0,217,149,0.15)' : 'rgba(0,185,120,0.12)')
                    : 'transparent',
                }}
              >
                <span style={{
                  fontSize: 20,
                  filter: active ? 'none' : 'grayscale(1)',
                  opacity: active ? 1 : 0.5,
                  transition: 'all 0.2s',
                }}>
                  {item.emoji}
                </span>
              </Link>
            )
          })}

          {/* Menu button */}
          <button
            onClick={() => setMenuOpen(m => !m)}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform active:scale-90 hover:scale-105 ml-1"
            style={{
              backgroundColor: accent,
              color: '#fff',
              boxShadow: `0 0 16px ${accentGlow}`,
            }}
            aria-label="Menu"
          >
            <IconGrid />
          </button>
        </div>
      </div>

      {/* ── Menu popup overlay ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center pb-28"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)' }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-5 mx-4"
            style={{
              background: dark ? 'rgba(2,10,8,0.97)' : 'rgba(247,251,249,0.97)',
              border: `1px solid ${dark ? 'rgba(0,217,149,0.15)' : 'rgba(0,185,120,0.2)'}`,
              boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-center"
              style={{ color: 'var(--t-text-soft)' }}>
              Menu
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {MENU_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]"
                  style={{
                    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                    color: 'var(--t-text-main)',
                  }}
                >
                  <span className="text-lg">{link.emoji}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Settings row */}
            <div className="flex gap-2 pt-3 border-t" style={{ borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
              <button
                onClick={toggleTheme}
                className="flex-1 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-1.5"
                style={{ background: `linear-gradient(135deg,var(--t-fab-from),var(--t-fab-to))`, color: '#fff' }}
              >
                {isSB ? '🟢 ZK' : '🩷 SB'}
              </button>
              <button
                onClick={toggleDark}
                className="w-11 h-11 rounded-2xl text-lg flex items-center justify-center"
                style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
              >
                {dark ? '☀️' : '🌙'}
              </button>
              <button
                onClick={toggleLang}
                className="w-11 h-11 rounded-2xl text-base flex items-center justify-center"
                style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
              >
                {lang === 'en' ? '🇫🇷' : '🇺🇸'}
              </button>
              <button
                onClick={() => { setMenuOpen(false); setVaultOpen(true) }}
                className="w-11 h-11 rounded-2xl text-lg flex items-center justify-center"
                style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
              >
                🔑
              </button>
            </div>
          </div>
        </div>
      )}

      {vaultOpen && <VaultLoginPopup onClose={() => setVaultOpen(false)} />}
    </>
  )
}
