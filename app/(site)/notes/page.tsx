'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'
import GamesTab from './GamesTab'

type Category = { id: number; name: string; color: string; emoji: string; createdAt: string }
type QuizQ = { q: string; opts: string[]; ans: number }
type Note = { id: number; categoryId: number; title: string; rules: string; examples: string; quiz?: string | null; createdAt: string }
type WordPair = { prompt: string; answer: string; noteTitle: string }

const PRESET_COLORS = [
  '#2d6a4f', '#40916c', '#1e6091', '#6a2d6a', '#6a2d2d',
  '#b8860b', '#6b4226', '#1a3a1a', '#3a1a3a', '#1a1a3a',
]

const PERSONAL_NOTES_KEY = 'personal_notes_content'

const emptyNote = { categoryId: '', title: '', rules: '', examples: '', quiz: '' }
const emptyCat = { name: '', emoji: '📝', color: '#2d6a4f' }

type Tab = 'spanish' | 'personal' | 'practice' | 'game'

function normalize(s: string) {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Returns true if the user's input matches any slash-separated alternative
function isCorrectAnswer(input: string, expected: string): boolean {
  const normInput = normalize(input)
  return expected.split('/').some(alt => normalize(alt) === normInput)
}

export default function NotesPage() {
  const { t } = useLang()
  const [categories, setCategories] = useState<Category[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [activeCat, setActiveCat] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('spanish')

  // Personal notes
  const [personalText, setPersonalText] = useState('')
  const [personalSaved, setPersonalSaved] = useState(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Category modal
  const [catModal, setCatModal] = useState(false)
  const [catForm, setCatForm] = useState(emptyCat)
  const [editingCatId, setEditingCatId] = useState<number | null>(null)
  const [catSaving, setCatSaving] = useState(false)

  // Note modal
  const [noteModal, setNoteModal] = useState(false)
  const [noteForm, setNoteForm] = useState<typeof emptyNote>(emptyNote)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [noteSaving, setNoteSaving] = useState(false)

  // Inline title editing
  const [editingTitle, setEditingTitle] = useState<number | null>(null)
  const [titleDraft, setTitleDraft] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)

  // ── Practice state ──
  const [practiceCatId, setPracticeCatId] = useState<number | null>(null)
  const [wordPairs, setWordPairs] = useState<WordPair[]>([])
  const [currentPair, setCurrentPair] = useState<{ pair: WordPair; idx: number } | null>(null)
  const [practiceInput, setPracticeInput] = useState('')
  const [practiceResult, setPracticeResult] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [recentIndices, setRecentIndices] = useState<number[]>([])
  const practiceInputRef = useRef<HTMLInputElement>(null)

  const loadCategories = () =>
    fetch('/api/notes/categories').then(r => r.json()).then(setCategories)

  const loadNotes = (catId?: number | null) => {
    const url = catId != null ? `/api/notes?categoryId=${catId}` : '/api/notes'
    fetch(url).then(r => r.json()).then(setNotes)
  }

  useEffect(() => {
    loadCategories()
    loadNotes(null)
    // Load personal notes: localStorage instant, then DB overrides
    const cached = localStorage.getItem(PERSONAL_NOTES_KEY)
    if (cached) setPersonalText(cached)
    fetch('/api/personal-notes')
      .then(r => r.json())
      .then(({ content }) => {
        if (content) {
          setPersonalText(content)
          localStorage.setItem(PERSONAL_NOTES_KEY, content)
        }
      })
      .catch(() => { /* offline — cached already loaded */ })
  }, [])

  const handleSelectCat = (id: number | null) => {
    setActiveCat(id)
    loadNotes(id)
  }

  const savePersonalNotes = async () => {
    // Save to localStorage immediately
    localStorage.setItem(PERSONAL_NOTES_KEY, personalText)
    // Save to DB
    await fetch('/api/personal-notes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: personalText }),
    })
    setPersonalSaved(true)
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => setPersonalSaved(false), 2000)
  }

  // ── Category CRUD ──
  const openAddCat = () => { setCatForm(emptyCat); setEditingCatId(null); setCatModal(true) }
  const openEditCat = (cat: Category) => {
    setCatForm({ name: cat.name, emoji: cat.emoji, color: cat.color })
    setEditingCatId(cat.id)
    setCatModal(true)
  }
  const saveCat = async () => {
    if (!catForm.name.trim()) return
    setCatSaving(true)
    if (editingCatId) {
      await fetch(`/api/notes/categories/${editingCatId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(catForm)
      })
    } else {
      await fetch('/api/notes/categories', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(catForm)
      })
    }
    await loadCategories()
    setCatModal(false)
    setCatSaving(false)
  }
  const deleteCat = async (id: number) => {
    if (!confirm(t.deleteCategory + '?')) return
    await fetch(`/api/notes/categories/${id}`, { method: 'DELETE' })
    if (activeCat === id) { setActiveCat(null); loadNotes(null) }
    await loadCategories()
    loadNotes(activeCat === id ? null : activeCat)
  }

  // ── Note CRUD ──
  const openAddNote = () => {
    setNoteForm({ ...emptyNote, categoryId: activeCat != null ? String(activeCat) : '' })
    setEditingNoteId(null)
    setNoteModal(true)
  }
  const openEditNote = (note: Note) => {
    setNoteForm({ categoryId: String(note.categoryId), title: note.title, rules: note.rules, examples: note.examples, quiz: note.quiz || '' })
    setEditingNoteId(note.id)
    setNoteModal(true)
  }
  const saveNote = async () => {
    if (!noteForm.title.trim() || !noteForm.categoryId) return
    setNoteSaving(true)
    if (editingNoteId) {
      await fetch(`/api/notes/${editingNoteId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(noteForm)
      })
    } else {
      await fetch('/api/notes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(noteForm)
      })
    }
    loadNotes(activeCat)
    setNoteModal(false)
    setNoteSaving(false)
  }
  const deleteNote = async (id: number) => {
    if (!confirm(t.deleteCategory + '?')) return
    await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    loadNotes(activeCat)
  }

  // ── Inline title editing ──
  const startEditTitle = (note: Note) => {
    setEditingTitle(note.id)
    setTitleDraft(note.title)
    setTimeout(() => titleInputRef.current?.focus(), 50)
  }
  const saveTitle = async (noteId: number) => {
    if (!titleDraft.trim()) { setEditingTitle(null); return }
    await fetch(`/api/notes/${noteId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titleDraft })
    })
    loadNotes(activeCat)
    setEditingTitle(null)
  }

  // ── Practice logic ──
  const doPick = useCallback((pairs: WordPair[], recent: number[]) => {
    if (pairs.length === 0) return
    const allIdx = pairs.map((_, i) => i)
    const available = pairs.length <= 5 ? allIdx : allIdx.filter(i => !recent.includes(i))
    const idx = available[Math.floor(Math.random() * available.length)]
    setCurrentPair({ pair: pairs[idx], idx })
    setPracticeInput('')
    setPracticeResult('idle')
    setRecentIndices(prev => [...prev, idx].slice(-5))
    setTimeout(() => practiceInputRef.current?.focus(), 80)
  }, [])

  const startPractice = async (catId: number) => {
    setPracticeCatId(catId)
    setCurrentPair(null)
    setRecentIndices([])
    const fetchedNotes: Note[] = await fetch(`/api/notes?categoryId=${catId}`).then(r => r.json())
    const pairs: WordPair[] = []
    for (const note of fetchedNotes) {
      if (!note.quiz) continue
      try {
        const items: QuizQ[] = JSON.parse(note.quiz)
        for (const item of items) {
          if (!item.q || !Array.isArray(item.opts) || item.ans === undefined || !item.opts[item.ans]) continue
          const answerParts = item.opts[item.ans].split('/').map((s: string) => s.trim()).filter(Boolean)
          for (const ans of answerParts) {
            pairs.push({ prompt: item.q.trim(), answer: ans, noteTitle: note.title })
          }
        }
      } catch {}
    }
    setWordPairs(pairs)
    doPick(pairs, [])
  }

  const confirmAnswer = () => {
    if (!currentPair || practiceResult !== 'idle') return
    const correct = isCorrectAnswer(practiceInput, currentPair.pair.answer)
    setPracticeResult(correct ? 'correct' : 'wrong')
  }

  const nextWord = () => doPick(wordPairs, recentIndices)

  const getCatById = (id: number) => categories.find(c => c.id === id)
  const activeCatObj = activeCat != null ? categories.find(c => c.id === activeCat) : null
  const practiceCatObj = practiceCatId != null ? categories.find(c => c.id === practiceCatId) : null

  return (
    <div>
      {/* ── Hero ── */}
      {categories.length > 0 && (
        <div className="rounded-2xl p-5 mb-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--t-hero-from), var(--t-hero-mid), var(--t-hero-to))' }}>
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#bfdbfe' }}>
            🇪🇸 Dernière catégorie
          </span>
          <p className="text-white font-bold text-lg leading-snug mb-1">
            {categories[0].emoji} {categories[0].name}
          </p>
          <p className="text-sm" style={{ color: '#bfdbfe' }}>
            {notes.filter(n => n.categoryId === categories[0].id).length} règle(s) enregistrée(s)
          </p>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--t-text-main)' }}>
            {activeTab === 'spanish' ? '🇪🇸 Spanish' : activeTab === 'personal' ? '📒 Notes' : activeTab === 'game' ? '🎮 Games' : '🎯 Pratique'}
          </h1>
          {activeTab === 'spanish' && (
            <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--t-text-muted)' }}>
              {t.notesCount(notes.length)}
              {activeCatObj && <span> · {activeCatObj.emoji} {activeCatObj.name}</span>}
            </p>
          )}
          {activeTab === 'practice' && practiceCatObj && (
            <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--t-text-muted)' }}>
              {practiceCatObj.emoji} {practiceCatObj.name} · {wordPairs.length} mots
            </p>
          )}
        </div>

        {activeTab === 'spanish' ? (
          <button
            onClick={openAddNote}
            className="btn-glass btn-glass-green px-4 py-2.5 rounded-xl text-sm font-medium shrink-0"
          >
            {t.addNote}
          </button>
        ) : activeTab === 'personal' ? (
          <button
            onClick={savePersonalNotes}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all"
            style={{
              backgroundColor: personalSaved ? '#d8f3dc' : '#2d6a4f',
              color: personalSaved ? '#2d6a4f' : '#fff',
            }}
          >
            {personalSaved ? '✓ Saved' : 'Save'}
          </button>
        ) : practiceCatId ? (
          <button
            onClick={() => { setPracticeCatId(null); setCurrentPair(null); setWordPairs([]) }}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-all"
            style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)', border: '1.5px solid var(--t-border-soft)' }}
          >
            ← Catégories
          </button>
        ) : null}
      </div>

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--t-border-soft)' }}>
          <button
            onClick={() => setActiveTab('spanish')}
            className="px-4 py-2 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: activeTab === 'spanish' ? 'var(--t-text-main)' : 'var(--t-item-bg)',
              color: activeTab === 'spanish' ? '#74c69d' : 'var(--t-text-muted)',
            }}
          >
            🇪🇸 Spanish
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className="px-4 py-2 text-sm font-semibold transition-colors border-l"
            style={{
              backgroundColor: activeTab === 'personal' ? 'var(--t-text-main)' : 'var(--t-item-bg)',
              color: activeTab === 'personal' ? '#74c69d' : 'var(--t-text-muted)',
              borderColor: 'var(--t-border-soft)',
            }}
          >
            📒 Notes
          </button>
          <button
            onClick={() => { setActiveTab('practice'); if (practiceCatId) setPracticeCatId(null) }}
            className="px-4 py-2 text-sm font-semibold transition-colors border-l"
            style={{
              backgroundColor: activeTab === 'practice' ? 'var(--t-text-main)' : 'var(--t-item-bg)',
              color: activeTab === 'practice' ? '#74c69d' : 'var(--t-text-muted)',
              borderColor: 'var(--t-border-soft)',
            }}
          >
            🎯 Pratique
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className="px-4 py-2 text-sm font-semibold transition-colors border-l"
            style={{
              backgroundColor: activeTab === 'game' ? 'var(--t-text-main)' : 'var(--t-item-bg)',
              color: activeTab === 'game' ? '#74c69d' : 'var(--t-text-muted)',
              borderColor: 'var(--t-border-soft)',
            }}
          >
            🎮 Games
          </button>
        </div>

        {/* Category dropdown — only for Spanish tab */}
        {activeTab === 'spanish' && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1 max-w-xs">
              <select
                value={activeCat ?? ''}
                onChange={e => handleSelectCat(e.target.value === '' ? null : Number(e.target.value))}
                className="w-full appearance-none pl-4 pr-8 py-2 rounded-xl border text-sm font-medium outline-none cursor-pointer"
                style={{
                  backgroundColor: activeCatObj ? activeCatObj.color + '18' : 'var(--t-item-bg)',
                  borderColor: activeCatObj ? activeCatObj.color : 'var(--t-border-soft)',
                  color: activeCatObj ? activeCatObj.color : 'var(--t-text-muted)',
                }}
              >
                <option value="">{t.allNotes}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: activeCatObj ? activeCatObj.color : 'var(--t-text-muted)' }}
              >
                ▾
              </span>
            </div>

            {activeCatObj && (
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => openEditCat(activeCatObj)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-xs"
                  style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}
                  title={t.editCategory}
                >✏️</button>
                <button
                  onClick={() => deleteCat(activeCatObj.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-xs"
                  style={{ backgroundColor: '#fde8ec', color: '#c0303e' }}
                  title={t.deleteCategory}
                >🗑</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Spanish tab: Notes grid ── */}
      {activeTab === 'spanish' && (
        notes.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
            <p className="text-5xl mb-3">📓</p>
            <p className="font-medium text-sm">{t.noNotesYet}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notes.map(note => {
              const cat = getCatById(note.categoryId)
              return (
                <NoteCard
                  key={note.id}
                  note={note}
                  cat={cat}
                  t={t}
                  editingTitle={editingTitle}
                  titleDraft={titleDraft}
                  titleInputRef={titleInputRef}
                  onStartEditTitle={startEditTitle}
                  onTitleDraftChange={setTitleDraft}
                  onSaveTitle={saveTitle}
                  onEdit={openEditNote}
                  onDelete={deleteNote}
                />
              )
            })}
          </div>
        )
      )}

      {/* ── Personal Notes tab ── */}
      {activeTab === 'personal' && (
        <div className="space-y-3">
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'var(--t-border-soft)', backgroundColor: 'var(--t-card-bg)' }}
          >
            <div
              className="px-4 py-2.5 flex items-center justify-between border-b"
              style={{ backgroundColor: 'var(--t-item-bg)', borderColor: 'var(--t-border-soft)' }}
            >
              <span className="text-xs font-semibold" style={{ color: 'var(--t-text-muted)' }}>📒 My Notes</span>
              <span className="text-xs" style={{ color: 'var(--t-text-soft)' }}>{personalText.length} chars</span>
            </div>
            <textarea
              value={personalText}
              onChange={e => { setPersonalText(e.target.value); setPersonalSaved(false) }}
              placeholder="Write your personal notes here… ideas, vocabulary you want to remember, observations, anything."
              className="w-full px-5 py-4 text-sm outline-none resize-none leading-relaxed"
              style={{ minHeight: '60vh', color: 'var(--t-text-main)', backgroundColor: 'var(--t-card-bg)' }}
              onKeyDown={e => {
                if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); savePersonalNotes() }
              }}
            />
          </div>
          <p className="text-xs text-center" style={{ color: 'var(--t-text-soft)' }}>
            Saved locally in your browser · Cmd/Ctrl+S to save
          </p>
        </div>
      )}

      {/* ── Practice tab ── */}
      {activeTab === 'practice' && (
        <div>
          {!practiceCatId ? (
            /* Category picker */
            <div>
              <p className="text-sm mb-4" style={{ color: 'var(--t-text-muted)' }}>
                Choisis une catégorie pour commencer l'entraînement illimité.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => startPractice(cat.id)}
                    className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all active:scale-95 hover:scale-[1.02]"
                    style={{
                      backgroundColor: cat.color + '15',
                      border: `2px solid ${cat.color}40`,
                    }}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: cat.color }}>{cat.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-soft)' }}>Pratiquer →</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : wordPairs.length === 0 ? (
            /* No vocab */
            <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
              <p className="text-5xl mb-3">📭</p>
              <p className="font-medium text-sm">Aucun vocabulaire trouvé dans cette catégorie.</p>
              <button
                onClick={() => { setPracticeCatId(null); setCurrentPair(null); setWordPairs([]) }}
                className="mt-4 text-sm underline"
                style={{ color: 'var(--t-primary)' }}
              >← Retour</button>
            </div>
          ) : currentPair ? (
            /* Exercise card */
            <PracticeCard
              pair={currentPair.pair}
              input={practiceInput}
              result={practiceResult}
              inputRef={practiceInputRef}
              onInput={setPracticeInput}
              onConfirm={confirmAnswer}
              onNext={nextWord}
            />
          ) : null}
        </div>
      )}

      {/* ── Game tab ── */}
      {activeTab === 'game' && <GamesTab />}

      {/* ── Category Modal ── */}
      {catModal && (
        <Modal
          title={editingCatId ? t.editCategory : t.addCategory}
          onClose={() => setCatModal(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--t-text-muted)' }}>{t.catName}</label>
              <input
                value={catForm.name}
                onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Spanish, Math…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-300"
                style={{ borderColor: 'var(--t-border-soft)' }}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--t-text-muted)' }}>{t.catEmoji}</label>
              <input
                value={catForm.emoji}
                onChange={e => setCatForm(f => ({ ...f, emoji: e.target.value }))}
                placeholder="📝"
                className="w-24 px-3 py-2.5 rounded-xl border text-sm outline-none text-center text-xl"
                style={{ borderColor: 'var(--t-border-soft)' }}
                maxLength={4}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--t-text-muted)' }}>{t.catColor}</label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setCatForm(f => ({ ...f, color }))}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{
                      backgroundColor: color,
                      border: catForm.color === color ? '3px solid var(--t-text-main)' : '3px solid transparent',
                      boxShadow: catForm.color === color ? '0 0 0 2px var(--t-card-bg), 0 0 0 4px ' + color : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-medium" style={{ color: 'var(--t-text-soft)' }}>Preview:</span>
              <span
                className="px-3 py-1.5 rounded-full text-sm font-semibold text-white flex items-center gap-1.5"
                style={{ backgroundColor: catForm.color }}
              >
                {catForm.emoji || '📝'} {catForm.name || 'Category'}
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setCatModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">{t.cancel}</button>
            {editingCatId && (
              <button onClick={() => deleteCat(editingCatId)} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: '#fde8ec', color: '#c0303e' }}>{t.deleteCategory}</button>
            )}
            <button onClick={saveCat} disabled={catSaving || !catForm.name.trim()} className="btn-glass btn-glass-green flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {catSaving ? t.saving : t.saveCategory}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Note Modal ── */}
      {noteModal && (
        <Modal title={editingNoteId ? t.editNote : t.addNote} onClose={() => setNoteModal(false)} wide>
          <div className="space-y-4">
            {!editingNoteId && (
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--t-text-muted)' }}>{t.category}</label>
                <select
                  value={noteForm.categoryId}
                  onChange={e => setNoteForm(f => ({ ...f, categoryId: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--t-border-soft)' }}
                >
                  <option value="">— Select category —</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--t-text-muted)' }}>{t.title}</label>
              <input
                value={noteForm.title}
                onChange={e => setNoteForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Note title…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-300"
                style={{ borderColor: 'var(--t-border-soft)' }}
                autoFocus={!!editingNoteId}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#2d6a4f' }}>{t.noteRules}</label>
              <textarea
                value={noteForm.rules}
                onChange={e => setNoteForm(f => ({ ...f, rules: e.target.value }))}
                rows={5}
                placeholder="Write your rules, principles, or notes here…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none focus:ring-2 focus:ring-green-300"
                style={{ borderColor: 'var(--t-border-soft)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#b8860b' }}>{t.noteExamples}</label>
              <textarea
                value={noteForm.examples}
                onChange={e => setNoteForm(f => ({ ...f, examples: e.target.value }))}
                rows={5}
                placeholder="Write examples, use cases, or practice sentences…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none focus:ring-2 focus:ring-green-300"
                style={{ borderColor: 'var(--t-border-soft)' }}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setNoteModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">{t.cancel}</button>
            <button
              onClick={saveNote}
              disabled={noteSaving || !noteForm.title.trim() || !noteForm.categoryId}
              className="btn-glass btn-glass-green flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
            >
              {noteSaving ? t.saving : t.saveNote}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── PracticeCard component ──
function PracticeCard({
  pair, input, result, inputRef, onInput, onConfirm, onNext,
}: {
  pair: WordPair
  input: string
  result: 'idle' | 'correct' | 'wrong'
  inputRef: React.RefObject<HTMLInputElement | null>
  onInput: (v: string) => void
  onConfirm: () => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Prompt card */}
      <div
        className="rounded-2xl p-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--t-hero-from), var(--t-hero-mid), var(--t-hero-to))' }}
      >
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'var(--t-hero-text)' }}
        >
          🇪🇸 Traduis
        </span>
        <p className="text-white font-black text-3xl leading-tight mb-2">{pair.prompt}</p>
        <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.55)' }}>{pair.noteTitle}</p>
      </div>

      {/* Answer area */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: 'var(--t-card-bg)', border: '1.5px solid var(--t-border-soft)' }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--t-text-muted)' }}>
          Ta réponse
        </p>

        <input
          ref={inputRef}
          value={input}
          onChange={e => onInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (result === 'idle') onConfirm()
              else onNext()
            }
          }}
          disabled={result !== 'idle'}
          placeholder="Ta réponse…"
          className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none mb-4"
          style={{
            backgroundColor: result === 'correct' ? '#d8f3dc' : result === 'wrong' ? '#fde8ec' : 'var(--t-item-bg)',
            color: result === 'correct' ? '#2d6a4f' : result === 'wrong' ? '#c0303e' : 'var(--t-text-main)',
            border: result === 'correct' ? '2px solid #52b788' : result === 'wrong' ? '2px solid #e57373' : '2px solid var(--t-border-soft)',
          }}
        />

        {/* Result feedback */}
        {result !== 'idle' && (
          <div
            className="rounded-xl px-4 py-3 mb-4 flex items-start gap-3"
            style={{
              backgroundColor: result === 'correct' ? '#d8f3dc' : '#fde8ec',
              border: `1.5px solid ${result === 'correct' ? '#52b788' : '#e57373'}`,
            }}
          >
            <span className="text-xl shrink-0">{result === 'correct' ? '✅' : '❌'}</span>
            <div>
              {result === 'correct' ? (
                <p className="font-bold text-sm" style={{ color: '#2d6a4f' }}>Correct ! Bien joué 🎉</p>
              ) : (
                <>
                  <p className="font-bold text-sm" style={{ color: '#c0303e' }}>Pas tout à fait…</p>
                  <p className="text-sm mt-0.5" style={{ color: '#c0303e' }}>
                    La bonne réponse : <span className="font-black">{pair.answer}</span>
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {result === 'idle' ? (
          <button
            onClick={onConfirm}
            disabled={!input.trim()}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-40"
            style={{ backgroundColor: '#2d6a4f', color: '#fff' }}
          >
            Vérifier ✓
          </button>
        ) : (
          <button
            onClick={onNext}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, var(--t-hero-from), var(--t-hero-mid))', color: '#fff' }}
          >
            Mot suivant →
          </button>
        )}

        <p className="text-xs text-center mt-3" style={{ color: 'var(--t-text-soft)' }}>
          Appuie sur Entrée pour confirmer / suivant
        </p>
      </div>
    </div>
  )
}

// ── NoteCard component ──
function NoteCard({
  note, cat, t, editingTitle, titleDraft, titleInputRef,
  onStartEditTitle, onTitleDraftChange, onSaveTitle, onEdit, onDelete,
}: {
  note: Note
  cat: Category | undefined
  t: ReturnType<typeof useLang>['t']
  editingTitle: number | null
  titleDraft: string
  titleInputRef: React.RefObject<HTMLInputElement | null>
  onStartEditTitle: (note: Note) => void
  onTitleDraftChange: (v: string) => void
  onSaveTitle: (id: number) => void
  onEdit: (note: Note) => void
  onDelete: (id: number) => void
}) {
  const isEditingTitle = editingTitle === note.id

  return (
    <div
      className="rounded-2xl border shadow-sm overflow-hidden"
      style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}
    >
      {cat && <div className="h-1 w-full" style={{ backgroundColor: cat.color }} />}

      <div className="p-4">
        <div className="flex items-start gap-2 mb-3">
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-1.5">
                <input
                  ref={titleInputRef}
                  value={titleDraft}
                  onChange={e => onTitleDraftChange(e.target.value)}
                  onBlur={() => onSaveTitle(note.id)}
                  onKeyDown={e => { if (e.key === 'Enter') onSaveTitle(note.id); if (e.key === 'Escape') onSaveTitle(note.id) }}
                  className="flex-1 min-w-0 px-2 py-1 rounded-lg border text-sm font-semibold outline-none focus:ring-2 focus:ring-green-300"
                  style={{ borderColor: 'var(--t-border-soft)', color: 'var(--t-text-main)' }}
                />
                <button
                  onMouseDown={e => { e.preventDefault(); onSaveTitle(note.id) }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold shrink-0"
                  style={{ backgroundColor: '#2d6a4f', color: '#fff' }}
                >✓</button>
              </div>
            ) : (
              <button
                onClick={() => onStartEditTitle(note)}
                className="text-left w-full font-semibold text-sm leading-snug hover:underline decoration-dotted"
                style={{ color: 'var(--t-text-main)' }}
                title="Click to edit title"
              >
                {note.title}
              </button>
            )}
          </div>

          {!isEditingTitle && (
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onEdit(note)}
                className="text-xs px-2 py-1 rounded-lg"
                style={{ color: 'var(--t-text-muted)', backgroundColor: 'var(--t-item-bg)' }}
                title={t.editNote}
              >✏️</button>
              <button
                onClick={() => onDelete(note.id)}
                className="text-xs px-2 py-1 rounded-lg"
                style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}
                title={t.del}
              >🗑</button>
            </div>
          )}
        </div>

        {cat && (
          <div className="mb-3">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: cat.color + '22', color: cat.color }}
            >
              {cat.emoji} {cat.name}
            </span>
          </div>
        )}

        <div className="mb-3">
          <p className="text-xs font-bold mb-1" style={{ color: '#2d6a4f' }}>{t.noteRules}</p>
          {note.rules
            ? <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--t-text-main)' }}>{note.rules}</p>
            : <p className="text-xs italic" style={{ color: 'var(--t-text-soft)' }}>No rules yet.</p>}
        </div>

        <div className="mb-3">
          <p className="text-xs font-bold mb-1" style={{ color: '#b8860b' }}>{t.noteExamples}</p>
          {note.examples
            ? <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--t-text-main)' }}>{note.examples}</p>
            : <p className="text-xs italic" style={{ color: 'var(--t-text-soft)' }}>No examples yet.</p>}
        </div>

        {note.quiz && <QuizSection noteId={note.id} quizJson={note.quiz} />}
      </div>
    </div>
  )
}

// ── QuizSection component ──
function QuizSection({ noteId, quizJson }: { noteId: number; quizJson: string }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [open, setOpen] = useState(false)

  let questions: QuizQ[] = []
  try { questions = JSON.parse(quizJson) } catch { return null }
  if (!questions.length) return null

  const answered = Object.keys(answers).length
  const correct = Object.entries(answers).filter(([i, a]) => questions[Number(i)].ans === a).length
  const reset = () => setAnswers({})

  return (
    <div className="border-t pt-3 mt-1" style={{ borderColor: 'var(--t-border-soft)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-xs font-bold py-1 rounded-lg px-2 transition-colors"
        style={{ color: 'var(--t-text-muted)', backgroundColor: open ? 'var(--t-item-bg)' : 'transparent' }}
      >
        <span>🎯 Quiz · {questions.length} questions</span>
        <span className="flex items-center gap-2">
          {answered > 0 && (
            <span
              className="font-semibold px-2 py-0.5 rounded-full text-xs"
              style={{ backgroundColor: correct === answered ? '#d8f3dc' : '#fde8ec', color: correct === answered ? '#2d6a4f' : '#c0303e' }}
            >
              {correct}/{answered}
            </span>
          )}
          <span>{open ? '▲' : '▼'}</span>
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-5">
          {questions.map((q, qi) => {
            const picked = answers[qi]
            const isDone = picked !== undefined
            return (
              <div key={qi}>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--t-text-main)' }}>
                  <span
                    className="text-xs font-bold mr-1.5 px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}
                  >{qi + 1}</span>
                  {q.q}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {q.opts.map((opt, oi) => {
                    let bg = 'var(--t-item-bg)', color = 'var(--t-text-muted)', border = 'var(--t-border-soft)'
                    if (isDone) {
                      if (oi === q.ans) { bg = '#d8f3dc'; color = '#2d6a4f'; border = '#52b788' }
                      else if (oi === picked) { bg = '#fde8ec'; color = '#c0303e'; border = '#e57373' }
                    }
                    return (
                      <button
                        key={oi}
                        onClick={() => !isDone && setAnswers(a => ({ ...a, [qi]: oi }))}
                        disabled={isDone}
                        className="text-left px-3 py-2 rounded-xl text-sm font-medium border transition-all"
                        style={{ backgroundColor: bg, color, borderColor: border, cursor: isDone ? 'default' : 'pointer' }}
                      >
                        {isDone && oi === q.ans ? '✓ ' : isDone && oi === picked ? '✗ ' : ''}
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {answered === questions.length && (
            <div
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: correct === questions.length ? '#d8f3dc' : 'var(--t-item-bg)' }}
            >
              <p className="font-bold text-sm" style={{ color: correct === questions.length ? '#2d6a4f' : 'var(--t-text-muted)' }}>
                {correct === questions.length ? '🎉 Perfect score!' : `${correct} / ${questions.length} correct`}
              </p>
              {correct < questions.length && (
                <button onClick={reset} className="text-xs mt-1 underline" style={{ color: 'var(--t-text-soft)' }}>
                  Try again
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
