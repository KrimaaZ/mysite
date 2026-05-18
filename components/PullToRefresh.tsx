'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const THRESHOLD = 80   // px to pull before triggering
const MAX_PULL  = 110  // max visual stretch

export default function PullToRefresh() {
  const router = useRouter()
  const [pullY, setPullY]       = useState(0)   // 0..MAX_PULL
  const [phase, setPhase]       = useState<'idle' | 'pulling' | 'releasing' | 'refreshing'>('idle')
  const startY  = useRef(0)
  const pulling = useRef(false)

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      // Only start if truly at top of scroll
      if (window.scrollY > 2) return
      startY.current = e.touches[0].clientY
      pulling.current = true
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current) return
      const dy = e.touches[0].clientY - startY.current
      if (dy <= 0) { setPullY(0); setPhase('idle'); return }
      // Elastic resistance: slow down after threshold
      const clamped = Math.min(dy * 0.5, MAX_PULL)
      setPullY(clamped)
      setPhase(clamped >= THRESHOLD * 0.5 ? 'pulling' : 'idle')
      if (dy > 8) e.preventDefault()          // prevent browser scroll-bounce
    }

    const onTouchEnd = () => {
      if (!pulling.current) return
      pulling.current = false
      if (pullY >= THRESHOLD * 0.5) {
        setPhase('refreshing')
        setPullY(52)                           // hold spinner visible
        setTimeout(() => {
          router.refresh()
          setTimeout(() => { setPullY(0); setPhase('idle') }, 600)
        }, 400)
      } else {
        setPhase('idle')
        setPullY(0)
      }
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove',  onTouchMove,  { passive: false })
    document.addEventListener('touchend',   onTouchEnd,   { passive: true })
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove',  onTouchMove)
      document.removeEventListener('touchend',   onTouchEnd)
    }
  }, [pullY, router])

  if (phase === 'idle' && pullY === 0) return null

  const progress  = Math.min(pullY / (THRESHOLD * 0.5), 1)   // 0→1
  const spinning  = phase === 'refreshing'
  const ready     = progress >= 1

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] flex justify-center pointer-events-none"
      style={{
        transform: `translateY(${pullY - 52}px)`,
        transition: phase === 'refreshing' || phase === 'idle' ? 'transform 0.3s ease' : 'none',
      }}>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
        style={{
          backgroundColor: 'var(--t-card-bg)',
          border: '1.5px solid var(--t-border-soft)',
          opacity: Math.max(0.3, progress),
          transform: `scale(${0.6 + progress * 0.4})`,
          transition: spinning ? 'none' : 'transform 0.1s, opacity 0.1s',
        }}>
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="var(--t-primary)" strokeWidth="2.5" strokeLinecap="round"
          style={{
            transform: `rotate(${spinning ? 0 : progress * 240}deg)`,
            animation: spinning ? 'ptr-spin 0.7s linear infinite' : 'none',
          }}>
          {spinning
            ? <><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 22a10 10 0 0 1-10-10" opacity=".3"/></>
            : ready
              ? <><polyline points="20 6 9 17 4 12"/></>
              : <><path d="M12 5v7"/><path d="M12 12l-3-3"/><path d="M12 12l3-3"/></>
          }
        </svg>
      </div>
      <style>{`@keyframes ptr-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
