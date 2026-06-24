'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function VaultLoginPopup({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/vault/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    })
    setLoading(false)
    if (res.ok) {
      sessionStorage.setItem('vault-token', 'vault-session-ok')
      onClose()
      router.push('/vault')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="w-80 rounded-3xl p-6 shadow-2xl"
        style={{ backgroundColor: 'var(--t-card-bg)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black" style={{ color: 'var(--t-text-main)' }}>🔑 Vault</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
            style={{ color: 'var(--t-text-muted)', backgroundColor: 'var(--t-item-bg)' }}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            value={login} onChange={e => setLogin(e.target.value)}
            placeholder="Login" autoFocus autoComplete="username"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none border"
            style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-bg-soft)' }} />
          <input
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" type="password" autoComplete="current-password"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none border"
            style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-bg-soft)' }} />
          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-2xl text-sm font-bold text-white mt-1"
            style={{ background: 'linear-gradient(135deg,var(--t-fab-from),var(--t-fab-to))', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
