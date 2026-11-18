'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/lib/theme'

const CHIPS = [
  { label: 'Trading', icon: '📈', href: '/trading' },
  { label: 'Food',    icon: '🍽️', href: '/food'    },
  { label: 'Vault',   icon: '🔐', href: '/vault'   },
  { label: 'Routine', icon: '⚡', href: '/routine' },
]

export default function QuickNav() {
  const pathname = usePathname()
  const { dark } = useTheme()

  return (
    <div
      className="overflow-x-auto"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
    >
      <div className="flex gap-2 px-4 py-3" style={{ width: 'max-content' }}>
        {CHIPS.map(chip => {
          const active = pathname.startsWith(chip.href)
          return (
            <Link key={chip.href} href={chip.href} style={{ textDecoration: 'none' }}>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-2xl transition-all active:scale-95"
                style={{
                  background: active
                    ? 'var(--t-primary)'
                    : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                  border: active
                    ? '1px solid transparent'
                    : `1px solid ${dark ? 'rgba(0,217,149,0.15)' : 'rgba(0,185,120,0.2)'}`,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <span style={{
                  fontSize: 16,
                  filter: active ? 'none' : 'grayscale(0.3)',
                }}>
                  {chip.icon}
                </span>
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: active ? '#fff' : 'var(--t-text-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {chip.label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
