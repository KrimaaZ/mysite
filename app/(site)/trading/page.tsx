'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/Modal'

type Trade = { id: number; date: string; instrument: string; type: string; entry: number; exit: number | null; size: number; pnl: number | null; notes: string | null; status: string }
type Strategy = { id: number; name: string; description: string; rules: string; timeframe: string; winRate: number | null; riskReward: number | null; notes: string | null }

const emptyTrade = { date: new Date().toISOString().split('T')[0], instrument: '', type: 'LONG', entry: '', exit: '', size: '', pnl: '', notes: '', status: 'OPEN' }
const emptyStrategy = { name: '', description: '', rules: '', timeframe: '', winRate: '', riskReward: '', notes: '' }

export default function TradingPage() {
  const [tab, setTab] = useState<'log' | 'backtest'>('log')
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

  const loadTrades = () => fetch('/api/trading').then(r => r.json()).then(setTrades)
  const loadStrats = () => fetch('/api/backtest').then(r => r.json()).then(setStrategies)
  useEffect(() => { loadTrades(); loadStrats() }, [])

  const closedTrades = trades.filter(t => t.status === 'CLOSED' && t.pnl != null)
  const totalPnl = closedTrades.reduce((s, t) => s + (t.pnl || 0), 0)
  const winRate = closedTrades.length > 0 ? Math.round((closedTrades.filter(t => (t.pnl || 0) > 0).length / closedTrades.length) * 100) : 0

  const openTradeModal = (t?: Trade) => {
    setTradeForm(t ? { date: t.date, instrument: t.instrument, type: t.type, entry: String(t.entry), exit: t.exit ? String(t.exit) : '', size: String(t.size), pnl: t.pnl ? String(t.pnl) : '', notes: t.notes || '', status: t.status } : emptyTrade)
    setEditTrade(t?.id ?? null); setTradeModal(true)
  }
  const saveTrade = async () => {
    setSaving(true)
    await fetch(editTrade ? `/api/trading/${editTrade}` : '/api/trading', { method: editTrade ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tradeForm) })
    await loadTrades(); setTradeModal(false); setSaving(false)
  }
  const delTrade = async (id: number) => {
    if (!confirm('Delete trade?')) return
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
    if (!confirm('Delete strategy?')) return
    await fetch(`/api/backtest/${id}`, { method: 'DELETE' }); loadStrats()
  }
  const analyzeAI = async (trade: Trade) => {
    setAiLoading(true)
    try {
      const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'trade_analysis', data: { trade } }) })
      const data = await r.json()
      alert(`Analysis:\n${data.analysis}\n\nLessons:\n${data.lessons}\n\nRating: ${data.rating}/5`)
    } catch { alert('AI failed') }
    setAiLoading(false)
  }
  const generateStrat = async () => {
    setAiLoading(true)
    try {
      const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'backtest', data: { description: stratForm.description || stratForm.name } }) })
      const data = await r.json()
      setStratForm(f => ({ ...f, name: data.name || f.name, description: data.description || f.description, rules: (data.rules || []).join('\n'), timeframe: data.timeframe || f.timeframe, notes: data.notes || f.notes }))
    } catch { alert('AI failed') }
    setAiLoading(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1a3a1a' }}>📈 Trading</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#8b5e3c' }}>Trades & strategies</p>
        </div>
        <button onClick={() => tab === 'log' ? openTradeModal() : openStratModal()}
          className="btn-glass btn-glass-gold px-4 py-2.5 rounded-xl text-sm font-medium">
          {tab === 'log' ? '+ Trade' : '+ Strategy'}
        </button>
      </div>

      {/* Stats */}
      {tab === 'log' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
          {[
            { label: 'Total', value: trades.length, unit: '' },
            { label: 'Closed', value: closedTrades.length, unit: '' },
            { label: 'Win Rate', value: winRate, unit: '%' },
            { label: 'P&L', value: totalPnl.toFixed(1), unit: '', color: totalPnl >= 0 ? '#2d6a4f' : '#c0303e' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 sm:p-4 border" style={{ backgroundColor: '#fff', borderColor: '#e8dcc8' }}>
              <p className="text-xs mb-0.5" style={{ color: '#a07850' }}>{s.label}</p>
              <p className="text-xl sm:text-2xl font-bold" style={{ color: s.color || '#1a3a1a' }}>{s.value}{s.unit}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[{ key: 'log', label: '📋 Log' }, { key: 'backtest', label: '🔬 Backtest' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as 'log' | 'backtest')}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ backgroundColor: tab === t.key ? '#b8860b' : '#f0e8d8', color: tab === t.key ? '#fff' : '#6b4226' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Trade Log */}
      {tab === 'log' && (
        trades.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#f9f5ef', color: '#a07850' }}>
            <p className="text-4xl mb-2">📊</p>
            <p className="font-medium text-sm">No trades yet. Start logging!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trades.map(t => (
              <div key={t.id} className="rounded-2xl border-2 p-4 shadow-sm" style={{ backgroundColor: '#fff', borderColor: '#e8dcc8' }}>
                <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: t.type === 'LONG' ? '#2d6a4f' : '#c0303e' }}>{t.type}</span>
                    <span className="font-semibold text-sm" style={{ color: '#1a3a1a' }}>{t.instrument}</span>
                    <span className="text-xs" style={{ color: '#a07850' }}>{t.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: t.status === 'OPEN' ? '#fef9e7' : '#f0e8d8', color: t.status === 'OPEN' ? '#b8860b' : '#6b4226' }}>{t.status}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => analyzeAI(t)} disabled={aiLoading} className="text-xs px-2 py-1 rounded-lg disabled:opacity-50" style={{ color: '#b8860b', backgroundColor: '#fef9e7' }}>{aiLoading ? '…' : 'AI'}</button>
                    <button onClick={() => openTradeModal(t)} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#8b5e3c', backgroundColor: '#f0e8d8' }}>Edit</button>
                    <button onClick={() => delTrade(t.id)} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>Del</button>
                  </div>
                </div>
                <div className="flex gap-3 text-sm flex-wrap">
                  <span style={{ color: '#6b4226' }}>In: <strong>{t.entry}</strong></span>
                  {t.exit && <span style={{ color: '#6b4226' }}>Out: <strong>{t.exit}</strong></span>}
                  <span style={{ color: '#6b4226' }}>Size: <strong>{t.size}</strong></span>
                  {t.pnl != null && <span className="font-bold" style={{ color: t.pnl >= 0 ? '#2d6a4f' : '#c0303e' }}>{t.pnl >= 0 ? '+' : ''}{t.pnl}</span>}
                </div>
                {t.notes && <p className="text-xs mt-2 italic" style={{ color: '#a07850' }}>{t.notes}</p>}
              </div>
            ))}
          </div>
        )
      )}

      {/* Backtest */}
      {tab === 'backtest' && (
        strategies.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#f9f5ef', color: '#a07850' }}>
            <p className="text-4xl mb-2">🔬</p>
            <p className="font-medium text-sm">No strategies yet. Add one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {strategies.map(s => {
              const rules: string[] = JSON.parse(s.rules)
              return (
                <div key={s.id} className="rounded-2xl border-2 overflow-hidden shadow-sm" style={{ backgroundColor: '#fff', borderColor: '#e8dcc8' }}>
                  <div className="p-4 flex items-start justify-between cursor-pointer" onClick={() => setExpandedStrat(expandedStrat === s.id ? null : s.id)}>
                    <div>
                      <h3 className="font-semibold" style={{ color: '#1a3a1a' }}>{s.name}</h3>
                      <div className="flex gap-3 mt-1 text-xs flex-wrap" style={{ color: '#a07850' }}>
                        <span>⏱ {s.timeframe}</span>
                        {s.winRate && <span>WR: {s.winRate}%</span>}
                        {s.riskReward && <span>R:R {s.riskReward}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={e => { e.stopPropagation(); openStratModal(s) }} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#8b5e3c', backgroundColor: '#f0e8d8' }}>Edit</button>
                      <button onClick={e => { e.stopPropagation(); delStrat(s.id) }} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>Del</button>
                      <span className="text-xs px-1" style={{ color: '#a07850' }}>{expandedStrat === s.id ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {expandedStrat === s.id && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: '#f0e8d8' }}>
                      <p className="text-sm mt-3 mb-3" style={{ color: '#6b4226' }}>{s.description}</p>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#2d6a4f' }}>📋 Rules</p>
                      <ul className="space-y-1">
                        {rules.map((r, i) => (
                          <li key={i} className="text-sm flex gap-2" style={{ color: '#6b4226' }}><span style={{ color: '#52b788' }}>{i + 1}.</span>{r}</li>
                        ))}
                      </ul>
                      {s.notes && <p className="text-sm mt-3 italic" style={{ color: '#a07850' }}>{s.notes}</p>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      )}

      {/* Trade Modal */}
      {tradeModal && (
        <Modal title={editTrade ? 'Edit Trade' : 'Log Trade'} onClose={() => setTradeModal(false)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>Date</label>
                <input type="date" value={tradeForm.date} onChange={e => setTradeForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>Instrument</label>
                <input value={tradeForm.instrument} onChange={e => setTradeForm(f => ({ ...f, instrument: e.target.value }))} placeholder="BTC/USD…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>Direction</label>
                <select value={tradeForm.type} onChange={e => setTradeForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }}>
                  <option value="LONG">LONG</option><option value="SHORT">SHORT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>Status</label>
                <select value={tradeForm.status} onChange={e => setTradeForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }}>
                  <option value="OPEN">OPEN</option><option value="CLOSED">CLOSED</option>
                </select>
              </div>
              {[{ label: 'Entry', key: 'entry' }, { label: 'Exit', key: 'exit' }, { label: 'Size', key: 'size' }, { label: 'P&L', key: 'pnl' }].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>{label}</label>
                  <input type="number" step="any" value={(tradeForm as Record<string, string>)[key]} onChange={e => setTradeForm(f => ({ ...f, [key]: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>Notes</label>
              <textarea value={tradeForm.notes} onChange={e => setTradeForm(f => ({ ...f, notes: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setTradeModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
            <button onClick={saveTrade} disabled={saving} className="btn-glass btn-glass-gold flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </Modal>
      )}

      {/* Strategy Modal */}
      {stratModal && (
        <Modal title={editStrat ? 'Edit Strategy' : 'New Strategy'} onClose={() => setStratModal(false)}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>Name</label>
              <input value={stratForm.name} onChange={e => setStratForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>Description</label>
              <textarea value={stratForm.description} onChange={e => setStratForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
            <button onClick={generateStrat} disabled={aiLoading} className="w-full py-2.5 rounded-xl text-sm font-medium disabled:opacity-60" style={{ backgroundColor: '#fef9e7', color: '#b8860b' }}>
              {aiLoading ? '✨ Generating…' : '✨ AI Generate Strategy'}
            </button>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>Rules (one per line)</label>
              <textarea value={stratForm.rules} onChange={e => setStratForm(f => ({ ...f, rules: e.target.value }))} rows={5} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>Timeframe</label>
                <input value={stratForm.timeframe} onChange={e => setStratForm(f => ({ ...f, timeframe: e.target.value }))} placeholder="1H, 4H…" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>Win Rate %</label>
                <input type="number" value={stratForm.winRate} onChange={e => setStratForm(f => ({ ...f, winRate: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>R:R</label>
                <input type="number" step="0.1" value={stratForm.riskReward} onChange={e => setStratForm(f => ({ ...f, riskReward: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: '#d4c5a9' }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b4226' }}>Notes</label>
              <textarea value={stratForm.notes} onChange={e => setStratForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ borderColor: '#d4c5a9' }} />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setStratModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
            <button onClick={saveStrat} disabled={saving} className="btn-glass btn-glass-gold flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
