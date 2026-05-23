'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'

type Trade = { id: number; date: string; instrument: string; type: string; entry: number; exit: number | null; size: number; pnl: number | null; notes: string | null; status: string }
type Strategy = { id: number; name: string; description: string; rules: string; timeframe: string; winRate: number | null; riskReward: number | null; notes: string | null }

const emptyTrade = { date: new Date().toISOString().split('T')[0], instrument: '', type: 'LONG', entry: '', exit: '', size: '', pnl: '', notes: '', status: 'OPEN' }
const emptyStrategy = { name: '', description: '', rules: '', timeframe: '', winRate: '', riskReward: '', notes: '' }

// ── Pre-Trade Checklist ────────────────────────────────────────────────────
const DEFAULT_CHECKS = [
  { id: 'trend',    label: 'Trend confirmed 4H TF' },
  { id: 'volume',   label: 'Volume above average' },
  { id: 'sr',       label: 'Support / Resistance clear' },
  { id: 'entry',    label: 'Entry price defined' },
  { id: 'sl',       label: 'Stop Loss placed' },
  { id: 'tp',       label: 'Take Profit target set' },
  { id: 'rr',       label: 'R:R ≥ 2' },
  { id: 'news',     label: 'No major news incoming' },
]
const PRE_CHECK_KEY = 'pre-trade-checklist-v1'

const BIAS_BTNS = [
  { key: 'bull', label: 'Bull', color: '#22c55e' },
  { key: 'bear', label: 'Bear', color: '#e84057' },
  { key: 'cons', label: 'Cons', color: '#f59e0b' },
]

