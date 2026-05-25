'use client'

import { useState } from 'react'
import { ALIMENTS, FoodItem, FoodCategory } from './aliments-data'

function MacroBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

function FicheModal({ item, cat, onClose }: { item: FoodItem; cat: FoodCategory; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl overflow-y-auto"
        style={{ backgroundColor: 'var(--t-bg)', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-5 pt-6 pb-4 rounded-t-3xl"
          style={{ background: `linear-gradient(135deg, ${cat.color}22 0%, ${cat.color}10 100%)` }}
        >
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{item.emoji}</span>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--t-text-main)' }}>{item.name}</h2>
                <span
                  className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5"
                  style={{ backgroundColor: cat.bg, color: cat.color }}
                >
                  {cat.emoji} {cat.name}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: 'rgba(0,0,0,0.08)', color: 'var(--t-text-muted)' }}
            >×</button>
          </div>
        </div>

        <div className="px-5 pb-8 space-y-5">
          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--t-text-muted)' }}>{item.description}</p>

          {/* Macros */}
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: 'var(--t-item-bg)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--t-text-soft)' }}>
              Valeurs nutritionnelles — 100g
            </p>
            {item.perPiece && (
              <p className="text-xs font-medium mb-3 px-2 py-1 rounded-lg" style={{ backgroundColor: cat.bg, color: cat.color }}>
                📐 {item.perPiece}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Calories', value: `${item.kcal} kcal`, raw: item.kcal, max: 900, color: '#f59e0b' },
                { label: 'Protéines', value: `${item.proteines}g`, raw: item.proteines, max: 35, color: '#3b82f6' },
                { label: 'Glucides', value: `${item.glucides}g`, raw: item.glucides, max: 80, color: '#10b981' },
                { label: 'Lipides', value: `${item.lipides}g`, raw: item.lipides, max: 50, color: '#f97316' },
                { label: 'Fibres', value: `${item.fibres}g`, raw: item.fibres, max: 15, color: '#8b5cf6' },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs" style={{ color: 'var(--t-text-muted)' }}>{m.label}</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--t-text-main)' }}>{m.value}</span>
                  </div>
                  <MacroBar value={m.raw} max={m.max} color={m.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Key nutrients */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--t-text-soft)' }}>
              Nutriments clés
            </p>
            <div className="flex flex-wrap gap-2">
              {item.keyNutrients.map(n => (
                <span
                  key={n}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: cat.bg, color: cat.color }}
                >
                  ✦ {n}
                </span>
              ))}
            </div>
          </div>

          {/* Conservation */}
          <div
            className="rounded-2xl p-4 flex gap-3 items-start"
            style={{ backgroundColor: '#fef9c3' }}
          >
            <span className="text-xl shrink-0">🧊</span>
            <div>
              <p className="text-xs font-bold mb-0.5" style={{ color: '#854d0e' }}>Conservation</p>
              <p className="text-xs leading-relaxed" style={{ color: '#92400e' }}>{item.preservation}</p>
            </div>
          </div>

          {/* Usages */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--t-text-soft)' }}>
              Usages en cuisine
            </p>
            <div className="grid grid-cols-2 gap-2">
              {item.usages.map(u => (
                <div
                  key={u.label}
                  className="rounded-xl p-3"
                  style={{ backgroundColor: 'var(--t-item-bg)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{u.icon}</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--t-text-main)' }}>{u.label}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--t-text-muted)' }}>{u.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AlimentsTab() {
  const [selectedCat, setSelectedCat] = useState<FoodCategory | null>(null)
  const [selectedItem, setSelectedItem] = useState<{ item: FoodItem; cat: FoodCategory } | null>(null)
  const [search, setSearch] = useState('')

  const searchResults = search.trim().length > 0
    ? ALIMENTS.flatMap(cat => cat.items
        .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        .map(item => ({ item, cat }))
      )
    : []

  return (
    <div>
      {selectedItem && (
        <FicheModal
          item={selectedItem.item}
          cat={selectedItem.cat}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Search bar */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setSelectedCat(null) }}
          placeholder="Rechercher un aliment…"
          className="w-full rounded-2xl py-3 pl-10 pr-10 text-sm outline-none"
          style={{
            backgroundColor: 'var(--t-item-bg)',
            color: 'var(--t-text-main)',
            border: '1.5px solid var(--t-border-soft)',
          }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs"
            style={{ backgroundColor: 'var(--t-border-soft)', color: 'var(--t-text-muted)' }}
          >×</button>
        )}
      </div>

      {/* Search results */}
      {search.trim().length > 0 ? (
        searchResults.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--t-text-muted)' }}>
            <p className="text-3xl mb-2">🤷</p>
            <p className="text-sm font-medium">Aucun aliment trouvé</p>
          </div>
        ) : (
          <>
            <p className="text-xs mb-3" style={{ color: 'var(--t-text-muted)' }}>
              {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {searchResults.map(({ item, cat }) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem({ item, cat })}
                  className="rounded-2xl p-4 text-left transition-all active:scale-95 hover:shadow-md"
                  style={{ backgroundColor: 'var(--t-card-bg)', border: `1px solid ${cat.color}22` }}
                >
                  <span className="text-3xl block mb-2">{item.emoji}</span>
                  <p className="font-bold text-sm" style={{ color: 'var(--t-text-main)' }}>{item.name}</p>
                  <span className="inline-block text-xs font-semibold px-1.5 py-0.5 rounded-full mt-1" style={{ backgroundColor: cat.bg, color: cat.color }}>
                    {cat.emoji} {cat.name}
                  </span>
                  <p className="text-xs mt-1 font-semibold" style={{ color: cat.color }}>{item.kcal} kcal</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>P {item.proteines}g</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>G {item.glucides}g</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>L {item.lipides}g</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )
      ) : (
      <>

      {/* Back button */}
      {selectedCat && (
        <button
          onClick={() => setSelectedCat(null)}
          className="flex items-center gap-2 mb-4 text-sm font-semibold"
          style={{ color: 'var(--t-primary)' }}
        >
          ← Catégories
        </button>
      )}

      {!selectedCat ? (
        /* ── Category grid ── */
        <>
          <p className="text-xs mb-4" style={{ color: 'var(--t-text-muted)' }}>
            {ALIMENTS.reduce((acc, c) => acc + c.items.length, 0)} aliments · {ALIMENTS.length} catégories
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ALIMENTS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat)}
                className="rounded-2xl p-4 text-left transition-all active:scale-95 hover:shadow-md"
                style={{ backgroundColor: 'var(--t-card-bg)', border: `2px solid ${cat.color}22` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ backgroundColor: cat.bg }}
                >
                  {cat.emoji}
                </div>
                <p className="font-bold text-sm" style={{ color: 'var(--t-text-main)' }}>{cat.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-muted)' }}>{cat.items.length} aliments</p>
              </button>
            ))}
          </div>
        </>
      ) : (
        /* ── Items grid ── */
        <>
          {/* Category header */}
          <div
            className="rounded-2xl p-4 mb-4 flex items-center gap-3"
            style={{ background: `linear-gradient(135deg, ${selectedCat.color}22 0%, ${selectedCat.color}10 100%)` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: selectedCat.bg }}
            >
              {selectedCat.emoji}
            </div>
            <div>
              <h2 className="font-bold text-base" style={{ color: 'var(--t-text-main)' }}>{selectedCat.name}</h2>
              <p className="text-xs" style={{ color: 'var(--t-text-muted)' }}>{selectedCat.items.length} aliments · clique pour la fiche</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {selectedCat.items.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedItem({ item, cat: selectedCat })}
                className="rounded-2xl p-4 text-left transition-all active:scale-95 hover:shadow-md"
                style={{ backgroundColor: 'var(--t-card-bg)', border: `1px solid ${selectedCat.color}22` }}
              >
                <span className="text-3xl block mb-2">{item.emoji}</span>
                <p className="font-bold text-sm" style={{ color: 'var(--t-text-main)' }}>{item.name}</p>
                <p className="text-xs mt-1 font-semibold" style={{ color: selectedCat.color }}>{item.kcal} kcal</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
                    P {item.proteines}g
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                    G {item.glucides}g
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                    L {item.lipides}g
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
      </>
      )}
    </div>
  )
}
