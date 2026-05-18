'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/Modal'
import { useLang } from '@/lib/lang'

type Tip = { id: number; title: string; content: string; category: string; agent: string | null; drill: string | null }

// ── Agent roster ─────────────────────────────────────────────────────────
type Role = 'duelist' | 'controller' | 'initiator' | 'sentinel'

type Agent = {
  name: string
  role: Role
  emoji: string
  country: string
  ability: string
}

const ROLES: { key: Role; label: string; emoji: string; color: string; bg: string; border: string; desc: string }[] = [
  { key: 'duelist',    label: 'Duelist',    emoji: '⚔️',  color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', desc: 'Self-sufficient fraggers' },
  { key: 'controller', label: 'Controller', emoji: '🌀',  color: '#7c3aed', bg: '#ede9fe', border: '#c4b5fd', desc: 'Vision & area denial' },
  { key: 'initiator',  label: 'Initiator',  emoji: '🔍',  color: '#d97706', bg: '#fef3c7', border: '#fcd34d', desc: 'Breach & intel' },
  { key: 'sentinel',   label: 'Sentinel',   emoji: '🛡️', color: '#2563eb', bg: '#dbeafe', border: '#93c5fd', desc: 'Defensive anchors' },
]

const AGENTS: Agent[] = [
  // ── Duelists ──
  { name: 'Jett',    role: 'duelist', emoji: '💨', country: '🇰🇷', ability: 'Tailwind' },
  { name: 'Reyna',   role: 'duelist', emoji: '👁️', country: '🇲🇽', ability: 'Leer' },
  { name: 'Phoenix', role: 'duelist', emoji: '🔥', country: '🇬🇧', ability: 'Blaze' },
  { name: 'Yoru',    role: 'duelist', emoji: '🌀', country: '🇯🇵', ability: 'Blindside' },
  { name: 'Neon',    role: 'duelist', emoji: '⚡', country: '🇵🇭', ability: 'Fast Lane' },
  { name: 'Iso',     role: 'duelist', emoji: '🎯', country: '🇨🇳', ability: 'Contingency' },
  { name: 'Waylay',  role: 'duelist', emoji: '🌊', country: '🇧🇷', ability: 'Riptide' },
  // ── Controllers ──
  { name: 'Brimstone', role: 'controller', emoji: '💣', country: '🇺🇸', ability: 'Incendiary' },
  { name: 'Omen',      role: 'controller', emoji: '👻', country: '❓',  ability: 'Paranoia' },
  { name: 'Viper',     role: 'controller', emoji: '🐍', country: '🇺🇸', ability: 'Poison Cloud' },
  { name: 'Astra',     role: 'controller', emoji: '⭐', country: '🇬🇭', ability: 'Gravity Well' },
  { name: 'Harbor',    role: 'controller', emoji: '🏄', country: '🇮🇳', ability: 'Cove' },
  { name: 'Clove',     role: 'controller', emoji: '☘️', country: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', ability: 'Meddle' },
  // ── Initiators ──
  { name: 'Sova',   role: 'initiator', emoji: '🏹', country: '🇷🇺', ability: 'Recon Bolt' },
  { name: 'Breach', role: 'initiator', emoji: '✊', country: '🇸🇪', ability: 'Aftershock' },
  { name: 'Skye',   role: 'initiator', emoji: '🌿', country: '🇦🇺', ability: 'Guiding Light' },
  { name: 'KAY/O',  role: 'initiator', emoji: '🤖', country: '❓',  ability: 'FLASH/drive' },
  { name: 'Fade',   role: 'initiator', emoji: '🌑', country: '🇹🇷', ability: 'Seize' },
  { name: 'Gekko',  role: 'initiator', emoji: '🦎', country: '🇺🇸', ability: 'Wingman' },
  { name: 'Tejo',   role: 'initiator', emoji: '🎯', country: '🇨🇴', ability: 'Special Delivery' },
  // ── Sentinels ──
  { name: 'Sage',     role: 'sentinel', emoji: '🌸', country: '🇨🇳', ability: 'Slow Orb' },
  { name: 'Cypher',   role: 'sentinel', emoji: '🕵️', country: '🇲🇦', ability: 'Trapwire' },
  { name: 'Killjoy',  role: 'sentinel', emoji: '🔧', country: '🇩🇪', ability: 'Alarm Bot' },
  { name: 'Chamber',  role: 'sentinel', emoji: '🔫', country: '🇫🇷', ability: 'Rendezvous' },
  { name: 'Deadlock', role: 'sentinel', emoji: '❄️', country: '🇳🇴', ability: 'GravNet' },
  { name: 'Vyse',     role: 'sentinel', emoji: '🕸️', country: '❓',  ability: 'Arc Rose' },
]

const CATS = ['ALL', 'MECHANICS', 'STRATEGY', 'MINDSET', 'AGENT']
const CAT_COLOR: Record<string, string> = { MECHANICS: '#c0303e', STRATEGY: '#2d6a4f', MINDSET: '#8b5e3c', AGENT: '#b8860b' }
const empty = { title: '', content: '', category: 'MECHANICS', agent: '', drill: '' }

export default function ValorantPage() {
  const [tips, setTips] = useState<Tip[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const { t } = useLang()

  const load = () =>
    fetch('/api/valorant').then(r => r.json()).then(setTips)

  useEffect(() => { load() }, [])

  const openAdd = (agentName?: string) => {
    setForm({ ...empty, agent: agentName || '' })
    setEditing(null)
    setModal(true)
  }
  const openEdit = (tip: Tip) => {
    setForm({ title: tip.title, content: tip.content, category: tip.category, agent: tip.agent || '', drill: tip.drill || '' })
    setEditing(tip.id)
    setModal(true)
  }
  const save = async () => {
    setSaving(true)
    await fetch(editing ? `/api/valorant/${editing}` : '/api/valorant', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    await load()
    setModal(false)
    setSaving(false)
  }
  const del = async (id: number) => {
    if (!confirm(t.deleteConfirm)) return
    await fetch(`/api/valorant/${id}`, { method: 'DELETE' })
    load()
  }
  const generateAI = async () => {
    setAiLoading(true)
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'valorant_tip', data: { category: form.category, agent: form.agent } }),
      })
      const data = await r.json()
      setForm(f => ({ ...f, title: data.title || f.title, content: data.content || f.content, drill: data.drill || f.drill }))
    } catch { alert(t.aiFailed) }
    setAiLoading(false)
  }

  const agentTips = selectedAgent
    ? tips.filter(tip => tip.agent?.toLowerCase() === selectedAgent.toLowerCase())
    : []

  const TipCard = ({ tip }: { tip: Tip }) => (
    <div className="rounded-2xl border-2 overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--t-card-bg)', borderColor: 'var(--t-border-soft)' }}>
      <div className="p-4 flex items-start justify-between gap-3 cursor-pointer" onClick={() => setExpanded(expanded === tip.id ? null : tip.id)}>
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className="text-xs font-bold px-2 py-1 rounded-full text-white shrink-0 mt-0.5"
            style={{ backgroundColor: CAT_COLOR[tip.category] || 'var(--t-text-main)' }}>{tip.category}</span>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--t-text-main)' }}>{tip.title}</h3>
            {tip.agent && <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-soft)' }}>{tip.agent}</p>}
          </div>
        </div>
        <div className="flex gap-1 shrink-0 items-center">
          <button onClick={e => { e.stopPropagation(); openEdit(tip) }} className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--t-text-muted)', backgroundColor: 'var(--t-item-bg)' }}>{t.edit}</button>
          <button onClick={e => { e.stopPropagation(); del(tip.id) }} className="text-xs px-2 py-1 rounded-lg" style={{ color: '#c0303e', backgroundColor: '#fde8ec' }}>{t.del}</button>
          <span className="text-xs px-1" style={{ color: 'var(--t-text-soft)' }}>{expanded === tip.id ? '▲' : '▼'}</span>
        </div>
      </div>
      {expanded === tip.id && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--t-item-bg)' }}>
          <p className="text-sm mt-3 whitespace-pre-wrap" style={{ color: 'var(--t-text-muted)' }}>{tip.content}</p>
          {tip.drill && (
            <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--t-item-bg)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#2d6a4f' }}>{t.practiceDrill}</p>
              <p className="text-sm" style={{ color: 'var(--t-text-muted)' }}>{tip.drill}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--t-text-main)' }}>🎮 Valorant</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--t-text-muted)' }}>{AGENTS.length} agents · {tips.length} tips</p>
        </div>
        <button onClick={() => openAdd()} className="btn-glass btn-glass-red px-4 py-2.5 rounded-xl text-sm font-medium">
          {t.addBtn}
        </button>
      </div>

      {/* ── Role cards ── */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {ROLES.map(role => {
          const active = selectedRole === role.key
          const count = AGENTS.filter(a => a.role === role.key).length
          return (
            <button
              key={role.key}
              onClick={() => { setSelectedRole(active ? null : role.key); setSelectedAgent(null) }}
              className="flex flex-col items-center gap-1 py-3 px-1 rounded-2xl transition-all active:scale-95"
              style={{
                backgroundColor: active ? role.color : role.bg,
                border: `2px solid ${active ? role.color : role.border}`,
              }}
            >
              <span className="text-xl leading-none">{role.emoji}</span>
              <span className="text-xs font-bold leading-tight text-center" style={{ color: active ? '#fff' : role.color }}>
                {role.label}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)', color: active ? '#fff' : role.color }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Role description ── */}
      {selectedRole && (() => {
        const role = ROLES.find(r => r.key === selectedRole)!
        return (
          <div className="rounded-2xl px-4 py-3 mb-4 flex items-center gap-3"
            style={{ backgroundColor: role.bg, border: `1px solid ${role.border}` }}>
            <span className="text-2xl">{role.emoji}</span>
            <div>
              <p className="text-sm font-bold" style={{ color: role.color }}>{role.label}</p>
              <p className="text-xs" style={{ color: role.color, opacity: 0.8 }}>{role.desc}</p>
            </div>
          </div>
        )
      })()}

      {/* ── Agent grid ── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
        {(selectedRole ? AGENTS.filter(a => a.role === selectedRole) : AGENTS).map(agent => {
          const roleInfo = ROLES.find(r => r.key === agent.role)!
          const isSelected = selectedAgent === agent.name
          const tipCount = tips.filter(tip => tip.agent?.toLowerCase() === agent.name.toLowerCase()).length
          return (
            <button
              key={agent.name}
              onClick={() => setSelectedAgent(isSelected ? null : agent.name)}
              className="relative flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95"
              style={{
                backgroundColor: isSelected ? roleInfo.color : 'var(--t-item-bg)',
                border: `2px solid ${isSelected ? roleInfo.color : 'var(--t-item-bg)'}`,
              }}
            >
              {tipCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: roleInfo.color, fontSize: 9 }}>
                  {tipCount}
                </span>
              )}
              <span className="text-2xl leading-none">{agent.emoji}</span>
              <span className="text-xs font-semibold text-center leading-tight"
                style={{ color: isSelected ? '#fff' : 'var(--t-text-main)' }}>
                {agent.name}
              </span>
              <span className="text-center" style={{ fontSize: 11 }}>{agent.country}</span>
              {!selectedRole && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : roleInfo.bg,
                    color: isSelected ? '#fff' : roleInfo.color,
                    fontSize: 9,
                  }}>
                  {roleInfo.label}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Agent tips panel ── */}
      {selectedAgent && (() => {
        const agent = AGENTS.find(a => a.name === selectedAgent)!
        const roleInfo = ROLES.find(r => r.key === agent.role)!
        return (
          <div className="mb-6">
            {/* Agent header */}
            <div className="rounded-2xl p-4 mb-4 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${roleInfo.color} 0%, ${roleInfo.border} 100%)` }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{agent.emoji}</span>
                <div>
                  <p className="font-bold text-white text-base">{agent.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {agent.country} · {roleInfo.label} · {agent.ability}
                  </p>
                </div>
              </div>
              <button
                onClick={() => openAdd(agent.name)}
                className="px-3 py-2 rounded-xl text-xs font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
              >
                + Tip
              </button>
            </div>

            {agentTips.length === 0 ? (
              <div className="text-center py-10 rounded-2xl" style={{ backgroundColor: 'var(--t-item-bg)', color: 'var(--t-text-soft)' }}>
                <p className="text-3xl mb-2">🎯</p>
                <p className="text-sm">Pas encore de tips pour {selectedAgent}</p>
                <button
                  onClick={() => openAdd(selectedAgent)}
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ backgroundColor: roleInfo.bg, color: roleInfo.color }}
                >
                  Ajouter le premier tip
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {agentTips.map(tip => <TipCard key={tip.id} tip={tip} />)}
              </div>
            )}
          </div>
        )
      })()}


      {/* ── Add / Edit modal ── */}
      {modal && (
        <Modal title={editing ? t.editTip : t.newTip} onClose={() => setModal(false)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.category}</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--t-border-soft)' }}
                >
                  {['MECHANICS', 'STRATEGY', 'MINDSET', 'AGENT'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.agentOptional}</label>
                <select
                  value={form.agent}
                  onChange={e => setForm(f => ({ ...f, agent: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: 'var(--t-border-soft)' }}
                >
                  <option value="">— Aucun —</option>
                  {ROLES.map(role => (
                    <optgroup key={role.key} label={`${role.emoji} ${role.label}`}>
                      {AGENTS.filter(a => a.role === role.key).map(agent => (
                        <option key={agent.name} value={agent.name}>{agent.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={generateAI}
              disabled={aiLoading}
              className="w-full py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
              style={{ backgroundColor: '#fde8ec', color: '#c0303e' }}
            >
              {aiLoading ? t.aiGenerating : t.aiGenerateTip}
            </button>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.title}</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--t-border-soft)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.content}</label>
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={5}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: 'var(--t-border-soft)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>{t.practiceDrillOpt}</label>
              <textarea
                value={form.drill}
                onChange={e => setForm(f => ({ ...f, drill: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: 'var(--t-border-soft)' }}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={() => setModal(false)} className="btn-glass btn-glass-neutral flex-1 py-2.5 rounded-xl text-sm font-medium">
              {t.cancel}
            </button>
            <button onClick={save} disabled={saving} className="btn-glass btn-glass-red flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
              {saving ? t.saving : t.saveTip}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
