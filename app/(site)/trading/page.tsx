'use client'

import { useEffect, useRef, useState } from 'react'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'

type Trade = { id: number; date: string; instrument: string; type: string; entry: number; exit: number | null; size: number; pnl: number | null; notes: string | null; status: string; tp: number | null; sl: number | null; riskPct: number | null; resultPct: number | null; rr: number | null; tvLinks: string | null }
type Strategy = { id: number; name: string; description: string; rules: string; timeframe: string; winRate: number | null; riskReward: number | null; notes: string | null }

const emptyTrade  = { date: new Date().toISOString().split('T')[0], instrument: '', type: 'LONG', entry: '', tp: '', sl: '', riskPct: '', resultPct: '', notes: '' }
const emptyTvLinks = { tf5m: '', tf1h: '', tf4h: '', tfd: '', tfw: '' }
const parseTvLinks = (s: string | null) => { try { return { ...emptyTvLinks, ...JSON.parse(s || '{}') } } catch { return { ...emptyTvLinks } } }
const emptyStrategy = { name: '', description: '', rules: '', timeframe: '', winRate: '', riskReward: '', notes: '' }

export default function TradingPage() {
  type ChecklistMode = 'amine' | 'my' | 'new'
  const [tab, setTab] = useState<'strategy' | 'log' | 'backtest' | 'checker'>('strategy')
  const [subTab,         setSubTab]        = useState<'counter' | 'guide'>('counter')
  const [checklistMode,  setChecklistMode] = useState<ChecklistMode>('amine')
  const [defaultSaved,   setDefaultSaved]  = useState(false)
  const [trades, setTrades] = useState<Trade[]>([])
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [tradeModal, setTradeModal] = useState(false)
  const [stratModal, setStratModal] = useState(false)
  const [tradeForm, setTradeForm] = useState(emptyTrade)
  const [tvLinks,   setTvLinks]   = useState({ ...emptyTvLinks })
  const [tvOpen,    setTvOpen]    = useState(false)
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
  useEffect(() => { const s = localStorage.getItem('trading-default-checklist') as ChecklistMode; if (s) setChecklistMode(s) }, [])

  const closedTrades = trades.filter(tr => tr.resultPct != null || tr.status === 'CLOSED')
  const totalPnl = closedTrades.reduce((s, tr) => s + (tr.resultPct ?? tr.pnl ?? 0), 0)
  const winRate = closedTrades.length > 0 ? Math.round((closedTrades.filter(tr => (tr.resultPct ?? tr.pnl ?? 0) > 0).length / closedTrades.length) * 100) : 0

  const openTradeModal = (tr?: Trade) => {
    if (tr) {
      setTradeForm({ date: tr.date, instrument: tr.instrument, type: tr.type, entry: String(tr.entry), tp: tr.tp ? String(tr.tp) : '', sl: tr.sl ? String(tr.sl) : '', riskPct: tr.riskPct ? String(tr.riskPct) : '', resultPct: tr.resultPct ? String(tr.resultPct) : '', notes: tr.notes || '' })
      setTvLinks(parseTvLinks(tr.tvLinks))
    } else {
      setTradeForm(emptyTrade)
      setTvLinks({ ...emptyTvLinks })
    }
    setTvOpen(false)
    setEditTrade(tr?.id ?? null)
    setTradeModal(true)
  }
  const saveTrade = async () => {
    setSaving(true)
    const entry = parseFloat(tradeForm.entry) || 0
    const tp    = parseFloat(tradeForm.tp) || 0
    const sl    = parseFloat(tradeForm.sl) || 0
    const rrVal = entry && tp && sl && sl !== entry
      ? tradeForm.type === 'LONG'
        ? Number(((tp - entry) / (entry - sl)).toFixed(2))
        : Number(((entry - tp) / (sl - entry)).toFixed(2))
      : null
    const hasLinks = Object.values(tvLinks).some(v => v.trim())
    await fetch(editTrade ? `/api/trading/${editTrade}` : '/api/trading', {
      method: editTrade ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...tradeForm, rr: rrVal, tvLinks: hasLinks ? JSON.stringify(tvLinks) : null, status: tradeForm.resultPct ? 'CLOSED' : 'OPEN' }),
    })
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
          <button
            onClick={() => tab === 'log' ? openTradeModal() : openStratModal()}
            className="btn-glass btn-glass-gold px-4 py-2.5 rounded-xl text-sm font-medium">
            {tab === 'log' ? t.addTrade : t.addStrategy}
          </button>
        )}
      </div>

      {/* Stats — only on Log tab */}
      {tab === 'log' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
          {[
            { label: t.total,   value: trades.length,         unit: '' },
            { label: t.closed,  value: closedTrades.length,   unit: '' },
            { label: t.winRate, value: winRate,                unit: '%' },
            { label: 'P&L %',   value: (totalPnl >= 0 ? '+' : '') + totalPnl.toFixed(1), unit: '%', color: totalPnl >= 0 ? '#2d6a4f' : '#c0303e' },
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
        {([
          { key: 'strategy', label: '📋 Strategy' },
          { key: 'log',      label: t.tradeLog },
          { key: 'backtest', label: t.backtestTab },
          { key: 'checker',  label: '✅ Checker' },
        ] as { key: 'strategy' | 'log' | 'backtest' | 'checker'; label: string }[]).map(tb => (
          <button key={tb.key} onClick={() => setTab(tb.key)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ backgroundColor: tab === tb.key ? '#b8860b' : 'var(--t-item-bg)', color: tab === tb.key ? '#fff' : 'var(--t-text-muted)' }}>
            {tb.label}
          </button>
        ))}
      </div>

      {/* Strategy */}
      {tab === 'strategy' && (
        <div className="space-y-5">
          {/* Checklist selector */}
          <div className="rounded-2xl border-2 p-3 flex items-center justify-between gap-3"
            style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
            <p className="text-xs font-bold uppercase tracking-widest shrink-0" style={{ color: 'var(--t-text-soft)' }}>🎯 Checklist</p>
            <div className="flex gap-2 items-center flex-1 justify-end">
              <select value={checklistMode} onChange={e => setChecklistMode(e.target.value as ChecklistMode)}
                className="flex-1 max-w-[180px] px-3 py-2 rounded-xl text-sm font-semibold border outline-none"
                style={{ borderColor: 'var(--t-border-soft)', backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-main)' }}>
                <option value="amine">Amine Checklist</option>
                <option value="my">My Checklist</option>
                <option value="new">New Strategy</option>
              </select>
              <button
                onClick={() => { localStorage.setItem('trading-default-checklist', checklistMode); setDefaultSaved(true); setTimeout(() => setDefaultSaved(false), 1800) }}
                className="text-xs px-3 py-2 rounded-xl font-semibold transition-all shrink-0"
                style={{ backgroundColor: defaultSaved ? '#d8f3dc' : 'var(--t-item-bg)', color: defaultSaved ? '#2d6a4f' : 'var(--t-text-muted)' }}>
                {defaultSaved ? '✓ Défaut' : 'Set Défaut'}
              </button>
            </div>
          </div>

          {checklistMode === 'amine' && <AmineChecklist />}
          {checklistMode === 'my'    && <PreTradeChecklist />}
          {checklistMode === 'new'   && <PreTradeTab />}

          {/* Strategy cards */}
          {strategies.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: 'var(--t-text-soft)' }}>📋 Mes stratégies</p>
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
          )}
        </div>
      )}

      {/* Trade Log */}
      {tab === 'log' && (
        trades.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
            <p className="text-4xl mb-2">📊</p>
            <p className="font-medium text-sm">{t.noTrades}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trades.map((tr, idx) => {
              const tradeNum = trades.length - idx
              const tvParsed = parseTvLinks(tr.tvLinks)
              const hasTv    = Object.values(tvParsed).some((v: unknown) => (v as string).trim())
              const tfLabels: { key: keyof typeof emptyTvLinks; label: string }[] = [
                { key: 'tf5m', label: '5m' }, { key: 'tf1h', label: '1H' },
                { key: 'tf4h', label: '4H' }, { key: 'tfd',  label: 'D'  },
                { key: 'tfw',  label: 'W'  },
              ]
              return (
              <div key={tr.id} className="rounded-2xl border-2 p-4 shadow-sm" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
                {/* Row 1 — number + direction + instrument + date + actions */}
                <div className="flex items-start justify-between gap-2 flex-wrap mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>#{tradeNum}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: tr.type === 'LONG' ? '#2d6a4f' : '#c0303e' }}>{tr.type}</span>
                    <span className="font-bold text-sm" style={{ color: 'var(--t-text-main)' }}>{tr.instrument}</span>
                    <span className="text-xs" style={{ color: 'var(--t-text-soft)' }}>{tr.date}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openTradeModal(tr)} className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--t-text-muted)', backgroundColor: 'var(--t-item-bg)' }}>{t.edit}</button>
                    <button onClick={() => delTrade(tr.id)} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>Delete</button>
                  </div>
                </div>

                {/* Row 2 — Entry / TP / SL / RR */}
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
                    { label: 'Entry', val: tr.entry },
                    { label: 'TP',    val: tr.tp },
                    { label: 'SL',    val: tr.sl },
                  ].map(({ label, val }) => (
                    <div key={label} className="rounded-xl px-2 py-2 text-center" style={{ backgroundColor: 'var(--t-item-bg)' }}>
                      <p className="text-xs" style={{ color: 'var(--t-text-soft)' }}>{label}</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--t-text-main)' }}>{val ?? '—'}</p>
                    </div>
                  ))}
                  <div className="rounded-xl px-2 py-2 text-center" style={{ backgroundColor: tr.rr ? (tr.rr >= 1 ? '#d8f3dc' : '#fde8ec') : 'var(--t-item-bg)' }}>
                    <p className="text-xs" style={{ color: 'var(--t-text-soft)' }}>R:R</p>
                    <p className="text-sm font-bold" style={{ color: tr.rr ? (tr.rr >= 1 ? '#2d6a4f' : '#c0303e') : 'var(--t-text-main)' }}>
                      {tr.rr != null ? `${tr.rr}` : '—'}
                    </p>
                  </div>
                </div>

                {/* Row 3 — Risk % + Result % */}
                {(tr.riskPct != null || tr.resultPct != null) && (
                  <div className="flex gap-2 mb-2">
                    {tr.riskPct != null && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#fef9e7', color: '#b8860b' }}>
                        ⚠️ Risk {tr.riskPct}%
                      </span>
                    )}
                    {tr.resultPct != null && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: tr.resultPct >= 0 ? '#d8f3dc' : '#fde8ec', color: tr.resultPct >= 0 ? '#2d6a4f' : '#c0303e' }}>
                        {tr.resultPct >= 0 ? '+' : ''}{tr.resultPct}%
                      </span>
                    )}
                  </div>
                )}

                {/* Notes */}
                {tr.notes && <p className="text-xs mb-2 italic" style={{ color: 'var(--t-text-soft)' }}>{tr.notes}</p>}

                {/* TradingView Charts */}
                {hasTv && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="text-xs font-semibold" style={{ color: 'var(--t-text-soft)' }}>📺</span>
                    {tfLabels.map(({ key, label }) =>
                      tvParsed[key] ? (
                        <a key={key} href={tvParsed[key]} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-bold px-2.5 py-1 rounded-full transition-all active:scale-95"
                          style={{ backgroundColor: '#1e609122', color: '#1e6091', border: '1px solid #1e609144' }}>
                          {label}
                        </a>
                      ) : null
                    )}
                  </div>
                )}
              </div>
              )
            })}
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
          <div className="flex gap-2">
            {([
              { key: 'counter', label: '📊 Counter' },
              { key: 'guide',   label: '📚 Guide' },
            ] as { key: 'counter' | 'guide'; label: string }[]).map(st => (
              <button key={st.key} onClick={() => setSubTab(st.key)}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                style={{ backgroundColor: subTab === st.key ? '#b8860b' : 'var(--t-item-bg)', color: subTab === st.key ? '#fff' : 'var(--t-text-muted)' }}>
                {st.label}
              </button>
            ))}
          </div>
          {subTab === 'counter' ? <CheckerTab /> : <StrategyGuideTab />}
        </div>
      )}

      {/* Trade Modal */}
      {tradeModal && (() => {
        const entry    = parseFloat(tradeForm.entry) || 0
        const tp       = parseFloat((tradeForm as Record<string,string>).tp) || 0
        const sl       = parseFloat((tradeForm as Record<string,string>).sl) || 0
        const rrCalc   = entry && tp && sl && sl !== entry
          ? tradeForm.type === 'LONG'
            ? ((tp - entry) / (entry - sl)).toFixed(2)
            : ((entry - tp) / (sl - entry)).toFixed(2)
          : null
        const tfLabels: { key: keyof typeof emptyTvLinks; label: string }[] = [
          { key: 'tf5m', label: '5m' }, { key: 'tf1h', label: '1H' },
          { key: 'tf4h', label: '4H' }, { key: 'tfd',  label: 'D'  },
          { key: 'tfw',  label: 'W'  },
        ]
        const tradeNum = editTrade ? (trades.length - trades.findIndex(t => t.id === editTrade)) : trades.length + 1
        return (
        <Modal title={`${editTrade ? '✏️ Edit' : '📝 Log'} Trade #${tradeNum}`} onClose={() => setTradeModal(false)}>
          <div className="space-y-3">

            {/* Date + Instrument */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.date}</label>
                <input type="date" value={tradeForm.date} onChange={e => setTradeForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.instrument}</label>
                <input value={tradeForm.instrument} onChange={e => setTradeForm(f => ({ ...f, instrument: e.target.value }))}
                  placeholder="BTC/USD…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
            </div>

            {/* Direction */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.direction}</label>
              <div className="grid grid-cols-2 gap-2">
                {['LONG', 'SHORT'].map(d => (
                  <button key={d} onClick={() => setTradeForm(f => ({ ...f, type: d }))}
                    className="py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{ backgroundColor: tradeForm.type === d ? (d === 'LONG' ? '#2d6a4f' : '#c0303e') : 'var(--t-item-bg)', color: tradeForm.type === d ? '#fff' : 'var(--t-text-muted)' }}>
                    {d === 'LONG' ? '📈 LONG' : '📉 SHORT'}
                  </button>
                ))}
              </div>
            </div>

            {/* Entry / TP / SL / RR */}
            <div className="grid grid-cols-2 gap-2">
              {[{ label: 'Entry', key: 'entry' }, { label: 'TP', key: 'tp' }, { label: 'SL', key: 'sl' }].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{label}</label>
                  <input type="number" step="any" value={(tradeForm as Record<string,string>)[key]}
                    onChange={e => setTradeForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
                </div>
              ))}
              {/* RR auto */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>R:R (auto)</label>
                <div className="w-full px-3 py-2.5 rounded-xl border text-sm font-bold"
                  style={{ borderColor: 'var(--t-border-soft)', backgroundColor: 'var(--t-item-bg)', color: rrCalc ? (parseFloat(rrCalc) >= 1 ? '#2d6a4f' : '#c0303e') : 'var(--t-text-soft)' }}>
                  {rrCalc ? `${rrCalc} : 1` : '—'}
                </div>
              </div>
            </div>

            {/* Risk % + Result % */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>⚠️ Risk %</label>
                <input type="number" step="0.01" placeholder="1.5" value={(tradeForm as Record<string,string>).riskPct}
                  onChange={e => setTradeForm(f => ({ ...f, riskPct: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>📊 Result %</label>
                <input type="number" step="0.01" placeholder="+3.2 or -1.5" value={(tradeForm as Record<string,string>).resultPct}
                  onChange={e => setTradeForm(f => ({ ...f, resultPct: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.notes}</label>
              <textarea value={tradeForm.notes} onChange={e => setTradeForm(f => ({ ...f, notes: e.target.value }))}
                rows={2} placeholder="Setup, confluence, context…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>

            {/* TradingView Links */}
            <div>
              <button onClick={() => setTvOpen(o => !o)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ backgroundColor: tvOpen ? '#1e609115' : 'var(--t-item-bg)', color: tvOpen ? '#1e6091' : 'var(--t-text-muted)', border: `1.5px solid ${tvOpen ? '#1e609144' : 'transparent'}` }}>
                <span>📺 TradingView Links</span>
                <span className="text-xs">{tvOpen ? '▲' : '▼'}</span>
              </button>
              {tvOpen && (
                <div className="mt-2 space-y-2">
                  {tfLabels.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs font-bold w-8 shrink-0 text-center px-1.5 py-1 rounded-lg"
                        style={{ backgroundColor: '#1e609122', color: '#1e6091' }}>{label}</span>
                      <input value={tvLinks[key]}
                        onChange={e => setTvLinks(l => ({ ...l, [key]: e.target.value }))}
                        placeholder={`https://www.tradingview.com/chart/...`}
                        className="flex-1 px-3 py-2 rounded-xl border text-xs outline-none"
                        style={{ borderColor: 'var(--t-border-soft)' }} />
                      {tvLinks[key] && (
                        <a href={tvLinks[key]} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-2 py-1.5 rounded-lg shrink-0 font-semibold"
                          style={{ backgroundColor: '#1e609122', color: '#1e6091' }}>↗</a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setTradeModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">{t.cancel}</button>
            <button onClick={saveTrade} disabled={saving} className="btn-glass btn-glass-gold flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {saving ? t.saving : t.save}
            </button>
          </div>
        </Modal>
        )
      })()}

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

// ── Amine Checklist ──────────────────────────────────────────────
const AMINE_KEY = 'amine-checklist-v1'

function AmineChecklist() {
  const [pair,    setPair]    = useState('')
  const [session, setSession] = useState('')
  const [bias4h,  setBias4h]  = useState('')
  const [drawLiq, setDrawLiq] = useState<string[]>([])
  const [pdArray, setPdArray] = useState<string[]>([])
  const [tf5m,    setTf5m]    = useState<string[]>([])

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(AMINE_KEY) || '{}')
      if (d.pair)    setPair(d.pair)
      if (d.session) setSession(d.session)
      if (d.bias4h)  setBias4h(d.bias4h)
      if (d.drawLiq) setDrawLiq(d.drawLiq)
      if (d.pdArray) setPdArray(d.pdArray)
      if (d.tf5m)    setTf5m(d.tf5m)
    } catch {}
  }, [])

  const persist = (patch: object) =>
    localStorage.setItem(AMINE_KEY, JSON.stringify({ pair, session, bias4h, drawLiq, pdArray, tf5m, ...patch }))

  const updPair    = (v: string) => { const n = pair === v ? '' : v;    setPair(n);    persist({ pair: n }) }
  const updSession = (v: string) => { const n = session === v ? '' : v; setSession(n); persist({ session: n }) }
  const updBias    = (v: string) => { const n = bias4h === v ? '' : v;  setBias4h(n);  persist({ bias4h: n }) }
  const updDrawLiq = (v: string) => { const n = drawLiq.includes(v) ? drawLiq.filter(x => x !== v) : [...drawLiq, v]; setDrawLiq(n); persist({ drawLiq: n }) }
  const updPdArray = (v: string) => { const n = pdArray.includes(v) ? pdArray.filter(x => x !== v) : [...pdArray, v]; setPdArray(n); persist({ pdArray: n }) }
  const updTf5m    = (v: string) => { const n = tf5m.includes(v)    ? tf5m.filter(x => x !== v)    : [...tf5m, v];   setTf5m(n);    persist({ tf5m: n }) }

  const DRAW_BTNS  = ['HPS','LPS','HPD','LPD']
  const PD_NORMAL  = ['Supply Zone','Demand Zone','BISI','SIBI','iFVG']
  const PD_SPECIAL = ['4H','1H']
  const TF_REQ     = ['CHOCH','MSS','iFVG']   // required
  const TF_OPT     = ['SMT']                  // optional

  // Validity — SMT is optional in item 6
  const v1 = pair !== ''
  const v2 = session !== ''
  const v3 = bias4h === 'Haussier' || bias4h === 'Baissier'
  const v4 = drawLiq.length === 4
  const v5 = pdArray.length > 0
  const v6 = TF_REQ.every(b => tf5m.includes(b))   // only CHOCH + MSS + iFVG required

  const passed   = [v1,v2,v3,v4,v5,v6].filter(Boolean).length
  const allGood  = passed === 6
  const reset    = () => { setPair(''); setSession(''); setBias4h(''); setDrawLiq([]); setPdArray([]); setTf5m([]); localStorage.removeItem(AMINE_KEY) }

  // Shared card row helper
  const chk = (svg: boolean) => (
    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
      style={{ borderColor: svg ? '#22c55e' : '#d1d5db', backgroundColor: svg ? '#22c55e' : 'transparent' }}>
      {svg && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>}
    </div>
  )

  const row = (valid: boolean, label: string, children: React.ReactNode) => (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all"
      style={{ backgroundColor: valid ? 'rgba(34,197,94,0.08)' : 'var(--t-card-bg)', borderColor: valid ? '#22c55e' : 'var(--t-border-soft)' }}>
      {chk(valid)}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold" style={{ color: valid ? '#16a34a' : 'var(--t-text-main)', textDecoration: valid ? 'line-through' : 'none' }}>{label}</span>
        <div className="flex flex-wrap gap-1.5 mt-2">{children}</div>
      </div>
    </div>
  )

  const rBtn = (opt: string, val: string, fn: (v:string)=>void, danger=false) => {
    const s = val === opt
    return <button key={opt} onClick={() => fn(opt)} className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95"
      style={{ backgroundColor: s?(danger?'#fde8ec':'#d8f3dc'):'var(--t-item-bg)', color: s?(danger?'#c0303e':'#2d6a4f'):'var(--t-text-muted)' as string, borderColor: s?(danger?'#e57373':'#52b788'):'var(--t-border-soft)' }}>
      {s?(danger?'✗ ':'✓ '):''}{opt}
    </button>
  }
  const mBtn = (opt: string, arr: string[], fn:(v:string)=>void, sc:string, sb:string, optional=false) => {
    const s = arr.includes(opt)
    return <button key={opt} onClick={() => fn(opt)} className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95"
      style={{ backgroundColor: s?sb:'var(--t-item-bg)', color: s?sc:'var(--t-text-muted)' as string, borderColor: s?sc:'var(--t-border-soft)', opacity: optional ? 0.75 : 1 }}>
      {s?'✓ ':''}{opt}{optional?' (opt)':''}
    </button>
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar card */}
      <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: allGood ? '#22c55e' : 'var(--t-border-soft)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#b8860b' }}>🎯 Amine Checklist</p>
          <button onClick={reset} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>Reset</button>
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-1" style={{ backgroundColor: 'var(--t-item-bg)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(passed/6)*100}%`, background: allGood ? '#22c55e' : 'linear-gradient(90deg,#d4a017,#b8860b)' }} />
        </div>
        <p className="text-xs font-semibold" style={{ color: allGood ? '#16a34a' : 'var(--t-text-muted)' }}>
          {allGood ? '✅ Ready to trade!' : `${passed} / 6 conditions`}
        </p>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {row(v1, 'Paire',
          ['EURUSD','NZDUSD','GBPUSD'].map(o => rBtn(o, pair, updPair))
        )}
        {row(v2, 'Session',
          <button onClick={() => updSession('lkz')} className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold border text-left transition-all active:scale-95"
            style={{ backgroundColor: session==='lkz'?'rgba(59,130,246,0.12)':'var(--t-item-bg)', color: session==='lkz'?'#3b82f6':'var(--t-text-muted)', borderColor: session==='lkz'?'#3b82f6':'var(--t-border-soft)' }}>
            {session==='lkz'?'✓ ':''} 🕑 London Kill Zone · 2:30 AM – 5:00 AM → 8:00 AM
          </button>
        )}
        {row(v3, 'Bias 4H', <>
          {rBtn('Haussier', bias4h, updBias)}
          {rBtn('Baissier', bias4h, updBias)}
          {rBtn('Pas clair', bias4h, updBias, true)}
        </>)}
        {row(v4, `Draw Liquidity (${drawLiq.length}/4)`,
          DRAW_BTNS.map(o => mBtn(o, drawLiq, updDrawLiq, '#1e6091', '#dbeafe'))
        )}
        {row(v5, 'PD Array', <>
          {PD_NORMAL.map(o  => mBtn(o, pdArray, updPdArray, '#2d6a4f', '#d8f3dc'))}
          {PD_SPECIAL.map(o => <button key={o} onClick={() => updPdArray(o)} className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95"
            style={{ backgroundColor: pdArray.includes(o)?'rgba(245,158,11,0.18)':'var(--t-item-bg)', color:'#b8860b', borderColor:'#b8860b' }}>
            {pdArray.includes(o)?'✓ ':''}{o}
          </button>)}
        </>)}
        {row(v6, `TF in 5min (${[...TF_REQ,...TF_OPT].filter(b=>tf5m.includes(b)).length}/4)`, <>
          {TF_REQ.map(o => mBtn(o, tf5m, updTf5m, '#8b5cf6', '#ede9fe'))}
          {TF_OPT.map(o => mBtn(o, tf5m, updTf5m, '#94a3b8', '#f1f5f9', true))}
        </>)}
      </div>

      <button onClick={reset} className="w-full rounded-xl text-sm font-bold transition-all active:scale-95"
        style={{ padding:'10px', border:'2px solid #e84057', color:'#e84057', backgroundColor:'transparent' }}>
        🔄 Reset All
      </button>
    </div>
  )
}

// ── Pre-Trade Checklist ──────────────────────────────────────────
type CheckState = Record<string, string | string[]>

function getStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? '' : (v ?? '')
}
function getArr(v: string | string[] | undefined): string[] {
  return Array.isArray(v) ? v : []
}

const CHECKS: {
  id: string
  label: string
  desc: string
  options: string[]
  multi?: boolean
  valid: (v: string | string[]) => boolean
  warning?: (v: string | string[]) => boolean
}[] = [
  {
    id: 'pair',
    label: 'Paire',
    desc: 'Quelle paire tu trades ?',
    options: ['XAUUSD', 'EURUSD', 'NZDUSD', 'GBPUSD'],
    valid: (v) => (Array.isArray(v) ? v.length > 0 : v !== ''),
  },
  {
    id: 'session',
    label: 'Session',
    desc: 'Tu es dans quelle session ?',
    options: ['London', 'NY'],
    valid: (v) => (Array.isArray(v) ? v.length > 0 : v !== ''),
  },
  {
    id: 'session_open',
    label: '15 min écoulées ?',
    desc: 'Les 15 premières minutes de la session sont passées ?',
    options: ['Oui', 'Non'],
    valid: (v) => v === 'Oui',
  },
  {
    id: 'losses',
    label: 'Pertes du jour',
    desc: 'Combien de pertes aujourd\'hui ?',
    options: ['0', '1', '2 — STOP'],
    valid: (v) => v === '0' || v === '1',
  },
  {
    id: 'bias_4h',
    label: 'Bias 4H',
    desc: 'Direction hebdomadaire sur 4H ?',
    options: ['Haussier', 'Baissier', 'Pas clair'],
    valid: (v) => v === 'Haussier' || v === 'Baissier',
  },
  {
    id: 'key_level_4h',
    label: 'Niveau clé 4H',
    desc: 'Quel(s) niveau(x) respecté(s)/cassé(s) sur 4H ?',
    options: ['FVG', 'IFVG', 'OB', 'BB', 'CISD', 'Liquidité', 'Psycho'],
    multi: true,
    valid: (v) => Array.isArray(v) ? v.length > 0 : v !== '',
  },
  {
    id: 'bias_1h',
    label: 'Bias 1H aligné',
    desc: 'Le bias 1H est aligné avec le bias 4H ?',
    options: ['Oui', 'Non — Reversal PO3 (Mer+)', 'Non'],
    valid: (v) => v === 'Oui' || v === 'Non — Reversal PO3 (Mer+)',
    warning: (v) => v === 'Non — Reversal PO3 (Mer+)',
  },
  {
    id: 'choch',
    label: 'CHOCH 15M confirmé',
    desc: 'Change of Character visible sur 15M ?',
    options: ['Oui', 'Non'],
    valid: (v) => v === 'Oui',
  },
  {
    id: 'ote',
    label: 'Zone OTE atteinte',
    desc: 'Prix dans la zone 61.8–79% Fibonacci ?',
    options: ['Oui', 'Non'],
    valid: (v) => v === 'Oui',
  },
  {
    id: 'confluence',
    label: 'Confluence OTE + niveau',
    desc: 'La zone OTE coïncide avec un niveau clé ?',
    options: ['Oui', 'Non'],
    valid: (v) => v === 'Oui',
  },
  {
    id: 'rejection',
    label: 'Signal de rejet 3M/5M',
    desc: 'Chandelle de rejet dans la zone (wick / engulfing) ?',
    options: ['Oui', 'Non'],
    valid: (v) => v === 'Oui',
  },
  {
    id: 'news',
    label: 'News',
    desc: 'Actualité économique imminente ?',
    options: ['Aucune', 'News — réduire taille'],
    valid: (v) => (Array.isArray(v) ? v.length > 0 : v !== ''),
    warning: (v) => v === 'News — réduire taille',
  },
]

function MultiGroup({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter(x => x !== opt) : [...value, opt])
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {options.map(opt => {
        const selected = value.includes(opt)
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95"
            style={{
              backgroundColor: selected ? '#d8f3dc' : 'var(--t-item-bg)',
              color: selected ? '#2d6a4f' : 'var(--t-text-muted)',
              borderColor: selected ? '#52b788' : 'var(--t-border-soft)',
            }}
          >
            {selected ? '✓ ' : ''}{opt}
          </button>
        )
      })}
    </div>
  )
}

function RadioGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {options.map(opt => {
        const selected = value === opt
        const isDanger = opt === '2 — STOP' || opt === 'Non' || opt === 'Pas clair'
        const isWarning = opt === 'News — réduire taille' || opt === 'Non — Reversal PO3 (Mer+)'
        let bg = 'var(--t-item-bg)', color = 'var(--t-text-muted)', border = 'var(--t-border-soft)'
        if (selected) {
          if (isDanger) { bg = '#fde8ec'; color = '#c0303e'; border = '#e57373' }
          else if (isWarning) { bg = '#fef9e7'; color = '#b8860b'; border = '#fde68a' }
          else { bg = '#d8f3dc'; color = '#2d6a4f'; border = '#52b788' }
        }
        return (
          <button
            key={opt}
            onClick={() => onChange(selected ? '' : opt)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95"
            style={{ backgroundColor: bg, color, borderColor: border }}
          >
            {selected ? (isDanger ? '✗ ' : isWarning ? '⚠ ' : '✓ ') : ''}{opt}
          </button>
        )
      })}
    </div>
  )
}

function PreTradeChecklist() {
  const [state, setState] = useState<CheckState>({})

  const setStr = (id: string, v: string) => setState(s => ({ ...s, [id]: v }))
  const setArr = (id: string, v: string[]) => setState(s => ({ ...s, [id]: v }))

  const passed = CHECKS.filter(c => c.valid(state[c.id] ?? (c.multi ? [] : ''))).length
  const hasWarning = CHECKS.some(c => c.warning?.(state[c.id] ?? ''))
  const isBlocked = state['losses'] === '2 — STOP'
  const allGood = !isBlocked && passed === CHECKS.length

  const progressColor = isBlocked ? '#e57373' : allGood ? '#22c55e' : 'linear-gradient(90deg,#d4a017,#b8860b)'
  const progressLabel = isBlocked
    ? '🚫 STOP — 2 pertes, ne trade pas'
    : allGood
    ? (hasWarning ? '⚠️ Valide — réduire la taille (news)' : '✅ Ready to trade!')
    : `${passed} / ${CHECKS.length} conditions`

  return (
    <div className="flex flex-col gap-2">
      {/* Progress bar card */}
      <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: allGood ? '#22c55e' : isBlocked ? '#e57373' : 'var(--t-border-soft)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#b8860b' }}>🎯 My Checklist</p>
          <button
            onClick={() => setState({})}
            className="text-xs px-2 py-1 rounded-lg font-semibold transition-all active:scale-95"
            style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}
          >Reset</button>
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--t-item-bg)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(passed / CHECKS.length) * 100}%`, background: isBlocked ? '#e57373' : allGood ? '#22c55e' : 'linear-gradient(90deg,#d4a017,#b8860b)' }}
          />
        </div>
        <p className="text-xs font-semibold" style={{ color: allGood ? '#22c55e' : isBlocked ? '#c0303e' : 'var(--t-text-muted)' }}>{progressLabel}</p>
      </div>

      {/* Item cards */}
      {CHECKS.map((check, i) => {
        const rawVal = state[check.id]
        const strVal = getStr(rawVal)
        const arrVal = getArr(rawVal)
        const isValid = check.valid(check.multi ? arrVal : strVal)
        const isWarn = check.warning?.(strVal)
        const isDanger = isBlocked && check.id === 'losses'
        const cardBg = isDanger ? 'rgba(229,115,115,0.08)' : isValid ? 'rgba(34,197,94,0.08)' : 'var(--t-card-bg)'
        const cardBorder = isDanger ? '#e57373' : isValid ? '#22c55e' : 'var(--t-border-soft)'
        return (
          <div
            key={check.id}
            className="flex items-start gap-3 px-4 py-3 rounded-2xl border-2 transition-all"
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          >
            {/* Circular checkbox */}
            <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
              style={{ borderColor: isValid ? '#22c55e' : isDanger ? '#e57373' : 'var(--t-border-soft)', backgroundColor: isValid ? '#22c55e' : isDanger ? '#e57373' : 'transparent' }}>
              {(isValid || isDanger) && <span className="text-white text-xs font-bold">{isWarn ? '!' : '✓'}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold" style={{ color: 'var(--t-text-soft)' }}>{i + 1}</span>
                <p className="text-sm font-semibold" style={{ color: 'var(--t-text-main)' }}>{check.label}</p>
              </div>
              <p className="text-xs mb-1.5" style={{ color: 'var(--t-text-muted)' }}>{check.desc}</p>
              {check.multi
                ? <MultiGroup options={check.options} value={arrVal} onChange={v => setArr(check.id, v)} />
                : <RadioGroup options={check.options} value={strVal} onChange={v => setStr(check.id, v)} />
              }
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Pre-Trade Tab (Checker sub-tab) ─────────────────────────────────────────
const DEFAULT_CHECKS = [
  { id: 'trend',      label: 'Trend confirmed 4H TF' },
  { id: 'volume',     label: 'Day' },
  { id: 'sr',         label: 'Time' },
  { id: 'sr_jamo',    label: 'Time (Jamo)' },
  { id: 'dop',        label: 'DOP (Daily Open Price)' },
  { id: 'analyse_15', label: 'Analyse 15min' },
  { id: 'key_level',  label: 'Key level' },
  { id: 'high_low',   label: 'High/Low' },
  { id: 'amd',        label: 'AMD' },
  { id: 'confirm_5',  label: 'Confirmation 5min' },
  { id: 'sl',         label: 'Stop Loss placed' },
  { id: 'tp',         label: 'Take Profit target set' },
  { id: 'rr',         label: 'R:R ≥ 2' },
  { id: 'news',       label: 'No major news incoming' },
]
const HIGH_LOW_BTNS = [
  { id: 'prev_high_sess', label: 'H Sess', fullLabel: 'Previous High Session' },
  { id: 'prev_low_sess',  label: 'L Sess', fullLabel: 'Previous Low Session' },
  { id: 'prev_day_high',  label: 'D High', fullLabel: 'Previous Day High' },
  { id: 'prev_day_low',   label: 'D Low',  fullLabel: 'Previous Day Low' },
]
const JAMO_SESSION_BTNS = [
  { key: 'jamo_london', label: 'London', time: '1am-4am',  color: '#3b82f6' },
  { key: 'jamo_ny',     label: 'NY',     time: '8am-12am', color: '#8b5cf6' },
]
const KEY_LEVEL_BTNS = [
  { key: 'OB',   color: '#f97316' },
  { key: 'BB',   color: '#e84057' },
  { key: 'FVG',  color: '#3b82f6' },
  { key: 'iFVG', color: '#6366f1' },
  { key: 'CISD', color: '#8b5cf6' },
  { key: 'PsyN', color: '#22c55e' },
  { key: 'Lq',   color: '#f59e0b' },
  { key: 'NC',   color: '#94a3b8' },
]
const AMD_BTNS = [
  { key: 'accum',   label: 'Accumulation', color: '#22c55e' },
  { key: 'manip',   label: 'Manipulation', color: '#e84057' },
  { key: 'dist',    label: 'Distribution', color: '#3b82f6' },
  { key: 'retrace', label: 'Retracement',  color: '#f59e0b' },
]
const AMD_STACK_BTNS = [
  { key: 'redistrib', label: 'Redistribution', color: '#ec4899' },
  { key: 'consol',    label: 'Consolidation',  color: '#8b5cf6' },
]
const DOP_BTNS = [
  { key: 'gold',  label: 'Gold',  time: '18h', color: '#b8860b' },
  { key: 'forex', label: 'Forex', time: '17h', color: '#3b82f6' },
]
const PRE_CHECK_KEY = 'pre-trade-checklist-v1'
const BIAS_BTNS = [
  { key: 'bull', label: 'Bullish Trend', color: '#22c55e' },
  { key: 'bear', label: 'Bearish Trend', color: '#e84057' },
  { key: 'cons', label: 'Consolidation', color: '#f59e0b' },
]
const DAY_BTNS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const SESSION_BTNS = [
  { key: 'london', label: 'London', time: '2am-7am',  color: '#3b82f6' },
  { key: 'ny',     label: 'NY',     time: '8am-12pm', color: '#8b5cf6' },
  { key: 'asia',   label: 'Asia',   time: '8pm-2am',  color: '#f59e0b' },
]
function getNthSunday(year: number, month: number, n: number): Date {
  const d = new Date(year, month, 1)
  const firstSunday = d.getDay() === 0 ? 1 : 8 - d.getDay()
  return new Date(year, month, firstSunday + (n - 1) * 7)
}
function isEDT(): boolean {
  const now = new Date()
  const y = now.getFullYear()
  return now >= getNthSunday(y, 2, 2) && now < getNthSunday(y, 10, 1)
}

function PreTradeTab() {
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [bias, setBias] = useState<string | null>(null)
  const [activeDay, setActiveDay] = useState<string | null>(null)
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [priceValues, setPriceValues] = useState<Record<string, string>>({})
  const [openPopup, setOpenPopup] = useState<string | null>(null)
  const [popupInput, setPopupInput] = useState('')
  const [activeJamoSession, setActiveJamoSession] = useState<string | null>(null)
  const [activeKeyLevels, setActiveKeyLevels] = useState<string[]>([])
  const [activeAMD, setActiveAMD] = useState<string[]>([])
  const [activeDOP, setActiveDOP] = useState<string | null>(null)
  const edt = isEDT()
  const utcLabelAli  = edt ? 'Time UTC-4 (Ali)'  : 'Time UTC-5 (Ali)'
  const utcLabelJamo = edt ? 'Time UTC-4 (Jamo)' : 'Time UTC-5 (Jamo)'
  const initialLoaded = useRef(false)

  useEffect(() => {
    try { setChecks(JSON.parse(localStorage.getItem(PRE_CHECK_KEY) || '{}')) } catch { /**/ }
    try { setBias(localStorage.getItem(PRE_CHECK_KEY + '-bias') || null) } catch { /**/ }
    try { setActiveDay(localStorage.getItem(PRE_CHECK_KEY + '-day') || null) } catch { /**/ }
    try { setActiveSession(localStorage.getItem(PRE_CHECK_KEY + '-session') || null) } catch { /**/ }
    try { setPriceValues(JSON.parse(localStorage.getItem(PRE_CHECK_KEY + '-prices') || '{}')) } catch { /**/ }
    try { setActiveJamoSession(localStorage.getItem(PRE_CHECK_KEY + '-jamo') || null) } catch { /**/ }
    try { setActiveKeyLevels(JSON.parse(localStorage.getItem(PRE_CHECK_KEY + '-keylevels') || '[]')) } catch { /**/ }
    try { setActiveAMD(JSON.parse(localStorage.getItem(PRE_CHECK_KEY + '-amd') || '[]')) } catch { /**/ }
    try { setActiveDOP(localStorage.getItem(PRE_CHECK_KEY + '-dop') || null) } catch { /**/ }
    fetch('/api/pretrade')
      .then(r => r.json())
      .then(({ data }) => {
        const d = JSON.parse(data || '{}')
        if (d.checks)                       setChecks(d.checks)
        if (d.bias !== undefined)           setBias(d.bias)
        if (d.activeDay !== undefined)      setActiveDay(d.activeDay)
        if (d.activeSession !== undefined)  setActiveSession(d.activeSession)
        if (d.activeJamoSession !== undefined) setActiveJamoSession(d.activeJamoSession)
        if (d.priceValues)                  setPriceValues(d.priceValues)
        if (d.activeKeyLevels)              setActiveKeyLevels(d.activeKeyLevels)
        if (d.activeAMD)                    setActiveAMD(d.activeAMD)
        if (d.activeDOP !== undefined)      setActiveDOP(d.activeDOP)
      })
      .catch(() => {})
      .finally(() => { initialLoaded.current = true })
  }, [])

  useEffect(() => {
    if (!initialLoaded.current) return
    const payload = JSON.stringify({ checks, bias, activeDay, activeSession, activeJamoSession, priceValues, activeKeyLevels, activeAMD, activeDOP })
    const timer = setTimeout(() => {
      fetch('/api/pretrade', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: payload }) })
    }, 800)
    return () => clearTimeout(timer)
  }, [checks, bias, activeDay, activeSession, activeJamoSession, priceValues, activeKeyLevels, activeAMD, activeDOP])

  const toggle = (id: string) => { const next = { ...checks, [id]: !checks[id] }; setChecks(next); localStorage.setItem(PRE_CHECK_KEY, JSON.stringify(next)) }
  const toggleBias = (key: string) => { const next = bias === key ? null : key; setBias(next); next ? localStorage.setItem(PRE_CHECK_KEY + '-bias', next) : localStorage.removeItem(PRE_CHECK_KEY + '-bias') }
  const toggleDay = (day: string) => { const next = activeDay === day ? null : day; setActiveDay(next); next ? localStorage.setItem(PRE_CHECK_KEY + '-day', next) : localStorage.removeItem(PRE_CHECK_KEY + '-day') }
  const toggleSession = (key: string) => { const next = activeSession === key ? null : key; setActiveSession(next); next ? localStorage.setItem(PRE_CHECK_KEY + '-session', next) : localStorage.removeItem(PRE_CHECK_KEY + '-session') }
  const openPricePopup = (id: string) => { setPopupInput(priceValues[id] || ''); setOpenPopup(id) }
  const confirmPrice = () => {
    if (!openPopup) return
    const next = { ...priceValues, [openPopup]: popupInput.trim() }
    if (!popupInput.trim()) delete next[openPopup]
    setPriceValues(next); localStorage.setItem(PRE_CHECK_KEY + '-prices', JSON.stringify(next)); setOpenPopup(null)
  }
  const toggleJamoSession = (key: string) => { const next = activeJamoSession === key ? null : key; setActiveJamoSession(next); next ? localStorage.setItem(PRE_CHECK_KEY + '-jamo', next) : localStorage.removeItem(PRE_CHECK_KEY + '-jamo') }
  const toggleDOP = (key: string) => { const next = activeDOP === key ? null : key; setActiveDOP(next); next ? localStorage.setItem(PRE_CHECK_KEY + '-dop', next) : localStorage.removeItem(PRE_CHECK_KEY + '-dop') }
  const toggleAMD = (key: string) => { const next = activeAMD.includes(key) ? activeAMD.filter(k => k !== key) : [...activeAMD, key]; setActiveAMD(next); localStorage.setItem(PRE_CHECK_KEY + '-amd', JSON.stringify(next)) }
  const resetPrices = () => { const next = { ...priceValues }; HIGH_LOW_BTNS.forEach(b => delete next[b.id]); setPriceValues(next); localStorage.setItem(PRE_CHECK_KEY + '-prices', JSON.stringify(next)) }
  const toggleKeyLevel = (key: string) => { const next = activeKeyLevels.includes(key) ? activeKeyLevels.filter(k => k !== key) : [...activeKeyLevels, key]; setActiveKeyLevels(next); localStorage.setItem(PRE_CHECK_KEY + '-keylevels', JSON.stringify(next)) }
  const reset = () => {
    setChecks({}); setBias(null); setActiveDay(null); setActiveSession(null); setPriceValues({}); setActiveJamoSession(null); setActiveKeyLevels([]); setActiveAMD([])
    ;[PRE_CHECK_KEY, PRE_CHECK_KEY+'-bias', PRE_CHECK_KEY+'-day', PRE_CHECK_KEY+'-session', PRE_CHECK_KEY+'-prices', PRE_CHECK_KEY+'-jamo', PRE_CHECK_KEY+'-keylevels', PRE_CHECK_KEY+'-amd', PRE_CHECK_KEY+'-dop'].forEach(k => localStorage.removeItem(k))
  }
  const done = DEFAULT_CHECKS.filter(c => checks[c.id]).length
  const allGood = done === DEFAULT_CHECKS.length

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: allGood ? '#22c55e' : 'var(--t-border-soft)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#b8860b' }}>🎯 Pre-Trade Checklist</p>
          <button onClick={reset} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>Reset</button>
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-1" style={{ backgroundColor: 'var(--t-item-bg)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(done / DEFAULT_CHECKS.length) * 100}%`, background: allGood ? '#22c55e' : 'linear-gradient(90deg,#d4a017,#b8860b)' }} />
        </div>
        <p className="text-xs font-semibold" style={{ color: allGood ? '#16a34a' : 'var(--t-text-muted)' }}>
          {allGood ? '✅ Ready to trade!' : `${done} / ${DEFAULT_CHECKS.length} conditions`}
        </p>
      </div>

      {openPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} onClick={() => setOpenPopup(null)}>
          <div className="rounded-2xl p-5 w-72 flex flex-col gap-3" style={{ backgroundColor: 'var(--t-card-bg)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
            <p className="text-sm font-bold" style={{ color: 'var(--t-text-main)' }}>
              {HIGH_LOW_BTNS.find(b => b.id === openPopup)?.fullLabel ?? DEFAULT_CHECKS.find(c => c.id === openPopup)?.label}
            </p>
            <input type="number" step="any" autoFocus placeholder="Enter price..." value={popupInput} onChange={e => setPopupInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') confirmPrice(); if (e.key === 'Escape') setOpenPopup(null) }} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#b8860b' }} />
            <div className="flex gap-2">
              <button onClick={() => setOpenPopup(null)} className="flex-1 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>Cancel</button>
              <button onClick={confirmPrice} className="flex-1 py-2 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#d4a017,#b8860b)' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {DEFAULT_CHECKS.map(c => {
          const isChecked = !!checks[c.id]
          const displayLabel = c.id === 'sr' ? utcLabelAli : c.id === 'sr_jamo' ? utcLabelJamo : c.label
          return (
            <div key={c.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all"
              style={{ backgroundColor: isChecked ? 'rgba(34,197,94,0.08)' : 'var(--t-card-bg)', borderColor: isChecked ? '#22c55e' : 'var(--t-border-soft)' }}>
              <button onClick={() => toggle(c.id)} className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                style={{ borderColor: isChecked ? '#22c55e' : '#d1d5db', backgroundColor: isChecked ? '#22c55e' : 'transparent' }}>
                {isChecked && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>}
              </button>
              <span onClick={() => toggle(c.id)} className="text-sm font-semibold cursor-pointer"
                style={{ color: isChecked ? '#16a34a' : 'var(--t-text-main)', textDecoration: isChecked ? 'line-through' : 'none',
                  flex: ['volume','trend','sr','sr_jamo','dop','key_level','high_low','amd'].includes(c.id) ? '1' : '0 0 auto' }}>
                {displayLabel}
              </span>
              {!['volume','trend','sr','sr_jamo','dop','key_level','high_low','amd'].includes(c.id) && <span className="flex-1" />}
              {c.id === 'volume' && (
                <div className="flex gap-1.5" style={{ width: '66%' }}>
                  {DAY_BTNS.map(d => (
                    <button key={d} onClick={() => toggleDay(d)} className="flex-1 rounded-xl font-bold transition-all active:scale-95"
                      style={{ fontSize: 11, padding: '5px 0', border: '2px solid #b8860b', backgroundColor: activeDay === d ? 'rgba(184,134,11,0.45)' : 'transparent', color: activeDay === d ? '#fff' : '#b8860b' }}>{d}</button>
                  ))}
                </div>
              )}
              {c.id === 'trend' && (
                <div className="flex gap-1.5" style={{ width: '66%' }}>
                  {BIAS_BTNS.map(b => (
                    <button key={b.key} onClick={() => toggleBias(b.key)} className="flex-1 rounded-xl font-bold transition-all active:scale-95"
                      style={{ fontSize: 11, padding: '5px 0', border: `2px solid ${b.color}`, backgroundColor: bias === b.key ? `${b.color}73` : 'transparent', color: bias === b.key ? '#fff' : b.color }}>{b.label}</button>
                  ))}
                </div>
              )}
              {c.id === 'sr' && (
                <div className="flex gap-1.5" style={{ width: '66%' }}>
                  {SESSION_BTNS.map(s => (
                    <button key={s.key} onClick={() => toggleSession(s.key)} className="flex-1 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
                      style={{ fontSize: 11, padding: '5px 2px', border: `2px solid ${s.color}`, backgroundColor: activeSession === s.key ? `${s.color}73` : 'transparent', color: activeSession === s.key ? '#fff' : s.color }}>
                      <span>{s.label}</span><span style={{ fontSize: 8, opacity: 0.8 }}>{s.time}</span>
                    </button>
                  ))}
                </div>
              )}
              {c.id === 'sr_jamo' && (
                <div className="flex gap-1.5" style={{ width: '66%' }}>
                  {JAMO_SESSION_BTNS.map(s => (
                    <button key={s.key} onClick={() => toggleJamoSession(s.key)} className="flex-1 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
                      style={{ fontSize: 11, padding: '5px 2px', border: `2px solid ${s.color}`, backgroundColor: activeJamoSession === s.key ? `${s.color}73` : 'transparent', color: activeJamoSession === s.key ? '#fff' : s.color }}>
                      <span>{s.label}</span><span style={{ fontSize: 8, opacity: 0.8 }}>{s.time}</span>
                    </button>
                  ))}
                </div>
              )}
              {c.id === 'key_level' && (
                <div style={{ width: '66%', flexShrink: 0, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                  {KEY_LEVEL_BTNS.map(kb => (
                    <button key={kb.key} onClick={() => toggleKeyLevel(kb.key)} className="rounded-xl font-bold transition-all active:scale-95"
                      style={{ fontSize: 12, padding: '6px 4px', border: `2px solid ${kb.color}`, backgroundColor: activeKeyLevels.includes(kb.key) ? `${kb.color}73` : 'transparent', color: activeKeyLevels.includes(kb.key) ? '#fff' : kb.color }}>{kb.key}</button>
                  ))}
                </div>
              )}
              {c.id === 'dop' && (
                <div className="flex gap-1.5" style={{ width: '66%', flexShrink: 0 }}>
                  {DOP_BTNS.map(b => (
                    <button key={b.key} onClick={() => toggleDOP(b.key)} className="flex-1 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
                      style={{ fontSize: 11, padding: '5px 2px', border: `2px solid ${b.color}`, backgroundColor: activeDOP === b.key ? `${b.color}73` : 'transparent', color: activeDOP === b.key ? '#fff' : b.color }}>
                      <span>{b.label}</span><span style={{ fontSize: 9, opacity: 0.85 }}>{b.time}</span>
                    </button>
                  ))}
                </div>
              )}
              {c.id === 'amd' && (
                <div className="no-scrollbar amd-container">
                  <div className="amd-inner">
                    {AMD_BTNS.map(b => (
                      <button key={b.key} onClick={() => toggleAMD(b.key)} className="amd-btn-main rounded-xl font-bold transition-all active:scale-95"
                        style={{ fontSize: 10, padding: '5px 10px', border: `2px solid ${b.color}`, backgroundColor: activeAMD.includes(b.key) ? `${b.color}73` : 'transparent', color: activeAMD.includes(b.key) ? '#fff' : b.color }}>{b.label}</button>
                    ))}
                    <div className="amd-stack">
                      {AMD_STACK_BTNS.map(b => (
                        <button key={b.key} onClick={() => toggleAMD(b.key)} className="rounded-xl font-bold transition-all active:scale-95"
                          style={{ fontSize: 10, padding: '3px 10px', border: `2px solid ${b.color}`, backgroundColor: activeAMD.includes(b.key) ? `${b.color}73` : 'transparent', color: activeAMD.includes(b.key) ? '#fff' : b.color }}>{b.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {c.id === 'high_low' && (
                <button onClick={resetPrices} className="shrink-0 rounded-lg transition-all active:scale-90"
                  style={{ fontSize: 11, padding: '3px 7px', border: '1.5px solid #d1d5db', color: '#9ca3af', backgroundColor: 'transparent' }} title="Reset prices">↺</button>
              )}
              {c.id === 'high_low' && (
                <div className="flex gap-1.5" style={{ width: '66%' }}>
                  {HIGH_LOW_BTNS.map(hb => (
                    <button key={hb.id} onClick={() => openPricePopup(hb.id)} className="flex-1 rounded-xl transition-all active:scale-95 flex flex-col items-center"
                      style={{ padding: '4px 2px', border: '2px solid #b8860b', backgroundColor: priceValues[hb.id] ? 'rgba(184,134,11,0.15)' : 'transparent' }}>
                      <span style={{ fontSize: 9, color: '#9ca3af', fontWeight: 600 }}>{hb.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: priceValues[hb.id] ? '#b8860b' : '#9ca3af' }}>{priceValues[hb.id] || '--'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button onClick={reset} className="w-full rounded-xl text-sm font-bold transition-all active:scale-95"
        style={{ padding: '10px', border: '2px solid #e84057', color: '#e84057', backgroundColor: 'transparent' }}>
        🔄 Reset All
      </button>
    </div>
  )
}

// ── Counter Tab ──────────────────────────────────────────────────────────────
type CheckerItem = { id: string; title: string; plus: number; minus: number }
const CHECKER_KEY = 'trading-checker-v1'
function loadChecker(): CheckerItem[] { try { return JSON.parse(localStorage.getItem(CHECKER_KEY) || '[]') } catch { return [] } }
function saveChecker(items: CheckerItem[]) { localStorage.setItem(CHECKER_KEY, JSON.stringify(items)) }

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
  const remove = (id: string) => { const next = items.filter(i => i.id !== id); setItems(next); saveChecker(next) }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#b8860b' }}>✚ New Checker</p>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') add() }} placeholder="Checker title..."
            className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
          <button onClick={add} className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg,#d4a017,#b8860b)' }}>Confirm</button>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-14 rounded-2xl" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
          <p className="text-4xl mb-2">📋</p><p className="text-sm font-medium">Add your first checker above</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="rounded-2xl border-2 p-4" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-base" style={{ color: 'var(--t-text-main)' }}>{item.title}</p>
                <button onClick={() => remove(item.id)} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>✕</button>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <button onClick={() => update(item.id, 'plus', 1)} className="w-full py-3 rounded-xl text-xl font-black transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)', color: '#fff' }}>＋</button>
                  <span className="text-2xl font-black tabular-nums" style={{ color: '#16a34a' }}>{item.plus}</span>
                </div>
                <div className="w-px my-1" style={{ backgroundColor: 'var(--t-border-soft)' }} />
                <div className="flex-1 flex flex-col items-center gap-2">
                  <button onClick={() => update(item.id, 'minus', 1)} className="w-full py-3 rounded-xl text-xl font-black transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#e84057,#c0303e)', color: '#fff' }}>－</button>
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

// ── Strategy Guide Tab ───────────────────────────────────────────────────────
const STEPS = [
  { letter: 'A', icon: '📅', title: 'Day & News filter', ref: 'Day · No major news incoming', lines: ['Select the current day on the checklist.','Prefer Tuesday → Wednesday → Thursday (highest probability).','Avoid Mondays (Asian manipulation carry-over) and Fridays (low liquidity, early close).','Check economic calendar — skip the session if NFP, FOMC or CPI drops within the next 2h.'] },
  { letter: 'B', icon: '🕯️', title: 'Mark the Daily Open Price (DOP)', ref: 'DOP (Daily Open Price)', lines: ['Gold: DOP is fixed at 18h00 (prior day NY close).','Forex: DOP is fixed at 17h00.','Draw a horizontal line at the DOP on your chart.','Price will often gravitate back to this level — it is a magnet and a bias reference.'] },
  { letter: 'C', icon: '📍', title: 'Mark Previous Levels (H/L)', ref: 'High/Low (PDH · PDL · PSH · PSL)', lines: ['Input Previous Day High (PDH) and Previous Day Low (PDL) in the High/Low inputs.','Input Previous Session High (PSH) and Previous Session Low (PSL).','These are the key liquidity pools — Smart Money will target them first.','Draw these levels on every TF you will trade.'] },
  { letter: 'D', icon: '📊', title: 'Determine bias on 4H TF', ref: 'Trend confirmed 4H TF → Bullish / Bearish / Consolidation', lines: ['Open the 4H chart.','Ask: is price making Higher Highs + Higher Lows (Bullish), Lower Highs + Lower Lows (Bearish), or ranging (Consolidation)?','Bullish bias → look ONLY for long setups in the session.','Bearish bias → look ONLY for short setups.','Consolidation → wait for a break or skip the session.','Mark bias button on checklist.'] },
  { letter: 'E', icon: '⏰', title: 'Select your session & confirm time', ref: 'Time UTC-4 (Ali) · Time UTC-4 (Jamo)', lines: ['Ali method — London: 2am–7am | NY: 8am–12pm.','Jamo method — London: 1am–4am | NY: 8am–12am.','The highest-probability window is 2–3h after the session open.','Select the active session on the checklist.','Do NOT trade outside your selected session window.'] },
  { letter: 'F', icon: '🔄', title: 'Read the AMD phase', ref: 'AMD → Accumulation · Manipulation · Distribution · Retracement · Redistribution · Consolidation', lines: ['Accumulation: price ranging tightly — Smart Money loading positions.','Manipulation (Stop Hunt): price spikes above/below the range to grab liquidity, then reverses.','Distribution: the real directional move begins — this is your entry zone.','Retracement: price pulls back into a discount/premium before continuing.','Redistribution: second push in the same direction after a retracement.','Wait for the Manipulation phase to complete before entering — entering in Accumulation is too early.'] },
  { letter: 'G', icon: '🔎', title: 'Identify Key Levels on 15min TF', ref: 'Key level: OB · BB · FVG · iFVG · CISD · PsyN · Lq · NC', lines: ['Open 15min chart. Mark all relevant structures in the direction of your 4H bias.','OB (Order Block): last opposing candle before a strong impulse move.','BB (Breaker Block): an OB that was broken through — now acts as resistance/support.','FVG (Fair Value Gap): 3-candle imbalance — price often returns to fill it.','iFVG (Inverse FVG): a filled FVG that flips into support/resistance.','CISD (Change In State of Delivery): structural shift confirming the new direction.','PsyN (Psychological Number): round price levels (.00, .50) — strong magnets.','Lq (Liquidity): equal highs/lows, old session highs/lows — where stops are sitting.'] },
  { letter: 'H', icon: '📈', title: 'Analyse 15min — wait for the setup', ref: 'Analyse 15min', lines: ['Stay on the 15min chart.','Wait for price to reach one of your key levels (OB, FVG, PsyN, PDH/PDL…).','Confirm AMD context: the Manipulation spike should be visible and over.','Look for a Market Structure Shift (MSS) — a break of a short-term swing point in your bias direction.','DO NOT enter until MSS is confirmed on this timeframe.'] },
  { letter: 'I', icon: '✅', title: 'Confirm entry on 5min TF', ref: 'Confirmation 5min', lines: ['Drop to 5min chart only after 15min MSS is confirmed.','Look for: a displacement candle, a 5min FVG or OB forming at the key level.','Enter on the reaction to the 5min key level (limit order into OB/FVG) or on the close of the confirmation candle.','This is your entry — no earlier.'] },
  { letter: 'J', icon: '🎯', title: 'Execute — SL, TP, R:R', ref: 'Stop Loss · Take Profit · R:R ≥ 2', lines: ['Stop Loss: place it 2–5 pips beyond the key level that triggered entry (below OB low / above OB high).','Take Profit: target the nearest significant liquidity pool in your bias direction (PDH, PDL, PSH, PSL, PsyN).','Calculate R:R — if R:R < 2, skip the trade. Move TP further or wait for a better entry.','Confirm R:R ≥ 2 on checklist before submitting the order.','Once in trade: do not move SL against the position. Let the trade breathe.'] },
]

function StrategyGuideTab() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#b8860b' }}>📚 ICT / SMC Strategy — A to J</p>
        <p className="text-xs" style={{ color: 'var(--t-text-muted)' }}>Every step maps to an item in your Pre-Trade checklist. Follow in order.</p>
      </div>
      {STEPS.map(s => {
        const isOpen = open === s.letter
        return (
          <div key={s.letter} className="rounded-2xl border-2 overflow-hidden transition-all" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: isOpen ? '#b8860b' : 'var(--t-border-soft)' }}>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left" onClick={() => setOpen(isOpen ? null : s.letter)}>
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0" style={{ backgroundColor: isOpen ? '#b8860b' : 'var(--t-item-bg)', color: isOpen ? '#fff' : 'var(--t-text-muted)' }}>{s.letter}</span>
              <span className="text-base mr-1">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: 'var(--t-text-main)' }}>{s.title}</p>
                <p className="text-xs truncate" style={{ color: 'var(--t-text-soft)' }}>✅ {s.ref}</p>
              </div>
              <span className="text-xs shrink-0" style={{ color: 'var(--t-text-soft)' }}>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--t-border-soft)' }}>
                <ol className="mt-3 flex flex-col gap-2">
                  {s.lines.map((line, i) => (
                    <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--t-text-muted)' }}>
                      <span className="shrink-0 font-bold" style={{ color: '#b8860b' }}>{i + 1}.</span><span>{line}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
