'use client'

import { useState } from 'react'
import Icon from './Icon'
import { tagPoints, type Points } from '@/lib/engagement'
import type { Member } from '@/lib/kpily'

// Figma "Give Feedback" → "Assign Points" (nodes 1278:26724, 1278:27483): what worked and what
// could change, each with point tags from Point Settings, then a points total to confirm.

export type FeedbackDraft = { to: string; subject: string; worked: string; different: string; tags: string[]; points: number }

export default function FeedbackForm({ members, subjects, points, initial, onCancel, onSend }: {
  members: Member[]; subjects: string[]; points: Points; initial?: Partial<FeedbackDraft>
  onCancel: () => void; onSend: (d: FeedbackDraft) => void
}) {
  const [d, setD] = useState<FeedbackDraft>({ to: '', subject: '', worked: '', different: '', tags: [], points: 0, ...initial })
  const [step, setStep] = useState<'write' | 'points'>('write')
  const [error, setError] = useState('')
  const toggle = (id: string) => setD({ ...d, tags: d.tags.includes(id) ? d.tags.filter((t) => t !== id) : [...d.tags, id] })

  function next(e: React.FormEvent) {
    e.preventDefault()
    if (!d.to) return setError('Choose who the feedback is for.')
    if (!d.subject.trim()) return setError('Add what the feedback is about.')
    if (!d.worked.trim() && !d.different.trim() && !d.tags.length) return setError('Write some feedback or pick at least one tag.')
    setError('')
    setD({ ...d, points: tagPoints(d.tags, points) })
    setStep('points')
  }

  const who = members.find((m) => m.email === d.to)?.fullname ?? d.to

  if (step === 'points') {
    return (
      <form className="ka-fbform" onSubmit={(e) => { e.preventDefault(); onSend(d) }}>
        <div className="ka-fbprogress" aria-hidden="true"><span style={{ width: '100%' }} /></div>
        <h1>Assign Points: <span>{d.subject}</span></h1>
        <div className="ka-fbpoints">
          <p>Points for <strong>{who}</strong>, from the tags you picked. You can adjust the total.</p>
          <div className="ka-pills">
            {[...points.positive, ...points.negative].filter((t) => d.tags.includes(t.id)).map((t) => (
              <span key={t.id} className={`ka-pill ${points.positive.includes(t) ? 'ka-pill--pos' : 'ka-pill--neg'}`}>{t.label} {points.positive.includes(t) ? '+' : '-'}{t.value}</span>
            ))}
          </div>
          <label className="ka-field ka-fbpoints__total">Total points<input type="number" value={d.points} onChange={(e) => setD({ ...d, points: Number(e.target.value) })} /></label>
        </div>
        <div className="ka-actions">
          <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setStep('write')}>Back</button>
          <button type="submit" className="ka-btn ka-btn--lg">Send Feedback</button>
        </div>
      </form>
    )
  }

  return (
    <form className="ka-fbform" onSubmit={next}>
      <div className="ka-fbprogress" aria-hidden="true"><span style={{ width: '50%' }} /></div>
      <h1>Feedback: <span>{d.subject || 'New'}</span></h1>
      <div className="ka-row2">
        <label className="ka-field">For<select value={d.to} onChange={(e) => setD({ ...d, to: e.target.value })} required>
          <option value="">Choose a team member</option>
          {members.map((m) => <option key={m.id} value={m.email}>{m.fullname}</option>)}
        </select></label>
        <label className="ka-field">About<input value={d.subject} onChange={(e) => setD({ ...d, subject: e.target.value })} list="ka-fb-subjects" placeholder="A task or project, e.g. Bug Test" required />
          <datalist id="ka-fb-subjects">{subjects.map((s) => <option key={s} value={s} />)}</datalist>
        </label>
      </div>

      <div className="ka-fbpair">
        <label className="ka-fbbox"><span>What worked</span><textarea rows={5} value={d.worked} onChange={(e) => setD({ ...d, worked: e.target.value })} /></label>
        <div className="ka-fbtags" role="group" aria-label="Positive tags">
          {points.positive.map((t) => <button key={t.id} type="button" aria-pressed={d.tags.includes(t.id)} className={`ka-fbtag ka-fbtag--pos ${d.tags.includes(t.id) ? 'is-on' : ''}`} onClick={() => toggle(t.id)}>{t.label}</button>)}
        </div>
      </div>
      <div className="ka-fbpair">
        <label className="ka-fbbox"><span>What might they do differently</span><textarea rows={5} value={d.different} onChange={(e) => setD({ ...d, different: e.target.value })} /></label>
        <div className="ka-fbtags" role="group" aria-label="Areas to improve">
          {points.negative.map((t) => <button key={t.id} type="button" aria-pressed={d.tags.includes(t.id)} className={`ka-fbtag ka-fbtag--neg ${d.tags.includes(t.id) ? 'is-on' : ''}`} onClick={() => toggle(t.id)}>{t.label}</button>)}
        </div>
      </div>

      {error && <p role="alert" className="ka-error">{error}</p>}
      <div className="ka-actions">
        <button type="button" className="ka-btn ka-btn--ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="ka-btn ka-btn--lg">Continue <Icon name="chevron" size={16} className="ka-flip" /></button>
      </div>
    </form>
  )
}
