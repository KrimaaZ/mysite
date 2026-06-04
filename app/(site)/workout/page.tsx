'use client'

import { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'
import { EXERCISE_FR, EQUIP_FR, MUSCLE_FR } from '@/lib/exercise-fr'

// ─── Types ────────────────────────────────────────────────────────────────────
type ExCard = {
  id: number; type: string; name: string; muscle: string; equipment: string
  description: string; steps: string[]
  levels: { novice: string; beginner: string; intermediate: string; advanced: string; elite: string }
}
type LogExercise = { name: string; sets: number; reps: string; notes: string }
type Session = { id: number; type: string; title: string; date: string; exercises: string; notes: string | null }
type VideoEntry = { id: number | string; name: string; url: string; types: string[] }

// ─── Exercise Library Data ────────────────────────────────────────────────────
// Exercises are based exclusively on Life Fitness machines available at the gym.
// Volume calibrated for a high-protein daily food plan (muscle building focus).
const EXERCISES: ExCard[] = [
  // ── PULL — Back & Biceps (1–5) ───────────────────────────────────────────────
  { id:1, type:'PULL', name:'Lat Pulldown',          muscle:'Lats & Biceps',          equipment:'Life Fitness Machine',
    description:'Machine lat pulldown — the cornerstone of back width training. Adjust the thigh pad to lock your legs and pull the bar to upper chest to maximise lat engagement. Calibrated for high-protein muscle building: 4 sets, moderate-to-heavy load.',
    steps:['Adjust thigh pad snugly over legs. Sit tall, overhand grip wider than shoulder-width.','Pull bar straight down to upper chest, driving elbows toward hips — lean back very slightly at peak.','Return the bar with full control — lats stretch at the top before the next rep.'],
    levels:{ novice:'3×10 light — focus on lat pull, not arm pull', beginner:'3×12 moderate — 2 min rest', intermediate:'4×10 at 70% max — 3s slow return', advanced:'4×8 at 80%+ — 1s pause at chest, 90s rest', elite:'5×8 at 85%+ — drop set on last set, 60s rest' }},
  { id:2, type:'PULL', name:'Low Row',               muscle:'Mid Back & Rhomboids',   equipment:'Life Fitness Machine',
    description:'Seated low row machine building the thick mid back and rhomboids. Upright torso throughout maximises back involvement and protects the lower back. Key exercise for posture.',
    steps:['Sit upright, feet on footrests, slight knee bend. Grip the handles — neutral or overhand.','Pull handles to lower abdomen, squeezing shoulder blades together hard at peak contraction.','Extend arms fully forward — feel the mid back stretch before initiating the next rep.'],
    levels:{ novice:'3×12 light — torso stays upright, no leaning back', beginner:'3×12 moderate', intermediate:'4×10 at 70% max — 2s hold at contraction', advanced:'4×8 heavy — 3s eccentric return', elite:'5×8 max — rest-pause on last set' }},
  { id:3, type:'PULL', name:'Row Machine',            muscle:'Upper Back & Traps',     equipment:'Life Fitness Machine',
    description:'Chest-supported row machine that removes lower back strain and forces strict back contraction. Perfect for targeting the upper back, traps, and rear delts in pure isolation.',
    steps:['Adjust chest pad so handles align with mid-chest height. Grip handles, chest firmly against the pad.','Row handles back by driving elbows wide and high — squeeze shoulder blades hard at the top.','Lower with full control — chest stays on pad the entire time, no body swing.'],
    levels:{ novice:'3×12 light — feel the upper back, not the arms', beginner:'3×12 moderate', intermediate:'4×10 heavy — 1.5s squeeze at top', advanced:'4×8 very heavy — 3s descent', elite:'5×8 max — unilateral if available, full stretch each rep' }},
  { id:4, type:'PULL', name:'Biceps Curl Machine',   muscle:'Biceps',                 equipment:'Life Fitness Machine',
    description:'Preacher-style biceps curl machine that locks the upper arms in place, eliminating cheating and delivering consistent tension throughout the entire range of motion.',
    steps:['Adjust seat so upper arms rest flat on the pad. Grip handles, palms facing up.','Curl handles up to full contraction — squeeze biceps hard at the top without lifting shoulders.','Lower slowly to full arm extension — maximum stretch at the bottom is essential.'],
    levels:{ novice:'3×12 light — full range of motion is the only priority', beginner:'3×12 moderate — 2s hold at top', intermediate:'4×10 heavy — 3s slow descent', advanced:'4×8 very heavy — drop set finish', elite:'5×8 max — partial reps at bottom for stretch overload' }},
  { id:5, type:'PULL', name:'Back Extension Machine', muscle:'Lower Back & Erectors',   equipment:'Life Fitness Machine',
    description:'Machine back extension strengthens the entire posterior chain — erector spinae, glutes, and hamstrings. Essential for injury prevention and performance on all compound movements.',
    steps:['Adjust the pivot point to hip level. Sit and secure your feet on the footrests.','Extend by driving your hips forward and raising your torso — squeeze glutes and lower back at the top.','Lower with full control back to start — do not round the back at any point.'],
    levels:{ novice:'3×12 bodyweight only — learn the extension arc first', beginner:'3×12 light resistance', intermediate:'4×12 moderate — 2s hold at top', advanced:'4×10 heavy — slow 3s descent', elite:'5×10 max — paused extension + glute squeeze' }},

  // ── PUSH — Chest, Shoulders & Triceps (6–11) ─────────────────────────────────
  { id:6, type:'PUSH', name:'Chest Press Machine',   muscle:'Chest & Triceps',        equipment:'Life Fitness Machine',
    description:'The Life Fitness chest press delivers a natural pressing arc mirroring the pec\'s fiber direction. Build chest mass safely without a spotter — supports high-protein bulking phases.',
    steps:['Adjust seat so handles align with mid-chest. Sit back into pad, feet flat on floor.','Press handles forward until arms nearly extended — do not hard-lock elbows.','Return slowly under control — feel a deep pec stretch at the start position each rep.'],
    levels:{ novice:'3×12 light — learn the pressing arc and pec activation', beginner:'3×12 moderate', intermediate:'4×10 heavy — 3s controlled return', advanced:'4×8 very heavy — 1s pause at extension', elite:'5×8 max — drop set on last set, 60s rest' }},
  { id:7, type:'PUSH', name:'Shoulder Press Machine', muscle:'Shoulders & Triceps',    equipment:'Life Fitness Machine',
    description:'Seated overhead press machine for building deltoid mass. The guided path protects the shoulder joint while allowing heavy loading for maximum shoulder development.',
    steps:['Adjust seat so handles start at shoulder height. Sit upright, back flat against the pad.','Press handles overhead until arms are nearly extended — do not shrug at the top.','Lower slowly until handles return to shoulder height — full range every rep.'],
    levels:{ novice:'3×12 light — feel the shoulder push, core braced', beginner:'3×12 moderate', intermediate:'4×10 heavy — 3s slow return', advanced:'4×8 very heavy — 90s rest', elite:'5×6 max — explode up, slow down, 60s rest' }},
  { id:8, type:'PUSH', name:'Lateral Raise Machine',  muscle:'Medial Deltoids',        equipment:'Life Fitness Machine',
    description:'Machine lateral raise creates constant tension throughout the movement — unlike dumbbells which become easy at the bottom. The key machine for building wide, capped shoulders.',
    steps:['Sit with elbows resting on the pads. Adjust height so elbows are at shoulder level.','Raise your arms laterally until parallel to the floor — lead with elbows, not wrists.','Lower slowly, maintaining tension — do not let the weight stack touch down between reps.'],
    levels:{ novice:'3×15 very light — feel the medial delt only, no traps', beginner:'3×15 light', intermediate:'4×15 moderate — 1s hold at top', advanced:'4×12 heavy — rest-pause on last set', elite:'5×15 heavy — 2s up, 3s down tempo' }},
  { id:9, type:'PUSH', name:'Pectoral Fly Machine',   muscle:'Chest (Inner & Stretch)',equipment:'Life Fitness Machine',
    description:'Isolation flye machine targeting the chest through a deep stretch — impossible to replicate with compound movements. Essential for inner chest development and muscle fullness.',
    steps:['Adjust handles so arms are parallel at start — keep a slight elbow bend throughout.','Bring handles together in a wide arc — squeeze the pecs hard when handles meet at the front.','Return slowly in a wide arc — feel the full chest stretch at the start before next rep.'],
    levels:{ novice:'3×15 light — feel the stretch first, squeeze second', beginner:'3×15 moderate', intermediate:'4×12 heavy — 2s hold at contraction', advanced:'4×12 very heavy — 3s eccentric', elite:'5×12 max — drop set immediately after last set' }},
  { id:10, type:'PUSH', name:'Triceps Extension Machine', muscle:'Triceps',            equipment:'Life Fitness Machine',
    description:'Overhead or pushdown triceps extension machine isolating all three tricep heads. The long head receives maximum stretch — the most underdeveloped head in most trainees.',
    steps:['Adjust seat so upper arms are locked against the pad. Grip handles firmly.','Extend arms to full lockout — squeeze the triceps hard at the peak of the movement.','Return slowly — upper arms stay glued to the pad throughout for strict isolation.'],
    levels:{ novice:'3×15 light — full lockout on every rep', beginner:'3×15 moderate', intermediate:'4×12 heavy — 2s hold at lockout', advanced:'4×10 very heavy — 3s eccentric', elite:'5×10 max — drop set, slow tempo throughout' }},
  { id:11, type:'PUSH', name:'Assisted Dip Machine',  muscle:'Chest & Triceps',        equipment:'Life Fitness Machine',
    description:'The assisted dip machine allows progressive loading by counterbalancing bodyweight. Work progressively toward unassisted dips — the gold standard for upper body pushing strength.',
    steps:['Set assistance weight (higher number = easier). Grip bars, step on platform, arms extended.','Lower your body bending elbows to 90° — lean slightly forward for more chest, upright for triceps.','Push back up to full extension — squeeze chest and triceps together at the top.'],
    levels:{ novice:'3×8 high assistance — learn the dip movement pattern safely', beginner:'3×10 moderate assistance', intermediate:'4×10 low assistance', advanced:'4×8 zero assistance (full bodyweight dip)', elite:'5×8+ zero assistance — add weight if available' }},

  // ── ABS & LEGS (12–17) ────────────────────────────────────────────────────────
  { id:12, type:'ABS_LEGS', name:'Abdominal Machine',       muscle:'Rectus Abdominis',        equipment:'Life Fitness Machine',
    description:'Crunch machine with resistance against the full abdominal contraction. The guided arc ensures correct spinal flexion and removes hip flexor cheating — pure ab training.',
    steps:['Adjust seat so the pivot aligns with your mid-torso. Grip handles at shoulder level.','Crunch forward bringing handles toward knees — exhale fully and squeeze abs hard at peak.','Return slowly — resist the weight on the way back for maximum time under tension.'],
    levels:{ novice:'3×15 light — abs, not hip flexors', beginner:'3×20 moderate', intermediate:'4×15 heavy — 2s hold at contraction', advanced:'4×12 very heavy — slow 3s eccentric', elite:'5×15 max — drop set, 45s rest' }},
  { id:13, type:'ABS_LEGS', name:'Seated Leg Press',         muscle:'Quads, Glutes & Hamstrings',equipment:'Life Fitness Machine',
    description:'The most effective machine for overall lower body mass. Heavy loading without spinal compression — the cornerstone of every leg session. Calibrated for high-protein muscle building.',
    steps:['Adjust backrest so knees reach 90° at start. Place feet shoulder-width on the platform.','Press platform away by extending legs — stop just short of full knee lockout.','Return the platform slowly — knees track over toes, go to 90° or deeper for full range.'],
    levels:{ novice:'3×12 light — learn foot placement and knee tracking', beginner:'3×15 moderate', intermediate:'4×12 heavy — 3s slow return', advanced:'4×10 very heavy — 2s pause at bottom', elite:'5×8 max — drop set on last, 90s rest' }},
  { id:14, type:'ABS_LEGS', name:'Seated Leg Curl Machine',  muscle:'Hamstrings',              equipment:'Life Fitness Machine',
    description:'Seated leg curl provides a superior hamstring stretch versus lying variations. Critical for hamstring hypertrophy, knee health, and posterior chain balance on a leg day.',
    steps:['Adjust thigh pad to sit firmly on top of thighs. Ankle pad positioned just above the heel.','Curl legs down as far as possible — squeeze hamstrings hard at full flexion.','Return slowly under control — do not let the weight slam at the top.'],
    levels:{ novice:'3×12 light — full range only, no partial reps', beginner:'3×12 moderate', intermediate:'4×10 heavy — 3s slow return', advanced:'4×8 very heavy — 2s hold at flex', elite:'5×10 max — drop set, 60s rest' }},
  { id:15, type:'ABS_LEGS', name:'Hip Abduction Machine',    muscle:'Glutes & Hip Abductors',  equipment:'Life Fitness Machine',
    description:'Hip abduction machine isolates the glute medius and hip abductors — key muscles for hip stability, glute shaping, and injury prevention. Often the most underdeveloped muscle group.',
    steps:['Sit with back against pad, thighs on the inner side of the pads.','Push legs outward against resistance as wide as possible — squeeze glutes hard at peak.','Return legs inward slowly — resist the weight throughout the full return.'],
    levels:{ novice:'3×15 light — feel the outer glute, not the quads', beginner:'3×15 moderate', intermediate:'4×20 moderate — 1s pause at full abduction', advanced:'4×15 heavy — 2s eccentric', elite:'5×20 heavy — drop set on last, continuous tension' }},
  { id:16, type:'ABS_LEGS', name:'Calf Extension Machine',   muscle:'Calves (Gastrocnemius & Soleus)',equipment:'Life Fitness Machine',
    description:'Full-range calf training on the Life Fitness machine. Deep stretch to peak contraction on every rep — the only way to grow calves. Partial reps build nothing.',
    steps:['Position feet on the platform — balls of feet only, heels hanging off.','Rise onto the balls of your feet as high as possible — squeeze calves hard at the top.','Lower heels as far as possible below the platform — pause 1s in the deep stretch before pressing.'],
    levels:{ novice:'3×15 bodyweight — deep stretch is the priority', beginner:'3×20 light resistance', intermediate:'4×15 moderate — 2s pause in stretch position', advanced:'4×12 heavy — 3s up, 3s down full tempo', elite:'5×15 max — single leg if available' }},
  { id:17, type:'ABS_LEGS', name:'Back Extension (Leg Day)',  muscle:'Lower Back, Glutes & Hamstrings',equipment:'Life Fitness Machine',
    description:'Back extension on leg day reinforces posterior chain strength connecting lower back to glutes and hamstrings. Finishes the leg session with full posterior chain activation.',
    steps:['Adjust pivot to hip level, feet secured on footrests. Start in the lowered position.','Extend upward by squeezing glutes and driving hips forward simultaneously.','Hold the top position 2s — feel lower back, glutes, and hamstrings all contracted together.'],
    levels:{ novice:'3×12 bodyweight — learn the hip extension arc', beginner:'3×12 light resistance', intermediate:'4×12 moderate — 2s hold at extension', advanced:'4×10 heavy — slow 4s descent', elite:'5×10 max — add a hold and glute squeeze every rep' }},

  // ── CARDIO — Treadmill & Bike (18–21) ────────────────────────────────────────
  { id:18, type:'CARDIO', name:'Treadmill — Warmup Walk',    muscle:'Full Body Activation',   equipment:'Life Fitness Treadmill',
    description:'5–10 minute incline walk to raise heart rate, warm joints and activate the posterior chain before any session. The non-negotiable warmup for every workout.',
    steps:['Set treadmill to 5–8% incline, speed 4.5–5.5 km/h.','Walk for 5–10 minutes — arms swinging naturally, no holding the handrails.','Increase speed slightly in the last 2 minutes to prime the cardiovascular system.'],
    levels:{ novice:'5 min flat, 4 km/h — ease into movement', beginner:'7 min at 5% incline, 4.5 km/h', intermediate:'10 min at 8% incline, 5 km/h', advanced:'10 min at 10% incline, 5.5 km/h — hands-free', elite:'10 min at 12% incline, 6 km/h — hands-free, upright posture' }},
  { id:19, type:'CARDIO', name:'Treadmill — Intervals (HIIT)',muscle:'Cardio & Legs',          equipment:'Life Fitness Treadmill',
    description:'High-intensity interval training on the treadmill — the most effective method for fat loss while preserving lean muscle mass. Ideal post-session cardio for a high-protein diet.',
    steps:['Warm up 3 min at easy walk (4 km/h flat).','Sprint at 10–14 km/h for 30s, then recover at 5 km/h for 60–90s — repeat cycles.','Finish with 3 min cool-down walk — mandatory to lower heart rate safely.'],
    levels:{ novice:'4 rounds × 20s jog / 90s walk', beginner:'6 rounds × 30s run / 90s walk', intermediate:'8 rounds × 30s sprint / 60s walk at 10–12 km/h', advanced:'10 rounds × 30s sprint / 45s walk at 12–14 km/h', elite:'12 rounds × 30s max sprint / 30s walk — all-out every round' }},
  { id:20, type:'CARDIO', name:'Bike — Warmup Pedal',        muscle:'Legs & Cardiovascular',  equipment:'Life Fitness Bike',
    description:'5–10 minute easy bike ride to warm up knees, hips and cardiovascular system before a leg or push day. Low-impact and joint-friendly — protects the knees before heavy loading.',
    steps:['Set resistance to level 3–5. Adjust seat so leg is nearly straight at bottom of pedal stroke.','Pedal at 75–90 RPM, comfortable pace — zone 1–2 heart rate, conversational.','Increase resistance slightly in the last 2 minutes to prime working heart rate.'],
    levels:{ novice:'5 min level 3, 70 RPM — just get blood moving', beginner:'7 min level 4, 75 RPM', intermediate:'10 min level 5, 80 RPM', advanced:'10 min level 6, 85 RPM', elite:'10 min level 7, 90 RPM — standing climbs in last 2 min' }},
  { id:21, type:'CARDIO', name:'Bike — LISS Cardio',         muscle:'Cardio & Fat Metabolism', equipment:'Life Fitness Bike',
    description:'Low-Intensity Steady State cycling at zone 2 heart rate. The most effective tool for fat metabolism without muscle breakdown — perfectly complements a high-protein recovery day.',
    steps:['Set resistance for a challenging but conversational pace — zone 2 (60–70% max HR).','Maintain a steady 75–85 RPM cadence for the full session duration.','Controlled breathing — you should be able to speak in short sentences throughout.'],
    levels:{ novice:'15 min steady — stay within comfortable breathing', beginner:'20 min zone 2', intermediate:'30 min zone 2 with 3 × 1 min hard efforts', advanced:'40 min — zone 2 with 5 × 2 min tempo surges', elite:'50–60 min pure zone 2 — structured aerobic base build' }},

]

// ─── Constants ───────────────────────────────────────────────────────────────
const TYPES = ['PULL', 'PUSH', 'ABS_LEGS', 'CARDIO']
const TYPE_INFO_STATIC: Record<string, { emoji: string; color: string }> = {
  PULL:     { emoji: '🔙', color: '#2d6a4f' },
  PUSH:     { emoji: '🔛', color: '#6b4226' },
  ABS_LEGS: { emoji: '🦵', color: '#40916c' },
  CARDIO:   { emoji: '🏃', color: '#a07850' },
}
const LEVELS = ['novice', 'beginner', 'intermediate', 'advanced', 'elite'] as const
const emptyLogForm = { type: 'PULL', title: '', date: new Date().toISOString().split('T')[0], notes: '' }
const emptyLogEx = { name: '', sets: 3, reps: '8-10', notes: '' }

// ─── 3-Day Split Plan ─────────────────────────────────────────────────────────
// Indices map to SPLIT_TYPES: 0=PULL, 1=PUSH, 2=ABS_LEGS
const SPLIT_TYPES = ['PULL', 'PUSH', 'ABS_LEGS'] as const
// Exercise IDs for each session — ordered: warmup → main lifts → cardio finisher
const DAY_PROGRAMS: Record<string, number[]> = {
  PULL:     [18, 1, 2, 3, 4, 5, 19],          // Treadmill warmup, 5 pulls, HIIT
  PUSH:     [20, 6, 7, 8, 9, 10, 11, 21],      // Bike warmup, 6 pushes, LISS
  ABS_LEGS: [18, 13, 14, 15, 16, 12, 17, 21],  // Treadmill warmup, 6 abs/legs, LISS
}
// Estimated session sets/reps for display
const DAY_DETAILS: Record<string, { sets: string; time: string }> = {
  PULL:     { sets: '20 sets', time: '~1h45' },
  PUSH:     { sets: '23 sets', time: '~1h45' },
  ABS_LEGS: { sets: '23 sets', time: '~1h45' },
}

// ─── Exercise Detail Overlay ──────────────────────────────────────────────────
function PhotoEditPopup({ index, current, onSave, onClose }: {
  index: number; current: string | null; onSave: (url: string | null) => void; onClose: () => void
}) {
  const [url, setUrl] = useState(current ?? '')

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { if (ev.target?.result) setUrl(ev.target.result as string) }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: 'var(--t-card-bg)' }}>
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--t-border-soft)' }}>
          <span className="font-semibold text-sm" style={{ color: 'var(--t-text-main)' }}>✏️ Photo {index + 1}</span>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold"
            style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>×</button>
        </div>
        <div className="p-4 space-y-3">
          {/* preview */}
          {url && (
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--t-border-soft)', aspectRatio: '4/3' }}>
              <img src={url} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
          {/* URL input */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>Image URL</label>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--t-border-soft)' }} />
          </div>
          {/* File upload */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>Or upload a file</label>
            <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed cursor-pointer text-sm font-medium transition-colors"
              style={{ borderColor: 'var(--t-border-soft)', color: 'var(--t-text-muted)' }}>
              📁 Choose file
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          </div>
          {/* actions */}
          <div className="flex gap-2 pt-1">
            {current && (
              <button onClick={() => onSave(null)}
                className="px-3 py-2.5 rounded-xl text-xs font-medium"
                style={{ backgroundColor: '#fde8ec', color: '#c0303e' }}>
                Reset
              </button>
            )}
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>Cancel</button>
            <button onClick={() => onSave(url.trim() || null)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ backgroundColor: '#2d6a4f' }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExDetailOverlay({ ex, onClose }: { ex: ExCard; onClose: () => void }) {
  const { t, lang } = useLang()
  const [activeStep, setActiveStep] = useState(0)
  const [level, setLevel] = useState<typeof LEVELS[number]>('beginner')
  const [imgs, setImgs] = useState<string[]>([])
  const [gifUrl, setGifUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingPhoto, setEditingPhoto] = useState<number | null>(null)
  const STORAGE_KEY = `workout_photos_${ex.id}`
  const [customPhotos, setCustomPhotos] = useState<(string | null)[]>(() => {
    if (typeof window === 'undefined') return [null, null, null]
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') ?? [null, null, null] } catch { return [null, null, null] }
  })

  function saveCustomPhoto(index: number, url: string | null) {
    const next = [...customPhotos]
    next[index] = url
    setCustomPhotos(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
    setEditingPhoto(null)
  }

  const fr = EXERCISE_FR[ex.id]
  const steps = lang === 'fr' && fr ? fr.steps : ex.steps
  const desc = lang === 'fr' && fr ? fr.description : ex.description
  const muscle = lang === 'fr' ? (MUSCLE_FR[ex.muscle] ?? ex.muscle) : ex.muscle
  const equipment = lang === 'fr' ? (EQUIP_FR[ex.equipment] ?? ex.equipment) : ex.equipment
  const levelLabels = [t.levelNovice, t.levelBeginner, t.levelIntermediate, t.levelAdvanced, t.levelElite]
  const levelText = (lk: typeof LEVELS[number]) => lang === 'fr' && fr ? fr.levels[lk] : ex.levels[lk]
  const info = TYPE_INFO_STATIC[ex.type]
  const stepColors = ['#2d6a4f', '#a07850', '#6b4226']
  const stepBgs = ['#d8f3dc', '#fef3e2', '#fde8ec']

  // Fetch exercise-specific images from wger.de (free, open-source, no key)
  // Fallback: ExerciseDB GIF
  useEffect(() => {
    const ctrl = new AbortController()
    const go = async () => {
      try {
        // Step 1: search wger for the exercise
        const sr = await fetch(
          `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(ex.name)}&language=english&format=json`,
          { signal: ctrl.signal }
        )
        if (!sr.ok) throw new Error()
        const sd = await sr.json()
        const baseId: number | undefined = sd.suggestions?.[0]?.data?.base_id
        if (baseId) {
          // Step 2: get exercise images
          const ir = await fetch(
            `https://wger.de/api/v2/exerciseimage/?exercise_base=${baseId}&format=json`,
            { signal: ctrl.signal }
          )
          if (!ir.ok) throw new Error()
          const id = await ir.json()
          const urls: string[] = (id.results ?? [])
            .filter((r: { image: string }) => r.image)
            .map((r: { image: string }) => r.image)
            .slice(0, 3)
          if (urls.length > 0) {
            // pad to 3 by repeating last
            while (urls.length < 3) urls.push(urls[urls.length - 1])
            setImgs(urls)
            setLoading(false)
            return
          }
        }
      } catch { /* fall through */ }

      // Fallback: ExerciseDB free API (animated GIF, shows full movement)
      try {
        const er = await fetch(
          `https://exercisedb.io/api/v1/exercises/name/${encodeURIComponent(ex.name.toLowerCase())}?limit=1`,
          { signal: ctrl.signal }
        )
        if (er.ok) {
          const ed = await er.json()
          if (ed[0]?.gifUrl) { setGifUrl(ed[0].gifUrl); setLoading(false); return }
        }
      } catch { /* fall through */ }

      setLoading(false) // show styled fallback
    }
    go()
    return () => ctrl.abort()
  }, [ex.name])

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl shadow-2xl"
        style={{ backgroundColor: 'var(--t-card-bg)' }}>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b"
          style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: info.color }}>{info.emoji} {ex.type}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>{equipment}</span>
            </div>
            <h2 className="font-bold text-lg leading-tight" style={{ color: 'var(--t-text-main)' }}>{ex.name}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-soft)' }}>{muscle}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>×</button>
        </div>

        <div className="px-5 py-4 space-y-5">

          {/* ── Image area ── */}
          {loading ? (
            /* Loading skeleton */
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="rounded-2xl animate-pulse" style={{ aspectRatio: '4/5', backgroundColor: 'var(--t-item-bg)' }} />
              ))}
            </div>
          ) : gifUrl && !customPhotos.some(p => p !== null) ? (
            /* ExerciseDB animated GIF — shows full movement */
            <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: info.color + '40' }}>
              <div className="relative">
                <img src={gifUrl} alt={ex.name} className="w-full object-contain" style={{ maxHeight: 280, backgroundColor: 'var(--t-item-bg)' }} />
                <span className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-lg text-white" style={{ backgroundColor: info.color }}>
                  {lang === 'fr' ? 'Mouvement complet' : 'Full movement'}
                </span>
                <button onClick={() => setEditingPhoto(0)}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md"
                  style={{ backgroundColor: 'var(--t-card-bg)', color: '#2d6a4f' }}>✏️</button>
              </div>
            </div>
          ) : imgs.length > 0 || customPhotos.some(p => p !== null) ? (
            /* wger exercise-specific images — 3 panels */
            <div className="grid grid-cols-3 gap-2">
              {steps.map((stepTxt, i) => {
                const src = customPhotos[i] ?? imgs[i]
                return (
                  <div key={i} className="relative rounded-2xl overflow-hidden transition-all"
                    style={{ aspectRatio: '4/5', outline: activeStep === i ? `3px solid ${info.color}` : '3px solid transparent', outlineOffset: '2px' }}>
                    <button className="absolute inset-0 w-full h-full" onClick={() => setActiveStep(i)} />
                    {src ? (
                      <img src={src} alt={`${ex.name} step ${i + 1}`}
                        className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0" style={{ backgroundColor: stepBgs[i] }} />
                    )}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.22) 50%, transparent 100%)' }} />
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white pointer-events-none"
                      style={{ backgroundColor: info.color }}>{i + 1}</div>
                    {/* Pen button */}
                    <button onClick={e => { e.stopPropagation(); setEditingPhoto(i) }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md z-10"
                      style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#2d6a4f' }}>✏️</button>
                    <div className="absolute bottom-0 left-0 right-0 p-2 pointer-events-none">
                      <p className="text-white font-medium leading-tight text-left"
                        style={{ fontSize: '10px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {stepTxt}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Styled fallback cards — no images available */
            <div className="grid grid-cols-3 gap-2">
              {steps.map((stepTxt, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden transition-all"
                  style={{ aspectRatio: '4/5', outline: activeStep === i ? `3px solid ${info.color}` : '3px solid transparent', outlineOffset: '2px', backgroundColor: stepBgs[i] }}>
                  <button className="absolute inset-0 w-full h-full flex flex-col items-center justify-between p-3" onClick={() => setActiveStep(i)}>
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-black text-white mt-1"
                      style={{ backgroundColor: stepColors[i] }}>{i + 1}</span>
                    <p className="text-center leading-snug mt-auto" style={{ fontSize: '10px', color: stepColors[i], fontWeight: 600 }}>
                      {stepTxt}
                    </p>
                  </button>
                  {/* Pen button */}
                  <button onClick={e => { e.stopPropagation(); setEditingPhoto(i) }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md z-10"
                    style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#2d6a4f' }}>✏️</button>
                </div>
              ))}
            </div>
          )}

          {/* Photo edit popup */}
          {editingPhoto !== null && (
            <PhotoEditPopup
              index={editingPhoto}
              current={customPhotos[editingPhoto] ?? null}
              onSave={url => saveCustomPhoto(editingPhoto, url)}
              onClose={() => setEditingPhoto(null)}
            />
          )}

          {/* Active step expanded */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: stepBgs[activeStep] }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ backgroundColor: stepColors[activeStep] }}>{activeStep + 1}</span>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: stepColors[activeStep] }}>
                {t.stepLabel} {activeStep + 1}
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--t-text-main)' }}>{steps[activeStep]}</p>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--t-text-muted)' }}>{desc}</p>

          {/* Level tabs */}
          <div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: 'none' }}>
              {LEVELS.map((lk, i) => (
                <button key={lk} onClick={() => setLevel(lk)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all"
                  style={{ backgroundColor: level === lk ? info.color : 'var(--t-item-bg)', color: level === lk ? '#fff' : 'var(--t-text-muted)' }}>
                  {levelLabels[i]}
                </button>
              ))}
            </div>
            <div className="rounded-2xl p-3" style={{ backgroundColor: 'var(--t-item-bg)' }}>
              <p className="text-sm font-medium" style={{ color: '#2d6a4f' }}>{levelText(level)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Exercise Card Component ──────────────────────────────────────────────────
function ExCard({
  ex, isFav, onFav, onEdit, onView,
}: {
  ex: ExCard; isFav: boolean; onFav: () => void; onEdit: () => void; onView: () => void
}) {
  const { t, lang } = useLang()
  const [step, setStep] = useState(0)
  const [level, setLevel] = useState<typeof LEVELS[number]>('beginner')
  const info = TYPE_INFO_STATIC[ex.type]
  const levelKeys = LEVELS
  const levelLabels = [t.levelNovice, t.levelBeginner, t.levelIntermediate, t.levelAdvanced, t.levelElite]

  const fr = EXERCISE_FR[ex.id]
  const steps = lang === 'fr' && fr ? fr.steps : ex.steps
  const levelText = (lk: typeof LEVELS[number]) =>
    lang === 'fr' && fr ? fr.levels[lk] : ex.levels[lk]
  const muscle = lang === 'fr' ? (MUSCLE_FR[ex.muscle] ?? ex.muscle) : ex.muscle
  const equipment = lang === 'fr' ? (EQUIP_FR[ex.equipment] ?? ex.equipment) : ex.equipment

  return (
    <div className="rounded-2xl border-2 flex flex-col overflow-hidden shadow-sm"
      style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onView}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: info.color }}>{info.emoji} {ex.type}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>{equipment}</span>
          </div>
          <h3 className="font-bold text-sm leading-tight" style={{ color: 'var(--t-text-main)' }}>{ex.name}</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-soft)' }}>{muscle}</p>
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onView} className="w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs"
            style={{ backgroundColor: info.color, color: '#fff' }}>📸</button>
          <button onClick={onEdit} className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>✏️</button>
          <button onClick={onFav} className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{ backgroundColor: isFav ? '#fde8ec' : 'var(--t-item-bg)' }}>
            <span style={{ fontSize: 14 }}>{isFav ? '❤️' : '🤍'}</span>
          </button>
        </div>
      </div>

      {/* Step Carousel */}
      <div className="mx-4 mb-2 rounded-xl p-3 relative" style={{ backgroundColor: 'var(--t-item-bg)', minHeight: 88 }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold" style={{ color: '#2d6a4f' }}>{t.stepLabel} {step + 1}/{steps.length}</span>
          <div className="flex gap-1">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
              className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center disabled:opacity-30"
              style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>‹</button>
            <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
              className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center disabled:opacity-30"
              style={{ backgroundColor: '#d8f3dc', color: '#2d6a4f' }}>›</button>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text-muted)' }}>{steps[step]}</p>
        {/* Dots */}
        <div className="flex gap-1 mt-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{ backgroundColor: i === step ? '#2d6a4f' : '#c4a882' }} />
          ))}
        </div>
      </div>

      {/* Level Tabs */}
      <div className="px-4 pb-2">
        <div className="flex gap-1 overflow-x-auto pb-1 mb-2" style={{ scrollbarWidth: 'none' }}>
          {levelKeys.map((lk, i) => (
            <button key={lk} onClick={() => setLevel(lk)}
              className="px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0"
              style={{ backgroundColor: level === lk ? info.color : 'var(--t-item-bg)', color: level === lk ? '#fff' : 'var(--t-text-muted)' }}>
              {levelLabels[i].split(' ')[0]}
            </button>
          ))}
        </div>
        <p className="text-xs leading-relaxed rounded-xl p-2.5" style={{ backgroundColor: 'var(--t-item-bg)', color: '#2d6a4f' }}>
          {levelLabels[levelKeys.indexOf(level)]} — {levelText(level)}
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WorkoutPage() {
  const { t } = useLang()

  const TYPE_INFO: Record<string, { label: string; emoji: string; color: string }> = {
    PULL:     { label: t.pullDay,  emoji: '🔙', color: '#2d6a4f' },
    PUSH:     { label: t.pushDay,  emoji: '🔛', color: '#6b4226' },
    ABS_LEGS: { label: t.absLegs,  emoji: '🦵', color: '#40916c' },
    CARDIO:   { label: t.cardio,   emoji: '🏃', color: '#a07850' },
  }

  // ── Main tab ────────────────────────────────────────────────────────────────
  const [mainTab, setMainTab] = useState<'library' | 'week' | 'videos'>('library')

  // ── Videos state ────────────────────────────────────────────────────────────
  const [igVideos, setIgVideos] = useState<VideoEntry[]>([])
  const [addingVideo, setAddingVideo] = useState(false)
  const [vForm, setVForm] = useState({ name: '', url: '', types: [] as string[] })
  const [vUrlStatus, setVUrlStatus] = useState<'idle' | 'ok' | 'bad'>('idle')

  // ── Library state ──────────────────────────────────────────────────────────
  const [libCat, setLibCat] = useState('PULL')
  const [libFilter, setLibFilter] = useState<'all' | 'favs'>('all')
  const [favExercises, setFavExercises] = useState<Set<number>>(new Set())
  const [editEx, setEditEx] = useState<ExCard | null>(null)
  const [detailEx, setDetailEx] = useState<ExCard | null>(null)
  const [customNotes, setCustomNotes] = useState<Record<number, string>>({})
  const [noteInput, setNoteInput] = useState('')


  // ── Week plan state ────────────────────────────────────────────────────────
  const [splitOrder, setSplitOrder] = useState<number[]>([0, 1, 2]) // indices into SPLIT_TYPES
  const [activeDay, setActiveDay] = useState(0)                      // which day card is expanded
  const [doneSets, setDoneSets] = useState<Set<string>>(new Set())   // "d{dayIdx}-{exId}"

  // ── Load ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      setFavExercises(new Set(JSON.parse(localStorage.getItem('favEx') || '[]')))
      setCustomNotes(JSON.parse(localStorage.getItem('exNotes') || '{}'))
      setSplitOrder(JSON.parse(localStorage.getItem('splitOrder') || '[0,1,2]'))
      setDoneSets(new Set(JSON.parse(localStorage.getItem('exDone') || '[]')))
    } catch {}
    fetch('/api/videos').then(r => r.json()).then(setIgVideos).catch(() => {})
  }, [])


  // ── Library helpers ────────────────────────────────────────────────────────
  const filteredLib = useMemo(() =>
    EXERCISES.filter(e => e.type === libCat && (libFilter === 'all' || favExercises.has(e.id))),
    [libCat, libFilter, favExercises])

  const toggleFav = (id: number) => {
    const next = new Set(favExercises)
    if (next.has(id)) next.delete(id); else next.add(id)
    setFavExercises(next); localStorage.setItem('favEx', JSON.stringify([...next]))
  }

  const openEdit = (ex: ExCard) => {
    setEditEx(ex); setNoteInput(customNotes[ex.id] || '')
  }
  const saveNote = () => {
    if (!editEx) return
    const next = { ...customNotes, [editEx.id]: noteInput }
    setCustomNotes(next); localStorage.setItem('exNotes', JSON.stringify(next)); setEditEx(null)
  }


  // ── Week helpers ───────────────────────────────────────────────────────────
  const getSplitType = (dayIdx: number) => SPLIT_TYPES[splitOrder[dayIdx]]
  const getDayExercises = (dayIdx: number) =>
    DAY_PROGRAMS[getSplitType(dayIdx)]
      .map(id => EXERCISES.find(e => e.id === id))
      .filter((e): e is ExCard => !!e)

  // Rotate: Day 1 done → Day 2 becomes Day 1, Day 3 → Day 2, old Day 1 → Day 3
  const rotateDay = () => {
    const next = [...splitOrder.slice(1), splitOrder[0]]
    setSplitOrder(next)
    localStorage.setItem('splitOrder', JSON.stringify(next))
    // Reset done checkmarks for what was Day 1 (now Day 3 after rotation)
    const cleaned = new Set([...doneSets].filter(k => !k.startsWith('d0-')))
    setDoneSets(cleaned); localStorage.setItem('exDone', JSON.stringify([...cleaned]))
    setActiveDay(0)
  }

  const toggleDone = (dayIdx: number, exId: number) => {
    const key = `d${dayIdx}-${exId}`
    const next = new Set(doneSets)
    if (next.has(key)) next.delete(key); else next.add(key)
    setDoneSets(next); localStorage.setItem('exDone', JSON.stringify([...next]))
  }

  const dayAllDone = (dayIdx: number) =>
    getDayExercises(dayIdx).every(ex => doneSets.has(`d${dayIdx}-${ex.id}`))

  return (
    <div>

      {/* Page Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--t-text-main)' }}>💪 Workout</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--t-text-muted)' }}>{t.workoutSubtitle}</p>
        </div>

      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {([['library', t.libraryTab], ['week', t.workoutWeekTab], ['videos', '🎬 Videos']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setMainTab(key)}
            className="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
            style={{ backgroundColor: mainTab === key ? '#2d6a4f' : 'var(--t-item-bg)', color: mainTab === key ? '#fff' : 'var(--t-text-muted)' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── LIBRARY TAB ──────────────────────────────────────────────────────── */}
      {mainTab === 'library' && (
        <>
          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: 'none' }}>
            {TYPES.map(tp => {
              const info = TYPE_INFO[tp]
              return (
                <button key={tp} onClick={() => setLibCat(tp)}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-1 transition-all"
                  style={{ backgroundColor: libCat === tp ? info.color : 'var(--t-item-bg)', color: libCat === tp ? '#fff' : 'var(--t-text-muted)' }}>
                  {info.emoji} {info.label}
                </button>
              )
            })}
          </div>

          {/* All / Favs sub-filter */}
          <div className="flex gap-2 mb-5">
            {(['all', 'favs'] as const).map(f => (
              <button key={f} onClick={() => setLibFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{ backgroundColor: libFilter === f ? '#c0303e' : '#fde8ec', color: libFilter === f ? '#fff' : '#c0303e' }}>
                {f === 'all' ? t.allExercises : '❤️ Favs'}
              </button>
            ))}
            <span className="text-xs ml-auto self-center" style={{ color: 'var(--t-text-soft)' }}>{filteredLib.length} exercises</span>
          </div>

          {filteredLib.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
              <p className="text-4xl mb-2">❤️</p>
              <p className="font-medium text-sm">{t.noFavExercises}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLib.map(ex => (
                <ExCard key={ex.id} ex={ex} isFav={favExercises.has(ex.id)}
                  onFav={() => toggleFav(ex.id)} onEdit={() => openEdit(ex)} onView={() => setDetailEx(ex)} />
              ))}
            </div>
          )}

          {/* Favs section per category */}
          {libFilter === 'all' && favExercises.size > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-semibold" style={{ color: 'var(--t-text-main)' }}>❤️ Favorites — {TYPE_INFO[libCat]?.label}</h2>
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--t-border-soft)' }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {EXERCISES.filter(e => e.type === libCat && favExercises.has(e.id)).map(ex => (
                  <ExCard key={ex.id} ex={ex} isFav={true}
                    onFav={() => toggleFav(ex.id)} onEdit={() => openEdit(ex)} onView={() => setDetailEx(ex)} />
                ))}
              </div>
            </div>
          )}
        </>
      )}


      {/* ── WEEK PLAN TAB ─────────────────────────────────────────────────────── */}
      {mainTab === 'week' && (
        <div className="space-y-4">

          {/* ── Day 1 rotate tip ── */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
            <span>💡</span>
            <span>Complete Day 1 → press <strong style={{ color: 'var(--t-text-main)' }}>Day Done ↻</strong> to shift the queue forward</span>
          </div>

          {/* ── 3 day cards ── */}
          {[0, 1, 2].map(dayIdx => {
            const type = getSplitType(dayIdx)
            const info = TYPE_INFO_STATIC[type]
            const exList = getDayExercises(dayIdx)
            const details = DAY_DETAILS[type]
            const isNext = dayIdx === 0
            const isOpen = activeDay === dayIdx
            const doneCount = exList.filter(ex => doneSets.has(`d${dayIdx}-${ex.id}`)).length
            const allDone = doneCount === exList.length

            return (
              <div key={dayIdx}
                className="rounded-2xl border-2 overflow-hidden transition-all"
                style={{
                  borderColor: isNext ? info.color : 'var(--t-border-soft)',
                  backgroundColor: 'var(--t-card-bg)',
                  opacity: dayIdx === 2 ? 0.75 : 1,
                }}>

                {/* Card header — always visible */}
                <button
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                  onClick={() => setActiveDay(isOpen ? -1 : dayIdx)}>

                  {/* Day badge */}
                  <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl shrink-0 text-white font-black text-sm"
                    style={{ backgroundColor: isNext ? info.color : 'var(--t-item-bg)', color: isNext ? '#fff' : 'var(--t-text-muted)' }}>
                    {dayIdx + 1}
                  </div>

                  {/* Label + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {isNext && <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: info.color }}>Next</span>}
                      <span className="font-bold text-sm" style={{ color: 'var(--t-text-main)' }}>
                        {info.emoji} Day {dayIdx + 1} — {type === 'ABS_LEGS' ? 'Abs & Legs' : type === 'PULL' ? 'Pull Day' : 'Push Day'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--t-text-soft)' }}>
                      <span>⏱ {details.time}</span>
                      <span>·</span>
                      <span>{details.sets}</span>
                      <span>·</span>
                      <span style={{ color: doneCount > 0 ? '#2d6a4f' : 'var(--t-text-soft)' }}>
                        {doneCount}/{exList.length} done
                      </span>
                    </div>
                  </div>

                  {/* Progress ring + chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    {allDone && <span className="text-lg">✅</span>}
                    <span className="text-sm" style={{ color: 'var(--t-text-soft)' }}>
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </div>
                </button>

                {/* Expanded exercise list */}
                {isOpen && (
                  <div className="border-t px-4 pb-4 pt-3 space-y-2"
                    style={{ borderColor: 'var(--t-border-soft)' }}>

                    {exList.map((ex, i) => {
                      const isDone = doneSets.has(`d${dayIdx}-${ex.id}`)
                      const exInfo = TYPE_INFO_STATIC[ex.type]
                      const isWarmup = ex.type === 'CARDIO' && i === 0
                      const isFinisher = ex.type === 'CARDIO' && i === exList.length - 1
                      return (
                        <div key={ex.id}
                          className="flex items-center gap-3 p-3 rounded-xl transition-all"
                          style={{ backgroundColor: isDone ? '#f0faf2' : 'var(--t-item-bg)', borderLeft: `3px solid ${isDone ? '#2d6a4f' : exInfo.color}` }}>
                          {/* Order number */}
                          <span className="text-xs font-black w-5 text-center shrink-0"
                            style={{ color: isDone ? '#52b788' : 'var(--t-text-soft)' }}>{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate"
                              style={{ color: isDone ? '#52b788' : 'var(--t-text-main)', textDecoration: isDone ? 'line-through' : 'none' }}>
                              {ex.name}
                              {isWarmup && <span className="ml-1 text-xs font-normal" style={{ color: '#a07850' }}>· warmup</span>}
                              {isFinisher && <span className="ml-1 text-xs font-normal" style={{ color: '#a07850' }}>· finisher</span>}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-soft)' }}>{ex.muscle}</p>
                          </div>
                          <button
                            onClick={() => toggleDone(dayIdx, ex.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all"
                            style={{ backgroundColor: isDone ? '#2d6a4f' : 'var(--t-card-bg)', color: isDone ? '#fff' : 'var(--t-text-muted)', border: `2px solid ${isDone ? '#2d6a4f' : 'var(--t-border-soft)'}` }}>
                            {isDone ? '✓' : ''}
                          </button>
                        </div>
                      )
                    })}

                    {/* Day 1 Done → Rotate button */}
                    {isNext && (
                      <button
                        onClick={rotateDay}
                        className="w-full mt-3 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
                        style={{ backgroundColor: allDone ? info.color : 'var(--t-item-bg)', color: allDone ? '#fff' : 'var(--t-text-muted)', border: `2px solid ${allDone ? info.color : 'var(--t-border-soft)'}` }}>
                        {allDone ? '🎉 Day Done — Rotate Queue ↻' : '↻ Day Done — Rotate Queue'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Edit Exercise Modal ─────────────────────────────────────────────── */}
      {editEx && (
        <Modal title={t.editExercise} onClose={() => setEditEx(null)}>
          <div className="mb-2">
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--t-text-main)' }}>{editEx.name}</p>
            <p className="text-xs mb-4" style={{ color: 'var(--t-text-soft)' }}>{editEx.muscle} · {editEx.equipment}</p>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.personalNotes}</label>
            <textarea value={noteInput} onChange={e => setNoteInput(e.target.value)} rows={4}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
              style={{ borderColor: 'var(--t-border-soft)' }}
              placeholder="Your custom notes, cues, weight used..." />
          </div>
          {customNotes[editEx.id] && (
            <p className="text-xs italic mb-3 px-2 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
              Previously saved: {customNotes[editEx.id]}
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <button onClick={() => setEditEx(null)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">{t.cancel}</button>
            <button onClick={saveNote} className="btn-glass btn-glass-green flex-1 py-2.5 rounded-xl text-sm font-medium">{t.saveNotes}</button>
          </div>
        </Modal>
      )}



      {/* ── VIDEOS TAB ──────────────────────────────────────────────────────── */}
      {mainTab === 'videos' && (
        <VideoTab
          videos={igVideos}
          adding={addingVideo}
          form={vForm}
          urlStatus={vUrlStatus}
          onStartAdd={() => { setVForm({ name: '', url: '', types: [] }); setVUrlStatus('idle'); setAddingVideo(true) }}
          onCancelAdd={() => setAddingVideo(false)}
          onFormChange={f => { setVForm(f); if (f.url !== vForm.url) setVUrlStatus('idle') }}
          onCheckUrl={() => {
            const ok = /tiktok\.com\/@[\w.]+\/video\/\d+|vm\.tiktok\.com\/[\w]+/i.test(vForm.url)
            setVUrlStatus(ok ? 'ok' : 'bad')
          }}
          onConfirm={async () => {
            if (!vForm.name.trim() || vUrlStatus !== 'ok') return
            const res = await fetch('/api/videos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: vForm.name.trim(), url: vForm.url.trim(), types: vForm.types }),
            })
            const created = await res.json()
            setIgVideos(prev => [...prev, created])
            setAddingVideo(false)
          }}
          onDelete={async (id) => {
            await fetch(`/api/videos/${id}`, { method: 'DELETE' })
            setIgVideos(prev => prev.filter(v => String(v.id) !== String(id)))
          }}
        />
      )}

      {/* ── Exercise Detail Overlay ─────────────────────────────────────────── */}
      {detailEx && <ExDetailOverlay ex={detailEx} onClose={() => setDetailEx(null)} />}
    </div>
  )
}

// ── Video types ───────────────────────────────────────────────────────────────
const VIDEO_TYPES = [
  { key: 'arms',  label: 'Bras',   emoji: '💪' },
  { key: 'abs',   label: 'Abdo',   emoji: '🔥' },
  { key: 'back',  label: 'Dos',    emoji: '🏋️' },
  { key: 'legs',  label: 'Jambes', emoji: '🦵' },
  { key: 'chest', label: 'Pecto',  emoji: '🫁' },
  { key: 'glutes',label: 'Fesse',  emoji: '🍑' },
  { key: 'cardio',label: 'Cardio', emoji: '🏃' },
] as const
type VType = typeof VIDEO_TYPES[number]['key']

// ── VideoTab component ────────────────────────────────────────────────────────
function VideoTab({
  videos, adding, form, urlStatus,
  onStartAdd, onCancelAdd, onFormChange, onCheckUrl, onConfirm, onDelete,
}: {
  videos: VideoEntry[]
  adding: boolean
  form: { name: string; url: string; types: string[] }
  urlStatus: 'idle' | 'ok' | 'bad'
  onStartAdd: () => void
  onCancelAdd: () => void
  onFormChange: (f: { name: string; url: string; types: string[] }) => void
  onCheckUrl: () => void
  onConfirm: () => void
  onDelete: (id: number | string) => void
}) {
  const [filter, setFilter] = useState<string | null>(null)

  const filtered = filter ? videos.filter(v => v.types?.includes(filter)) : videos

  // Empty state
  if (videos.length === 0 && !adding) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-black"
          style={{ background: 'linear-gradient(135deg,#69C9D0,#EE1D52)', color: '#fff' }}>
          ♪
        </div>
        <div className="text-center">
          <p className="font-bold text-base" style={{ color: 'var(--t-text-main)' }}>Aucune vidéo pour l'instant</p>
          <p className="text-sm mt-1" style={{ color: 'var(--t-text-soft)' }}>Ajoute ta première vidéo TikTok</p>
        </div>
        <button
          onClick={onStartAdd}
          className="w-14 h-14 rounded-full text-3xl font-bold flex items-center justify-center shadow-lg active:scale-95"
          style={{ background: 'linear-gradient(135deg,#69C9D0,#EE1D52)', color: '#fff' }}
        >
          +
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* ── Filter pills ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setFilter(null)}
          className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            backgroundColor: filter === null ? 'var(--t-primary)' : 'var(--t-item-bg)',
            color: filter === null ? '#fff' : 'var(--t-text-muted)',
          }}
        >
          Tous ({videos.length})
        </button>
        {VIDEO_TYPES.map(vt => {
          const count = videos.filter(v => v.types?.includes(vt.key)).length
          if (count === 0) return null
          return (
            <button
              key={vt.key}
              onClick={() => setFilter(filter === vt.key ? null : vt.key)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1"
              style={{
                backgroundColor: filter === vt.key ? '#2d6a4f' : 'var(--t-item-bg)',
                color: filter === vt.key ? '#fff' : 'var(--t-text-muted)',
              }}
            >
              {vt.emoji} {vt.label} ({count})
            </button>
          )
        })}
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(v => (
          <VideoCard key={v.id} video={v} onDelete={onDelete} />
        ))}

        {/* Add form — full width on mobile, 1 col on sm+ */}
        {adding ? (
          <div className="sm:col-span-1 col-span-full">
            <AddVideoCard
              form={form}
              urlStatus={urlStatus}
              onChange={onFormChange}
              onCheck={onCheckUrl}
              onConfirm={onConfirm}
              onCancel={onCancelAdd}
            />
          </div>
        ) : (
          <button
            onClick={onStartAdd}
            className="rounded-2xl border-2 border-dashed flex items-center justify-center transition-all active:scale-95 min-h-[120px] sm:min-h-[200px]"
            style={{ borderColor: '#a0c4a9', backgroundColor: 'var(--t-item-bg)' }}
          >
            <span className="text-4xl font-bold" style={{ color: '#2d6a4f' }}>+</span>
          </button>
        )}
      </div>

      {/* Empty filter result */}
      {filtered.length === 0 && filter && (
        <p className="text-center text-sm py-10" style={{ color: 'var(--t-text-soft)' }}>
          Aucune vidéo pour ce type.
        </p>
      )}
    </div>
  )
}

function VideoCard({ video, onDelete }: { video: VideoEntry; onDelete: (id: number | string) => void }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-md"
      style={{ minHeight: 180, background: 'linear-gradient(160deg,#010101 0%,#1a1a1a 60%,#2a2a2a 100%)' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* TikTok gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg,#69C9D0,#EE1D52,#010101)' }} />

      {/* Type tags — top left */}
      {video.types && video.types.length > 0 && (
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[calc(100%-3rem)]">
          {video.types.map(tk => {
            const vt = VIDEO_TYPES.find(v => v.key === tk)
            return vt ? (
              <span key={tk} className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                {vt.emoji} {vt.label}
              </span>
            ) : null
          })}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center justify-center gap-3 p-4 pt-10 pb-4 h-full min-h-[180px]">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black"
          style={{ background: 'linear-gradient(135deg,#69C9D0,#EE1D52)', color: '#fff' }}>
          ♪
        </div>
        <p className="text-white font-bold text-sm text-center leading-tight px-2">{video.name}</p>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full flex items-center justify-center text-lg shadow-lg active:scale-95"
          style={{ background: 'linear-gradient(135deg,#69C9D0,#EE1D52)', color: '#fff' }}
        >
          ▶
        </a>
      </div>

      {/* Delete — always visible on mobile, hover on desktop */}
      <button
        onClick={e => { e.stopPropagation(); if (confirm('Supprimer cette vidéo ?')) onDelete(video.id) }}
        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          backgroundColor: 'rgba(192,48,62,0.85)', color: '#fff',
          opacity: hover ? 1 : 0.6,
        }}
      >
        ×
      </button>
    </div>
  )
}

function AddVideoCard({
  form, urlStatus, onChange, onCheck, onConfirm, onCancel,
}: {
  form: { name: string; url: string; types: string[] }
  urlStatus: 'idle' | 'ok' | 'bad'
  onChange: (f: { name: string; url: string; types: string[] }) => void
  onCheck: () => void
  onConfirm: () => void
  onCancel: () => void
}) {
  const canConfirm = form.name.trim().length > 0 && urlStatus === 'ok'

  const toggleType = (key: string) => {
    const next = form.types.includes(key)
      ? form.types.filter(t => t !== key)
      : [...form.types, key]
    onChange({ ...form, types: next })
  }

  return (
    <div
      className="rounded-2xl border-2 shadow-lg flex flex-col overflow-hidden w-full"
      style={{ borderColor: '#40916c', backgroundColor: 'var(--t-card-bg)' }}
    >
      <div className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg,#69C9D0,#EE1D52,#010101)' }} />

      <div className="flex flex-col gap-3 p-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--t-text-muted)' }}>Nom de l'exercice</label>
          <input
            value={form.name}
            onChange={e => onChange({ ...form, name: e.target.value })}
            placeholder="ex. Squat Jump"
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-300"
            style={{ borderColor: 'var(--t-border-soft)' }}
            autoFocus
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--t-text-muted)' }}>Lien TikTok</label>
          <div className="flex gap-2">
            <input
              value={form.url}
              onChange={e => onChange({ ...form, url: e.target.value })}
              placeholder="https://tiktok.com/@user/video/…"
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-green-300"
              style={{ borderColor: urlStatus === 'ok' ? '#40916c' : urlStatus === 'bad' ? '#c0303e' : 'var(--t-border-soft)' }}
              onKeyDown={e => { if (e.key === 'Enter') onCheck() }}
            />
            <button
              onClick={onCheck}
              className="px-3 py-2 rounded-xl text-xs font-bold shrink-0"
              style={{ backgroundColor: '#1a3a1a', color: '#74c69d' }}
            >
              ✓
            </button>
          </div>
          {urlStatus === 'ok' && <p className="text-xs mt-1 font-medium" style={{ color: '#2d6a4f' }}>✓ Lien valide</p>}
          {urlStatus === 'bad' && <p className="text-xs mt-1 font-medium" style={{ color: '#c0303e' }}>✗ URL TikTok invalide</p>}
        </div>

        {/* Type multi-select */}
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--t-text-muted)' }}>Type d'exercice</label>
          <div className="flex flex-wrap gap-2">
            {VIDEO_TYPES.map(vt => {
              const active = form.types.includes(vt.key)
              return (
                <button
                  key={vt.key}
                  type="button"
                  onClick={() => toggleType(vt.key)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: active ? '#2d6a4f' : 'var(--t-item-bg)',
                    color: active ? '#fff' : 'var(--t-text-muted)',
                    border: active ? '2px solid #2d6a4f' : '2px solid var(--t-border-soft)',
                  }}
                >
                  {vt.emoji} {vt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
            style={{ background: canConfirm ? 'linear-gradient(135deg,#69C9D0,#EE1D52)' : '#ccc', color: '#fff' }}
          >
            Ajouter ▶
          </button>
        </div>
      </div>
    </div>
  )
}
