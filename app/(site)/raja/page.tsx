'use client'

import { useEffect, useRef, useState } from 'react'

type Photo = { id: number; title: string; year: string; imageData: string; mood?: string | null; createdAt: string }

// Deterministic tilt per id so cards don't re-shuffle on re-render
function tilt(id: number) {
  const tilts = [-3.2, -1.8, -0.5, 1.1, 2.4, 3.6, -2.5, 0.8, -1.2, 2.1]
  return tilts[id % tilts.length]
}

async function compressImage(file: File): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const MAX = 1200
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * ratio)
        canvas.height = Math.round(img.height * ratio)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.78))
      }
      img.src = e.target!.result as string
    }
    reader.readAsDataURL(file)
  })
}

export default function RajaPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', year: new Date().getFullYear().toString() })
  const [saving, setSaving] = useState(false)
  const [lightbox, setLightbox] = useState<Photo | null>(null)
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [editTitle, setEditTitle] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const years = Array.from(new Set(photos.map(p => p.year))).sort((a, b) => Number(b) - Number(a))

  const displayedPhotos = [...photos]
    .filter(p => yearFilter === 'all' || p.year === yearFilter)
    .sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return sortOrder === 'desc' ? diff : -diff
    })

  useEffect(() => {
    fetch('/api/raja').then(r => r.json()).then(d => { setPhotos(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    const compressed = await compressImage(file)
    setPreview(compressed)
    setModal(true)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const save = async () => {
    if (!preview || !form.title.trim() || !form.year.trim()) return
    setSaving(true)
    const res = await fetch('/api/raja', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title.trim(), year: form.year.trim(), imageData: preview }),
    })
    const created = await res.json()
    setPhotos(prev => [created, ...prev])
    setModal(false)
    setPreview(null)
    setForm({ title: '', year: new Date().getFullYear().toString() })
    setSaving(false)
  }

  const del = async (id: number) => {
    if (!confirm('Supprimer cette photo ?')) return
    await fetch(`/api/raja/${id}`, { method: 'DELETE' })
    setPhotos(prev => prev.filter(p => p.id !== id))
    if (lightbox?.id === id) setLightbox(null)
  }

  const patch = async (id: number, data: Partial<Photo>) => {
    const updated = await fetch(`/api/raja/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json())
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p))
    setLightbox(prev => prev?.id === id ? { ...prev, ...updated } : prev)
  }

  const openLightbox = (photo: Photo) => {
    setLightbox(photo)
    setEditTitle(photo.title)
  }

  const saveTitle = async () => {
    if (!lightbox || !editTitle.trim() || editTitle.trim() === lightbox.title) return
    setEditSaving(true)
    await patch(lightbox.id, { title: editTitle.trim() })
    setEditSaving(false)
  }

  const setMood = async (mood: 'good' | 'bad') => {
    if (!lightbox) return
    const next = lightbox.mood === mood ? null : mood
    await patch(lightbox.id, { mood: next })
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#0a1f0a 0%,#061506 100%)' }}>
      {/* Film-grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.06]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '200px' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 pb-24 sm:pb-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-4 mb-10">
          {/* Raja logo */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/raja-logo.png"
              alt="Raja Club Athletic"
              className="w-28 h-28 object-contain drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 0 18px rgba(82,183,82,0.45))' }}
            />
          </div>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-widest uppercase"
              style={{ color: '#f5c842', fontFamily: 'Georgia, serif', textShadow: '0 2px 20px rgba(245,200,66,0.4)' }}>
              T3ich Raja 49
            </h1>
            <p className="text-xs mt-1 tracking-widest uppercase" style={{ color: '#52b752', letterSpacing: '0.25em' }}>
              Raja Athletic Club · Casablanca
            </p>
          </div>

          {/* Add button */}
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-2 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all active:scale-95 hover:scale-105"
            style={{ backgroundColor: '#f5c842', color: '#0a2a0a', boxShadow: '0 4px 20px rgba(245,200,66,0.3)' }}
          >
            + Ajouter une photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
        </div>

        {/* ── Filters bar ── */}
        {!loading && photos.length > 0 && (
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <select
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              className="flex-1 min-w-[120px] px-3 py-2 rounded-xl text-sm font-semibold outline-none cursor-pointer"
              style={{ backgroundColor: '#0d2a0d', color: '#f5c842', border: '1px solid #2d6a2d', fontFamily: 'Georgia, serif' }}
            >
              <option value="all">Toutes les années</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <button
              onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ backgroundColor: '#0d2a0d', color: '#52b752', border: '1px solid #2d6a2d' }}
            >
              <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
              <span>{sortOrder === 'desc' ? 'Plus récent' : 'Plus ancien'}</span>
            </button>
          </div>
        )}

        {/* ── Drop zone (empty state) ── */}
        {!loading && photos.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed cursor-pointer transition-all"
            style={{ borderColor: '#2d6a2d', backgroundColor: 'rgba(45,106,45,0.08)' }}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
          >
            <span className="text-6xl mb-4">📷</span>
            <p className="text-base font-semibold" style={{ color: '#52b752' }}>Dépose ou clique pour ajouter ta première photo</p>
            <p className="text-xs mt-1" style={{ color: '#2d6a2d' }}>JPG, PNG, WEBP</p>
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-sm"
                style={{ backgroundColor: '#1a3a1a', height: 240 }} />
            ))}
          </div>
        )}

        {/* ── Polaroid grid ── */}
        {!loading && photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {displayedPhotos.map(photo => (
              <div key={photo.id}
                className="cursor-pointer group"
                style={{ transform: `rotate(${tilt(photo.id)}deg)`, transformOrigin: 'center center' }}
                onClick={() => openLightbox(photo)}
              >
                {/* Polaroid frame */}
                <div className="rounded-sm shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: '#f5f0e0',
                    padding: '10px 10px 40px 10px',
                    boxShadow: `${tilt(photo.id) > 0 ? '4px' : '-4px'} 6px 30px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(0,0,0,0.08)`,
                  }}>
                  {/* Photo */}
                  <div className="relative overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.imageData}
                      alt={photo.title}
                      className="w-full object-cover block"
                      style={{
                        maxHeight: 280,
                        filter: 'sepia(25%) contrast(1.08) brightness(0.97) saturate(0.9)',
                      }}
                    />
                    {/* Vignette */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ boxShadow: 'inset 0 0 30px rgba(0,0,0,0.45)' }} />
                    {/* Delete on hover */}
                    <button
                      onClick={e => { e.stopPropagation(); del(photo.id) }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: 'rgba(180,30,30,0.9)', color: '#fff' }}
                    >×</button>
                  </div>

                  {/* Caption area */}
                  <div className="pt-2 pb-1 px-1 relative">
                    {photo.mood && (
                      <span className="absolute bottom-1 left-1 text-lg leading-none">
                        {photo.mood === 'good' ? '😊' : '😔'}
                      </span>
                    )}
                    <p className="text-center font-bold text-xs leading-snug"
                      style={{ color: '#2a1a0a', fontFamily: 'Georgia, serif', letterSpacing: '0.03em', wordBreak: 'break-word' }}>
                      {photo.title}
                    </p>
                    <p className="text-center text-xs mt-0.5"
                      style={{ color: '#8a6a3a', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                      {photo.year}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* + card to add more */}
            <div>
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-sm border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                style={{ minHeight: 180, borderColor: '#2d6a2d', backgroundColor: 'rgba(45,106,45,0.06)', padding: '10px 10px 40px 10px' }}
              >
                <span className="text-4xl" style={{ filter: 'opacity(0.6)' }}>📷</span>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#52b752' }}>Ajouter</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Upload modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={e => { if (e.target === e.currentTarget) { setModal(false); setPreview(null) } }}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: '#f5f0e0', maxHeight: '92vh', overflowY: 'auto' }}>

            {/* Film strip top */}
            <div className="h-6 flex items-center gap-1 px-3" style={{ backgroundColor: '#1a1a1a' }}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex-1 h-3.5 rounded-sm" style={{ backgroundColor: '#333' }} />
              ))}
            </div>

            <div className="p-6">
              <h2 className="text-lg font-bold mb-4 text-center uppercase tracking-widest"
                style={{ color: '#2a1a0a', fontFamily: 'Georgia, serif' }}>
                📷 Développer la photo
              </h2>

              {/* Preview */}
              {preview && (
                <div className="mb-5 rounded-sm overflow-hidden shadow-xl border-8"
                  style={{ borderColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="preview" className="w-full object-contain max-h-64"
                    style={{ filter: 'sepia(20%) contrast(1.05)' }} />
                </div>
              )}

              {/* Title */}
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: '#6b4226', fontFamily: 'Georgia, serif' }}>
                  Titre
                </label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="ex. Match contre le WAC..."
                  className="w-full px-4 py-3 rounded-lg border-2 text-sm outline-none"
                  style={{ borderColor: '#c4a882', backgroundColor: '#faf7f0', color: '#2a1a0a', fontFamily: 'Georgia, serif' }}
                  autoFocus
                />
              </div>

              {/* Year */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: '#6b4226', fontFamily: 'Georgia, serif' }}>
                  Année
                </label>
                <input
                  value={form.year}
                  onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                  placeholder="ex. 1997"
                  className="w-full px-4 py-3 rounded-lg border-2 text-sm outline-none"
                  style={{ borderColor: '#c4a882', backgroundColor: '#faf7f0', color: '#2a1a0a', fontFamily: 'Georgia, serif' }}
                  maxLength={9}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setModal(false); setPreview(null) }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider"
                  style={{ backgroundColor: '#e8dcc8', color: '#6b4226' }}
                >
                  Annuler
                </button>
                <button
                  onClick={save}
                  disabled={saving || !form.title.trim() || !form.year.trim()}
                  className="flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider disabled:opacity-40"
                  style={{ backgroundColor: '#f5c842', color: '#0a2a0a' }}
                >
                  {saving ? 'Sauvegarde…' : '✓ Sauvegarder'}
                </button>
              </div>
            </div>

            {/* Film strip bottom */}
            <div className="h-6 flex items-center gap-1 px-3" style={{ backgroundColor: '#1a1a1a' }}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex-1 h-3.5 rounded-sm" style={{ backgroundColor: '#333' }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            {/* Polaroid enlarged */}
            <div className="rounded-sm mx-auto shadow-2xl"
              style={{ backgroundColor: '#f5f0e0', padding: '14px 14px 14px 14px', maxWidth: 560 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightbox.imageData}
                alt={lightbox.title}
                className="w-full object-contain rounded-sm"
                style={{ filter: 'sepia(20%) contrast(1.08) brightness(0.97)', maxHeight: '55vh' }}
              />
              <div className="relative inset-0 pointer-events-none rounded-sm"
                style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3)', marginTop: -4 }} />

              {/* Editable title */}
              <div className="pt-3 px-1">
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={e => { if (e.key === 'Enter') { e.currentTarget.blur() } }}
                  className="w-full text-center font-bold text-base bg-transparent outline-none border-b-2 pb-1"
                  style={{ color: '#2a1a0a', fontFamily: 'Georgia, serif', borderColor: editTitle !== lightbox.title ? '#f5c842' : 'transparent' }}
                />
                <p className="text-sm mt-1 text-center" style={{ color: '#8a6a3a', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  {lightbox.year}
                </p>
              </div>

              {/* Mood row */}
              <div className="flex items-center justify-between px-1 pt-3 pb-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMood('good')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
                    style={{
                      backgroundColor: lightbox.mood === 'good' ? '#d4f7d4' : '#e8dcc8',
                      color: lightbox.mood === 'good' ? '#1a6a1a' : '#6b4226',
                      border: lightbox.mood === 'good' ? '2px solid #52b752' : '2px solid transparent',
                    }}
                  >
                    <span className="text-base">😊</span> G
                  </button>
                  <button
                    onClick={() => setMood('bad')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
                    style={{
                      backgroundColor: lightbox.mood === 'bad' ? '#f7d4d4' : '#e8dcc8',
                      color: lightbox.mood === 'bad' ? '#8a1a1a' : '#6b4226',
                      border: lightbox.mood === 'bad' ? '2px solid #c05050' : '2px solid transparent',
                    }}
                  >
                    <span className="text-base">😔</span> B
                  </button>
                </div>
                {editSaving && <span className="text-xs" style={{ color: '#8a6a3a' }}>Sauvegarde…</span>}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => del(lightbox.id)}
                className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: 'rgba(180,30,30,0.8)', color: '#fff' }}
              >
                Supprimer
              </button>
              <button
                onClick={() => setLightbox(null)}
                className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
              >
                Fermer ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
