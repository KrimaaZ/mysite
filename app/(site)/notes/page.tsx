'use client'

import { useEffect, useRef, useState } from 'react'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'

type Category = { id: number; name: string; color: string; emoji: string; createdAt: string }
type Note = { id: number; categoryId: number; title: string; rules: string; examples: string; createdAt: string }

const PRESET_COLORS = [
  '#2d6a4f', '#40916c', '#1e6091', '#6a2d6a', '#6a2d2d',
  '#b8860b', '#6b4226', '#1a3a1a', '#3a1a3a', '#1a1a3a',
]

const emptyNote = { categoryId: '', title: '', rules: '', examples: '' }
const emptyCat = { name: '', emoji: '📝', color: '#2d6a4f' }

export default function NotesPage() {
  const { t } = useLang()
  const [categories, setCategories] = useState<Category[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [activeCat, setActiveCat] = useState<number | null>(null)

  // Category modal
  const [catModal, setCatModal] = useState(false)
  const [catForm, setCatForm] = useState(emptyCat)
  const [editingCatId, setEditingCatId] = useState<number | null>(null)
  const [catSaving, setCatSaving] = useState(false)

  // Note modal
  const [noteModal, setNoteModal] = useState(false)
  const [noteForm, setNoteForm] = useState(emptyNote)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [noteSaving, setNoteSaving] = useState(false)

  // Inline title editing
  const [editingTitle, setEditingTitle] = useState<number | null>(null)
  const [titleDraft, setTitleDraft] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Hover state for cat pills
  const [hoveredCat, setHoveredCat] = useState<number | null>(null)

  const loadCategories = () =>
    fetch('/api/notes/categories').then(r => r.json()).then(setCategories)

  const loadNotes = (catId?: number | null) => {
    const url = catId != null ? `/api/notes?categoryId=${catId}` : '/api/notes'
    fetch(url).then(r => r.json()).then(setNotes)
  }

  useEffect(() => { loadCategories(); loadNotes(null) }, [])

  const handleSelectCat = (id: number | null) => {
    setActiveCat(id)
    loadNotes(id)
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
    setNoteForm({ categoryId: String(note.categoryId), title: note.title, rules: note.rules, examples: note.examples })
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

  const getCatById = (id: number) => categories.find(c => c.id === id)

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1a3a1a' }}>
            {t.notesPage}
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#8b5e3c' }}>
            {t.notesCount(notes.length)}
            {activeCat != null && categories.find(c => c.id === activeCat) && (
              <span>
                {' '}· {categories.find(c => c.id === activeCat)!.emoji}{' '}
                {categories.find(c => c.id === activeCat)!.name}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={openAddNote}
          className="btn-glass btn-glass-green px-4 py-2.5 rounded-xl text-sm font-medium shrink-0"
        >
          {t.addNote}
        </button>
      </div>

      {/* ── Category pills ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {/* ALL pill */}
        <button
          onClick={() => handleSelectCat(null)}
          className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
          style={{
            backgroundColor: activeCat === null ? '#1a3a1a' : '#f0e8d8',
            color: activeCat === null ? '#74c69d' : '#6b4226',
            border: '2px solid',
            borderColor: activeCat === null ? '#1a3a1a' : '#e8dcc8',
          }}
        >
          {t.allNotes}
        </button>

        {/* Category pills */}
        {categories.map(cat => (
          <div
            key={cat.id}
            className="shrink-0 relative flex items-center gap-1.5"
            onMouseEnter={() => setHoveredCat(cat.id)}
            onMouseLeave={() => setHoveredCat(null)}
          >
            <button
              onClick={() => handleSelectCat(cat.id)}
              className="pl-3 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5"
              style={{
                backgroundColor: activeCat === cat.id ? cat.color : '#f0e8d8',
                color: activeCat === cat.id ? '#fff' : '#6b4226',
                border: '2px solid',
                borderColor: activeCat === cat.id ? cat.color : '#e8dcc8',
                paddingRight: hoveredCat === cat.id ? '4px' : '12px',
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
              {hoveredCat === cat.id && (
                <span className="flex gap-0.5 ml-1">
                  <button
                    onClick={e => { e.stopPropagation(); openEditCat(cat) }}
                    className="w-6 h-6 flex items-center justify-center rounded-full text-xs transition-all"
                    style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: activeCat === cat.id ? '#fff' : '#6b4226' }}
                    title={t.editCategory}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); deleteCat(cat.id) }}
                    className="w-6 h-6 flex items-center justify-center rounded-full text-xs transition-all"
                    style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: activeCat === cat.id ? '#fff' : '#c0303e' }}
                    title={t.deleteCategory}
                  >
                    🗑
                  </button>
                </span>
              )}
            </button>
          </div>
        ))}

        {/* + Category button */}
        <button
          onClick={openAddCat}
          className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
          style={{ backgroundColor: '#f9f5ef', color: '#2d6a4f', border: '2px dashed #a0c4a9' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#e8f5ec' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f9f5ef' }}
        >
          {t.addCategory}
        </button>
      </div>

      {/* ── Notes grid ── */}
      {notes.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: '#f9f5ef', color: '#a07850' }}>
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
      )}

      {/* ── Category Modal ── */}
      {catModal && (
        <Modal
          title={editingCatId ? t.editCategory : t.addCategory}
          onClose={() => setCatModal(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b4226' }}>
                {t.catName}
              </label>
              <input
                value={catForm.name}
                onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Spanish, Math…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-300"
                style={{ borderColor: '#d4c5a9' }}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b4226' }}>
                {t.catEmoji}
              </label>
              <input
                value={catForm.emoji}
                onChange={e => setCatForm(f => ({ ...f, emoji: e.target.value }))}
                placeholder="📝"
                className="w-24 px-3 py-2.5 rounded-xl border text-sm outline-none text-center text-xl"
                style={{ borderColor: '#d4c5a9' }}
                maxLength={4}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: '#6b4226' }}>
                {t.catColor}
              </label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setCatForm(f => ({ ...f, color }))}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{
                      backgroundColor: color,
                      border: catForm.color === color ? '3px solid #1a3a1a' : '3px solid transparent',
                      boxShadow: catForm.color === color ? '0 0 0 2px #fff, 0 0 0 4px ' + color : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-medium" style={{ color: '#a07850' }}>Preview:</span>
              <span
                className="px-3 py-1.5 rounded-full text-sm font-semibold text-white flex items-center gap-1.5"
                style={{ backgroundColor: catForm.color }}
              >
                {catForm.emoji || '📝'} {catForm.name || 'Category'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setCatModal(false)}
              className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium"
            >
              {t.cancel}
            </button>
            {editingCatId && (
              <button
                onClick={() => deleteCat(editingCatId)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ backgroundColor: '#fde8ec', color: '#c0303e' }}
              >
                {t.deleteCategory}
              </button>
            )}
            <button
              onClick={saveCat}
              disabled={catSaving || !catForm.name.trim()}
              className="btn-glass btn-glass-green flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
            >
              {catSaving ? t.saving : t.saveCategory}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Note Modal ── */}
      {noteModal && (
        <Modal
          title={editingNoteId ? t.editNote : t.addNote}
          onClose={() => setNoteModal(false)}
          wide
        >
          <div className="space-y-4">
            {/* Category selector (only when adding) */}
            {!editingNoteId && (
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b4226' }}>
                  {t.category}
                </label>
                <select
                  value={noteForm.categoryId}
                  onChange={e => setNoteForm(f => ({ ...f, categoryId: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#d4c5a9' }}
                >
                  <option value="">— Select category —</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b4226' }}>
                {t.title}
              </label>
              <input
                value={noteForm.title}
                onChange={e => setNoteForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Note title…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-300"
                style={{ borderColor: '#d4c5a9' }}
                autoFocus={!!editingNoteId}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#2d6a4f' }}>
                {t.noteRules}
              </label>
              <textarea
                value={noteForm.rules}
                onChange={e => setNoteForm(f => ({ ...f, rules: e.target.value }))}
                rows={5}
                placeholder="Write your rules, principles, or notes here…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none focus:ring-2 focus:ring-green-300"
                style={{ borderColor: '#d4c5a9' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#b8860b' }}>
                {t.noteExamples}
              </label>
              <textarea
                value={noteForm.examples}
                onChange={e => setNoteForm(f => ({ ...f, examples: e.target.value }))}
                rows={5}
                placeholder="Write examples, use cases, or practice sentences…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none focus:ring-2 focus:ring-green-300"
                style={{ borderColor: '#d4c5a9' }}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setNoteModal(false)}
              className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium"
            >
              {t.cancel}
            </button>
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

// ── NoteCard component ──
function NoteCard({
  note,
  cat,
  t,
  editingTitle,
  titleDraft,
  titleInputRef,
  onStartEditTitle,
  onTitleDraftChange,
  onSaveTitle,
  onEdit,
  onDelete,
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
      style={{ backgroundColor: '#fff', borderColor: '#e8dcc8' }}
    >
      {/* Category badge stripe */}
      {cat && (
        <div
          className="h-1 w-full"
          style={{ backgroundColor: cat.color }}
        />
      )}

      <div className="p-4">
        {/* Header row */}
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
                  style={{ borderColor: '#d4c5a9', color: '#1a3a1a' }}
                />
                <button
                  onMouseDown={e => { e.preventDefault(); onSaveTitle(note.id) }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold shrink-0"
                  style={{ backgroundColor: '#2d6a4f', color: '#fff' }}
                >
                  ✓
                </button>
              </div>
            ) : (
              <button
                onClick={() => onStartEditTitle(note)}
                className="text-left w-full font-semibold text-sm leading-snug hover:underline decoration-dotted"
                style={{ color: '#1a3a1a' }}
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
                style={{ color: '#8b5e3c', backgroundColor: '#f0e8d8' }}
                title={t.editNote}
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="text-xs px-2 py-1 rounded-lg"
                style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}
                title={t.del}
              >
                🗑
              </button>
            </div>
          )}
        </div>

        {/* Category tag */}
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

        {/* Rules section */}
        <div className="mb-3">
          <p className="text-xs font-bold mb-1" style={{ color: '#2d6a4f' }}>{t.noteRules}</p>
          {note.rules ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: '#3a3a2a' }}>
              {note.rules}
            </p>
          ) : (
            <p className="text-xs italic" style={{ color: '#c4b89a' }}>No rules yet.</p>
          )}
        </div>

        {/* Examples section */}
        <div>
          <p className="text-xs font-bold mb-1" style={{ color: '#b8860b' }}>{t.noteExamples}</p>
          {note.examples ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: '#3a3a2a' }}>
              {note.examples}
            </p>
          ) : (
            <p className="text-xs italic" style={{ color: '#c4b89a' }}>No examples yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
