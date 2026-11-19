'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'
import CoursesTab from '@/components/CoursesTab'

type Trade = { id: number; date: string; instrument: string; type: string; entry: number; exit: number | null; size: number; pnl: number | null; notes: string | null; status: string; tp: number | null; sl: number | null; riskPct: number | null; resultPct: number | null; rr: number | null; tvLinks: string | null }

const emptyTrade   = { date: new Date().toISOString().split('T')[0], instrument: '', type: 'LONG', entry: '', tp: '', sl: '', riskPct: '', resultPct: '', notes: '' }
const emptyTvLinks = { tf5m: '', tf1h: '', tf4h: '', tfd: '', tfw: '' }
const parseTvLinks = (s: string | null) => { try { return { ...emptyTvLinks, ...JSON.parse(s || '{}') } } catch { return { ...emptyTvLinks } } }

function TradingPageInner() {
  const router      = useRouter()
  const searchParams = useSearchParams()
  const validTabs   = ['guide', 'log'] as const
  const initialTab  = (validTabs.includes(searchParams.get('tab') as typeof validTabs[number]) ? searchParams.get('tab') : 'guide') as 'guide' | 'log'
  const [tab,         setTab]        = useState<'guide' | 'log'>(initialTab)
  const [showCourse,  setShowCourse] = useState(false)
  const [clearing,    setClearing]   = useState(false)
  const [trades,      setTrades]     = useState<Trade[]>([])
  const [tradeModal,  setTradeModal] = useState(false)
  const [tradeForm,   setTradeForm]  = useState(emptyTrade)
  const [tvLinks,     setTvLinks]    = useState({ ...emptyTvLinks })
  const [tvOpen,      setTvOpen]     = useState(false)
  const [editTrade,   setEditTrade]  = useState<number | null>(null)
  const [saving,      setSaving]     = useState(false)
  const { t } = useLang()

  const switchTab = (tb: 'guide' | 'log') => { setTab(tb); router.replace(`?tab=${tb}`, { scroll: false }) }
  const loadTrades = () => fetch('/api/trading').then(r => r.json()).then(setTrades)
  useEffect(() => { loadTrades() }, [])

  const closedTrades = trades.filter(tr => tr.resultPct != null || tr.status === 'CLOSED')
  const totalPnl     = closedTrades.reduce((s, tr) => s + (tr.resultPct ?? tr.pnl ?? 0), 0)
  const winRate      = closedTrades.length > 0 ? Math.round((closedTrades.filter(tr => (tr.resultPct ?? tr.pnl ?? 0) > 0).length / closedTrades.length) * 100) : 0

  const openTradeModal = (tr?: Trade) => {
    if (tr) {
      setTradeForm({ date: tr.date, instrument: tr.instrument, type: tr.type, entry: String(tr.entry), tp: tr.tp ? String(tr.tp) : '', sl: tr.sl ? String(tr.sl) : '', riskPct: tr.riskPct ? String(tr.riskPct) : '', resultPct: tr.resultPct ? String(tr.resultPct) : '', notes: tr.notes || '' })
      setTvLinks(parseTvLinks(tr.tvLinks))
    } else {
      setTradeForm(emptyTrade); setTvLinks({ ...emptyTvLinks })
    }
    setTvOpen(false); setEditTrade(tr?.id ?? null); setTradeModal(true)
  }

  const saveTrade = async () => {
    setSaving(true)
    const entry  = parseFloat(tradeForm.entry) || 0
    const tp     = parseFloat((tradeForm as Record<string,string>).tp) || 0
    const sl     = parseFloat((tradeForm as Record<string,string>).sl) || 0
    const rrVal  = entry && tp && sl && sl !== entry
      ? tradeForm.type === 'LONG' ? Number(((tp-entry)/(entry-sl)).toFixed(2)) : Number(((entry-tp)/(sl-entry)).toFixed(2))
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

  const clearAllTrades = async () => {
    if (!confirm('Delete ALL trade log entries? This cannot be undone.')) return
    setClearing(true)
    for (const tr of trades) await fetch(`/api/trading/${tr.id}`, { method: 'DELETE' })
    await loadTrades(); setClearing(false)
  }

  const tfLabels: { key: keyof typeof emptyTvLinks; label: string }[] = [
    { key: 'tf5m', label: '5m' }, { key: 'tf1h', label: '1H' },
    { key: 'tf4h', label: '4H' }, { key: 'tfd',  label: 'D'  },
    { key: 'tfw',  label: 'W'  },
  ]

  return (
    <div>
      {trades.length > 0 && (
        <div className="rounded-2xl p-5 mb-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,var(--t-hero-from) 0%,var(--t-hero-mid) 55%,var(--t-hero-to) 100%)' }}>
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#bbf7d0' }}>📈 Dernier trade</span>
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
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCourse(s => !s)} className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ backgroundColor: showCourse ? 'var(--t-primary)' : 'var(--t-item-bg)', color: showCourse ? '#fff' : 'var(--t-text-muted)' }}>
            🎓 Course
          </button>
          {tab === 'log' && !showCourse && (
            <button onClick={() => openTradeModal()} className="btn-glass btn-glass-gold px-4 py-2.5 rounded-xl text-sm font-medium">
              {t.addTrade}
            </button>
          )}
        </div>
      </div>

      {showCourse && <CoursesTab />}

      {!showCourse && tab === 'log' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
          {[
            { label: t.total,   value: trades.length,       unit: '' },
            { label: t.closed,  value: closedTrades.length, unit: '' },
            { label: t.winRate, value: winRate,              unit: '%' },
            { label: 'P&L %',   value: (totalPnl >= 0 ? '+' : '') + totalPnl.toFixed(1), unit: '%', color: totalPnl >= 0 ? '#2d6a4f' : '#c0303e' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 sm:p-4 border" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
              <p className="text-xs mb-0.5" style={{ color: 'var(--t-text-soft)' }}>{s.label}</p>
              <p className="text-xl sm:text-2xl font-bold" style={{ color: (s as {color?: string}).color || 'var(--t-text-main)' }}>{s.value}{s.unit}</p>
            </div>
          ))}
        </div>
      )}

      {!showCourse && (
        <div className="flex gap-2 mb-5 overflow-x-auto">
          {([
            { key: 'guide', label: '✅ Guide' },
            { key: 'log',   label: '📓 Journal' },
          ] as { key: 'guide' | 'log'; label: string }[]).map(tb => (
            <button key={tb.key} onClick={() => switchTab(tb.key)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0"
              style={{ backgroundColor: tab === tb.key ? 'var(--t-primary)' : 'var(--t-item-bg)', color: tab === tb.key ? '#fff' : 'var(--t-text-muted)' }}>
              {tb.label}
            </button>
          ))}
        </div>
      )}

      {/* Guide tab */}
      {!showCourse && tab === 'guide' && <PreTradeTab />}

      {/* Log tab */}
      {!showCourse && tab === 'log' && (
        trades.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
            <p className="text-4xl mb-2">📊</p>
            <p className="font-medium text-sm">{t.noTrades}</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {trades.map((tr, idx) => {
                const tradeNum = trades.length - idx
                const tvParsed = parseTvLinks(tr.tvLinks)
                const hasTv    = Object.values(tvParsed).some((v: unknown) => (v as string).trim())
                return (
                  <div key={tr.id} className="rounded-2xl border-2 p-4 shadow-sm" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>#{tradeNum}</span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: tr.type === 'LONG' ? '#2d6a4f' : '#c0303e' }}>{tr.type}</span>
                        <span className="font-bold text-sm" style={{ color: 'var(--t-text-main)' }}>{tr.instrument}</span>
                        <span className="text-xs" style={{ color: 'var(--t-text-soft)' }}>{tr.date}</span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => openTradeModal(tr)} className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--t-text-muted)', backgroundColor: 'var(--t-item-bg)' }}>{t.edit}</button>
                        <button onClick={() => delTrade(tr.id)} className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--c-red-text)', backgroundColor: 'var(--c-red-bg)' }}>Delete</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {[{ label: 'Entry', val: tr.entry }, { label: 'TP', val: tr.tp }, { label: 'SL', val: tr.sl }].map(({ label, val }) => (
                        <div key={label} className="rounded-xl px-2 py-2 text-center" style={{ backgroundColor: 'var(--t-item-bg)' }}>
                          <p className="text-xs" style={{ color: 'var(--t-text-soft)' }}>{label}</p>
                          <p className="text-sm font-bold" style={{ color: 'var(--t-text-main)' }}>{val ?? '—'}</p>
                        </div>
                      ))}
                      <div className="rounded-xl px-2 py-2 text-center" style={{ backgroundColor: tr.rr ? (tr.rr >= 1 ? 'var(--c-green-bg)' : 'var(--c-red-bg)') : 'var(--t-item-bg)' }}>
                        <p className="text-xs" style={{ color: 'var(--t-text-soft)' }}>R:R</p>
                        <p className="text-sm font-bold" style={{ color: tr.rr ? (tr.rr >= 1 ? '#2d6a4f' : '#c0303e') : 'var(--t-text-main)' }}>{tr.rr != null ? `${tr.rr}` : '—'}</p>
                      </div>
                    </div>
                    {(tr.riskPct != null || tr.resultPct != null) && (
                      <div className="flex gap-2 mb-2">
                        {tr.riskPct != null && <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--c-gold-bg)', color: 'var(--c-gold-text)' }}>⚠️ Risk {tr.riskPct}%</span>}
                        {tr.resultPct != null && <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: tr.resultPct >= 0 ? 'var(--c-green-bg)' : 'var(--c-red-bg)', color: tr.resultPct >= 0 ? '#2d6a4f' : '#c0303e' }}>{tr.resultPct >= 0 ? '+' : ''}{tr.resultPct}%</span>}
                      </div>
                    )}
                    {tr.notes && <p className="text-xs mb-2 italic" style={{ color: 'var(--t-text-soft)' }}>{tr.notes}</p>}
                    {hasTv && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <span className="text-xs font-semibold" style={{ color: 'var(--t-text-soft)' }}>📺</span>
                        {tfLabels.map(({ key, label }) =>
                          tvParsed[key] ? (
                            <a key={key} href={tvParsed[key]} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-bold px-2.5 py-1 rounded-full transition-all active:scale-95"
                              style={{ backgroundColor: '#1e609122', color: '#1e6091', border: '1px solid #1e609144' }}>{label}</a>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <button onClick={clearAllTrades} disabled={clearing}
              className="w-full mt-4 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
              style={{ padding: '10px', border: '2px solid #e84057', color: '#e84057', backgroundColor: 'transparent' }}>
              {clearing ? 'Clearing…' : '🗑 Clear All Trades'}
            </button>
          </>
        )
      )}

      {/* Trade Modal */}
      {tradeModal && (() => {
        const entry  = parseFloat(tradeForm.entry) || 0
        const tp     = parseFloat((tradeForm as Record<string,string>).tp) || 0
        const sl     = parseFloat((tradeForm as Record<string,string>).sl) || 0
        const rrCalc = entry && tp && sl && sl !== entry
          ? tradeForm.type === 'LONG' ? ((tp-entry)/(entry-sl)).toFixed(2) : ((entry-tp)/(sl-entry)).toFixed(2)
          : null
        const tradeNum = editTrade ? (trades.length - trades.findIndex(t => t.id === editTrade)) : trades.length + 1
        return (
          <Modal title={`${editTrade ? '✏️ Edit' : '📝 Log'} Trade #${tradeNum}`} onClose={() => setTradeModal(false)}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.date}</label>
                  <input type="date" value={tradeForm.date} onChange={e => setTradeForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.instrument}</label>
                  <input value={tradeForm.instrument} onChange={e => setTradeForm(f => ({ ...f, instrument: e.target.value }))}
                    placeholder="XAUUSD…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.direction}</label>
                <div className="grid grid-cols-2 gap-2">
                  {['LONG', 'SHORT'].map(d => (
                    <button key={d} onClick={() => setTradeForm(f => ({ ...f, type: d }))}
                      className="py-2.5 rounded-xl text-sm font-bold transition-all"
                      style={{ backgroundColor: tradeForm.type === d ? (d === 'LONG' ? 'var(--t-primary)' : 'rgba(232,64,87,0.2)') : 'var(--t-item-bg)', color: tradeForm.type === d ? '#fff' : 'var(--t-text-muted)' }}>
                      {d === 'LONG' ? '📈 LONG' : '📉 SHORT'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[{ label: 'Entry', key: 'entry' }, { label: 'TP', key: 'tp' }, { label: 'SL', key: 'sl' }].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{label}</label>
                    <input type="number" step="any" value={(tradeForm as Record<string,string>)[key]}
                      onChange={e => setTradeForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>R:R (auto)</label>
                  <div className="w-full px-3 py-2.5 rounded-xl border text-sm font-bold"
                    style={{ borderColor: 'var(--t-border-soft)', backgroundColor: 'var(--t-item-bg)', color: rrCalc ? (parseFloat(rrCalc) >= 1 ? '#2d6a4f' : '#c0303e') : 'var(--t-text-soft)' }}>
                    {rrCalc ? `${rrCalc} : 1` : '—'}
                  </div>
                </div>
              </div>
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
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.notes}</label>
                <textarea value={tradeForm.notes} onChange={e => setTradeForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2} placeholder="Setup, confluence, context…"
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
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
                        <span className="text-xs font-bold w-8 shrink-0 text-center px-1.5 py-1 rounded-lg" style={{ backgroundColor: '#1e609122', color: '#1e6091' }}>{label}</span>
                        <input value={tvLinks[key]} onChange={e => setTvLinks(l => ({ ...l, [key]: e.target.value }))}
                          placeholder="https://www.tradingview.com/chart/..."
                          className="flex-1 px-3 py-2 rounded-xl border text-xs outline-none" style={{ borderColor: 'var(--t-border-soft)' }} />
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
    </div>
  )
}

export default function TradingPage() {
  return <Suspense><TradingPageInner /></Suspense>
}

// ── PreTradeTab ──────────────────────────────────────────────────────────────
const PRE_CHECK_KEY = 'pretrade-v2'

const DEFAULT_CHECKS = [
  { id: 'trend',     label: 'Trend Global HTF' },
  { id: 'volume',    label: 'Day' },
  { id: 'sr',        label: 'Time' },
  { id: 'sr_jamo',   label: 'Time (Jamo)' },
  { id: 'dop',       label: 'DOP (Daily Open Price)' },
  { id: 'key_level', label: 'Zone' },
  { id: 'confirm_5', label: 'Confirmation 5min' },
  { id: 'sl',        label: 'Stop Loss placed' },
  { id: 'tp',        label: 'Take Profit target set' },
  { id: 'rr',        label: 'R:R ≥ 2' },
  { id: 'news',      label: 'Is there any news today? Skip it.' },
]

const DAY_BTNS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const HTF_TFS    = ['1M', '1W', '1D', '4H'] as const
const BIAS_OPTS  = [
  { label: 'Bullish', color: '#22c55e' },
  { label: 'Bearish', color: '#e84057' },
  { label: 'Range',   color: '#f97316' },
]
const SESSION_BTNS = [
  { key: 'london', label: 'London', time: '8am',  color: '#3b82f6' },
  { key: 'ny',     label: 'NY',     time: '1pm',  color: '#8b5cf6' },
  { key: 'asian',  label: 'Asian',  time: '11pm', color: '#f97316' },
]
const JAMO_SESSION_BTNS = [
  { key: 'jamo_london', label: 'London', time: '1am-4am',  color: '#3b82f6' },
  { key: 'jamo_ny',     label: 'NY',     time: '8am-12am', color: '#8b5cf6' },
]
const ZONE_TFS  = ['4H', '1H', '30m'] as const
const ZONE_OPTS = [
  { label: 'BISI', color: '#22c55e' },
  { label: 'SIBI', color: '#e84057' },
  { label: 'OB+',  color: '#22c55e' },
  { label: 'OB-',  color: '#e84057' },
  { label: 'Clear', color: '#9ca3af' },
]

// SVG candle definitions for the candle picker
type CandleType = { id: string; bullish: boolean; wick: 'none' | 'top' | 'bottom' | 'both'; neutral?: boolean }
const CANDLE_TYPES: CandleType[] = [
  { id: 'bull_plain',  bullish: true,  wick: 'none' },
  { id: 'bull_top',    bullish: true,  wick: 'top' },
  { id: 'bull_bot',    bullish: true,  wick: 'bottom' },
  { id: 'bear_plain',  bullish: false, wick: 'none' },
  { id: 'bear_top',    bullish: false, wick: 'top' },
  { id: 'bear_bot',    bullish: false, wick: 'bottom' },
  { id: 'neutral',     bullish: true,  wick: 'both', neutral: true },
]

function CandleSvg({ candle, size = 28, selected = false }: { candle: CandleType | null; size?: number; selected?: boolean }) {
  const w = size, h = size
  const bodyW = w * 0.45
  const bodyX = (w - bodyW) / 2
  const wickX = w / 2

  if (!candle) {
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x={bodyX} y={h * 0.2} width={bodyW} height={h * 0.6} rx="2"
          fill="none" stroke="var(--t-text-muted)" strokeWidth="1.5" strokeDasharray="3,2" />
      </svg>
    )
  }

  const color = candle.neutral ? 'var(--t-text-muted)' : candle.bullish ? '#22c55e' : '#e84057'
  const bodyTop = candle.wick === 'top' || candle.wick === 'both' ? h * 0.35 : h * 0.15
  const bodyBot = candle.wick === 'bottom' || candle.wick === 'both' ? h * 0.65 : h * 0.85
  const bodyH = bodyBot - bodyTop

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {(candle.wick === 'top' || candle.wick === 'both') && (
        <line x1={wickX} y1={h * 0.05} x2={wickX} y2={bodyTop} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      )}
      {(candle.wick === 'bottom' || candle.wick === 'both') && (
        <line x1={wickX} y1={bodyBot} x2={wickX} y2={h * 0.95} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      )}
      <rect x={bodyX} y={bodyTop} width={bodyW} height={bodyH} rx="2"
        fill={selected ? color : `${color}55`} stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

function PreTradeTab() {
  const edt = (() => { const m = new Date().getMonth() + 1; return m >= 3 && m <= 11 })()
  const utcLabelAli  = edt ? 'Time UTC-4' : 'Time UTC-5'
  const utcLabelJamo = 'Time UTC+1 (Morocco)'

  const initialLoaded = useRef(false)
  const [checks,            setChecks]           = useState<Record<string, boolean>>({})
  const [biasByTf,          setBiasByTf]         = useState<Record<string, string>>({})
  const [activeDay,         setActiveDay]        = useState<string | null>(null)
  const [activeSession,     setActiveSession]    = useState<string | null>(null)
  const [activeJamoSession, setActiveJamoSession]= useState<string | null>(null)
  const [activeCandle,      setActiveCandle]     = useState<string | null>(null)
  const [candlePickerOpen,  setCandlePickerOpen] = useState(false)
  const [zoneByTf,          setZoneByTf]         = useState<Record<string, string>>({})
  const [guideOpen,         setGuideOpen]        = useState(false)

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(PRE_CHECK_KEY) || '{}')
      if (d.checks)             setChecks(d.checks)
      if (d.biasByTf)           setBiasByTf(d.biasByTf)
      if (d.activeDay)          setActiveDay(d.activeDay)
      if (d.activeSession)      setActiveSession(d.activeSession)
      if (d.activeJamoSession)  setActiveJamoSession(d.activeJamoSession)
      if (d.activeCandle)       setActiveCandle(d.activeCandle)
      if (d.zoneByTf)           setZoneByTf(d.zoneByTf)
    } catch {}
    initialLoaded.current = true
  }, [])

  useEffect(() => {
    if (!initialLoaded.current) return
    const data = { checks, biasByTf, activeDay, activeSession, activeJamoSession, activeCandle, zoneByTf }
    localStorage.setItem(PRE_CHECK_KEY, JSON.stringify(data))
    const timer = setTimeout(() => {
      fetch('/api/pretrade', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: JSON.stringify(data) }) })
    }, 800)
    return () => clearTimeout(timer)
  }, [checks, biasByTf, activeDay, activeSession, activeJamoSession, activeCandle, zoneByTf])

  const toggle         = (id: string) => setChecks(p => ({ ...p, [id]: !p[id] }))
  const toggleBias     = (tf: string, val: string) => setBiasByTf(p => ({ ...p, [tf]: p[tf] === val ? '' : val }))
  const toggleDay      = (d: string)  => setActiveDay(p => p === d ? null : d)
  const toggleSession  = (k: string)  => setActiveSession(p => p === k ? null : k)
  const toggleJamo     = (k: string)  => setActiveJamoSession(p => p === k ? null : k)
  const pickCandle     = (id: string) => { setActiveCandle(id); setCandlePickerOpen(false) }
  const setZone        = (tf: string, val: string) => setZoneByTf(p => ({ ...p, [tf]: p[tf] === val ? '' : val }))

  const reset = () => {
    setChecks({}); setBiasByTf({}); setActiveDay(null); setActiveSession(null)
    setActiveJamoSession(null); setActiveCandle(null); setCandlePickerOpen(false); setZoneByTf({})
    localStorage.removeItem(PRE_CHECK_KEY)
  }

  const isFomoDay = activeDay === 'Mon' || activeDay === 'Fri'
  const done      = DEFAULT_CHECKS.filter(c => checks[c.id]).length
  const allGood   = done === DEFAULT_CHECKS.length

  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div className="rounded-2xl p-4 border-2" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: allGood ? '#22c55e' : 'var(--t-border-soft)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--c-gold-text)' }}>🎯 Pre-Trade Checklist</p>
          <button onClick={reset} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>Reset</button>
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-1" style={{ backgroundColor: 'var(--t-item-bg)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(done / DEFAULT_CHECKS.length) * 100}%`, background: allGood ? '#22c55e' : 'linear-gradient(90deg,#d4a017,#b8860b)' }} />
        </div>
        <p className="text-xs font-semibold" style={{ color: allGood ? '#16a34a' : 'var(--t-text-muted)' }}>
          {allGood ? '✅ Ready to trade!' : `${done} / ${DEFAULT_CHECKS.length} conditions`}
        </p>
      </div>

      {/* FOMO warning (item 9) */}
      {isFomoDay && (
        <div className="rounded-2xl p-3 border-2 flex items-center gap-3"
          style={{ backgroundColor: 'rgba(232,64,87,0.08)', borderColor: '#e84057' }}>
          <span className="text-xl shrink-0">⚠️</span>
          <p className="text-sm font-bold" style={{ color: '#e84057' }}>
            FOMO Alert — {activeDay === 'Mon' ? 'Monday' : 'Friday'}: High risk day. Be extra cautious or skip.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {DEFAULT_CHECKS.map(c => {
          const isChecked    = !!checks[c.id]
          const displayLabel = c.id === 'sr' ? utcLabelAli : c.id === 'sr_jamo' ? utcLabelJamo : c.label
          return (
            <div key={c.id} className="rounded-2xl border-2 transition-all"
              style={{ backgroundColor: isChecked ? 'rgba(34,197,94,0.08)' : 'var(--t-card-bg)', borderColor: isChecked ? '#22c55e' : 'var(--t-border-soft)' }}>
              {/* Header row */}
              <div className="flex items-center gap-3 px-4 py-3">
                <button onClick={() => toggle(c.id)}
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                  style={{ borderColor: isChecked ? '#22c55e' : '#d1d5db', backgroundColor: isChecked ? '#22c55e' : 'transparent' }}>
                  {isChecked && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>}
                </button>
                <span onClick={() => toggle(c.id)} className="text-sm font-semibold cursor-pointer flex-1"
                  style={{ color: isChecked ? '#16a34a' : 'var(--t-text-main)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                  {displayLabel}
                </span>
              </div>

              {/* Sub-controls */}
              {c.id === 'trend' && (
                <div className="px-4 pb-3 flex flex-col gap-2">
                  {HTF_TFS.map(tf => (
                    <div key={tf} className="flex items-center gap-2">
                      <span className="text-xs font-bold w-7 shrink-0 text-right" style={{ color: 'var(--t-text-soft)' }}>{tf}</span>
                      <div className="flex gap-1.5 flex-1">
                        {BIAS_OPTS.map(o => {
                          const active = biasByTf[tf] === o.label
                          return (
                            <button key={o.label} onClick={() => toggleBias(tf, o.label)}
                              className="flex-1 rounded-xl font-bold transition-all active:scale-95"
                              style={{ fontSize: 11, padding: '5px 2px', border: `2px solid ${o.color}`, backgroundColor: active ? `${o.color}44` : 'transparent', color: active ? '#fff' : o.color }}>
                              {o.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {c.id === 'volume' && (
                <div className="px-4 pb-3 flex gap-1.5">
                  {DAY_BTNS.map(d => {
                    const isFomo = d === 'Mon' || d === 'Fri'
                    const borderColor = isFomo ? '#e84057' : 'rgba(255,255,255,0.4)'
                    const activeColor = isFomo ? 'rgba(232,64,87,0.2)' : 'rgba(255,255,255,0.12)'
                    const textColor   = isFomo ? '#e84057' : 'var(--t-text-main)'
                    return (
                      <button key={d} onClick={() => toggleDay(d)} className="flex-1 rounded-xl font-bold transition-all active:scale-95"
                        style={{ fontSize: 11, padding: '5px 0', border: `2px solid ${borderColor}`, backgroundColor: activeDay === d ? activeColor : 'transparent', color: textColor }}>
                        {d}
                      </button>
                    )
                  })}
                </div>
              )}

              {c.id === 'sr' && (
                <div className="px-4 pb-3 flex gap-1.5">
                  {SESSION_BTNS.map(s => (
                    <button key={s.key} onClick={() => toggleSession(s.key)} className="flex-1 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
                      style={{ fontSize: 11, padding: '5px 2px', border: `2px solid ${s.color}`, backgroundColor: activeSession === s.key ? `${s.color}73` : 'transparent', color: activeSession === s.key ? '#fff' : s.color }}>
                      <span>{s.label}</span><span style={{ fontSize: 8, opacity: 0.8 }}>{s.time}</span>
                    </button>
                  ))}
                </div>
              )}

              {c.id === 'sr_jamo' && (
                <div className="px-4 pb-3 flex gap-1.5">
                  {JAMO_SESSION_BTNS.map(s => (
                    <button key={s.key} onClick={() => toggleJamo(s.key)} className="flex-1 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
                      style={{ fontSize: 11, padding: '5px 2px', border: `2px solid ${s.color}`, backgroundColor: activeJamoSession === s.key ? `${s.color}73` : 'transparent', color: activeJamoSession === s.key ? '#fff' : s.color }}>
                      <span>{s.label}</span><span style={{ fontSize: 8, opacity: 0.8 }}>{s.time}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* DOP: XAUUSD 18h + SVG candle picker */}
              {c.id === 'dop' && (
                <div className="px-4 pb-3">
                  <div className="flex items-center gap-3">
                    {/* XAUUSD badge with 18h inside */}
                    <span className="px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      style={{ backgroundColor: 'rgba(184,134,11,0.15)', color: '#b8860b', border: '2px solid #b8860b' }}>
                      XAUUSD <span style={{ opacity: 0.7 }}>18h</span>
                    </span>
                    {/* Candle picker trigger */}
                    <div className="relative">
                      <button
                        onClick={() => setCandlePickerOpen(o => !o)}
                        className="flex items-center justify-center rounded-xl transition-all active:scale-95"
                        style={{ width: 40, height: 40, border: '2px solid var(--t-border-soft)', backgroundColor: 'transparent' }}
                      >
                        <CandleSvg candle={CANDLE_TYPES.find(ct => ct.id === activeCandle) ?? null} size={28} selected={!!activeCandle} />
                      </button>
                      {/* Picker dropdown */}
                      {candlePickerOpen && (
                        <div className="absolute left-0 top-12 z-50 flex gap-1.5 p-2 rounded-2xl"
                          style={{ backgroundColor: 'var(--t-card-bg)', border: '2px solid var(--t-border-soft)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                          {CANDLE_TYPES.map(ct => (
                            <button key={ct.id}
                              onClick={() => pickCandle(ct.id)}
                              className="flex items-center justify-center rounded-xl transition-all active:scale-90"
                              style={{ width: 36, height: 36, border: `2px solid ${activeCandle === ct.id ? '#b8860b' : 'var(--t-border-soft)'}`, backgroundColor: activeCandle === ct.id ? 'rgba(184,134,11,0.2)' : 'transparent' }}>
                              <CandleSvg candle={ct} size={26} selected={activeCandle === ct.id} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Zone card (item 14) */}
              {c.id === 'key_level' && (
                <div className="px-4 pb-3 flex flex-col gap-2">
                  {ZONE_TFS.map(tf => (
                    <div key={tf} className="flex items-center gap-2">
                      <span className="text-xs font-bold w-8 shrink-0 text-right" style={{ color: 'var(--t-text-soft)' }}>{tf}</span>
                      <div className="flex gap-1 flex-1">
                        {ZONE_OPTS.map(o => {
                          const active = zoneByTf[tf] === o.label
                          return (
                            <button key={o.label} onClick={() => setZone(tf, o.label)}
                              className="flex-1 rounded-xl font-bold transition-all active:scale-95"
                              style={{ fontSize: 11, padding: '6px 2px', border: `2px solid ${o.color}`, backgroundColor: active ? `${o.color}44` : 'transparent', color: active ? '#fff' : o.color }}>
                              {o.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* News simple checkbox (item 10) */}
              {c.id === 'news' && (
                <div className="px-4 pb-3">
                  <button onClick={() => toggle('news')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95"
                    style={{ backgroundColor: isChecked ? 'rgba(232,64,87,0.1)' : 'var(--t-item-bg)', color: isChecked ? '#e84057' : 'var(--t-text-muted)', borderColor: isChecked ? '#e84057' : 'var(--t-border-soft)' }}>
                    {isChecked ? '⚠️ News today — skip session' : 'No news / confirm clear'}
                  </button>
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

      {/* Strategy Guide (collapsible) */}
      <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: 'var(--t-border-soft)' }}>
        <button className="w-full flex items-center justify-between px-4 py-3"
          onClick={() => setGuideOpen(o => !o)}>
          <span className="text-sm font-bold" style={{ color: 'var(--c-gold-text)' }}>📚 Strategy Guide</span>
          <span className="text-xs" style={{ color: 'var(--t-text-soft)' }}>{guideOpen ? '▲' : '▼'}</span>
        </button>
        {guideOpen && (
          <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--t-border-soft)' }}>
            <div className="pt-3">
              <StrategyGuideTab />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Strategy Guide ───────────────────────────────────────────────────────────
const STEPS = [
  { letter: 'A', icon: '📅', title: 'Day & News filter', ref: 'Day · No major news incoming', lines: ['Select the current day on the checklist.','Prefer Tuesday → Wednesday → Thursday (highest probability).','Avoid Mondays (Asian manipulation carry-over) and Fridays (low liquidity, early close).','Check economic calendar — skip the session if NFP, FOMC or CPI drops within the next 2h.'] },
  { letter: 'B', icon: '🕯️', title: 'Mark the Daily Open Price (DOP)', ref: 'DOP (Daily Open Price)', lines: ['Gold: DOP is fixed at 18h00 (prior day NY close).','Draw a horizontal line at the DOP on your chart.','Price will often gravitate back to this level — it is a magnet and a bias reference.'] },
  { letter: 'C', icon: '📍', title: 'Mark the ERL (H/L)', ref: 'High/Low depend on the trend', lines: ['Determine the direction of the market.','Determine the zone of the correction.','Draw the ERL on TF you will trade.'] },
  { letter: 'D', icon: '⏰', title: 'Select your session & confirm time', ref: 'Time UTC+1 (Morocco)', lines: ['Wait after 11H/12H — highest-probability window after manipulation is done.','After you defined the zone of the correction put alarm in this zone.','Do NOT trade outside your selected session window (max 18H).'] },
  { letter: 'E', icon: '🔄', title: 'Read the AMD phase', ref: 'AMD → Accumulation · Manipulation · Distribution', lines: ['Accumulation: price ranging tightly — Smart Money loading positions.','Manipulation (Stop Hunt): price spikes above/below the range to grab liquidity, then reverses.','Distribution: the real directional move begins — this is your entry zone.','Retracement: price pulls back into a discount/premium before continuing.','Wait for the Manipulation phase to complete before entering — entering in Accumulation is too early.'] },
  { letter: 'F', icon: '🔎', title: 'Zone of Correction', ref: 'Key level: OB · FVG', lines: ['Open 30min 1H 4H chart. Mark all relevant FVG in the direction of your bias and scale it to one zone.','OB (Order Block): last opposing candle before a strong impulse move with FVG — used once only.'] },
  { letter: 'G', icon: '📈', title: 'Wait for the setup', ref: 'Pullback to our zone — wait for entry model in 3 or 5 min', lines: ['Stay on the 3min or 5min chart.','Wait for price to reach our zone.','Confirm entry by: BOS, MSS or iFVG.'] },
  { letter: 'H', icon: '🎯', title: 'Execute — SL, TP, R:R', ref: 'Stop Loss · Take Profit · R:R ≥ 2', lines: ['Stop Loss: place it below the last High or Low with eye space.','Take Profit: target the significant liquidity pool in your bias direction (ERL).','If R:R < 2, skip the trade or move TP further with a BE after 1 RR.','Once in trade: do not move SL against the position. Let the trade breathe.'] },
]

function StrategyGuideTab() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-3">
      {STEPS.map(s => {
        const isOpen = open === s.letter
        return (
          <div key={s.letter} className="rounded-2xl border-2 overflow-hidden transition-all"
            style={{ backgroundColor: 'var(--t-card-bg)', borderColor: isOpen ? '#b8860b' : 'var(--t-border-soft)' }}>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left" onClick={() => setOpen(isOpen ? null : s.letter)}>
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
                style={{ backgroundColor: isOpen ? 'var(--t-primary)' : 'var(--t-item-bg)', color: isOpen ? '#fff' : 'var(--t-text-muted)' }}>{s.letter}</span>
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
                      <span className="shrink-0 font-bold" style={{ color: 'var(--c-gold-text)' }}>{i + 1}.</span>
                      <span>{line}</span>
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
