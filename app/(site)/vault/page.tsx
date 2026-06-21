'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Entry = { id: number; app: string; login: string; password: string }

export default function VaultPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ app: '', login: '', password: '' })
  const [adding, setAdding] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)

  useEffect(() => {
    const token = sessionStorage.getItem('vault-token')
    if (!token) { router.replace('/'); return }
    fetch('/api/vault')
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false) })
  }, [router])

  const handleAdd = async () => {
    if (!form.app.trim() || !form.login.trim() || !form.password.trim()) return
    const res = await fetch('/api/vault', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const entry = await res.json()
    setEntries(prev => [...prev, entry])
    setForm({ app: '', login: '', password: '' })
    setAdding(false)
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/vault/${id}`, { method: 'DELETE' })
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const handleCopy = (id: number, password: string) => {
    navigator.clipboard.writeText(password)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('vault-token')
    router.replace('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--t-bg)' }}>
        <p style={{ color: 'var(--t-text-muted)' }}>Loading vault…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32 px-4 pt-10" style={{ backgroundColor: 'var(--t-bg)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--t-text-main)' }}>🔑 Vault</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--t-text-muted)' }}>Password manager — private</p>
          </div>
          <button onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-xs font-bold"
            style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
            Logout
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--t-border-soft)', backgroundColor: 'var(--t-card-bg)' }}>
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest border-b"
            style={{ color: 'var(--t-text-muted)', borderColor: 'var(--t-border-soft)', backgroundColor: 'var(--t-bg-soft)' }}>
            <span>App</span>
            <span>Login</span>
            <span>Password</span>
            <span></span>
          </div>

          {entries.length === 0 && (
            <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--t-text-muted)' }}>
              No entries yet. Add your first one below.
            </div>
          )}

          {entries.map(e => (
            <div key={e.id}
              className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center px-4 py-3.5 border-b"
              style={{ borderColor: 'var(--t-border-soft)' }}>
              <span className="text-sm font-semibold truncate" style={{ color: 'var(--t-text-main)' }}>{e.app}</span>
              <span className="text-sm truncate" style={{ color: 'var(--t-text-soft)' }}>{e.login}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm tracking-widest" style={{ color: 'var(--t-text-muted)' }}>••••••••</span>
                <button
                  onClick={() => handleCopy(e.id, e.password)}
                  title="Copy password"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0"
                  style={{ backgroundColor: copied === e.id ? 'var(--t-primary)' : 'var(--t-item-bg)' }}>
                  {copied === e.id ? (
                    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--t-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <button onClick={() => handleDelete(e.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
                style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                title="Delete">
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* Add entry */}
        <div className="mt-4">
          {adding ? (
            <div className="rounded-2xl p-4 flex flex-col gap-3 border"
              style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
              <div className="grid grid-cols-3 gap-2">
                <input
                  value={form.app} onChange={e => setForm(f => ({ ...f, app: e.target.value }))}
                  placeholder="App name" autoFocus
                  className="px-3 py-2 rounded-xl text-sm outline-none border"
                  style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-bg-soft)' }} />
                <input
                  value={form.login} onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
                  placeholder="Login"
                  className="px-3 py-2 rounded-xl text-sm outline-none border"
                  style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-bg-soft)' }} />
                <input
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Password" type="password"
                  onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
                  className="px-3 py-2 rounded-xl text-sm outline-none border"
                  style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-bg-soft)' }} />
              </div>
              <div className="flex gap-2">
                <button onClick={handleAdd}
                  className="flex-1 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: 'var(--t-primary)' }}>+ Save</button>
                <button onClick={() => { setAdding(false); setForm({ app: '', login: '', password: '' }) }}
                  className="px-4 py-2 rounded-xl text-sm font-bold"
                  style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)}
              className="w-full py-3 rounded-2xl text-sm font-bold border-2 border-dashed transition-all"
              style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-accent)' }}>
              + Add entry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
