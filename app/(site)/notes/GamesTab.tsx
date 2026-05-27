'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

// ── Shared data ───────────────────────────────────────────────────────────
type WordCard = { es: string; fr: string }

const VOCAB: WordCard[] = [
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

// ── Game 2 sentences ───────────────────────────────────────────────────────
// parts.length === blanks.length + 1  (sentence split at blank positions)
type SentenceData = {
  id: number
  parts: string[]     // sentence fragments between blanks
  blanks: string[]    // correct answers in order
  distractors: string[] // wrong chips shown alongside
  hint: string        // French translation
}

const GAME2_DATA: SentenceData[] = [
  // ── Objects ──
  { id:1,  parts:['¿Dónde está mi ','?'],                    blanks:['cargador'],          distractors:['tableta','reloj','maleta'],             hint:'Où est mon chargeur ?' },
  { id:2,  parts:['Tengo mi ',' en la mochila.'],            blanks:['pasaporte'],          distractors:['libro','reloj','gorra'],                hint:'J\'ai mon passeport dans le sac à dos.' },
  { id:3,  parts:['Pongo la ropa en la ','.'],               blanks:['maleta'],             distractors:['mochila','cartera','tableta'],          hint:'Je mets les vêtements dans la valise.' },
  { id:4,  parts:['Llevo los libros en la ','.'],            blanks:['mochila'],            distractors:['maleta','cartera','gorra'],             hint:'Je porte les livres dans le sac à dos.' },
  { id:5,  parts:['Mi ',' tiene mucho dinero.'],             blanks:['cartera'],            distractors:['maleta','mochila','gorra'],             hint:'Mon portefeuille a beaucoup d\'argent.' },
  { id:6,  parts:['Ella lleva una ',' azul.'],               blanks:['gorra'],              distractors:['mochila','maleta','cartera'],           hint:'Elle porte une casquette bleue.' },
  { id:7,  parts:['Tengo frío, ¿tienes un ','?'],            blanks:['suéter'],             distractors:['vestido','libro','reloj'],              hint:'J\'ai froid, tu as un pull ?' },
  { id:8,  parts:['Ella lleva un ',' muy bonito.'],          blanks:['vestido'],            distractors:['suéter','gorra','libro'],               hint:'Elle porte une très belle robe.' },
  { id:9,  parts:['Este ',' es muy interesante.'],           blanks:['libro'],              distractors:['reloj','tableta','cargador'],           hint:'Ce livre est très intéressant.' },
  { id:10, parts:['Mi ',' nuevo marca las 3h.'],             blanks:['reloj'],              distractors:['libro','tableta','cargador'],           hint:'Ma nouvelle montre indique 3h.' },
  { id:11, parts:['¿Tienes tu ',' hoy?'],                    blanks:['tableta'],            distractors:['libro','reloj','cargador'],             hint:'Tu as ta tablette aujourd\'hui ?' },
  // ── Food & drinks ──
  { id:12, parts:['¿Tienes ',' para el café?'],              blanks:['azúcar'],             distractors:['hielo','jugo','helado'],                hint:'Tu as du sucre pour le café ?' },
  { id:13, parts:['Quiero un ',' de agua fría.'],            blanks:['vaso'],               distractors:['libro','tableta','reloj'],              hint:'Je veux un verre d\'eau froide.' },
  { id:14, parts:['Necesito ',' para la limonada.'],         blanks:['hielo'],              distractors:['azúcar','jugo','vaso'],                 hint:'J\'ai besoin de glace pour la limonade.' },
  { id:15, parts:['Quiero un ',' de mango.'],                blanks:['jugo'],               distractors:['vaso','helado','azúcar'],               hint:'Je veux un jus de mangue.' },
  { id:16, parts:['¿Quieres un ',' de chocolate?'],          blanks:['helado'],             distractors:['jugo','vaso','azúcar'],                 hint:'Tu veux une glace au chocolat ?' },
  // ── Family & people ──
  { id:17, parts:['Mi ',' vive en Madrid.'],                 blanks:['hermano'],            distractors:['tío','hijo','compañero de cuarto'],     hint:'Mon frère vit à Madrid.' },
  { id:18, parts:['Él es mi ',', vive en París.'],           blanks:['tío'],                distractors:['hermano','hijo','compañero de cuarto'], hint:'C\'est mon oncle, il vit à Paris.' },
  { id:19, parts:['Tengo un ',' de cinco años.'],            blanks:['hijo'],               distractors:['hermano','tío','compañero de cuarto'],  hint:'J\'ai un fils de cinq ans.' },
  { id:20, parts:['Mi novia es de Colombia.'],               blanks:['novia'],              distractors:['hermano','tío','hijo'],                 hint:'Ma petite amie est de Colombie.' },
  { id:21, parts:['Él es mi ',', vivimos juntos.'],          blanks:['compañero de cuarto'],distractors:['hermano','tío','hijo'],                 hint:'C\'est mon colocataire, on vit ensemble.' },
  { id:22, parts:['¿Dónde está ','?'],                       blanks:['tu mamá'],            distractors:['hermano','tío','mi novia'],             hint:'Où est ta maman ?' },
  // ── Adjectives ──
  { id:23, parts:['Él es muy ',' en el trabajo.'],           blanks:['serio'],              distractors:['tímido','simpático','nuevo'],           hint:'Il est très sérieux au travail.' },
  { id:24, parts:['Ella es muy ',' con todos.'],             blanks:['simpático'],          distractors:['serio','tímido','nuevo'],               hint:'Elle est très sympathique avec tout le monde.' },
  { id:25, parts:['No habla mucho, es muy ','.'],            blanks:['tímido'],             distractors:['serio','simpático','nuevo'],            hint:'Il ne parle pas beaucoup, il est très timide.' },
  { id:26, parts:['¡Ella es muy ','! Me hace reír.'],        blanks:['graciosa'],           distractors:['serio','tímido','simpático'],           hint:'Elle est très drôle ! Elle me fait rire.' },
  { id:27, parts:['Es ',' aquí, no conoce a nadie.'],        blanks:['nuevo'],              distractors:['serio','tímido','simpático'],           hint:'Il est nouveau ici, il ne connaît personne.' },
  // ── Greetings ──
  { id:28, parts:['','! ¿Cómo estás?'],                      blanks:['Buenos días'],        distractors:['Mucho gusto','Chao','Encantado'],       hint:'Bonjour ! Comment tu vas ?' },
  { id:29, parts:['','! Hasta mañana.'],                     blanks:['Chao'],               distractors:['Buenos días','Encantado','Mucho gusto'], hint:'Au revoir ! À demain.' },
  { id:30, parts:['',' , me llamo Carlos.'],                 blanks:['Mucho gusto'],        distractors:['Chao','Buenos días','Pues'],            hint:'Enchanté, je m\'appelle Carlos.' },
  { id:31, parts:['',' de conocerte.'],                      blanks:['Encantado'],          distractors:['Chao','Buenos días','Mucho gusto'],     hint:'Enchanté de te rencontrer.' },
  // ── Connectors & expressions ──
  { id:32, parts:['',' es muy inteligente.'],                blanks:['Creo que'],           distractors:['Pues','Pero','También'],                hint:'Je crois qu\'il est très intelligent.' },
  { id:33, parts:['Me gusta el café, ',' me gusta el té.'], blanks:['también'],            distractors:['pero','pues','aquí'],                   hint:'J\'aime le café, j\'aime aussi le thé.' },
  { id:34, parts:['Me gusta el sol, ',' no me gusta el frío.'], blanks:['pero'],           distractors:['también','pues','aquí'],                hint:'J\'aime le soleil, mais je n\'aime pas le froid.' },
  { id:35, parts:['','... no sé qué decir.'],                blanks:['Pues'],               distractors:['Pero','También','Aquí'],                hint:'Eh bien... je ne sais pas quoi dire.' },
  { id:36, parts:['Tu libro está ','! No lo busques más.'], blanks:['aquí'],               distractors:['también','pues','pero'],                hint:'Ton livre est ici ! Ne le cherche plus.' },
  { id:37, parts:['¿Es ',' que ella habla cinco idiomas?'], blanks:['verdad'],             distractors:['nuevo','serio','simpático'],             hint:'C\'est vrai qu\'elle parle cinq langues ?' },
  { id:38, parts:['',' no hablo español muy bien.'],         blanks:['En realidad'],        distractors:['Creo que','Pues','También'],             hint:'En fait, je ne parle pas très bien espagnol.' },
  { id:39, parts:['','! Eso duele mucho.'],                  blanks:['Ay'],                 distractors:['Chao','Pues','También'],                hint:'Aïe ! Ça fait très mal.' },
  { id:40, parts:['Soy estudiante, ',' tú.'],                blanks:['como yo'],            distractors:['también','pero','pues'],                hint:'Je suis étudiant, comme toi.' },
  // ── Full phrases as blanks ──
  { id:41, parts:['',' mi maleta en el hotel.'],             blanks:['No encuentro'],       distractors:['Tengo','Creo que','En realidad'],       hint:'Je ne trouve pas ma valise à l\'hôtel.' },
  { id:42, parts:['',' un hermano en México.'],              blanks:['Tengo'],              distractors:['No encuentro','Creo que','En realidad'], hint:'J\'ai un frère au Mexique.' },
  { id:43, parts:['',' muy simpática.'],                     blanks:['Ella es'],            distractors:['Él es','Tengo','No encuentro'],         hint:'Elle est très sympathique.' },
  { id:44, parts:['',' mi mejor amigo.'],                    blanks:['Él es'],              distractors:['Ella es','Tengo','No encuentro'],       hint:'Il est mon meilleur ami.' },
  { id:45, parts:['¿',', de México o de España?'],           blanks:['De dónde eres'],      distractors:['Creo que','No crees','En realidad'],    hint:'Tu viens d\'où, du Mexique ou d\'Espagne ?' },
  { id:46, parts:['¿',' que ella es simpática?'],            blanks:['No crees'],           distractors:['Creo que','En realidad','Pues'],        hint:'Tu ne crois pas qu\'elle est sympathique ?' },
  { id:47, parts:['Me presento: ','! Encantada.'],           blanks:['Yo soy Ana'],         distractors:['Mucho gusto','Buenos días','Chao'],     hint:'Je me présente : Je suis Ana ! Enchantée.' },
  { id:48, parts:['¿Quién viene? ','.'],                     blanks:['Yo solamente'],       distractors:['Tengo','No encuentro','También'],       hint:'Qui vient ? Moi seulement.' },
  { id:49, parts:['Tu pasaporte ',' .'],                     blanks:['está aquí'],          distractors:['no encuentro','también','verdad'],      hint:'Ton passeport est ici.' },
  // ── Two blanks ──
  { id:50, parts:['',' mi ','.'],                            blanks:['No encuentro','pasaporte'],   distractors:['Tengo','maleta','Creo que','mochila'],     hint:'Je ne trouve pas mon passeport.' },
  { id:51, parts:['',' un ',' nuevo.'],                      blanks:['Tengo','suéter'],             distractors:['No encuentro','vestido','Creo que','libro'], hint:'J\'ai un nouveau pull.' },
  { id:52, parts:['',' muy ','.'],                           blanks:['Ella es','graciosa'],         distractors:['Él es','serio','Tengo','tímido'],            hint:'Elle est très drôle.' },
  { id:53, parts:['Él es mi ',' y ella es mi ','.'],         blanks:['hermano','novia'],            distractors:['tío','compañero de cuarto','hijo','amiga'],  hint:'C\'est mon frère et c\'est ma petite amie.' },
  { id:54, parts:['Quiero un ',' y un ','.'],                blanks:['helado','jugo'],              distractors:['vaso','azúcar','hielo','suéter'],            hint:'Je veux une glace et un jus.' },
  { id:55, parts:['Tengo tu ',' y tu ','.'],                 blanks:['mochila','tableta'],          distractors:['maleta','cargador','cartera','reloj'],       hint:'J\'ai ton sac à dos et ta tablette.' },
  { id:56, parts:['',' muy ',' en la clase.'],               blanks:['Él es','serio'],              distractors:['Ella es','tímido','Tengo','simpático'],      hint:'Il est très sérieux en classe.' },
  { id:57, parts:['¿',' que ella es ','?'],                  blanks:['No crees','graciosa'],        distractors:['Creo que','serio','En realidad','tímido'],   hint:'Tu ne crois pas qu\'elle est drôle ?' },
]

// ── Utilities ─────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Shared completion screen ───────────────────────────────────────────────
function CompletionScreen({ correct, total, maxCombo, rounds, onRestart }: {
  correct: number; total: number; maxCombo: number; rounds: number; onRestart: () => void
}) {
  const pct   = total > 0 ? Math.round((correct / total) * 100) : 0
  const emoji = pct === 100 ? '🏆' : pct >= 80 ? '🎉' : '💪'
  const label = pct === 100 ? 'Parfait !' : pct >= 80 ? 'Excellent !' : 'Continue !'
  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <div className="text-6xl">{emoji}</div>
      <div className="text-center">
        <p className="text-xl font-black" style={{ color: 'var(--t-text-main)' }}>{label}</p>
        <p className="text-sm mt-1" style={{ color: 'var(--t-text-muted)' }}>
          Terminé en {rounds} round{rounds > 1 ? 's' : ''}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 w-full">
        {[
          { label: 'Score',     value: `${pct}%`,            color: pct >= 80 ? '#2d6a4f' : '#b8860b' },
          { label: 'Correct',   value: `${correct}/${total}`, color: '#1e6091' },
          { label: 'Combo max', value: `×${maxCombo}`,        color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: 'var(--t-item-bg)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--t-text-soft)' }}>{s.label}</p>
            <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
      <button onClick={onRestart} className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
        style={{ background: 'linear-gradient(135deg,#1e6091,#2d6a4f)' }}>
        🔄 Rejouer
      </button>
    </div>
  )
}

// ── Flashcard game (Game 1 & Jeu 1) ───────────────────────────────────────
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
    const deck = shuffle(VOCAB)
    setQueue(deck.slice(1)); setCurrent(deck[0]); setRetryQueue([])
    setFlipped(false); setCombo(0); setMaxCombo(0); setCorrect(0); setTotal(0)
    setDone(false); setRound(1); setAnimKey(k => k + 1)
  }
  useEffect(() => { startGame() }, [])

  const answer = (knew: boolean) => {
    if (!current) return
    const newCombo   = knew ? combo + 1 : 0
    const newMax     = Math.max(maxCombo, newCombo)
    const newRetry   = knew ? retryQueue : [...retryQueue, current]
    setTotal(t => t + 1); setCorrect(c => knew ? c + 1 : c)
    setCombo(newCombo); setMaxCombo(newMax)
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

  if (done) return <CompletionScreen correct={correct} total={total} maxCombo={maxCombo} rounds={round} onRestart={startGame} />
  if (!current) return null

  const seen = total, remaining = queue.length + 1 + retryQueue.length
  const frontFlag = direction === 'es-fr' ? '🇪🇸' : '🇫🇷'
  const backFlag  = direction === 'es-fr' ? '🇫🇷' : '🇪🇸'
  const frontText = direction === 'es-fr' ? current.es : current.fr
  const backText  = direction === 'es-fr' ? current.fr : current.es
  const backHint  = direction === 'es-fr' ? current.es : current.fr

  return (
    <div className="flex flex-col gap-4">
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
            style={{ width: `${(seen / (seen + remaining)) * 100}%`, background: retryQueue.length > 0 ? 'linear-gradient(90deg,#f59e0b,#d97706)' : 'linear-gradient(90deg,#1e6091,#40916c)' }} />
        </div>
        <p className="text-xs mt-1 text-right font-medium" style={{ color: 'var(--t-text-soft)' }}>{seen} / {seen + remaining} vus</p>
      </div>
      <div key={animKey} className="relative cursor-pointer select-none" style={{ perspective: '1200px', height: '230px' }}
        onClick={() => { if (!flipped) setFlipped(true) }}>
        <div className="absolute inset-0 transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-6 gap-2"
            style={{ backfaceVisibility: 'hidden', backgroundColor: 'var(--t-card-bg)', border: '2px solid #1e6091', boxShadow: '0 8px 32px rgba(30,96,145,0.12)' }}>
            <span className="text-4xl">{frontFlag}</span>
            <p className="text-2xl font-black text-center leading-snug" style={{ color: 'var(--t-text-main)' }}>{frontText}</p>
            <p className="text-xs mt-2 font-medium" style={{ color: 'var(--t-text-soft)' }}>👆 Appuie pour voir la traduction</p>
          </div>
          <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-6 gap-2"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg,#1e6091,#40916c)', boxShadow: '0 8px 32px rgba(30,96,145,0.3)' }}>
            <span className="text-4xl">{backFlag}</span>
            <p className="text-xl font-black text-center text-white leading-snug">{backText}</p>
            <p className="text-sm font-semibold text-center mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{backHint}</p>
          </div>
        </div>
      </div>
      {flipped ? (
        <div className="flex gap-3">
          <button onClick={() => answer(false)} className="flex-1 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95"
            style={{ backgroundColor: '#fde8ec', color: '#c0303e', border: '2px solid #fca5a5' }}>✗ À revoir</button>
          <button onClick={() => answer(true)} className="flex-1 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95"
            style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f', border: '2px solid #6ee7b7' }}>✓ Je savais !</button>
        </div>
      ) : (
        <div className="text-center py-3 rounded-2xl text-sm font-medium" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
          Flip la carte, puis évalue-toi
        </div>
      )}
      {total > 0 && (
        <div className="flex gap-2">
          {[
            { label: 'Correct',  value: correct,         color: '#2d6a4f', bg: '#d8f3dc' },
            { label: 'À revoir', value: total - correct, color: '#c0303e', bg: '#fde8ec' },
            { label: 'Combo',    value: `×${combo}`,     color: '#b8860b', bg: '#fef9e7' },
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

// ── Fill-in-the-blank game (Game 2) ───────────────────────────────────────
type BlankResult = 'correct' | 'wrong' | null

function FillBlankGame() {
  const [sentences]    = useState<SentenceData[]>(() => shuffle(GAME2_DATA))
  const [idx, setIdx]  = useState(0)
  const [filled, setFilled]   = useState<(string | null)[]>([])
  const [chips, setChips]     = useState<string[]>([])
  const [results, setResults] = useState<BlankResult[]>([])
  const [checking, setChecking] = useState(false)
  const [score, setScore]     = useState({ correct: 0, total: 0 })
  const [done, setDone]       = useState(false)

  const sentence = sentences[idx]

  const initSentence = (s: SentenceData) => {
    setFilled(new Array(s.blanks.length).fill(null))
    setChips(shuffle([...s.blanks, ...s.distractors]))
    setResults(new Array(s.blanks.length).fill(null))
    setChecking(false)
  }

  useEffect(() => { initSentence(sentences[0]) }, [])

  const allFilled = filled.length > 0 && filled.every(b => b !== null)

  const placeChip = (word: string) => {
    if (checking) return
    const nextEmpty = filled.findIndex(b => b === null)
    if (nextEmpty === -1) return
    const newFilled = [...filled]; newFilled[nextEmpty] = word
    setFilled(newFilled)
    const i = chips.indexOf(word)
    setChips([...chips.slice(0, i), ...chips.slice(i + 1)])
  }

  const removeFromBlank = (blankIdx: number) => {
    if (checking) return
    const word = filled[blankIdx]; if (!word) return
    const newFilled = [...filled]; newFilled[blankIdx] = null
    setFilled(newFilled)
    setChips(c => [...c, word])
  }

  const check = () => {
    if (!allFilled || checking) return
    setChecking(true)
    const res: BlankResult[] = filled.map((w, i) => w === sentence.blanks[i] ? 'correct' : 'wrong')
    setResults(res)
    const allCorrect = res.every(r => r === 'correct')
    setScore(s => ({ correct: s.correct + (allCorrect ? 1 : 0), total: s.total + 1 }))

    setTimeout(() => {
      if (allCorrect) {
        if (idx + 1 >= sentences.length) { setDone(true) }
        else { setIdx(i => i + 1); initSentence(sentences[idx + 1]) }
      } else {
        // Return wrong chips to pool
        const wrongWords = filled.filter((w, i) => res[i] === 'wrong') as string[]
        const newFilled  = filled.map((w, i) => res[i] === 'wrong' ? null : w)
        setFilled(newFilled)
        setChips(c => shuffle([...c, ...wrongWords]))
        setResults(new Array(sentence.blanks.length).fill(null))
        setChecking(false)
      }
    }, 1400)
  }

  if (done) {
    return (
      <CompletionScreen
        correct={score.correct} total={score.total}
        maxCombo={0} rounds={1}
        onRestart={() => { setIdx(0); setScore({ correct:0, total:0 }); setDone(false); initSentence(sentences[0]) }}
      />
    )
  }

  if (!sentence || filled.length === 0) return null

  // Build inline sentence with blank slots
  const sentenceNodes: React.ReactNode[] = []
  sentence.parts.forEach((part, i) => {
    if (part) sentenceNodes.push(<span key={`p${i}`}>{part}</span>)
    if (i < sentence.blanks.length) {
      const word    = filled[i]
      const result  = results[i]
      const borderColor =
        result === 'correct' ? '#22c55e' :
        result === 'wrong'   ? '#e84057' :
        word ? '#1e6091' : '#d1d5db'
      const bgColor =
        result === 'correct' ? 'rgba(34,197,94,0.12)' :
        result === 'wrong'   ? 'rgba(232,64,87,0.12)' :
        word ? 'rgba(30,96,145,0.08)' : 'transparent'

      sentenceNodes.push(
        <button
          key={`b${i}`}
          onClick={() => word ? removeFromBlank(i) : undefined}
          className="inline-flex items-center justify-center rounded-xl font-bold transition-all mx-1"
          style={{
            minWidth: Math.max(60, (sentence.blanks[i].length * 9) + 16),
            height: 34,
            border: `2px dashed ${borderColor}`,
            backgroundColor: bgColor,
            color: result === 'correct' ? '#16a34a' : result === 'wrong' ? '#e84057' : 'var(--t-text-main)',
            fontSize: 13,
            padding: '0 8px',
            cursor: word ? 'pointer' : 'default',
          }}
        >
          {word
            ? <>{word} {result === 'correct' ? '✓' : result === 'wrong' ? '✗' : <span style={{ fontSize:10, opacity:0.5 }}>✕</span>}</>
            : <span style={{ fontSize: 10, color: '#9ca3af', letterSpacing: 2 }}>_ _ _</span>
          }
        </button>
      )
    }
  })

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold" style={{ color: 'var(--t-text-main)' }}>🎮 Game 2 — Complète la phrase</p>
          <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>
            {idx + 1} / {sentences.length}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--t-item-bg)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(idx / sentences.length) * 100}%`, background: 'linear-gradient(90deg,#1e6091,#40916c)' }} />
        </div>
      </div>

      {/* Sentence card */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--t-card-bg)', border: '2px solid #1e609122' }}>
        <p className="text-base leading-loose font-semibold flex flex-wrap items-center" style={{ color: 'var(--t-text-main)' }}>
          {sentenceNodes}
        </p>
        <p className="text-xs mt-3 italic" style={{ color: 'var(--t-text-soft)' }}>
          💬 {sentence.hint}
        </p>
      </div>

      {/* Word chips */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--t-text-soft)' }}>
          Mots disponibles
        </p>
        <div className="flex flex-wrap gap-2">
          {chips.map((word, i) => (
            <button
              key={`${word}-${i}`}
              onClick={() => placeChip(word)}
              className="px-3 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ backgroundColor: '#dbeafe', color: '#1e40af', border: '1.5px solid #93c5fd' }}
            >
              {word}
            </button>
          ))}
          {chips.length === 0 && filled.every(b => b !== null) && (
            <p className="text-xs italic" style={{ color: 'var(--t-text-soft)' }}>Tous les mots sont placés →</p>
          )}
        </div>
      </div>

      {/* Check button */}
      <button
        onClick={check}
        disabled={!allFilled || checking}
        className="w-full py-4 rounded-2xl text-base font-black transition-all active:scale-95 disabled:opacity-40"
        style={{
          background: allFilled && !checking ? 'linear-gradient(135deg,#1e6091,#40916c)' : 'var(--t-item-bg)',
          color: allFilled && !checking ? '#fff' : 'var(--t-text-muted)',
        }}
      >
        {checking ? '⏳ Vérification…' : '✓ Vérifier'}
      </button>

      {/* Score */}
      {score.total > 0 && (
        <div className="flex gap-2">
          {[
            { label: 'Correct',  value: score.correct,              color: '#2d6a4f', bg: '#d8f3dc' },
            { label: 'Raté',     value: score.total - score.correct, color: '#c0303e', bg: '#fde8ec' },
            { label: 'Phrases',  value: `${idx}/${sentences.length}`, color: '#1e6091', bg: '#dbeafe' },
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

// ── Game 3 — Matching pairs ───────────────────────────────────────────────
type MatchPair = { es: string; fr: string }

const MATCH_PAIRS: MatchPair[] = [
  { es: 'Cartera',  fr: 'Portefeuille' },
  { es: 'Cargador', fr: 'Chargeur'     },
  { es: 'Gorra',    fr: 'Casquette'    },
  { es: 'Libro',    fr: 'Livre'        },
  { es: 'Maleta',   fr: 'Valise'       },
  { es: 'Mochila',  fr: 'Sac à dos'   },
  { es: 'Pero',     fr: 'Mais'         },
  { es: 'Pues',     fr: 'Donc'         },
  { es: 'Reloj',    fr: 'Montre'       },
  { es: 'Suéter',   fr: 'Pull'         },
  { es: 'Tableta',  fr: 'Tablette'     },
  { es: 'Vestido',  fr: 'Robe'         },
]

const ROUND_SIZE = 6

function MatchingGame() {
  const allPairs   = useMemo(() => shuffle([...MATCH_PAIRS]), [])
  const rounds     = useMemo<MatchPair[][]>(
    () => [allPairs.slice(0, ROUND_SIZE), allPairs.slice(ROUND_SIZE)],
    [allPairs],
  )

  const [roundIdx,    setRoundIdx]    = useState(0)
  const [done,        setDone]        = useState(false)
  const [totalScore,  setTotalScore]  = useState({ correct: 0, errors: 0 })
  const [leftOrder,   setLeftOrder]   = useState<number[]>([])
  const [rightOrder,  setRightOrder]  = useState<number[]>([])
  const [matched,     setMatched]     = useState<Set<number>>(new Set())
  const [selected,    setSelected]    = useState<{ side: 'left' | 'right'; pairIdx: number } | null>(null)
  const [wrong,       setWrong]       = useState<{ left: number; right: number } | null>(null)
  const [checking,    setChecking]    = useState(false)

  const initRound = useCallback((pairs: MatchPair[]) => {
    const idx = pairs.map((_, i) => i)
    setLeftOrder(shuffle([...idx]))
    setRightOrder(shuffle([...idx]))
    setMatched(new Set())
    setSelected(null)
    setWrong(null)
    setChecking(false)
  }, [])

  useEffect(() => { initRound(rounds[0]) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (side: 'left' | 'right', pairIdx: number) => {
    if (checking || matched.has(pairIdx)) return

    // Nothing selected yet
    if (!selected) { setSelected({ side, pairIdx }); return }

    // Tap same item → deselect
    if (selected.side === side && selected.pairIdx === pairIdx) { setSelected(null); return }

    // Same side → switch highlight
    if (selected.side === side) { setSelected({ side, pairIdx }); return }

    // Different sides → attempt match
    const leftIdx  = side === 'right' ? selected.pairIdx : pairIdx
    const rightIdx = side === 'right' ? pairIdx : selected.pairIdx

    if (leftIdx === rightIdx) {
      // ✅ Correct
      const next = new Set(matched); next.add(leftIdx)
      setMatched(next)
      setSelected(null)
      setTotalScore(s => ({ ...s, correct: s.correct + 1 }))
      if (next.size === rounds[roundIdx].length) {
        setChecking(true)
        setTimeout(() => {
          if (roundIdx + 1 >= rounds.length) { setDone(true) }
          else { const r = roundIdx + 1; setRoundIdx(r); initRound(rounds[r]) }
        }, 600)
      }
    } else {
      // ❌ Wrong — flash red then clear
      setChecking(true)
      setWrong({ left: leftIdx, right: rightIdx })
      setTotalScore(s => ({ ...s, errors: s.errors + 1 }))
      setTimeout(() => { setWrong(null); setSelected(null); setChecking(false) }, 700)
    }
  }

  if (done) {
    return (
      <CompletionScreen
        correct={totalScore.correct} total={MATCH_PAIRS.length}
        maxCombo={0} rounds={2}
        onRestart={() => {
          setRoundIdx(0)
          setTotalScore({ correct: 0, errors: 0 })
          setDone(false)
          initRound(rounds[0])
        }}
      />
    )
  }

  if (leftOrder.length === 0) return null

  const currentPairs = rounds[roundIdx]
  const progress     = Math.round((matched.size / currentPairs.length) * 100)

  const itemStyle = (pairIdx: number, side: 'left' | 'right'): React.CSSProperties => {
    const isMatched  = matched.has(pairIdx)
    const isSel      = selected?.side === side && selected.pairIdx === pairIdx
    const isWrong    = side === 'left' ? wrong?.left === pairIdx : wrong?.right === pairIdx
    return {
      backgroundColor: isMatched ? 'rgba(34,197,94,0.14)' : isWrong ? 'rgba(232,64,87,0.14)' : isSel ? 'rgba(30,96,145,0.16)' : 'var(--t-item-bg)',
      border:         `2px solid ${isMatched ? '#22c55e' : isWrong ? '#e84057' : isSel ? '#1e6091' : 'transparent'}`,
      color:           isMatched ? '#16a34a' : isWrong ? '#e84057' : isSel ? '#1e6091' : 'var(--t-text-main)' as string,
      opacity:         isMatched ? 0.55 : 1,
      transform:       isSel ? 'scale(1.03)' : 'scale(1)',
      transition:      'all 0.15s ease',
      cursor:          isMatched ? 'default' : 'pointer',
    }
  }

  return (
    <div className="space-y-4">
      {/* Round header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-black" style={{ color: 'var(--t-text-main)' }}>
          Round {roundIdx + 1} / {rounds.length}
        </span>
        <span className="text-xs font-semibold" style={{ color: 'var(--t-text-soft)' }}>
          {matched.size} / {currentPairs.length} liés
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--t-item-bg)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#1e6091,#40916c)' }} />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left — French */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: 'var(--t-text-soft)' }}>🇫🇷 Français</p>
          {leftOrder.map(pairIdx => (
            <button
              key={pairIdx}
              onClick={() => handleSelect('left', pairIdx)}
              disabled={matched.has(pairIdx)}
              className="w-full px-2 py-3 rounded-xl text-sm font-semibold text-center"
              style={itemStyle(pairIdx, 'left')}
            >
              {currentPairs[pairIdx].fr}
            </button>
          ))}
        </div>

        {/* Right — Spanish */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: 'var(--t-text-soft)' }}>🇪🇸 Español</p>
          {rightOrder.map(pairIdx => (
            <button
              key={pairIdx}
              onClick={() => handleSelect('right', pairIdx)}
              disabled={matched.has(pairIdx)}
              className="w-full px-2 py-3 rounded-xl text-sm font-semibold text-center"
              style={itemStyle(pairIdx, 'right')}
            >
              {currentPairs[pairIdx].es}
            </button>
          ))}
        </div>
      </div>

      {/* Score pills */}
      {(totalScore.correct > 0 || totalScore.errors > 0) && (
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl py-2 text-center" style={{ backgroundColor: '#d8f3dc' }}>
            <p className="text-xs font-black tabular-nums" style={{ color: '#2d6a4f' }}>{totalScore.correct}</p>
            <p className="text-xs mt-0.5" style={{ color: '#2d6a4f', opacity: 0.7 }}>Liés ✓</p>
          </div>
          <div className="flex-1 rounded-xl py-2 text-center" style={{ backgroundColor: '#fde8ec' }}>
            <p className="text-xs font-black tabular-nums" style={{ color: '#c0303e' }}>{totalScore.errors}</p>
            <p className="text-xs mt-0.5" style={{ color: '#c0303e', opacity: 0.7 }}>Erreurs</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Game 4 — True / False ────────────────────────────────────────────────
type TFQuestion = { es: string; shown: string; correct: boolean }

function buildTFQuestions(): TFQuestion[] {
  const questions: TFQuestion[] = []
  // Each word appears twice: once true, once false — 24 questions total
  MATCH_PAIRS.forEach(pair => {
    // True card
    questions.push({ es: pair.es, shown: pair.fr, correct: true })
    // False card — pick a random different translation
    const others = MATCH_PAIRS.filter(p => p.es !== pair.es)
    const wrong  = others[Math.floor(Math.random() * others.length)]
    questions.push({ es: pair.es, shown: wrong.fr, correct: false })
  })
  return shuffle(questions)
}

function TrueFalseGame() {
  const [questions] = useState<TFQuestion[]>(() => buildTFQuestions())
  const [idx,       setIdx]       = useState(0)
  const [score,     setScore]     = useState({ correct: 0, wrong: 0 })
  const [feedback,  setFeedback]  = useState<'correct' | 'wrong' | null>(null)
  const [done,      setDone]      = useState(false)

  const q = questions[idx]

  const answer = (userSaysTrue: boolean) => {
    if (feedback) return
    const isRight = userSaysTrue === q.correct
    setFeedback(isRight ? 'correct' : 'wrong')
    setScore(s => ({ correct: s.correct + (isRight ? 1 : 0), wrong: s.wrong + (isRight ? 0 : 1) }))
    setTimeout(() => {
      setFeedback(null)
      if (idx + 1 >= questions.length) setDone(true)
      else setIdx(i => i + 1)
    }, 900)
  }

  if (done) {
    return (
      <CompletionScreen
        correct={score.correct} total={questions.length}
        maxCombo={0} rounds={1}
        onRestart={() => { setIdx(0); setScore({ correct: 0, wrong: 0 }); setDone(false) }}
      />
    )
  }

  const pct = Math.round((idx / questions.length) * 100)

  const cardBg =
    feedback === 'correct' ? 'linear-gradient(135deg,#22c55e22,#16a34a11)' :
    feedback === 'wrong'   ? 'linear-gradient(135deg,#e8405722,#c0303e11)' :
    'var(--t-card-bg)'
  const cardBorder =
    feedback === 'correct' ? '#22c55e' :
    feedback === 'wrong'   ? '#e84057' :
    '#1e609122'

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-black" style={{ color: 'var(--t-text-main)' }}>
          {idx + 1} / {questions.length}
        </span>
        <div className="flex gap-3 text-xs font-semibold">
          <span style={{ color: '#16a34a' }}>✓ {score.correct}</span>
          <span style={{ color: '#e84057' }}>✗ {score.wrong}</span>
        </div>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--t-item-bg)' }}>
        <div className="h-full rounded-full transition-all duration-400"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#1e6091,#40916c)' }} />
      </div>

      {/* Card */}
      <div className="rounded-3xl p-8 text-center transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: cardBg, border: `2.5px solid ${cardBorder}` }}>

        {/* Feedback overlay icon */}
        {feedback && (
          <div className="text-5xl animate-bounce">
            {feedback === 'correct' ? '✅' : '❌'}
          </div>
        )}

        {!feedback && (
          <>
            {/* Spanish word */}
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--t-text-soft)' }}>
              🇪🇸 Espagnol
            </p>
            <p className="text-3xl font-black" style={{ color: 'var(--t-text-main)' }}>
              {q.es}
            </p>

            {/* Equals */}
            <div className="flex items-center gap-3 w-full justify-center">
              <div className="h-px flex-1" style={{ backgroundColor: 'var(--t-item-bg)' }} />
              <span className="text-sm font-bold" style={{ color: 'var(--t-text-soft)' }}>signifie</span>
              <div className="h-px flex-1" style={{ backgroundColor: 'var(--t-item-bg)' }} />
            </div>

            {/* Proposed French */}
            <div className="rounded-2xl px-6 py-3" style={{ backgroundColor: 'var(--t-item-bg)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--t-text-soft)' }}>🇫🇷 Français</p>
              <p className="text-2xl font-black" style={{ color: '#1e6091' }}>{q.shown}</p>
            </div>
          </>
        )}

        {/* Show correct answer when wrong */}
        {feedback === 'wrong' && (
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: '#e84057' }}>
              ❌ &nbsp;<span style={{ color: 'var(--t-text-main)' }}>{q.es}</span> = <span style={{ color: '#e84057' }}>{q.shown}</span> est <strong>FAUX</strong>
            </p>
            <p className="text-sm font-semibold mt-1" style={{ color: '#16a34a' }}>
              ✓ &nbsp;La bonne réponse : <strong>{MATCH_PAIRS.find(p => p.es === q.es)?.fr}</strong>
            </p>
          </div>
        )}
        {feedback === 'correct' && (
          <p className="text-base font-black" style={{ color: '#16a34a' }}>Bonne réponse !</p>
        )}
      </div>

      {/* Buttons */}
      {!feedback && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => answer(true)}
            className="py-5 rounded-2xl text-lg font-black transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', boxShadow: '0 4px 16px rgba(34,197,94,0.35)' }}>
            ✅ VRAI
          </button>
          <button
            onClick={() => answer(false)}
            className="py-5 rounded-2xl text-lg font-black transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg,#e84057,#c0303e)', color: '#fff', boxShadow: '0 4px 16px rgba(232,64,87,0.35)' }}>
            ❌ FAUX
          </button>
        </div>
      )}
    </div>
  )
}

// ── Game 5 — Ser vs Estar ─────────────────────────────────────────────────
type SerEstarRaw = { type: 'conjugation' | 'context'; display: string; hint: string; correct: string; distractors: string[] }

const SERSTAR_RAW: SerEstarRaw[] = [
  // ── Partie 1 : Conjugaisons ──
  { type:'conjugation', display:'yo + SER',            hint:'Je → SER (être permanent)',        correct:'soy',    distractors:['estoy','eres','somos']   },
  { type:'conjugation', display:'tú + SER',            hint:'Tu → SER (être permanent)',        correct:'eres',   distractors:['estás','soy','son']       },
  { type:'conjugation', display:'él / ella + SER',     hint:'Il/Elle → SER (être permanent)',   correct:'es',     distractors:['está','eres','somos']     },
  { type:'conjugation', display:'nosotros + SER',      hint:'Nous → SER (être permanent)',      correct:'somos',  distractors:['estamos','sois','son']    },
  { type:'conjugation', display:'vosotros + SER',      hint:'Vous → SER (être permanent)',      correct:'sois',   distractors:['estáis','somos','son']    },
  { type:'conjugation', display:'ellos / ellas + SER', hint:'Ils/Elles → SER (être permanent)', correct:'son',    distractors:['están','somos','sois']    },
  { type:'conjugation', display:'yo + ESTAR',          hint:'Je → ESTAR (état temporaire)',     correct:'estoy',  distractors:['soy','estás','estamos']   },
  { type:'conjugation', display:'tú + ESTAR',          hint:'Tu → ESTAR (état temporaire)',     correct:'estás',  distractors:['eres','estoy','están']    },
  { type:'conjugation', display:'él / ella + ESTAR',   hint:'Il/Elle → ESTAR (état temporaire)',correct:'está',   distractors:['es','estás','estamos']    },
  { type:'conjugation', display:'nosotros + ESTAR',    hint:'Nous → ESTAR (état temporaire)',   correct:'estamos',distractors:['somos','estáis','están']  },
  { type:'conjugation', display:'vosotros + ESTAR',    hint:'Vous → ESTAR (état temporaire)',   correct:'estáis', distractors:['sois','estamos','están']  },
  { type:'conjugation', display:'ellos / ellas + ESTAR',hint:'Ils → ESTAR (état temporaire)',   correct:'están',  distractors:['son','estamos','estáis']  },
  // ── Partie 2 : Contexte ──
  { type:'context', display:'Ella ___ doctora.',            hint:'Elle est médecin. → profession (SER)',          correct:'es',     distractors:['está','eres','están']    },
  { type:'context', display:'Yo ___ de Marruecos.',         hint:'Je suis du Maroc. → origine (SER)',             correct:'soy',    distractors:['estoy','eres','somos']   },
  { type:'context', display:'La casa ___ muy grande.',      hint:'La maison est grande. → caractère (SER)',       correct:'es',     distractors:['está','son','somos']     },
  { type:'context', display:'Ellos ___ estudiantes.',       hint:'Ils sont étudiants. → identité (SER)',          correct:'son',    distractors:['están','es','somos']     },
  { type:'context', display:'Tú ___ muy inteligente.',      hint:'Tu es intelligent(e). → qualité (SER)',         correct:'eres',   distractors:['estás','soy','es']       },
  { type:'context', display:'Nosotros ___ amigos.',         hint:'Nous sommes amis. → relation (SER)',            correct:'somos',  distractors:['estamos','son','sois']   },
  { type:'context', display:'El libro ___ de papel.',       hint:'Le livre est en papier. → matière (SER)',       correct:'es',     distractors:['está','son','estamos']   },
  { type:'context', display:'¿De dónde ___ tú?',           hint:'Tu viens d\'où ? → origine (SER)',              correct:'eres',   distractors:['estás','soy','es']       },
  { type:'context', display:'La fiesta ___ el viernes.',    hint:'La fête c\'est vendredi. → événement (SER)',    correct:'es',     distractors:['está','son','están']     },
  { type:'context', display:'Mi hermano ___ médico.',       hint:'Mon frère est médecin. → profession (SER)',     correct:'es',     distractors:['está','eres','somos']    },
  { type:'context', display:'Yo ___ en casa.',              hint:'Je suis à la maison. → lieu (ESTAR)',           correct:'estoy',  distractors:['soy','estás','estamos']  },
  { type:'context', display:'Ella ___ cansada hoy.',        hint:'Elle est fatiguée. → état temporaire (ESTAR)',  correct:'está',   distractors:['es','estás','estamos']   },
  { type:'context', display:'¿Dónde ___ el gato?',          hint:'Où est le chat ? → lieu (ESTAR)',               correct:'está',   distractors:['es','estoy','están']     },
  { type:'context', display:'Nosotros ___ muy contentos.',  hint:'Nous sommes contents. → émotion (ESTAR)',       correct:'estamos',distractors:['somos','estáis','están'] },
  { type:'context', display:'El café ___ frío.',            hint:'Le café est froid. → état temp. (ESTAR)',       correct:'está',   distractors:['es','estoy','están']     },
  { type:'context', display:'¿Cómo ___ tú?',               hint:'Comment vas-tu ? → état (ESTAR)',               correct:'estás',  distractors:['eres','estoy','está']    },
  { type:'context', display:'Los niños ___ en el parque.',  hint:'Les enfants sont au parc. → lieu (ESTAR)',      correct:'están',  distractors:['son','estamos','estáis'] },
  { type:'context', display:'Mi madre ___ enferma.',        hint:'Ma mère est malade. → état temp. (ESTAR)',      correct:'está',   distractors:['es','estás','estamos']   },
  { type:'context', display:'Vosotros ___ muy ocupados.',   hint:'Vous êtes très occupés. → état (ESTAR)',        correct:'estáis', distractors:['sois','estamos','están'] },
  { type:'context', display:'Yo ___ listo para salir.',     hint:'Je suis prêt à partir. → état (ESTAR)',         correct:'estoy',  distractors:['soy','estás','estamos']  },
]

function SerEstarGame() {
  const questions = useMemo(() =>
    shuffle([...SERSTAR_RAW]).map(q => ({ ...q, options: shuffle([q.correct, ...q.distractors]) })),
  [])

  const [idx,     setIdx]     = useState(0)
  const [chosen,  setChosen]  = useState<string | null>(null)
  const [score,   setScore]   = useState({ correct: 0, wrong: 0 })
  const [done,    setDone]    = useState(false)

  const q          = questions[idx]
  const isAnswered = chosen !== null
  const pct        = Math.round((idx / questions.length) * 100)

  const pick = (opt: string) => {
    if (isAnswered) return
    setChosen(opt)
    setScore(s => ({ correct: s.correct + (opt === q.correct ? 1 : 0), wrong: s.wrong + (opt === q.correct ? 0 : 1) }))
  }
  const next = () => {
    if (idx + 1 >= questions.length) setDone(true)
    else { setIdx(i => i + 1); setChosen(null) }
  }

  if (done) return (
    <CompletionScreen correct={score.correct} total={questions.length} maxCombo={0} rounds={1}
      onRestart={() => { setIdx(0); setScore({ correct: 0, wrong: 0 }); setDone(false); setChosen(null) }} />
  )

  const isSer = q.type === 'conjugation' ? q.display.includes('+ SER') : q.correct === 'soy' || q.correct === 'eres' || q.correct === 'es' || q.correct === 'somos' || q.correct === 'sois' || q.correct === 'son'

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-black" style={{ color: 'var(--t-text-main)' }}>{idx + 1} / {questions.length}</span>
        <div className="flex gap-3 text-xs font-semibold">
          <span style={{ color: '#16a34a' }}>✓ {score.correct}</span>
          <span style={{ color: '#e84057' }}>✗ {score.wrong}</span>
        </div>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--t-item-bg)' }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#7c3aed,#1e6091)' }} />
      </div>

      {/* Question card */}
      <div className="rounded-3xl p-6 text-center" style={{ backgroundColor: 'var(--t-card-bg)', border: '2px solid var(--t-border-soft)' }}>
        {/* Type badge */}
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ backgroundColor: q.type === 'conjugation' ? '#dbeafe' : '#fae8ff', color: q.type === 'conjugation' ? '#1e40af' : '#86198f' }}>
          {q.type === 'conjugation' ? '🔤 Conjugaison' : '💬 Contexte'}
        </span>

        {q.type === 'conjugation' ? (
          /* Conjugation: show pronoun + SER/ESTAR badge */
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--t-text-soft)' }}>Quelle forme ?</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-3xl font-black" style={{ color: 'var(--t-text-main)' }}>
                {q.display.split(' + ')[0].trim()}
              </span>
              <span className="text-lg font-black px-4 py-2 rounded-2xl"
                style={{ backgroundColor: isSer ? '#dbeafe' : '#dcfce7', color: isSer ? '#1e40af' : '#166534' }}>
                {q.display.split(' + ')[1]}
              </span>
            </div>
          </div>
        ) : (
          /* Context: sentence with blank */
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--t-text-soft)' }}>
              SER ou ESTAR ?
            </p>
            <p className="text-xl font-bold leading-relaxed" style={{ color: 'var(--t-text-main)' }}>
              {q.display.split('___').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="inline-block px-3 py-0.5 mx-1 rounded-xl font-black text-base align-middle"
                      style={{
                        minWidth: 70, textAlign: 'center',
                        backgroundColor: isAnswered
                          ? (chosen === q.correct ? 'rgba(34,197,94,0.18)' : 'rgba(232,64,87,0.18)')
                          : '#7c3aed18',
                        color: isAnswered
                          ? (chosen === q.correct ? '#16a34a' : '#e84057')
                          : '#7c3aed',
                        border: `1.5px dashed ${isAnswered ? (chosen === q.correct ? '#22c55e' : '#e84057') : '#7c3aed66'}`,
                      }}>
                      {isAnswered ? chosen : '?'}
                    </span>
                  )}
                </span>
              ))}
            </p>
            {/* Show correct if wrong */}
            {isAnswered && chosen !== q.correct && (
              <p className="text-sm mt-3 font-semibold" style={{ color: '#16a34a' }}>
                ✓ Correct : <strong>{q.correct}</strong>
              </p>
            )}
          </div>
        )}

        {/* Hint */}
        <p className="text-xs mt-4 italic" style={{ color: 'var(--t-text-soft)' }}>💬 {q.hint}</p>
      </div>

      {/* 2×2 options */}
      <div className="grid grid-cols-2 gap-2">
        {q.options.map(opt => {
          const isChosen  = chosen === opt
          const isCorrect = opt === q.correct
          const bg     = !isAnswered ? 'var(--t-item-bg)' : isCorrect ? 'rgba(34,197,94,0.15)' : isChosen ? 'rgba(232,64,87,0.15)' : 'var(--t-item-bg)'
          const border = !isAnswered ? 'transparent'      : isCorrect ? '#22c55e'               : isChosen ? '#e84057'               : 'transparent'
          const color  = !isAnswered ? 'var(--t-text-main)': isCorrect ? '#16a34a'              : isChosen ? '#e84057'               : 'var(--t-text-muted)'
          return (
            <button key={opt} onClick={() => pick(opt)}
              className="py-4 rounded-2xl text-lg font-black transition-all active:scale-95"
              style={{ backgroundColor: bg, border: `2px solid ${border}`, color }}>
              {isAnswered && isCorrect ? '✓ ' : isAnswered && isChosen ? '✗ ' : ''}{opt}
            </button>
          )
        })}
      </div>

      {/* Next */}
      {isAnswered && (
        <button onClick={next}
          className="w-full py-4 rounded-2xl text-base font-black transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#1e6091)', color: '#fff' }}>
          {idx + 1 >= questions.length ? '🎉 Terminer' : 'Suivant →'}
        </button>
      )}
    </div>
  )
}

// ── GamesTab — picker + router ────────────────────────────────────────────
const GAMES = [
  { id: 'game1', label: 'Game 1', icon: '🃏', tag: '🇪🇸 → 🇫🇷', desc: 'Espagnol vers Français', count: `${VOCAB.length} mots`,          accent: '#dbeafe', accentText: '#1e40af' },
  { id: 'jeu1',  label: 'Jeu 1',  icon: '🔄', tag: '🇫🇷 → 🇪🇸', desc: 'Français vers Espagnol', count: `${VOCAB.length} mots`,          accent: '#dcfce7', accentText: '#166534' },
  { id: 'game2', label: 'Game 2', icon: '✍️', tag: 'Phrases',    desc: 'Complète les phrases',   count: `${GAME2_DATA.length} phrases`,  accent: '#fef9c3', accentText: '#854d0e' },
  { id: 'game3', label: 'Game 3', icon: '🔗', tag: 'Relier',     desc: 'Associe les mots',       count: `${MATCH_PAIRS.length} paires`,  accent: '#fae8ff', accentText: '#86198f' },
  { id: 'game4', label: 'Game 4', icon: '🎯', tag: 'Vrai/Faux',  desc: 'Vrai ou Faux ?',          count: '24 questions',                 accent: '#fff1f2', accentText: '#be123c' },
  { id: 'game5', label: 'Game 5', icon: '🔀', tag: 'Ser/Estar',  desc: 'Ser vs Estar — 2 parties', count: `${SERSTAR_RAW.length} questions`, accent: '#ede9fe', accentText: '#5b21b6' },
]

export default function GamesTab() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1e6091,#40916c)' }}>
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>🎮 Games</p>
        <p className="text-white font-bold text-base">{VOCAB.length} mots · {GAME2_DATA.length} phrases · 3 jeux</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Flashcards + complétion de phrases</p>
      </div>

      {!selected ? (
        /* ── Picker ── */
        <div className="flex flex-col gap-3">
          {GAMES.map(g => (
            <button key={g.id} onClick={() => setSelected(g.id)}
              className="rounded-2xl p-4 text-left transition-all active:scale-95 hover:shadow-md flex items-center gap-3"
              style={{ backgroundColor: 'var(--t-card-bg)', border: '2px solid #1e609122' }}>
              {/* Icon box — emoji only, fixed size, no overflow */}
              <div className="shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 overflow-hidden"
                style={{ backgroundColor: g.accent }}>
                <span style={{ fontSize: 26, lineHeight: 1 }}>{g.icon}</span>
                <span className="font-bold text-center leading-tight" style={{ fontSize: 9, color: g.accentText, maxWidth: 52, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{g.tag}</span>
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-black text-base" style={{ color: 'var(--t-text-main)' }}>{g.label}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--t-text-muted)' }}>{g.desc}</p>
              </div>
              {/* Badge */}
              <span className="text-xs font-bold px-2 py-1 rounded-full shrink-0" style={{ backgroundColor: g.accent, color: g.accentText }}>
                {g.count}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#1e6091' }}>
            ← Choisir un jeu
          </button>
          {selected === 'game1' && <FlashcardGame  key="game1" direction="es-fr" title="🎮 Game 1 — Español → Français" />}
          {selected === 'jeu1'  && <FlashcardGame  key="jeu1"  direction="fr-es" title="🎮 Jeu 1 — Français → Español" />}
          {selected === 'game2' && <FillBlankGame  key="game2" />}
          {selected === 'game3' && <MatchingGame   key="game3" />}
          {selected === 'game4' && <TrueFalseGame  key="game4" />}
          {selected === 'game5' && <SerEstarGame   key="game5" />}
        </>
      )}
    </div>
  )
}
