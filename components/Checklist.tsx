'use client'

import { useEffect, useRef, useState } from 'react'

type Task = { id: string; label: string; time: string; done: boolean }

const DEFAULT_TASKS: Task[] = [
  { id: '1',  label: 'Waking up early',           time: '7h',            done: false },
  { id: '2',  label: 'Breakfast Made Home',        time: '7h20',          done: false },
  { id: '3',  label: 'Shower Morning',             time: '7h40',          done: false },
  { id: '4',  label: 'Walking to work',            time: '8h',            done: false },
  { id: '5',  label: 'Work',                       time: '8h30 → 16h',    done: false },
  { id: '6',  label: 'Cooking lunch',              time: '16h40',         done: false },
  { id: '7',  label: 'Workout',                    time: '17h → 18h30',   done: false },
  { id: '8',  label: 'Shower + Eat lunch',         time: '18h45 → 19h30', done: false },
  { id: '9',  label: 'Time ON PC',                 time: '20h → 23h',     done: false },
  { id: '10', label: 'Cooking snacks for work',    time: '23h30',         done: false },
  { id: '11', label: 'Cleaning dishes',            time: '23h45',         done: false },
  { id: '12', label: 'N3AAAAAAAAASS ZERWAAAAAT',   time: '',              done: false },
]

const STORAGE_KEY = 'daily-checklist-v1'

function today() { return new Date().toISOString().split('T')[0] }

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_TASKS
    const data = JSON.parse(raw)
    if (data.date !== today()) {
      const reset = data.tasks.map((t: Task) => ({ ...t, done: false }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today(), tasks: reset }))
      return reset
    }
    return data.tasks
  } catch { return DEFAULT_TASKS }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today(), tasks }))
}

export default function Checklist() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editTime, setEditTime] = useState('')
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newTime, setNewTime] = useState('')
  const addRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setTasks(loadTasks()) }, [])

  const toggle = (id: string) => {
    const next = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    setTasks(next); saveTasks(next)
  }

  const startEdit = (t: Task) => { setEditingId(t.id); setEditLabel(t.label); setEditTime(t.time) }

  const saveEdit = () => {
    if (!editLabel.trim()) return
    const next = tasks.map(t => t.id === editingId ? { ...t, label: editLabel.trim(), time: editTime.trim() } : t)
    setTasks(next); saveTasks(next); setEditingId(null)
  }

  const deleteTask = (id: string) => {
    const next = tasks.filter(t => t.id !== id)
    setTasks(next); saveTasks(next)
  }

  const addTask = () => {
    if (!newLabel.trim()) return
    const next = [...tasks, { id: Date.now().toString(), label: newLabel.trim(), time: newTime.trim(), done: false }]
    setTasks(next); saveTasks(next)
    setNewLabel(''); setNewTime(''); setAdding(false)
  }

  const done = tasks.filter(t => t.done).length
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold mb-1.5" style={{ color: 'var(--t-text-muted)' }}>
          <span>Routine du jour</span>
          <span style={{ color: 'var(--t-primary)' }}>{done}/{tasks.length} · {pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--t-item-bg)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--t-fab-from), var(--t-fab-to))' }} />
        </div>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2">
        {tasks.map(t => (
          <div key={t.id}>
            {editingId === t.id ? (
              <div className="rounded-2xl p-3 flex flex-col gap-2" style={{ backgroundColor: 'var(--t-bg-soft)' }}>
                <input value={editLabel} onChange={e => setEditLabel(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl text-sm outline-none border"
                  style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-card-bg)' }}
                  placeholder="Tâche..." autoFocus />
                <input value={editTime} onChange={e => setEditTime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl text-xs outline-none border"
                  style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-muted)', backgroundColor: 'var(--t-card-bg)' }}
                  placeholder="Horaire (ex: 7h → 8h)" />
                <div className="flex gap-2">
                  <button onClick={saveEdit}
                    className="flex-1 py-1.5 rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: 'var(--t-primary)' }}>✓ OK</button>
                  <button onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold"
                    style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>✕</button>
                  <button onClick={() => deleteTask(t.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold"
                    style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>🗑</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all"
                style={{ backgroundColor: t.done ? 'var(--t-bg-soft)' : 'var(--t-card-bg)', border: '1px solid', borderColor: t.done ? 'var(--t-border)' : 'var(--t-border-soft)' }}>
                <button onClick={() => toggle(t.id)}
                  className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                  style={{ borderColor: t.done ? 'var(--t-primary)' : '#d1d5db', backgroundColor: t.done ? 'var(--t-primary)' : 'transparent' }}>
                  {t.done && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight"
                    style={{ color: t.done ? 'var(--t-text-soft)' : 'var(--t-text-main)', textDecoration: t.done ? 'line-through' : 'none' }}>
                    {t.label}
                  </p>
                  {t.time && <p className="text-xs mt-0.5" style={{ color: 'var(--t-primary)' }}>{t.time}</p>}
                </div>
                <button onClick={() => startEdit(t)} className="text-sm opacity-40 hover:opacity-80 shrink-0">✏️</button>
              </div>
            )}
          </div>
        ))}

        {adding ? (
          <div className="rounded-2xl p-3 flex flex-col gap-2" style={{ backgroundColor: 'var(--t-bg-soft)' }}>
            <input ref={addRef} value={newLabel} onChange={e => setNewLabel(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl text-sm outline-none border"
              style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-main)', backgroundColor: 'var(--t-card-bg)' }}
              placeholder="Nouvelle tâche..." autoFocus
              onKeyDown={e => { if (e.key === 'Enter') addTask() }} />
            <input value={newTime} onChange={e => setNewTime(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl text-xs outline-none border"
              style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-muted)', backgroundColor: 'var(--t-card-bg)' }}
              placeholder="Horaire (optionnel)"
              onKeyDown={e => { if (e.key === 'Enter') addTask() }} />
            <div className="flex gap-2">
              <button onClick={addTask}
                className="flex-1 py-1.5 rounded-xl text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--t-primary)' }}>+ Ajouter</button>
              <button onClick={() => setAdding(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-muted)' }}>✕</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)}
            className="w-full py-2.5 rounded-2xl text-xs font-bold border-2 border-dashed transition-all"
            style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-accent)' }}>
            + Ajouter une tâche
          </button>
        )}
      </div>
    </div>
  )
}
