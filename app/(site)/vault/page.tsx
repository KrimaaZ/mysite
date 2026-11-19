'use client'

import { useEffect, useRef, useState } from 'react'

type Entry = { id: number; app: string; login: string; password: string }

// 3×3 dot grid positions inside a 180×180 viewBox
const DOT_POS = Array.from({ length: 9 }, (_, i) => ({
  x: (i % 3) * 60 + 30,
  y: Math.floor(i / 3) * 60 + 30,
}))
// M shape: top-left → bottom-left → center → top-right → bottom-right
const M_PATTERN = [0, 6, 4, 2, 8]
const FACE_ID_KEY = 'vault-faceid-cred'

export default function VaultPage() {
  const [unlocked, setUnlocked] = useState(false)

  // Password auth
  const [loginForm, setLoginForm] = useState({ login: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Auth method tabs
  const [authMethod, setAuthMethod] = useState<'password' | 'pattern' | 'faceid'>('password')

  // Pattern auth
  const [patternDots, setPatternDots] = useState<number[]>([])
  const patternDotsRef = useRef<number[]>([])
  const patternDrawingRef = useRef(false)
  const [patternError, setPatternError] = useState(false)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Face ID auth
  const [faceIdError, setFaceIdError] = useState('')
  const [faceIdLoading, setFaceIdLoading] = useState(false)
  const [faceIdAvailable, setFaceIdAvailable] = useState(false)
  const [faceIdCred, setFaceIdCred] = useState<string | null>(null)

  // Vault content
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ app: '', login: '', password: '' })
  const [adding, setAdding] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)

  useEffect(() => {
    // Check existing session
    const token = sessionStorage.getItem('vault-token')
    if (token) {
      setUnlocked(true)
      setLoading(true)
      fetch('/api/vault').then(r => r.json()).then(data => { setEntries(data); setLoading(false) })
    }
    // Face ID availability
    if (typeof window !== 'undefined' && window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(ok => setFaceIdAvailable(ok)).catch(() => {})
    }
    setFaceIdCred(localStorage.getItem(FACE_ID_KEY))
  }, [])

  // ── Shared unlock ────────────────────────────────────────────
  const doUnlock = () => {
    sessionStorage.setItem('vault-token', 'vault-session-ok')
    setUnlocked(true)
    setLoading(true)
    fetch('/api/vault').then(r => r.json()).then(data => { setEntries(data); setLoading(false) })
  }

  // ── Password ─────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true); setLoginError('')
    const res = await fetch('/api/vault/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    })
    setLoginLoading(false)
    if (res.ok) { doUnlock() } else { setLoginError('Identifiants incorrects') }
  }

  // ── Pattern helpers ──────────────────────────────────────────
  const getSvgCoords = (cx: number, cy: number) => {
    if (!svgRef.current) return null
    const r = svgRef.current.getBoundingClientRect()
    return { x: ((cx - r.left) / r.width) * 180, y: ((cy - r.top) / r.height) * 180 }
  }
  const getDotAt = (x: number, y: number) =>
    DOT_POS.findIndex(d => Math.hypot(x - d.x, y - d.y) < 22)

  const startPattern = (cx: number, cy: number) => {
    const pt = getSvgCoords(cx, cy)
    if (!pt) return
    const dot = getDotAt(pt.x, pt.y)
    if (dot === -1) return
    patternDrawingRef.current = true
    patternDotsRef.current = [dot]
    setPatternDots([dot])
    setPatternError(false)
    setCursorPos(pt)
  }

  const movePattern = (cx: number, cy: number) => {
    if (!patternDrawingRef.current) return
    const pt = getSvgCoords(cx, cy)
    if (!pt) return
    setCursorPos(pt)
    const dot = getDotAt(pt.x, pt.y)
    if (dot !== -1 && !patternDotsRef.current.includes(dot)) {
      patternDotsRef.current = [...patternDotsRef.current, dot]
      setPatternDots([...patternDotsRef.current])
    }
  }

  const endPattern = () => {
    if (!patternDrawingRef.current) return
    patternDrawingRef.current = false
    setCursorPos(null)
    const dots = patternDotsRef.current
    patternDotsRef.current = []
    if (dots.length === M_PATTERN.length && dots.every((d, i) => d === M_PATTERN[i])) {
      doUnlock()
    } else if (dots.length > 0) {
      setPatternError(true)
      setTimeout(() => { setPatternDots([]); setPatternError(false) }, 800)
    } else {
      setPatternDots([])
    }
  }

  // ── Face ID (WebAuthn) ───────────────────────────────────────
  const handleFaceId = async () => {
    setFaceIdLoading(true); setFaceIdError('')
    try {
      const rpId = window.location.hostname
      const challenge = crypto.getRandomValues(new Uint8Array(32))

      if (!faceIdCred) {
        // First time: register
        const cred = await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: { name: 'Vault', id: rpId },
            user: { id: new Uint8Array([1]), name: 'vault', displayName: 'Vault' },
            pubKeyCredParams: [
              { type: 'public-key', alg: -7 },
              { type: 'public-key', alg: -257 },
            ],
            authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
            timeout: 60000,
          },
        }) as PublicKeyCredential | null
        if (!cred) throw new Error('Annulé')
        const credId = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)))
        localStorage.setItem(FACE_ID_KEY, credId)
        setFaceIdCred(credId)
        doUnlock()
      } else {
        // Subsequent: authenticate
        const credIdBytes = new Uint8Array(atob(faceIdCred).split('').map(c => c.charCodeAt(0)))
        const ok = await navigator.credentials.get({
          publicKey: {
            challenge,
            rpId,
            userVerification: 'required',
            allowCredentials: [{ type: 'public-key', id: credIdBytes, transports: ['internal'] }],
            timeout: 60000,
          },
        })
        if (!ok) throw new Error('Échec biométrique')
        doUnlock()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur'
      if (!/cancel|Cancel|user/i.test(msg)) setFaceIdError(msg)
    } finally {
      setFaceIdLoading(false)
    }
  }

  // ── Vault CRUD ───────────────────────────────────────────────
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
    setUnlocked(false)
    setEntries([])
  }

  // ── Login screen ─────────────────────────────────────────────
  if (!unlocked) {
    const accent = 'var(--t-primary)'

    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: 'var(--t-bg)' }}>
        <div className="w-full max-w-sm rounded-3xl p-8 border"
          style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>

          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔑</div>
            <h1 className="text-xl font-black" style={{ color: 'var(--t-text-main)' }}>Vault</h1>
          </div>

          {/* Auth method tabs */}
          <div className="flex gap-1 p-1 rounded-2xl mb-6"
            style={{ backgroundColor: 'var(--t-bg-soft)' }}>
            {[
              { key: 'password', label: '🔒 Mot de passe' },
              { key: 'pattern',  label: '✳️ Schéma' },
              ...(faceIdAvailable ? [{ key: 'faceid', label: '👁 Face ID' }] : []),
            ].map(tab => (
              <button key={tab.key}
                onClick={() => {
                  setAuthMethod(tab.key as 'password' | 'pattern' | 'faceid')
                  setPatternDots([]); setPatternError(false)
                }}
                style={{
                  flex: 1,
                  padding: '8px 2px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: authMethod === tab.key ? accent : 'transparent',
                  color: authMethod === tab.key ? '#fff' : 'var(--t-text-muted)',
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Password tab ── */}
          {authMethod === 'password' && (
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                type="text" placeholder="Login"
                value={loginForm.login}
                onChange={e => setLoginForm(f => ({ ...f, login: e.target.value }))}
                autoFocus
                className="px-4 py-3 rounded-2xl text-sm outline-none border"
                style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-bg-soft)' }}
              />
              <input
                type="password" placeholder="Mot de passe"
                value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                className="px-4 py-3 rounded-2xl text-sm outline-none border"
                style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-bg-soft)' }}
              />
              {loginError && <p className="text-xs text-center" style={{ color: '#dc2626' }}>{loginError}</p>}
              <button type="submit" disabled={loginLoading}
                className="py-3 rounded-2xl text-sm font-bold text-white mt-1"
                style={{ backgroundColor: accent, opacity: loginLoading ? 0.6 : 1 }}>
                {loginLoading ? 'Vérification…' : 'Entrer'}
              </button>
            </form>
          )}

          {/* ── Pattern tab ── */}
          {authMethod === 'pattern' && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs" style={{ color: 'var(--t-text-muted)' }}>
                Tracez la lettre <strong style={{ color: 'var(--t-text-main)' }}>M</strong>
              </p>
              <div style={{ touchAction: 'none', userSelect: 'none' }}>
                <svg
                  ref={svgRef}
                  viewBox="0 0 180 180"
                  width={192} height={192}
                  style={{ display: 'block', cursor: 'crosshair' }}
                  onMouseDown={e => startPattern(e.clientX, e.clientY)}
                  onMouseMove={e => movePattern(e.clientX, e.clientY)}
                  onMouseUp={endPattern}
                  onMouseLeave={endPattern}
                  onTouchStart={e => { e.preventDefault(); startPattern(e.touches[0].clientX, e.touches[0].clientY) }}
                  onTouchMove={e => { e.preventDefault(); movePattern(e.touches[0].clientX, e.touches[0].clientY) }}
                  onTouchEnd={endPattern}
                >
                  <rect width={180} height={180} rx={20} fill="var(--t-bg-soft)" />

                  {/* Lines between visited dots */}
                  {patternDots.slice(0, -1).map((dot, i) => {
                    const a = DOT_POS[dot], b = DOT_POS[patternDots[i + 1]]
                    return (
                      <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                        stroke={patternError ? '#dc2626' : accent}
                        strokeWidth={3} strokeLinecap="round" strokeOpacity={0.75} />
                    )
                  })}

                  {/* Trailing line to cursor */}
                  {patternDrawingRef.current && cursorPos && patternDots.length > 0 && (
                    <line
                      x1={DOT_POS[patternDots[patternDots.length - 1]].x}
                      y1={DOT_POS[patternDots[patternDots.length - 1]].y}
                      x2={cursorPos.x} y2={cursorPos.y}
                      stroke={accent} strokeWidth={2} strokeOpacity={0.4} strokeDasharray="4 3" />
                  )}

                  {/* Dots */}
                  {DOT_POS.map((pos, i) => {
                    const active = patternDots.includes(i)
                    const col = patternError ? '#dc2626' : accent
                    return (
                      <g key={i}>
                        {/* Hit area */}
                        <circle cx={pos.x} cy={pos.y} r={22} fill="transparent" />
                        {/* Outer ring on active */}
                        {active && (
                          <circle cx={pos.x} cy={pos.y} r={18}
                            fill="none" stroke={col} strokeWidth={1.5} strokeOpacity={0.35} />
                        )}
                        {/* Dot */}
                        <circle cx={pos.x} cy={pos.y} r={active ? 10 : 6}
                          fill={active ? col : 'var(--t-border)'}
                          style={{ transition: 'r 0.12s, fill 0.12s' }} />
                      </g>
                    )
                  })}
                </svg>
              </div>
              {patternError && (
                <p className="text-xs" style={{ color: '#dc2626' }}>Schéma incorrect</p>
              )}
            </div>
          )}

          {/* ── Face ID tab ── */}
          {authMethod === 'faceid' && (
            <div className="flex flex-col items-center gap-5">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--t-bg-soft)', fontSize: 48 }}>
                👁
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold" style={{ color: 'var(--t-text-main)' }}>
                  {faceIdCred ? 'Déverrouiller avec Face ID' : 'Configurer Face ID'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--t-text-muted)' }}>
                  {faceIdCred
                    ? 'Utilisez votre biométrie pour accéder au vault'
                    : 'Enregistrez votre visage pour un accès rapide'}
                </p>
              </div>
              {faceIdError && <p className="text-xs" style={{ color: '#dc2626' }}>{faceIdError}</p>}
              <button
                onClick={handleFaceId}
                disabled={faceIdLoading}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white"
                style={{ backgroundColor: accent, opacity: faceIdLoading ? 0.6 : 1 }}>
                {faceIdLoading ? 'Vérification…' : faceIdCred ? 'Déverrouiller' : 'Configurer'}
              </button>
              {faceIdCred && (
                <button
                  onClick={() => { localStorage.removeItem(FACE_ID_KEY); setFaceIdCred(null) }}
                  className="text-xs"
                  style={{ color: 'var(--t-text-muted)' }}>
                  Réinitialiser Face ID
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Vault content ─────────────────────────────────────────────
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
        <div className="rounded-2xl overflow-hidden border"
          style={{ borderColor: 'var(--t-border-soft)', backgroundColor: 'var(--t-card-bg)' }}>
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest border-b"
            style={{ color: 'var(--t-text-muted)', borderColor: 'var(--t-border-soft)', backgroundColor: 'var(--t-bg-soft)' }}>
            <span>App</span><span>Login</span><span>Password</span><span></span>
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
                <button onClick={() => handleCopy(e.id, e.password)} title="Copy password"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0"
                  style={{ backgroundColor: copied === e.id ? 'var(--t-primary)' : 'var(--t-item-bg)' }}>
                  {copied === e.id
                    ? <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--t-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              <button onClick={() => handleDelete(e.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
                style={{ backgroundColor: '#fee2e2', color: '#dc2626' }} title="Delete">
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
                <input value={form.app} onChange={e => setForm(f => ({ ...f, app: e.target.value }))}
                  placeholder="App name" autoFocus
                  className="px-3 py-2 rounded-xl text-sm outline-none border"
                  style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-bg-soft)' }} />
                <input value={form.login} onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
                  placeholder="Login"
                  className="px-3 py-2 rounded-xl text-sm outline-none border"
                  style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-bg-soft)' }} />
                <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
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
