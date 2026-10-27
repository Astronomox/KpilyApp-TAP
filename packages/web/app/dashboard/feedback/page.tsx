'use client'

import { useEffect, useMemo, useState } from 'react'
import Avatar from '@/components/app/Avatar'
import Evidence from '@/components/app/Evidence'
import FeedbackForm, { type FeedbackDraft } from '@/components/app/FeedbackForm'
import Icon from '@/components/app/Icon'
import Modal from '@/components/app/Modal'
import { useProfile } from '@/components/app/ProfileContext'
import { timeAgo } from '@/components/app/TaskBits'
import {
  FEEDBACK_KEY, FEEDBACK_REQUESTS_KEY, POINTS_KEY, POINT_DEFAULTS, newId,
  type Feedback, type FeedbackRequest, type Points,
} from '@/lib/engagement'
import { getMembers, getTasks, type Member } from '@/lib/kpily'
import { useLocalSetting } from '@/lib/useLocalSetting'
import '@/styles/Tasks.css'
import '@/styles/Performance.css'
import '@/styles/Engagement.css'

// Figma "Feedback Dash" (node 1278:30531) and its flow: Give Feedback, Assign Points,
// Feedback Complete, reading a message, and Appeal Feedback.
type View = { kind: 'list' } | { kind: 'give'; initial?: Partial<FeedbackDraft>; requestId?: string } | { kind: 'done'; to: string } | { kind: 'read'; id: string } | { kind: 'appeal'; id: string }
type Tab = 'messages' | 'requests'

