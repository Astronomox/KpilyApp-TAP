'use client'

import { useState } from 'react'
import { useLocalSetting } from '@/lib/useLocalSetting'
import '@/styles/Performance.css'

type Points = { rules: { id: string; label: string; points: number }[]; grades: { A: number; B: number; C: number; D: number } }
const DEFAULTS: Points = {
  rules: [
    { id: 'on-time', label: 'Task completed on time', points: 100 },
    { id: 'early', label: 'Task completed early (bonus)', points: 20 },
    { id: 'late', label: 'Task completed late', points: 50 },
    { id: 'feedback', label: 'Positive feedback received', points: 10 },
    { id: 'recognition', label: 'Peer recognition', points: 5 },
  ],
  grades: { A: 90, B: 80, C: 70, D: 60 },
}

export default function PointSettings() {
  const [stored, save, loaded] = useLocalSetting<Points>('kpily.point-settings', DEFAULTS)
  const [saved, setSaved] = useState(false)

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    save({
      rules: stored.rules.map((r) => ({ ...r, points: Number(f.get(r.id)) })),
      grades: { A: Number(f.get('A')), B: Number(f.get('B')), C: Number(f.get('C')), D: Number(f.get('D')) },
    })
    setSaved(true)
  }

  return (
    <div className="ka-score">
      <div className="ka-pagehead"><div><h1>Point Settings</h1><p>How many points each achievement is worth, and the grade boundaries.</p></div></div>
      {loaded && (
        <form className="ka-card ka-settings-form" onSubmit={submit} onChange={() => setSaved(false)}>
          <h2>Points per achievement</h2>
          <div className="ka-row2">
            {stored.rules.map((r) => <label key={r.id} className="ka-field">{r.label}<input name={r.id} type="number" min={0} required defaultValue={r.points} /></label>)}
          </div>
          <h2>Grade boundaries (% of tasks completed)</h2>
          <div className="ka-row4">
            {(['A', 'B', 'C', 'D'] as const).map((g) => <label key={g} className="ka-field">{g} from<input name={g} type="number" min={0} max={100} required defaultValue={stored.grades[g]} /></label>)}
          </div>
          <p className="ka-muted">Below D is graded F. These settings are saved in this browser.</p>
          <div className="ka-actions">
            <button type="button" className="ka-btn ka-btn--ghost" onClick={() => { save(DEFAULTS); setSaved(false) }}>Reset to defaults</button>
            <button type="submit" className="ka-btn">{saved ? 'Saved ✓' : 'Save'}</button>
          </div>
        </form>
      )}
    </div>
  )
}