function PreTradeTab() {
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [bias, setBias] = useState<string | null>(null)

  useEffect(() => {
    try { setChecks(JSON.parse(localStorage.getItem(PRE_CHECK_KEY) || '{}')) } catch { /**/ }
    try { setBias(localStorage.getItem(PRE_CHECK_KEY + '-bias') || null) } catch { /**/ }
  }, [])

  const toggle = (id: string) => {
    const next = { ...checks, [id]: !checks[id] }
    setChecks(next)
    localStorage.setItem(PRE_CHECK_KEY, JSON.stringify(next))
  }

  const toggleBias = (key: string) => {
    const next = bias === key ? null : key
    setBias(next)
    if (next) localStorage.setItem(PRE_CHECK_KEY + '-bias', next)
    else localStorage.removeItem(PRE_CHECK_KEY + '-bias')
  }

  const reset = () => {
    setChecks({}); setBias(null)
    localStorage.removeItem(PRE_CHECK_KEY)
    localStorage.removeItem(PRE_CHECK_KEY + '-bias')
  }

  const done = DEFAULT_CHECKS.filter(c => checks[c.id]).length
  const allGood = done === DEFAULT_CHECKS.length

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: allGood ? '#22c55e' : 'var(--t-border-soft)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#b8860b' }}>🎯 Pre-Trade Checklist</p>
          <button onClick={reset} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>Reset</button>
        </div>
        {/* Progress bar */}
        <div className="h-2 rounded-full overflow-hidden mb-1" style={{ backgroundColor: 'var(--t-item-bg)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(done / DEFAULT_CHECKS.length) * 100}%`, background: allGood ? '#22c55e' : 'linear-gradient(90deg,#d4a017,#b8860b)' }} />
        </div>
        <p className="text-xs font-semibold" style={{ color: allGood ? '#16a34a' : 'var(--t-text-muted)' }}>
          {allGood ? '✅ Ready to trade!' : `${done} / ${DEFAULT_CHECKS.length} conditions`}
        </p>
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-2">
        {DEFAULT_CHECKS.map(c => (
          <div key={c.id}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all"
            style={{
              backgroundColor: checks[c.id] ? 'rgba(34,197,94,0.08)' : 'var(--t-card-bg)',
              borderColor: checks[c.id] ? '#22c55e' : 'var(--t-border-soft)',
            }}>
            {/* Checkbox */}
            <button onClick={() => toggle(c.id)}
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
              style={{ borderColor: checks[c.id] ? '#22c55e' : '#d1d5db', backgroundColor: checks[c.id] ? '#22c55e' : 'transparent' }}>
              {checks[c.id] && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>}
            </button>
            {/* Label */}
            <span onClick={() => toggle(c.id)} className="text-sm font-semibold flex-1 cursor-pointer"
              style={{ color: checks[c.id] ? '#16a34a' : 'var(--t-text-main)', textDecoration: checks[c.id] ? 'line-through' : 'none' }}>
              {c.label}
            </span>
            {/* Bias btns — only on trend row */}
            {c.id === 'trend' && (
              <div className="flex gap-1 shrink-0">
                {BIAS_BTNS.map(b => (
                  <button key={b.key} onClick={() => toggleBias(b.key)}
                    className="rounded-lg font-bold transition-all active:scale-95"
                    style={{
                      fontSize: 10,
                      padding: '2px 7px',
                      border: `1.5px solid ${b.color}`,
                      backgroundColor: bias === b.key ? `${b.color}73` : 'transparent',
                      color: bias === b.key ? '#fff' : b.color,
                      whiteSpace: 'nowrap',
                    }}>
                    {b.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Checker types ─────────────────────────────────────────────────────────
type CheckerItem = { id: string; title: string; plus: number; minus: number }
const CHECKER_KEY = 'trading-checker-v1'
function loadChecker(): CheckerItem[] {
  try { return JSON.parse(localStorage.getItem(CHECKER_KEY) || '[]') } catch { return [] }
}
function saveChecker(items: CheckerItem[]) {
  localStorage.setItem(CHECKER_KEY, JSON.stringify(items))
}

// ── Checker tab component ──────────────────────────────────────────────────
function CheckerTab() {
  const [items, setItems] = useState<CheckerItem[]>([])
  const [input, setInput] = useState('')

  useEffect(() => { setItems(loadChecker()) }, [])

  const add = () => {
    if (!input.trim()) return
    const next = [...items, { id: Date.now().toString(), title: input.trim(), plus: 0, minus: 0 }]
    setItems(next); saveChecker(next); setInput('')
  }

  const update = (id: string, field: 'plus' | 'minus', delta: number) => {
    const next = items.map(i => i.id === id ? { ...i, [field]: Math.max(0, i[field] + delta) } : i)
    setItems(next); saveChecker(next)
  }

  const remove = (id: string) => {
    const next = items.filter(i => i.id !== id)
    setItems(next); saveChecker(next)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Add form ── */}
      <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#b8860b' }}>✚ New Checker</p>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') add() }}
            placeholder="Checker title..."
            className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: 'var(--t-border-soft)', backgroundColor: 'var(--t-input-bg)', color: 'var(--t-text-main)' }}
          />
          <button
            onClick={add}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg,#d4a017,#b8860b)', boxShadow: '0 4px 12px rgba(184,134,11,0.3)' }}
          >
            Confirm
          </button>
        </div>
      </div>

      {/* ── Checker cards ── */}
      {items.length === 0 ? (
        <div className="text-center py-14 rounded-2xl" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
          <p className="text-4xl mb-2">📋</p>
          <p className="text-sm font-medium">Add your first checker above</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="rounded-2xl border-2 p-4" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
              {/* Title + delete */}
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-base" style={{ color: 'var(--t-text-main)' }}>{item.title}</p>
                <button onClick={() => remove(item.id)} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>✕</button>
              </div>
              {/* Counter buttons */}
              <div className="flex gap-3">
                {/* Plus */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <button
                    onClick={() => update(item.id, 'plus', 1)}
                    className="w-full py-3 rounded-xl text-xl font-black transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)', color: '#fff', boxShadow: '0 4px 12px rgba(34,197,94,0.3)' }}
                  >＋</button>
                  <span className="text-2xl font-black tabular-nums" style={{ color: '#16a34a' }}>{item.plus}</span>
                </div>
                {/* Divider */}
                <div className="w-px my-1" style={{ backgroundColor: 'var(--t-border-soft)' }} />
                {/* Minus */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <button
                    onClick={() => update(item.id, 'minus', 1)}
                    className="w-full py-3 rounded-xl text-xl font-black transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#e84057,#c0303e)', color: '#fff', boxShadow: '0 4px 12px rgba(232,64,87,0.3)' }}
                  >－</button>
                  <span className="text-2xl font-black tabular-nums" style={{ color: '#c0303e' }}>{item.minus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TradingPage() {
  const [tab, setTab] = useState<'log' | 'backtest' | 'checker'>('log')
  const [subTab, setSubTab] = useState<'pre' | 'counter'>('pre')
  const [trades, setTrades] = useState<Trade[]>([])
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [tradeModal, setTradeModal] = useState(false)
  const [stratModal, setStratModal] = useState(false)
  const [tradeForm, setTradeForm] = useState(emptyTrade)
  const [stratForm, setStratForm] = useState(emptyStrategy)
  const [editTrade, setEditTrade] = useState<number | null>(null)
  const [editStrat, setEditStrat] = useState<number | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [expandedStrat, setExpandedStrat] = useState<number | null>(null)
  const { t } = useLang()

  const loadTrades = () => fetch('/api/trading').then(r => r.json()).then(setTrades)
  const loadStrats = () => fetch('/api/backtest').then(r => r.json()).then(setStrategies)
  useEffect(() => { loadTrades(); loadStrats() }, [])

  const closedTrades = trades.filter(tr => tr.status === 'CLOSED' && tr.pnl != null)
  const totalPnl = closedTrades.reduce((s, tr) => s + (tr.pnl || 0), 0)
  const winRate = closedTrades.length > 0 ? Math.round((closedTrades.filter(tr => (tr.pnl || 0) > 0).length / closedTrades.length) * 100) : 0

  const openTradeModal = (tr?: Trade) => {
    setTradeForm(tr ? { date: tr.date, instrument: tr.instrument, type: tr.type, entry: String(tr.entry), exit: tr.exit ? String(tr.exit) : '', size: String(tr.size), pnl: tr.pnl ? String(tr.pnl) : '', notes: tr.notes || '', status: tr.status } : emptyTrade)
    setEditTrade(tr?.id ?? null); setTradeModal(true)
  }
  const saveTrade = async () => {
    setSaving(true)
    await fetch(editTrade ? `/api/trading/${editTrade}` : '/api/trading', { method: editTrade ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tradeForm) })
    await loadTrades(); setTradeModal(false); setSaving(false)
  }
  const delTrade = async (id: number) => {
    if (!confirm(t.deleteTrade)) return
    await fetch(`/api/trading/${id}`, { method: 'DELETE' }); loadTrades()
  }
  const openStratModal = (s?: Strategy) => {
    setStratForm(s ? { name: s.name, description: s.description, rules: JSON.parse(s.rules).join('\n'), timeframe: s.timeframe, winRate: s.winRate ? String(s.winRate) : '', riskReward: s.riskReward ? String(s.riskReward) : '', notes: s.notes || '' } : emptyStrategy)
    setEditStrat(s?.id ?? null); setStratModal(true)
  }
  const saveStrat = async () => {
    setSaving(true)
    await fetch(editStrat ? `/api/backtest/${editStrat}` : '/api/backtest', { method: editStrat ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...stratForm, rules: stratForm.rules.split('\n').filter(Boolean) }) })
    await loadStrats(); setStratModal(false); setSaving(false)
  }
  const delStrat = async (id: number) => {
    if (!confirm(t.deleteStrategy)) return
    await fetch(`/api/backtest/${id}`, { method: 'DELETE' }); loadStrats()
  }
  const analyzeAI = async (trade: Trade) => {
    setAiLoading(true)
    try {
      const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'trade_analysis', data: { trade } }) })
      const data = await r.json()
      alert(`${t.analysisLabel}\n${data.analysis}\n\n${t.lessonsLabel}\n${data.lessons}\n\n${t.ratingLabel} ${data.rating}/5`)
    } catch { alert(t.aiFailed) }
    setAiLoading(false)
  }
  const generateStrat = async () => {
    setAiLoading(true)
    try {
      const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'backtest', data: { description: stratForm.description || stratForm.name } }) })
      const data = await r.json()
      setStratForm(f => ({ ...f, name: data.name || f.name, description: data.description || f.description, rules: (data.rules || []).join('\n'), timeframe: data.timeframe || f.timeframe, notes: data.notes || f.notes }))
    } catch { alert(t.aiFailed) }
    setAiLoading(false)
  }

  return (
    <div>
      {/* ── Hero last trade ── */}
      {trades.length > 0 && (
        <div className="rounded-2xl p-5 mb-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--t-hero-from) 0%, var(--t-hero-mid) 55%, var(--t-hero-to) 100%)' }}>
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#bbf7d0' }}>
            📈 Dernier trade
          </span>
          <p className="text-white font-bold text-lg leading-snug mb-1">{trades[0].instrument} — {trades[0].type}</p>
          <p className="text-sm" style={{ color: '#bbf7d0' }}>
            {trades[0].status === 'CLOSED' && trades[0].pnl != null
              ? `P&L : ${trades[0].pnl > 0 ? '+' : ''}${trades[0].pnl}`
              : trades[0].status} · {trades[0].date}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--t-text-main)' }}>📈 Trading</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--t-text-muted)' }}>{t.tradesStrategies}</p>
        </div>
        {tab !== 'checker' && (
          <button onClick={() => tab === 'log' ? openTradeModal() : openStratModal()}
            className="btn-glass btn-glass-gold px-4 py-2.5 rounded-xl text-sm font-medium">
            {tab === 'log' ? t.addTrade : t.addStrategy}
          </button>
        )}
      </div>

      {/* Stats */}
      {tab === 'log' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
          {[
            { label: t.total,   value: trades.length,         unit: '' },
            { label: t.closed,  value: closedTrades.length,   unit: '' },
            { label: t.winRate, value: winRate,                unit: '%' },
            { label: 'P&L',     value: totalPnl.toFixed(1),   unit: '', color: totalPnl >= 0 ? '#2d6a4f' : '#c0303e' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 sm:p-4 border" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
              <p className="text-xs mb-0.5" style={{ color: 'var(--t-text-soft)' }}>{s.label}</p>
              <p className="text-xl sm:text-2xl font-bold" style={{ color: s.color || 'var(--t-text-main)' }}>{s.value}{s.unit}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[{ key: 'log', label: t.tradeLog }, { key: 'backtest', label: t.backtestTab }, { key: 'checker', label: '✅ Checker' }].map(tb => (
          <button key={tb.key} onClick={() => setTab(tb.key as 'log' | 'backtest' | 'checker')}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ backgroundColor: tab === tb.key ? '#b8860b' : 'var(--t-item-bg)', color: tab === tb.key ? '#fff' : 'var(--t-text-muted)' }}>
            {tb.label}
          </button>
        ))}
      </div>

      {/* Trade Log */}
      {tab === 'log' && (
        trades.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
            <p className="text-4xl mb-2">📊</p>
            <p className="font-medium text-sm">{t.noTrades}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trades.map(tr => (
              <div key={tr.id} className="rounded-2xl border-2 p-4 shadow-sm" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
                <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: tr.type === 'LONG' ? '#2d6a4f' : '#c0303e' }}>{tr.type}</span>
                    <span className="font-semibold text-sm" style={{ color: 'var(--t-text-main)' }}>{tr.instrument}</span>
                    <span className="text-xs" style={{ color: 'var(--t-text-soft)' }}>{tr.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: tr.status === 'OPEN' ? '#fef9e7' : 'var(--t-item-bg)', color: tr.status === 'OPEN' ? '#b8860b' : 'var(--t-text-muted)' }}>{tr.status}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => analyzeAI(tr)} disabled={aiLoading} className="text-xs px-2 py-1 rounded-lg disabled:opacity-50" style={{ color: '#b8860b', backgroundColor: '#fef9e7' }}>{aiLoading ? '…' : 'AI'}</button>
                    <button onClick={() => openTradeModal(tr)} className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--t-text-muted)', backgroundColor: 'var(--t-item-bg)' }}>{t.edit}</button>
                    <button onClick={() => delTrade(tr.id)} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>{t.del}</button>
                  </div>
                </div>
                <div className="flex gap-3 text-sm flex-wrap">
                  <span style={{ color: 'var(--t-text-muted)' }}>In: <strong>{tr.entry}</strong></span>
                  {tr.exit && <span style={{ color: 'var(--t-text-muted)' }}>Out: <strong>{tr.exit}</strong></span>}
                  <span style={{ color: 'var(--t-text-muted)' }}>{t.size}: <strong>{tr.size}</strong></span>
                  {tr.pnl != null && <span className="font-bold" style={{ color: tr.pnl >= 0 ? '#2d6a4f' : '#c0303e' }}>{tr.pnl >= 0 ? '+' : ''}{tr.pnl}</span>}
                </div>
                {tr.notes && <p className="text-xs mt-2 italic" style={{ color: 'var(--t-text-soft)' }}>{tr.notes}</p>}
              </div>
            ))}
          </div>
        )
      )}

      {/* Backtest */}
      {tab === 'backtest' && (
        strategies.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
            <p className="text-4xl mb-2">🔬</p>
            <p className="font-medium text-sm">{t.noStrategies}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {strategies.map(s => {
              const rules: string[] = JSON.parse(s.rules)
              return (
                <div key={s.id} className="rounded-2xl border-2 overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
                  <div className="p-4 flex items-start justify-between cursor-pointer" onClick={() => setExpandedStrat(expandedStrat === s.id ? null : s.id)}>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--t-text-main)' }}>{s.name}</h3>
                      <div className="flex gap-3 mt-1 text-xs flex-wrap" style={{ color: 'var(--t-text-soft)' }}>
                        <span>⏱ {s.timeframe}</span>
                        {s.winRate && <span>WR: {s.winRate}%</span>}
                        {s.riskReward && <span>R:R {s.riskReward}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={e => { e.stopPropagation(); openStratModal(s) }} className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--t-text-muted)', backgroundColor: 'var(--t-item-bg)' }}>{t.edit}</button>
                      <button onClick={e => { e.stopPropagation(); delStrat(s.id) }} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>{t.del}</button>
                      <span className="text-xs px-1" style={{ color: 'var(--t-text-soft)' }}>{expandedStrat === s.id ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {expandedStrat === s.id && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--t-border-soft)' }}>
                      <p className="text-sm mt-3 mb-3" style={{ color: 'var(--t-text-muted)' }}>{s.description}</p>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#2d6a4f' }}>{t.rulesLabel}</p>
                      <ul className="space-y-1">
                        {rules.map((r, i) => (
                          <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--t-text-muted)' }}><span style={{ color: '#52b788' }}>{i + 1}.</span>{r}</li>
                        ))}
                      </ul>
                      {s.notes && <p className="text-sm mt-3 italic" style={{ color: 'var(--t-text-soft)' }}>{s.notes}</p>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      )}

      {/* Checker */}
      {tab === 'checker' && (
        <div className="flex flex-col gap-4">
          {/* Sub-tabs */}
          <div className="flex gap-2">
            {[{ key: 'pre', label: '🎯 Pre-Trade' }, { key: 'counter', label: '📊 Counter' }].map(st => (
              <button key={st.key} onClick={() => setSubTab(st.key as 'pre' | 'counter')}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                style={{ backgroundColor: subTab === st.key ? '#b8860b' : 'var(--t-item-bg)', color: subTab === st.key ? '#fff' : 'var(--t-text-muted)' }}>
                {st.label}
              </button>
            ))}
          </div>
          {subTab === 'pre' ? <PreTradeTab /> : <CheckerTab />}
        </div>
      )}

      {/* Trade Modal */}
      {tradeModal && (
        <Modal title={editTrade ? t.editTrade : t.logTrade} onClose={() => setTradeModal(false)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.date}</label>
                <input type="date" value={tradeForm.date} onChange={e => setTradeForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.instrument}</label>
                <input value={tradeForm.instrument} onChange={e => setTradeForm(f => ({ ...f, instrument: e.target.value }))} placeholder="BTC/USD…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.direction}</label>
                <select value={tradeForm.type} onChange={e => setTradeForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }}>
                  <option value="LONG">LONG</option><option value="SHORT">SHORT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.status}</label>
                <select value={tradeForm.status} onChange={e => setTradeForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }}>
                  <option value="OPEN">OPEN</option><option value="CLOSED">CLOSED</option>
                </select>
              </div>
              {[{ label: t.entry, key: 'entry' }, { label: t.exit, key: 'exit' }, { label: t.size, key: 'size' }, { label: 'P&L', key: 'pnl' }].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{label}</label>
                  <input type="number" step="any" value={(tradeForm as Record<string, string>)[key]} onChange={e => setTradeForm(f => ({ ...f, [key]: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.notes}</label>
              <textarea value={tradeForm.notes} onChange={e => setTradeForm(f => ({ ...f, notes: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setTradeModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">{t.cancel}</button>
            <button onClick={saveTrade} disabled={saving} className="btn-glass btn-glass-gold flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {saving ? t.saving : t.save}
            </button>
          </div>
        </Modal>
      )}

      {/* Strategy Modal */}
      {stratModal && (
        <Modal title={editStrat ? t.editStrategy : t.newStrategy} onClose={() => setStratModal(false)}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.name}</label>
              <input value={stratForm.name} onChange={e => setStratForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.description}</label>
              <textarea value={stratForm.description} onChange={e => setStratForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
            <button onClick={generateStrat} disabled={aiLoading} className="w-full py-2.5 rounded-xl text-sm font-medium disabled:opacity-60" style={{ backgroundColor: '#fef9e7', color: '#b8860b' }}>
              {aiLoading ? t.aiGenerating : t.aiGenerateStrategy}
            </button>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.rulesOneLine}</label>
              <textarea value={stratForm.rules} onChange={e => setStratForm(f => ({ ...f, rules: e.target.value }))} rows={5} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.timeframe}</label>
                <input value={stratForm.timeframe} onChange={e => setStratForm(f => ({ ...f, timeframe: e.target.value }))} placeholder="1H, 4H…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.winRatePct}</label>
                <input type="number" value={stratForm.winRate} onChange={e => setStratForm(f => ({ ...f, winRate: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>R:R</label>
                <input type="number" step="0.1" value={stratForm.riskReward} onChange={e => setStratForm(f => ({ ...f, riskReward: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.notes}</label>
              <textarea value={stratForm.notes} onChange={e => setStratForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setStratModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">{t.cancel}</button>
            <button onClick={saveStrat} disabled={saving} className="btn-glass btn-glass-gold flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {saving ? t.saving : t.save}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