export default function FeedbackPage() {
  const { profile } = useProfile()
  const me = profile?.email ?? ''
  const [feedback, saveFeedback, loaded] = useLocalSetting<Feedback[]>(FEEDBACK_KEY, [])
  const [requests, saveRequests] = useLocalSetting<FeedbackRequest[]>(FEEDBACK_REQUESTS_KEY, [])
  const [points] = useLocalSetting<Points>(POINTS_KEY, POINT_DEFAULTS)
  const [members, setMembers] = useState<Member[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [view, setView] = useState<View>({ kind: 'list' })
  const [tab, setTab] = useState<Tab>('messages')
  const [query, setQuery] = useState('')
  const [asking, setAsking] = useState(false)
  const [appeal, setAppeal] = useState({ reason: '', files: [] as string[], links: [] as string[] })

  useEffect(() => {
    getMembers().then(setMembers).catch(() => {})
    getTasks().then((ts) => setSubjects([...new Set(ts.map((t) => t.name))])).catch(() => {})
    // Account overview links here with #give to open the form straight away.
    if (window.location.hash === '#give') queueMicrotask(() => setView({ kind: 'give' }))
  }, [])

  const others = members.filter((m) => m.email !== me)
  const nameOf = (email: string) => members.find((m) => m.email === email)?.fullname ?? email
  const mine = useMemo(() => feedback.filter((f) => f.to === me || f.from === me).sort((a, b) => b.date - a.date), [feedback, me])
  const asked = useMemo(() => requests.filter((r) => r.to === me).sort((a, b) => b.date - a.date), [requests, me])
  const q = query.trim().toLowerCase()
  const match = (...s: string[]) => !q || s.some((x) => x.toLowerCase().includes(q))
  const unread = mine.filter((f) => f.to === me && !f.read).length

  function send(d: FeedbackDraft, requestId?: string) {
    saveFeedback([...feedback, { id: newId(), from: me, fromName: profile?.fullname ?? me, to: d.to, toName: nameOf(d.to), subject: d.subject.trim(), worked: d.worked.trim(), different: d.different.trim(), tags: d.tags, points: d.points, date: Date.now(), read: false }])
    if (requestId) saveRequests(requests.filter((r) => r.id !== requestId))
    setView({ kind: 'done', to: nameOf(d.to) })
  }

  function open(f: Feedback) {
    if (f.to === me && !f.read) saveFeedback(feedback.map((x) => (x.id === f.id ? { ...x, read: true } : x)))
    setView({ kind: 'read', id: f.id })
  }

  function ask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const to = String(f.get('to'))
    saveRequests([...requests, { id: newId(), from: me, fromName: profile?.fullname ?? me, to, toName: nameOf(to), subject: String(f.get('subject')).trim(), date: Date.now() }])
    setAsking(false)
  }

  function submitAppeal(e: React.FormEvent, id: string) {
    e.preventDefault()
    if (!appeal.reason.trim()) return
    saveFeedback(feedback.map((x) => (x.id === id ? { ...x, appeal: { ...appeal, reason: appeal.reason.trim(), date: Date.now() } } : x)))
    setAppeal({ reason: '', files: [], links: [] })
    setView({ kind: 'read', id })
  }

  const back = <button type="button" className="ka-back" onClick={() => setView({ kind: 'list' })}><Icon name="chevron" size={14} />Back</button>

  if (view.kind === 'give') {
    return <div className="ka-eng">{back}<FeedbackForm members={others} subjects={subjects} points={points} initial={view.initial} onCancel={() => setView({ kind: 'list' })} onSend={(d) => send(d, view.requestId)} /></div>
  }

  if (view.kind === 'done') {
    return (
      <div className="ka-eng ka-done">
        <span className="ka-done__icon" aria-hidden="true"><Icon name="check" size={44} /></span>
        <h1>Feedback Complete!</h1>
        <p>Your feedback for {view.to} has been sent.</p>
        <button type="button" className="ka-btn ka-btn--lg" onClick={() => setView({ kind: 'list' })}>Back to Feedback</button>
      </div>
    )
  }

  const current = view.kind === 'read' || view.kind === 'appeal' ? feedback.find((f) => f.id === view.id) : undefined

  if (view.kind === 'appeal' && current) {
    return (
      <div className="ka-eng">
        <button type="button" className="ka-back" onClick={() => setView({ kind: 'read', id: current.id })}><Icon name="chevron" size={14} />Back</button>
        <form className="ka-fbform" onSubmit={(e) => submitAppeal(e, current.id)}>
          <h1>Appeal Feedback: <span>{current.subject}</span></h1>
          <div className="ka-fbpair">
            <label className="ka-fbbox"><span>Why are you appealing the feedback?</span><textarea rows={10} required value={appeal.reason} onChange={(e) => setAppeal({ ...appeal, reason: e.target.value })} /></label>
            <div><h2 className="ka-evidence__title">Add Supporting Evidence</h2><Evidence files={appeal.files} links={appeal.links} onChange={(v) => setAppeal({ ...appeal, ...v })} /></div>
          </div>
          <div className="ka-actions"><button type="submit" className="ka-btn ka-btn--lg" disabled={!appeal.reason.trim()}>Continue</button></div>
        </form>
      </div>
    )
  }

  if (view.kind === 'read' && current) {
    const tags = [...points.positive.map((t) => ({ ...t, pos: true })), ...points.negative.map((t) => ({ ...t, pos: false }))].filter((t) => current.tags.includes(t.id))
    const canAppeal = current.to === me && !current.appeal && (current.points < 0 || tags.some((t) => !t.pos) || !!current.different)
    return (
      <div className="ka-eng">
        {back}
        <article className="ka-card ka-fbread">
          <header>
            <Avatar name={current.fromName} size={48} />
            <div><small>{current.to === me ? `Feedback from ${current.fromName}` : `Feedback to ${current.toName}`} · {timeAgo(current.date)}</small><h1>{current.subject}</h1></div>
            <span className={`ka-fbread__pts ${current.points < 0 ? 'is-neg' : ''}`}>{current.points > 0 ? '+' : ''}{current.points} PTS</span>
          </header>
          {current.worked && <section><h2>What worked</h2><p>{current.worked}</p></section>}
          {current.different && <section><h2>What might they do differently</h2><p>{current.different}</p></section>}
          {tags.length > 0 && <div className="ka-pills">{tags.map((t) => <span key={t.id} className={`ka-pill ${t.pos ? 'ka-pill--pos' : 'ka-pill--neg'}`}>{t.label} {t.pos ? '+' : '-'}{t.value}</span>)}</div>}
          {current.appeal && (
            <section className="ka-fbread__appeal">
              <h2>Appealed {timeAgo(current.appeal.date)}</h2>
              <p>{current.appeal.reason}</p>
              {(current.appeal.files.length > 0 || current.appeal.links.length > 0) && (
                <ul className="ka-evidence__list">
                  {current.appeal.files.map((f, i) => <li key={`f${i}`}><Icon name="folder" size={16} />{f}</li>)}
                  {current.appeal.links.map((l, i) => <li key={`l${i}`}><Icon name="link" size={16} /><a href={l} target="_blank" rel="noreferrer">{l}</a></li>)}
                </ul>
              )}
            </section>
          )}
          {canAppeal && <div className="ka-actions ka-actions--start"><button type="button" className="ka-btn ka-btn--outline" onClick={() => setView({ kind: 'appeal', id: current.id })}>Appeal Feedback</button></div>}
        </article>
      </div>
    )
  }

  return (
    <div className="ka-eng">
      <div className="ka-tasks__head">
        <h1>Feedback</h1>
        <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setAsking(true)}>Request Feedback</button>
      </div>
      <p className="ka-localnote">Feedback, requests and appeals are saved in this browser until the KPILY API supports them.</p>

      <section className="ka-card ka-taskfeed">
        <div className="ka-buckets" role="tablist" aria-label="Feedback">
          <button type="button" role="tab" aria-selected={tab === 'messages'} className={`ka-bucket ka-bucket--new ${tab === 'messages' ? 'is-on' : ''}`} onClick={() => setTab('messages')}><strong>{unread || mine.length}</strong>Feedback Messages</button>
          <button type="button" role="tab" aria-selected={tab === 'requests'} className={`ka-bucket ka-bucket--approvals ${tab === 'requests' ? 'is-on' : ''}`} onClick={() => setTab('requests')}><strong>{asked.length}</strong>Feedback Requests</button>
          <button type="button" className="ka-bucket ka-bucket--create" onClick={() => setView({ kind: 'give' })}><Icon name="heart" size={34} /><span>Create Feedback<br />Give Kudos</span></button>
        </div>
        <div className="ka-taskfeed__search">
          <Icon name="search" size={22} />
          <input placeholder="Search feedback by name, keyword, team member, etc." aria-label="Search feedback" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {!loaded ? <p className="ka-table__empty">Loading…</p> : tab === 'messages' ? (
          mine.filter((f) => match(f.subject, f.fromName, f.toName, f.worked, f.different)).length ? (
            <ul className="ka-feedlist">
              {mine.filter((f) => match(f.subject, f.fromName, f.toName, f.worked, f.different)).map((f) => {
                const received = f.to === me
                return (
                  <li key={f.id} className="ka-feeditem">
                    <span className="ka-feeditem__new">{received && !f.read ? 'NEW' : ''}</span>
                    <Avatar name={received ? f.fromName : f.toName} size={44} />
                    <button type="button" className="ka-feeditem__body" onClick={() => open(f)}>
                      <small>{received ? `Feedback from ${f.fromName}` : `Feedback to ${f.toName}`}{f.appeal ? ' · Appealed' : ''}</small>
                      <strong>{f.subject}</strong>
                    </button>
                    <time className="ka-feeditem__time">{timeAgo(f.date)}</time>
                    <span />
                  </li>
                )
              })}
            </ul>
          ) : <p className="ka-table__empty">No feedback yet. Give some kudos to get things started.</p>
        ) : asked.filter((r) => match(r.subject, r.fromName)).length ? (
          <ul className="ka-feedlist">
            {asked.filter((r) => match(r.subject, r.fromName)).map((r) => (
              <li key={r.id} className="ka-feeditem">
                <span className="ka-feeditem__new">ASK</span>
                <Avatar name={r.fromName} size={44} />
                <button type="button" className="ka-feeditem__body" onClick={() => setView({ kind: 'give', initial: { to: r.from, subject: r.subject }, requestId: r.id })}>
                  <small>Give Feedback to {r.fromName}</small>
                  <strong>{r.subject}</strong>
                </button>
                <time className="ka-feeditem__time">{timeAgo(r.date)}</time>
                <button type="button" className="ka-iconbtn" aria-label={`Dismiss request from ${r.fromName}`} onClick={() => saveRequests(requests.filter((x) => x.id !== r.id))}><Icon name="close" size={16} /></button>
              </li>
            ))}
          </ul>
        ) : <p className="ka-table__empty">Nobody has asked you for feedback.</p>}
      </section>

      <Modal open={asking} title="Request feedback" onClose={() => setAsking(false)} width={460}>
        <form onSubmit={ask}>
          <label className="ka-field">From<select name="to" required defaultValue=""><option value="" disabled>Choose a team member</option>{others.map((m) => <option key={m.id} value={m.email}>{m.fullname}</option>)}</select></label>
          <label className="ka-field">About<input name="subject" required list="ka-fb-subjects-ask" placeholder="A task or project" /><datalist id="ka-fb-subjects-ask">{subjects.map((s) => <option key={s} value={s} />)}</datalist></label>
          <div className="ka-actions">
            <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setAsking(false)}>Cancel</button>
            <button type="submit" className="ka-btn">Send request</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
