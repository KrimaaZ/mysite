'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'

type BtTrade = {
  id: number
  date: string
  type: string
  entry: number
  sl: number | null
  tp: number | null
  rr: number | null
  riskPct: number | null
  result: number | null
  comment: string | null
  flagged: boolean
  hasScreenshots: string[]
}

const emptyBtForm = {
  date: new Date().toISOString().split('T')[0],
  time: '',
  type: 'BUY',
  entry: '',
  sl: '',
  tp: '',
  riskPct: '',
  result: '',
  comment: '',
}

const BT_TIMEFRAMES = ['AFTER', '3M', '5M', '15M', '30M', '1H', '4H', '1D', '1W', '1M']

export default function BacktestJournal() {
  const { t } = useLang()
  const [btTrades, setBtTrades] = useState<BtTrade[]>([])
  const [btModal, setBtModal] = useState(false)
  const [btForm, setBtForm] = useState({ ...emptyBtForm })
  const [editBt, setEditBt] = useState<number | null>(null)
  const [btFilterFlagged, setBtFilterFlagged] = useState(false)
  const [scPopup, setScPopup] = useState<{ tradeId: number; timeframe: string } | null>(null)
  const [scImage, setScImage] = useState<string | null>(null)
  const [scSaving, setScSaving] = useState(false)
  const [scLoading, setScLoading] = useState(false)
  const [scFullscreen, setScFullscreen] = useState(false)
  const [carousel, setCarousel] = useState<{ trade: BtTrade; timeframes: string[]; index: number } | null>(null)
  const [carouselImages, setCarouselImages] = useState<Record<string, string>>({})
  const [carouselLoading, setCarouselLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadBtTrades = () =>
    fetch('/api/backtest-trades').then(r => r.json()).then(setBtTrades)

  useEffect(() => { loadBtTrades() }, [])

  useEffect(() => {
    if (!scPopup) return
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      for (const item of Array.from(items || [])) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (!file) continue
          const reader = new FileReader()
          reader.onload = () => setScImage(reader.result as string)
          reader.readAsDataURL(file)
          e.preventDefault()
          break
        }
      }
    }
    window.addEventListener('paste', handler)
    return () => window.removeEventListener('paste', handler)
  }, [scPopup])

  const openBtModal = (bt?: BtTrade) => {
    if (bt) {
      const parts = bt.date.split(' ')
      setBtForm({
        date: parts[0],
        time: parts[1] || '',
        type: bt.type,
        entry: String(bt.entry),
        sl: bt.sl ? String(bt.sl) : '',
        tp: bt.tp ? String(bt.tp) : '',
        riskPct: bt.riskPct ? String(bt.riskPct) : '',
        result: bt.result ? String(bt.result) : '',
        comment: bt.comment || '',
      })
      setEditBt(bt.id)
    } else {
      setBtForm({ ...emptyBtForm })
      setEditBt(null)
    }
    setBtModal(true)
  }

  const saveBtTrade = async () => {
    setSaving(true)
    const entry = parseFloat(btForm.entry) || 0
    const tp    = parseFloat(btForm.tp) || 0
    const sl    = parseFloat(btForm.sl) || 0
    const rrVal = entry && tp && sl && sl !== entry
      ? btForm.type === 'BUY'
        ? Number(((tp - entry) / (entry - sl)).toFixed(2))
        : Number(((entry - tp) / (sl - entry)).toFixed(2))
      : null
    const currentFlagged = editBt ? (btTrades.find(b => b.id === editBt)?.flagged ?? false) : false
    const fullDate = btForm.time ? `${btForm.date} ${btForm.time}` : btForm.date
    const body = { ...btForm, date: fullDate, rr: rrVal, flagged: currentFlagged }
    await fetch(editBt ? `/api/backtest-trades/${editBt}` : '/api/backtest-trades', {
      method: editBt ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await loadBtTrades()
    setBtModal(false)
    setSaving(false)
  }

  const delBtTrade = async (id: number) => {
    if (!confirm('Delete this backtest trade?')) return
    await fetch(`/api/backtest-trades/${id}`, { method: 'DELETE' })
    loadBtTrades()
  }

  const toggleFlag = async (bt: BtTrade) => {
    await fetch(`/api/backtest-trades/${bt.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: bt.date, type: bt.type, entry: bt.entry,
        sl: bt.sl, tp: bt.tp, rr: bt.rr,
        riskPct: bt.riskPct, result: bt.result,
        comment: bt.comment, flagged: !bt.flagged,
      }),
    })
    loadBtTrades()
  }

  const openScPopup = async (tradeId: number, timeframe: string) => {
    setScPopup({ tradeId, timeframe })
    setScImage(null)
    setScLoading(true)
    const r = await fetch(`/api/backtest-screenshots?tradeId=${tradeId}&timeframe=${encodeURIComponent(timeframe)}`)
    const data = await r.json()
    if (data?.imageData) setScImage(data.imageData)
    setScLoading(false)
  }

  const saveSc = async () => {
    if (!scImage || !scPopup) return
    setScSaving(true)
    await fetch('/api/backtest-screenshots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tradeId: scPopup.tradeId, timeframe: scPopup.timeframe, imageData: scImage }),
    })
    await loadBtTrades()
    setScPopup(null)
    setScSaving(false)
  }

  const deleteSc = async () => {
    if (!scPopup) return
    await fetch('/api/backtest-screenshots', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tradeId: scPopup.tradeId, timeframe: scPopup.timeframe }),
    })
    await loadBtTrades()
    setScPopup(null)
  }

  const TF_ORDER = ['1M', '1W', '1D', '4H', '1H', '30M', '15M', '5M', '3M', 'AFTER']

  const openCarousel = async (trade: BtTrade) => {
    if (trade.hasScreenshots.length === 0) return
    const timeframes = [...trade.hasScreenshots].sort(
      (a, b) => TF_ORDER.indexOf(a) - TF_ORDER.indexOf(b)
    )
    setCarousel({ trade, timeframes, index: 0 })
    setCarouselImages({})
    setCarouselLoading(true)
    const results: Record<string, string> = {}
    await Promise.all(
      timeframes.map(async tf => {
        const r = await fetch(`/api/backtest-screenshots?tradeId=${trade.id}&timeframe=${encodeURIComponent(tf)}`)
        const data = await r.json()
        if (data?.imageData) results[tf] = data.imageData
      })
    )
    setCarouselImages(results)
    setCarouselLoading(false)
  }

  const btClosed  = btTrades.filter(bt => bt.result != null)
  const btWinRate = btClosed.length > 0
    ? Math.round((btClosed.filter(bt => (bt.result ?? 0) > 0).length / btClosed.length) * 100)
    : 0
  const btPnl    = btClosed.reduce((s, bt) => s + (bt.result ?? 0), 0)
  const displayed = btFilterFlagged ? btTrades.filter(bt => bt.flagged) : btTrades

  const entry  = parseFloat(btForm.entry) || 0
  const tp     = parseFloat(btForm.tp) || 0
  const sl     = parseFloat(btForm.sl) || 0
  const rrCalc = entry && tp && sl && sl !== entry
    ? btForm.type === 'BUY'
      ? ((tp - entry) / (entry - sl)).toFixed(2)
      : ((entry - tp) / (sl - entry)).toFixed(2)
    : null

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--t-text-soft)' }}>
          {btTrades.length} trade{btTrades.length !== 1 ? 's' : ''}
        </p>
        <button onClick={() => openBtModal()}
          className="px-4 py-2 rounded-xl text-sm font-bold"
          style={{ backgroundColor: 'var(--t-primary)', color: '#000' }}>
          + Add Trade
        </button>
      </div>

      {/* Stats */}
      {btTrades.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'Total',    value: btTrades.length,   unit: '' },
            { label: 'Closed',   value: btClosed.length,   unit: '' },
            { label: 'Win Rate', value: btWinRate,          unit: '%' },
            { label: 'Result',   value: (btPnl >= 0 ? '+' : '') + btPnl.toFixed(1), unit: '%', color: btPnl >= 0 ? '#2d6a4f' : '#c0303e' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 sm:p-4 border"
              style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
              <p className="text-xs mb-0.5" style={{ color: 'var(--t-text-soft)' }}>{s.label}</p>
              <p className="text-xl sm:text-2xl font-bold" style={{ color: s.color || 'var(--t-text-main)' }}>
                {s.value}{s.unit}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filter row */}
      <div className="flex gap-2">
        {[{ label: 'All', val: false }, { label: '🚩 Flagged', val: true }].map(f => (
          <button key={String(f.val)} onClick={() => setBtFilterFlagged(f.val)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ backgroundColor: btFilterFlagged === f.val ? 'var(--t-primary)' : 'var(--t-item-bg)', color: btFilterFlagged === f.val ? '#fff' : 'var(--t-text-muted)' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Trade list */}
      {displayed.length === 0 ? (
        <div className="text-center py-16 rounded-2xl"
          style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
          <p className="text-4xl mb-2">🔬</p>
          <p className="font-medium text-sm">
            {btFilterFlagged ? 'No flagged trades.' : 'No backtest trades yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(bt => {
            const num = btTrades.length - btTrades.indexOf(bt)
            return (
              <div key={bt.id} className="rounded-2xl border-2 p-4 shadow-sm"
                style={{ backgroundColor: 'var(--t-card-bg)', borderColor: bt.flagged ? '#b8860b' : 'var(--t-border-soft)' }}>
                {/* Row 1 */}
                <div className="flex items-start justify-between gap-2 flex-wrap mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg"
                      style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>#{num}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: bt.type === 'BUY' ? '#2d6a4f' : '#c0303e' }}>{bt.type}</span>
                    <span className="text-xs" style={{ color: 'var(--t-text-soft)' }}>{bt.date}</span>
                    {bt.flagged && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg"
                        style={{ backgroundColor: '#fef9e7', color: '#b8860b' }}>🚩 Flagged</span>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => toggleFlag(bt)}
                      className="text-xs px-2 py-1 rounded-lg transition-all"
                      title={bt.flagged ? 'Unflag' : 'Flag for review'}
                      style={{ color: bt.flagged ? '#b8860b' : 'var(--t-text-soft)', backgroundColor: bt.flagged ? '#fef9e7' : 'var(--t-item-bg)' }}>
                      🚩
                    </button>
                    <button onClick={() => openBtModal(bt)}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ color: 'var(--t-text-muted)', backgroundColor: 'var(--t-item-bg)' }}>
                      {t.edit}
                    </button>
                    <button onClick={() => delBtTrade(bt.id)}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>
                      Del
                    </button>
                  </div>
                </div>

                {/* Row 2: Entry / SL / TP / RR */}
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[{ label: 'Entry', val: bt.entry }, { label: 'SL', val: bt.sl }, { label: 'TP', val: bt.tp }].map(({ label, val }) => (
                    <div key={label} className="rounded-xl px-2 py-2 text-center"
                      style={{ backgroundColor: 'var(--t-item-bg)' }}>
                      <p className="text-xs" style={{ color: 'var(--t-text-soft)' }}>{label}</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--t-text-main)' }}>{val ?? '—'}</p>
                    </div>
                  ))}
                  <div className="rounded-xl px-2 py-2 text-center"
                    style={{ backgroundColor: bt.rr ? (bt.rr >= 1 ? '#d8f3dc' : '#fde8ec') : 'var(--t-item-bg)' }}>
                    <p className="text-xs" style={{ color: 'var(--t-text-soft)' }}>R:R</p>
                    <p className="text-sm font-bold"
                      style={{ color: bt.rr ? (bt.rr >= 1 ? '#2d6a4f' : '#c0303e') : 'var(--t-text-main)' }}>
                      {bt.rr ?? '—'}
                    </p>
                  </div>
                </div>

                {/* Row 3: Risk % + Result % */}
                {(bt.riskPct != null || bt.result != null) && (
                  <div className="flex gap-2 mb-2">
                    {bt.riskPct != null && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: '#fef9e7', color: '#b8860b' }}>
                        ⚠️ Risk {bt.riskPct}%
                      </span>
                    )}
                    {bt.result != null && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: bt.result >= 0 ? '#d8f3dc' : '#fde8ec', color: bt.result >= 0 ? '#2d6a4f' : '#c0303e' }}>
                        {bt.result >= 0 ? '+' : ''}{bt.result}%
                      </span>
                    )}
                  </div>
                )}

                {/* Comment */}
                {bt.comment && (
                  <p className="text-xs mb-2 italic" style={{ color: 'var(--t-text-soft)' }}>{bt.comment}</p>
                )}

                {/* TF Screenshot buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t"
                  style={{ borderColor: 'var(--t-border-soft)' }}>
                  {BT_TIMEFRAMES.map(tf => {
                    const hasSc = bt.hasScreenshots.includes(tf)
                    return (
                      <button key={tf} onClick={() => openScPopup(bt.id, tf)}
                        className="text-xs font-bold px-2.5 py-1 rounded-full transition-all active:scale-95"
                        style={{
                          backgroundColor: hasSc ? '#d8f3dc' : 'var(--t-item-bg)',
                          color: hasSc ? '#2d6a4f' : 'var(--t-text-soft)',
                          border: hasSc ? '1px solid #52b788' : '1px solid var(--t-border-soft)',
                        }}>
                        {hasSc ? '✓ ' : ''}{tf}
                      </button>
                    )
                  })}
                  {bt.hasScreenshots.length > 0 && (
                    <button onClick={() => openCarousel(bt)}
                      className="ml-auto text-xs font-bold px-3 py-1 rounded-full transition-all active:scale-95"
                      style={{ backgroundColor: '#1a1a2e', color: '#a78bfa', border: '1px solid #7c3aed' }}>
                      All ({bt.hasScreenshots.length})
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {btModal && (
        <Modal
          title={editBt ? '✏️ Edit Backtest Trade' : '🔬 New Backtest Trade'}
          onClose={() => setBtModal(false)}>
          <div className="space-y-3">
            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.date}</label>
                <input type="date" value={btForm.date}
                  onChange={e => setBtForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>Time</label>
                <input type="time" value={btForm.time}
                  onChange={e => setBtForm(f => ({ ...f, time: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
            </div>

            {/* Direction */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.direction}</label>
              <div className="grid grid-cols-2 gap-2">
                {['BUY', 'SELL'].map(d => (
                  <button key={d} onClick={() => setBtForm(f => ({ ...f, type: d }))}
                    className="py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{
                      backgroundColor: btForm.type === d ? (d === 'BUY' ? '#2d6a4f' : '#c0303e') : 'var(--t-item-bg)',
                      color: btForm.type === d ? '#fff' : 'var(--t-text-muted)',
                    }}>
                    {d === 'BUY' ? '📈 BUY' : '📉 SELL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Entry / SL / TP / RR */}
            <div className="grid grid-cols-2 gap-2">
              {[{ label: 'Entry', key: 'entry' }, { label: 'Stop Loss', key: 'sl' }, { label: 'Take Profit', key: 'tp' }].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{label}</label>
                  <input type="number" step="any" value={(btForm as Record<string, string>)[key]}
                    onChange={e => setBtForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: 'var(--t-border-soft)' }} />
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

            {/* Risk % + Result % */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>⚠️ Risk %</label>
                <input type="number" step="0.01" placeholder="1.5" value={btForm.riskPct}
                  onChange={e => setBtForm(f => ({ ...f, riskPct: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>📊 Result %</label>
                <input type="number" step="0.01" placeholder="+3.2 or -1.5" value={btForm.result}
                  onChange={e => setBtForm(f => ({ ...f, result: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--t-border-soft)' }} />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>Comment</label>
              <textarea value={btForm.comment}
                onChange={e => setBtForm(f => ({ ...f, comment: e.target.value }))}
                rows={2} placeholder="Setup, notes, lessons…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: 'var(--t-border-soft)' }} />
            </div>

            <p className="text-xs text-center" style={{ color: 'var(--t-text-soft)' }}>
              📺 Screenshots (AFTER · 3M–1M) can be pasted from the trade card after saving.
            </p>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setBtModal(false)}
              className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">
              {t.cancel}
            </button>
            <button onClick={saveBtTrade} disabled={saving}
              className="btn-glass btn-glass-gold flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {saving ? t.saving : t.save}
            </button>
          </div>
        </Modal>
      )}

      {/* Screenshot Paste Popup */}
      {scPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg rounded-3xl p-5 shadow-2xl"
            style={{ backgroundColor: 'var(--t-card-bg)', border: '1px solid var(--t-border-soft)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold text-base" style={{ color: 'var(--t-text-main)' }}>
                  📺 {scPopup.timeframe} — Screenshot
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-soft)' }}>
                  Press{' '}
                  <kbd className="px-1.5 py-0.5 rounded text-xs font-mono"
                    style={{ backgroundColor: 'var(--t-item-bg)', border: '1px solid var(--t-border-soft)' }}>
                    Ctrl+V
                  </kbd>{' '}
                  anywhere to paste
                </p>
              </div>
              <button onClick={() => setScPopup(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
                ✕
              </button>
            </div>

            <div className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden"
              style={{ minHeight: 220, borderColor: scImage ? '#22c55e' : 'var(--t-border-soft)', backgroundColor: 'var(--t-item-bg)' }}>
              {scLoading ? (
                <p className="text-sm" style={{ color: 'var(--t-text-soft)' }}>Loading…</p>
              ) : scImage ? (
                <img src={scImage} alt="screenshot" className="max-w-full max-h-72 object-contain rounded-xl" />
              ) : (
                <div className="text-center px-6 py-8">
                  <p className="text-3xl mb-2">📋</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--t-text-main)' }}>Paste your screenshot here</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--t-text-soft)' }}>Copy a chart on TradingView then press Ctrl+V</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4">
              {scImage && (
                <button onClick={deleteSc} title="Delete"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all active:scale-95"
                  style={{ backgroundColor: 'transparent', border: '1.5px solid #22c55e', color: '#22c55e' }}>
                  🗑
                </button>
              )}
              {scImage && (
                <button onClick={() => setScImage(null)} title="Replace"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all active:scale-95"
                  style={{ backgroundColor: 'transparent', border: '1.5px solid #22c55e', color: '#22c55e' }}>
                  ↺
                </button>
              )}
              {scImage && (
                <button onClick={() => setScFullscreen(true)} title="View fullscreen"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all active:scale-95"
                  style={{ backgroundColor: 'transparent', border: '1.5px solid #22c55e', color: '#22c55e' }}>
                  🔍
                </button>
              )}
              <div className="flex-1" />
              <button onClick={() => setScPopup(null)} title="Cancel"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold transition-all active:scale-95"
                style={{ backgroundColor: 'transparent', border: '1.5px solid #22c55e', color: '#22c55e' }}>
                ✕
              </button>
              <button onClick={saveSc} disabled={!scImage || scSaving} title="Save"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold disabled:opacity-40 transition-all active:scale-95"
                style={{ backgroundColor: '#22c55e', border: '1.5px solid #22c55e', color: '#fff' }}>
                {scSaving ? '…' : '✓'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carousel overlay */}
      {carousel && (
        <div className="fixed inset-0 z-[300] flex flex-col"
          style={{ backgroundColor: 'rgba(0,0,0,0.97)' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold" style={{ color: '#a78bfa' }}>
                {carousel.timeframes[carousel.index]}
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {carousel.index + 1} / {carousel.timeframes.length}
              </span>
            </div>
            <button onClick={() => setCarousel(null)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              ✕
            </button>
          </div>

          {/* Image area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden px-14">
            {carouselLoading ? (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading…</p>
            ) : carouselImages[carousel.timeframes[carousel.index]] ? (
              <img
                src={carouselImages[carousel.timeframes[carousel.index]]}
                alt={carousel.timeframes[carousel.index]}
                className="max-w-full max-h-full object-contain rounded-xl"
                style={{ maxHeight: 'calc(100vh - 140px)' }}
              />
            ) : (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>No image</p>
            )}

            {/* Left arrow */}
            {carousel.index > 0 && (
              <button
                onClick={() => setCarousel(c => c ? { ...c, index: c.index - 1 } : c)}
                className="absolute left-2 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all active:scale-90"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                ‹
              </button>
            )}

            {/* Right arrow */}
            {carousel.index < carousel.timeframes.length - 1 && (
              <button
                onClick={() => setCarousel(c => c ? { ...c, index: c.index + 1 } : c)}
                className="absolute right-2 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all active:scale-90"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                ›
              </button>
            )}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 py-4 shrink-0">
            {carousel.timeframes.map((tf, i) => (
              <button key={tf} onClick={() => setCarousel(c => c ? { ...c, index: i } : c)}
                className="transition-all"
                style={{
                  width: i === carousel.index ? 20 : 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: i === carousel.index ? '#a78bfa' : 'rgba(255,255,255,0.2)',
                }} />
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen image overlay */}
      {scFullscreen && scImage && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(4px)' }}
          onClick={() => setScFullscreen(false)}>
          <button
            onClick={() => setScFullscreen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-10"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
            ✕
          </button>
          <img
            src={scImage}
            alt="screenshot fullscreen"
            className="max-w-full max-h-full object-contain"
            style={{ width: '100vw', height: '100vh', objectFit: 'contain', padding: '48px 16px 16px' }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
