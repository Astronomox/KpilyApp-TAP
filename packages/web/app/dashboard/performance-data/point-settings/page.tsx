'use client'

import { useState } from 'react'
import Icon from '@/components/app/Icon'
import { useLocalSetting } from '@/lib/useLocalSetting'
import '@/styles/Performance.css'

// Figma: Point Settings (node 1884:69993). Positive and negative point tags.
// No API endpoint exists for these yet, so they are kept in this browser.
type Point = { id: string; label: string; value: number }
type Points = { positive: Point[]; negative: Point[] }

function PointGroup({ title, cls, sign, items, editing, onRemove }: {
  title: string; cls: string; sign: '+' | '-'; items: Point[]; editing: boolean; onRemove: (id: string) => void
}) {
  return (
    <section className="ka-ptgroup">
      <h2>{title}</h2>
      <div className="ka-pills">
        {items.map((pt) => (
          <span key={pt.id} className={`ka-pill ${cls}`}>
            {pt.label} {sign}{pt.value}
            {editing && <button type="button" className="ka-pill__del" aria-label={`Remove ${pt.label}`} onClick={() => onRemove(pt.id)}>×</button>}
          </span>
        ))}
        {!items.length && <span className="ka-muted">None yet.</span>}
      </div>
    </section>
  )
}

const p = (label: string, value: number): Point => ({ id: `${label}-${value}`, label, value })
const DEFAULTS: Points = {
  positive: [
    p('Assistance', 50), p('Great Communication', 100), p('Life Saver', 200), p('THANK YOU!', 25),
    p('Collaboration', 100), p('High Quality', 100), p('Speedy', 100), p('Well-Balanced Work', 75),
    p('Creative', 75), p('Inspirational', 50), p('Task Complete', 150),
    p('Flexible', 25), p('Noticeable improvement', 75), p('Team Player', 50),
  ],
  negative: [
    p('Be Patient', 25), p('Too rushed', 25),
    p('Needs Improvement', 50), p('Wrong Direction', 50),
    p('Not thorough enough', 50),
    p('Review again for errors', 75),
  ],
}

export default function PointSettings() {
  const [points, save, loaded] = useLocalSetting<Points>('kpily.point-settings', DEFAULTS)
  const [editing, setEditing] = useState(false)

  function remove(kind: keyof Points, id: string) {
    save({ ...points, [kind]: points[kind].filter((x) => x.id !== id) })
  }

  return (
    <div className="ka-score">
      <div className="ka-setbar">
        <h1>Point Settings</h1>
        <div className="ka-setbar__actions">
          <button type="button" className="ka-btn" onClick={() => setEditing((v) => !v)}><Icon name="edit" size={16} />{editing ? 'Done' : 'Edit'}</button>
        </div>
      </div>

      {loaded && (
        <>
          <PointGroup title="Positive Points" cls="ka-pill--pos" sign="+" items={points.positive} editing={editing} onRemove={(id) => remove('positive', id)} />
          <PointGroup title="Negative Points" cls="ka-pill--neg" sign="-" items={points.negative} editing={editing} onRemove={(id) => remove('negative', id)} />
        </>
      )}
    </div>
  )
}
