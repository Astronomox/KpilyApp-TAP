'use client'

import { useState } from 'react'
import Icon from '@/components/app/Icon'
import { useLocalSetting } from '@/lib/useLocalSetting'
import '@/styles/Performance.css'

type Badge = { id: string; name: string; points: number; color: string }
const DEFAULTS: Badge[] = [
  { id: 'bronze', name: 'Bronze', points: 500, color: '#b87333' },
  { id: 'silver', name: 'Silver', points: 1500, color: '#9aa4ad' },
  { id: 'gold', name: 'Gold', points: 3000, color: '#e0a800' },
  { id: 'platinum', name: 'Platinum', points: 6000, color: '#106190' },
]

export default function BadgeSettings() {
  const [badges, save, loaded] = useLocalSetting<Badge[]>('kpily.badge-settings', DEFAULTS)
  const [draft, setDraft] = useState({ name: '', points: 1000, color: '#1e7a5a' })

  function add(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.name.trim()) return
    save([...badges, { ...draft, name: draft.name.trim(), id: `${Date.now()}` }].sort((a, b) => a.points - b.points))
    setDraft({ name: '', points: 1000, color: '#1e7a5a' })
  }

  return (
    <div className="ka-score">
      <div className="ka-pagehead"><div><h1>Badge Settings</h1><p>Badges staff earn as their points grow.</p></div></div>
      {loaded && (
        <section className="ka-card ka-settings-form">
          <ul className="ka-badges">
            {badges.map((b) => (
              <li key={b.id}>
                <span className="ka-badges__medal" style={{ background: b.color }} aria-hidden="true">★</span>
                <strong>{b.name}</strong><span>{b.points.toLocaleString()} points</span>
                <button type="button" className="ka-sq ka-sq--del" aria-label={`Remove ${b.name}`} onClick={() => save(badges.filter((x) => x.id !== b.id))}><Icon name="trash" size={16} /></button>
              </li>
            ))}
            {!badges.length && <li className="ka-muted">No badges yet.</li>}
          </ul>
          <form className="ka-badges__add" onSubmit={add}>
            <label className="ka-field">Badge name<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required placeholder="e.g. Diamond" /></label>
            <label className="ka-field">Points needed<input type="number" min={0} value={draft.points} onChange={(e) => setDraft({ ...draft, points: Number(e.target.value) })} required /></label>
            <label className="ka-field">Colour<input type="color" value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })} /></label>
            <button type="submit" className="ka-btn"><Icon name="plus" size={16} />Add badge</button>
          </form>
          <p className="ka-muted">These settings are saved in this browser.</p>
        </section>
      )}
    </div>
  )
}
