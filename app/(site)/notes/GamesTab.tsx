'use client'

import { useState, useEffect } from 'react'

type WordCard = { es: string; fr: string }

const GAME1: WordCard[] = [
  { es: 'Aquí',                   fr: 'Ici' },
  { es: 'Azúcar',                 fr: 'Sucre' },
  { es: 'Ay',                     fr: 'Aïe ! / Oh !' },
  { es: 'Buenos días',            fr: 'Bonjour' },
  { es: 'Cartera',                fr: 'Portefeuille / Sac' },
  { es: 'Chao',                   fr: 'Au revoir' },
  { es: 'Cargador',               fr: 'Chargeur' },
  { es: 'Compañero de cuarto',    fr: 'Colocataire' },
  { es: 'Como yo',                fr: 'Comme moi' },
  { es: 'Creo que',               fr: 'Je crois que' },
  { es: 'De dónde eres',          fr: 'Tu viens d\'où ?' },
  { es: 'Él es',                  fr: 'Il est' },
  { es: 'Ella es',                fr: 'Elle est' },
  { es: 'En realidad',            fr: 'En fait / En réalité' },
  { es: 'Encantado',              fr: 'Enchanté' },
  { es: 'Esta aquí',              fr: 'Il / Elle est ici' },
  { es: 'Gorra',                  fr: 'Casquette' },
  { es: 'Graciosa',               fr: 'Drôle (féminin)' },
  { es: 'Helado',                 fr: 'Glace / Glacé' },
  { es: 'Hermano',                fr: 'Frère' },
  { es: 'Hielo',                  fr: 'Glace (eau)' },
  { es: 'Hijo',                   fr: 'Fils' },
  { es: 'Jugo',                   fr: 'Jus' },
  { es: 'Libro',                  fr: 'Livre' },
  { es: 'Maleta',                 fr: 'Valise' },
  { es: 'Mi novia',               fr: 'Ma petite amie' },
  { es: 'Mochila',                fr: 'Sac à dos' },
  { es: 'Mucho gusto',            fr: 'Enchanté / Ravi de te rencontrer' },
  { es: 'No crees',               fr: 'Tu ne crois pas ?' },
  { es: 'No encuentro',           fr: 'Je ne trouve pas' },
  { es: 'Nuevo',                  fr: 'Nouveau' },
  { es: 'Pasaporte',              fr: 'Passeport' },
  { es: 'Pero',                   fr: 'Mais' },
  { es: 'Pues',                   fr: 'Eh bien / Donc' },
  { es: 'Reloj',                  fr: 'Montre / Horloge' },
  { es: 'Serio',                  fr: 'Sérieux' },
  { es: 'Simpático',              fr: 'Sympathique / Gentil' },
  { es: 'Suéter',                 fr: 'Pull / Sweat' },
  { es: 'También',                fr: 'Aussi' },
  { es: 'Tableta',                fr: 'Tablette' },
  { es: 'Tengo',                  fr: 'J\'ai' },
  { es: 'Tímido',                 fr: 'Timide' },
  { es: 'Tío',                    fr: 'Oncle' },
  { es: 'Tu mamá',                fr: 'Ta maman' },
  { es: 'Vaso',                   fr: 'Verre (à boire)' },
  { es: 'Verdad',                 fr: 'Vrai / Vraiment ?' },
  { es: 'Vestido',                fr: 'Robe' },
  { es: 'Yo soy Ana',             fr: 'Je suis Ana' },
  { es: 'Yo solamente',           fr: 'Moi seulement / Juste moi' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Completion screen ──────────────────────────────────────────────────────
function CompletionScreen({
  correct, total, maxCombo, rounds, onRestart,
}: { correct: number; total: number; maxCombo: number; rounds: number; onRestart: () => void }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const emoji = pct === 100 ? '🏆' : pct >= 80 ? '🎉' : '💪'
  const label = pct === 100 ? 'Parfait !' : pct >= 80 ? 'Excellent !' : 'Continue !'

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <div className="text-6xl">{emoji}</div>
      <div className="text-center">
        <p className="text-xl font-black" style={{ color: 'var(--t-text-main)' }}>{label}</p>
        <p className="text-sm mt-1" style={{ color: 'var(--t-text-muted)' }}>
          Toutes les cartes maîtrisées en {rounds} round{rounds > 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full">
        {[
          { label: 'Score',     value: `${pct}%`,       color: pct >= 80 ? '#2d6a4f' : '#b8860b' },
          { label: 'Correct',   value: `${correct}/${total}`, color: '#1e6091' },
          { label: 'Combo max', value: `×${maxCombo}`,  color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: 'var(--t-item-bg)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--t-text-soft)' }}>{s.label}</p>
            <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onRestart}
        className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
        style={{ background: 'linear-gradient(135deg,#1e6091,#2d6a4f)' }}
      >
        🔄 Rejouer
      </button>
    </div>
  )
}

// ── Flashcard game (générique ES↔FR) ─────────────────────────────────────
function FlashcardGame({ direction, title }: { direction: 'es-fr' | 'fr-es'; title: string }) {
  const [queue, setQueue]           = useState<WordCard[]>([])
  const [retryQueue, setRetryQueue] = useState<WordCard[]>([])
  const [current, setCurrent]       = useState<WordCard | null>(null)
  const [flipped, setFlipped]       = useState(false)
  const [combo, setCombo]           = useState(0)
  const [maxCombo, setMaxCombo]     = useState(0)
  const [correct, setCorrect]       = useState(0)
  const [total, setTotal]           = useState(0)
  const [done, setDone]             = useState(false)
  const [round, setRound]           = useState(1)
  const [animKey, setAnimKey]       = useState(0)

  const startGame = () => {
    const deck = shuffle(GAME1)
    setQueue(deck.slice(1))
    setCurrent(deck[0])
    setRetryQueue([])
    setFlipped(false)
    setCombo(0); setMaxCombo(0); setCorrect(0); setTotal(0)
    setDone(false); setRound(1)
    setAnimKey(k => k + 1)
  }

  useEffect(() => { startGame() }, [])

  const answer = (knew: boolean) => {
    if (!current) return
    const newTotal   = total + 1
    const newCorrect = knew ? correct + 1 : correct
    const newCombo   = knew ? combo + 1 : 0
    const newMax     = Math.max(maxCombo, newCombo)
    const newRetry   = knew ? retryQueue : [...retryQueue, current]
    setTotal(newTotal); setCorrect(newCorrect); setCombo(newCombo); setMaxCombo(newMax)
    if (queue.length === 0) {
      if (newRetry.length === 0) { setDone(true); setCurrent(null) }
      else {
        const next = shuffle(newRetry)
        setRound(r => r + 1); setQueue(next.slice(1)); setCurrent(next[0])
        setRetryQueue([]); setFlipped(false); setAnimKey(k => k + 1)
      }
    } else {
      const [next, ...rest] = queue
      setQueue(rest); setRetryQueue(newRetry); setCurrent(next)
      setFlipped(false); setAnimKey(k => k + 1)
    }
  }

  if (done) {
    return <CompletionScreen correct={correct} total={total} maxCombo={maxCombo} rounds={round} onRestart={startGame} />
  }
  if (!current) return null

  const seen      = total
  const remaining = queue.length + 1 + retryQueue.length

  // ES→FR : front=ES, back=FR  |  FR→ES : front=FR, back=ES
  const frontFlag  = direction === 'es-fr' ? '🇪🇸' : '🇫🇷'
  const backFlag   = direction === 'es-fr' ? '🇫🇷' : '🇪🇸'
  const frontText  = direction === 'es-fr' ? current.es : current.fr
  const backText   = direction === 'es-fr' ? current.fr : current.es
  const backHint   = direction === 'es-fr' ? current.es : current.fr

  return (
    <div className="flex flex-col gap-4">
      {/* ── Progress header ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--t-text-main)' }}>{title}</p>
            <p className="text-xs" style={{ color: 'var(--t-text-muted)' }}>
              {queue.length + 1} carte{queue.length + 1 > 1 ? 's' : ''} restante{queue.length + 1 > 1 ? 's' : ''}
              {retryQueue.length > 0 && ` · ${retryQueue.length} à revoir`}
              {round > 1 && ` · Round ${round}`}
            </p>
          </div>
          {combo >= 3 && (
            <div className="px-3 py-1.5 rounded-full text-xs font-black animate-bounce"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff' }}>
              🔥 ×{combo}
            </div>
          )}
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--t-item-bg)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(seen / (seen + remaining)) * 100}%`,
              background: retryQueue.length > 0
                ? 'linear-gradient(90deg,#f59e0b,#d97706)'
                : 'linear-gradient(90deg,#1e6091,#40916c)',
            }} />
        </div>
        <p className="text-xs mt-1 text-right font-medium" style={{ color: 'var(--t-text-soft)' }}>
          {seen} / {seen + remaining} vus
        </p>
      </div>

      {/* ── Flip card ── */}
      <div
        key={animKey}
        className="relative cursor-pointer select-none"
        style={{ perspective: '1200px', height: '230px' }}
        onClick={() => { if (!flipped) setFlipped(true) }}
      >
        <div className="absolute inset-0 transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

          {/* Front */}
          <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-6 gap-2"
            style={{ backfaceVisibility: 'hidden', backgroundColor: 'var(--t-card-bg)', border: '2px solid #1e6091', boxShadow: '0 8px 32px rgba(30,96,145,0.12)' }}>
            <span className="text-4xl">{frontFlag}</span>
            <p className="text-2xl font-black text-center leading-snug" style={{ color: 'var(--t-text-main)' }}>
              {frontText}
            </p>
            <p className="text-xs mt-2 font-medium" style={{ color: 'var(--t-text-soft)' }}>
              👆 Appuie pour voir la traduction
            </p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-6 gap-2"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg,#1e6091,#40916c)', boxShadow: '0 8px 32px rgba(30,96,145,0.3)' }}>
            <span className="text-4xl">{backFlag}</span>
            <p className="text-xl font-black text-center text-white leading-snug">{backText}</p>
            <p className="text-sm font-semibold text-center mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{backHint}</p>
          </div>
        </div>
      </div>

      {/* ── Answer buttons ── */}
      {flipped ? (
        <div className="flex gap-3">
          <button onClick={() => answer(false)} className="flex-1 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95"
            style={{ backgroundColor: '#fde8ec', color: '#c0303e', border: '2px solid #fca5a5' }}>
            ✗ À revoir
          </button>
          <button onClick={() => answer(true)} className="flex-1 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95"
            style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f', border: '2px solid #6ee7b7' }}>
            ✓ Je savais !
          </button>
        </div>
      ) : (
        <div className="text-center py-3 rounded-2xl text-sm font-medium"
          style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
          Flip la carte, puis évalue-toi
        </div>
      )}

      {/* ── Mini stats ── */}
      {total > 0 && (
        <div className="flex gap-2">
          {[
            { label: 'Correct',  value: correct,           color: '#2d6a4f', bg: '#d8f3dc' },
            { label: 'À revoir', value: total - correct,   color: '#c0303e', bg: '#fde8ec' },
            { label: 'Combo',    value: `×${combo}`,       color: '#b8860b', bg: '#fef9e7' },
          ].map(s => (
            <div key={s.label} className="flex-1 rounded-xl py-2 text-center" style={{ backgroundColor: s.bg }}>
              <p className="text-xs font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: s.color, opacity: 0.7 }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── GamesTab ───────────────────────────────────────────────────────────────
const GAMES = [
  { id: 'game1', label: 'Game 1', sub: '🇪🇸 → 🇫🇷', direction: 'es-fr' as const, title: '🎮 Game 1 — Español → Français' },
  { id: 'jeu1',  label: 'Jeu 1',  sub: '🇫🇷 → 🇪🇸', direction: 'fr-es' as const, title: '🎮 Jeu 1 — Français → Español' },
]

export default function GamesTab() {
  const [selected, setSelected] = useState<string | null>(null)

  const activeGame = GAMES.find(g => g.id === selected)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1e6091,#40916c)' }}>
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>🎮 Games</p>
        <p className="text-white font-bold text-base">{GAME1.length} mots · 2 jeux</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Flashcards · flip & évalue-toi · les ratés reviennent
        </p>
      </div>

      {/* ── Game picker ── */}
      {!activeGame ? (
        <div className="grid grid-cols-2 gap-3">
          {GAMES.map(g => (
            <button
              key={g.id}
              onClick={() => setSelected(g.id)}
              className="rounded-2xl p-5 text-left transition-all active:scale-95 hover:shadow-md"
              style={{ backgroundColor: 'var(--t-card-bg)', border: '2px solid #1e609122' }}
            >
              <p className="text-2xl mb-2">{g.sub}</p>
              <p className="font-black text-base" style={{ color: 'var(--t-text-main)' }}>{g.label}</p>
              <p className="text-xs mt-1 font-semibold" style={{ color: '#1e6091' }}>{GAME1.length} mots →</p>
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* Back button */}
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: '#1e6091' }}
          >
            ← Choisir un jeu
          </button>
          <FlashcardGame key={activeGame.id} direction={activeGame.direction} title={activeGame.title} />
        </>
      )}
    </div>
  )
}
