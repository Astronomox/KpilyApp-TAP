'use client'

import { useEffect, useMemo, useState } from 'react'
import { BIMONTHS, BarChart, Gauge, Pie, StatCard } from '@/components/app/Charts'
import Evidence from '@/components/app/Evidence'
import Icon from '@/components/app/Icon'
import Modal from '@/components/app/Modal'
import { useProfile } from '@/components/app/ProfileContext'
import SkeletonCard from '@/components/app/SkeletonCard'
import { GOALS_KEY, currentSlot, newId, slotsFor, type Goal, type GoalPeriod } from '@/lib/engagement'
import { dueMs, getDashboard, getMembers, getTasks, type Dashboard, type Member, type Task } from '@/lib/kpily'
import { useLocalSetting } from '@/lib/useLocalSetting'
import '@/styles/Performance.css'
import '@/styles/Engagement.css'

// Figma "Goals" (node 1278:28723) and "Add Goal" (1466:27878 / 28285 / 28484).
// The KPI tiles and chart are live API data; goals themselves are kept in this browser.
const GREEN = { dark: '#1a6b4f', mid: '#2fa37a', light: '#a3e8cd' }
const PERIODS: [GoalPeriod, string, string][] = [['quarter', 'Quarterly', 'Quarter'], ['month', 'Monthly', 'Month'], ['year', 'Yearly', 'Year']]

const blank = () => ({ title: '', owner: '', period: 'quarter' as GoalPeriod, slot: currentSlot('quarter'), details: '', files: [] as string[], links: [] as string[] })

export default function Goals() {
  const { profile } = useProfile()
  const me = profile?.email ?? ''
  const isLead = (profile?.privilege ?? 0) >= 40
  const [goals, saveGoals, loaded] = useLocalSetting<Goal[]>(GOALS_KEY, [])
  const [dash, setDash] = useState<Dashboard | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [period, setPeriod] = useState<GoalPeriod>('quarter')
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState(blank)
  const [added, setAdded] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard().then(setDash).catch(() => {})
    getTasks().then(setTasks).catch(() => {})
    getMembers().then(setMembers).catch(() => {})
  }, [])

  const year = new Date().getFullYear()
  const annual = useMemo(() => {
    const ts = tasks.filter((t) => new Date(dueMs(t)).getFullYear() === year)
    const s = (pred: (t: Task) => boolean) => BIMONTHS.map((_, i) => ts.filter((t) => Math.floor(new Date(dueMs(t)).getMonth() / 2) === i && pred(t)).length)
    return [
      { label: 'Completed', color: GREEN.dark, values: s((t) => t.status === 3) },
      { label: 'WIP', color: GREEN.mid, values: s((t) => t.status === 1 || t.status === 2) },
      { label: 'Awaiting Approval', color: GREEN.light, values: s((t) => t.status === 4) },
    ]
  }, [tasks, year])
  const areas = [
    { label: 'Collaboration', value: dash?.feedBackRate.value ?? 0, color: '#4591bf' },
    { label: 'Tasks', value: dash?.taskCompletionRate.value ?? 0, color: '#0d4d73' },
    { label: 'Communication', value: dash?.responseRate.value ?? 0, color: '#a8cde0' },
  ]

  // Leads see every goal; everyone else sees goals for them or that they set.
  const visible = goals.filter((g) => isLead || g.owner === me || g.createdBy === me)
  const slot = currentSlot(period)
  const shown = visible.filter((g) => g.period === period && g.slot === slot)
  const pct = shown.length ? (shown.filter((g) => g.done).length / shown.length) * 100 : 0

  function openAdd() { setDraft({ ...blank(), owner: me }); setError(''); setAdding(true) }

  function add(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.title.trim()) return setError('Give the goal a title.')
    const owner = draft.owner || me
    saveGoals([...goals, {
      id: newId(), title: draft.title.trim(), owner, ownerName: members.find((m) => m.email === owner)?.fullname ?? profile?.fullname ?? owner, createdBy: me,
      period: draft.period, slot: draft.slot, details: draft.details.trim(), files: draft.files, links: draft.links, done: false, date: Date.now(),
    }])
    setAdding(false)
    setPeriod(draft.period)
    setAdded(draft.title.trim())
  }

  const toggle = (g: Goal) => saveGoals(goals.map((x) => (x.id === g.id ? { ...x, done: !x.done } : x)))
  const remove = (g: Goal) => saveGoals(goals.filter((x) => x.id !== g.id))
  const canEdit = (g: Goal) => g.owner === me || g.createdBy === me || isLead

  return (
    <div className="ka-perf ka-eng">
      <div className="ka-pagehead">
        <h1>Goals</h1>
        <button type="button" className="ka-fab" aria-label="Add goal" onClick={openAdd}><Icon name="plus" size={26} /></button>
      </div>

      {dash === null ? (
        <div className="ka-perf__stats"><SkeletonCard lines={4} height={140} /><SkeletonCard lines={4} height={140} /><SkeletonCard lines={4} height={140} /><SkeletonCard lines={4} height={140} /></div>
      ) : (
        <div className="ka-perf__stats">
          <StatCard title="Task Completion Rate" rate={dash.taskCompletionRate} />
          <StatCard title="Positive Feedback" rate={dash.positiveFeedback} />
          <StatCard title="Response Rate" rate={dash.responseRate} />
          <section className="ka-card ka-statcard"><h2>Achievement Areas</h2><Pie slices={areas} label="Achievement areas" /></section>
        </div>
      )}

      <div className="ka-perf__two">
        <section className="ka-card"><h2>Annual KPI</h2><BarChart labels={BIMONTHS} series={annual} label="Tasks by status this year" /></section>
        <section className="ka-card ka-goals">
          <div className="ka-card__head">
            <h2>{PERIODS.find(([p]) => p === period)?.[1]} Goals <small>{slot}</small></h2>
            <div className="ka-goals__periods" role="group" aria-label="Goal period">
              {PERIODS.map(([p, label]) => <button key={p} type="button" aria-pressed={period === p} className={period === p ? 'is-on' : ''} onClick={() => setPeriod(p)}>{label}</button>)}
            </div>
          </div>
          <Gauge pct={pct} />
          {!loaded ? null : shown.length ? (
            <ul className="ka-goals__list">
              {shown.map((g) => (
                <li key={g.id}>
                  <span className="ka-goals__title">{g.title}{g.owner !== me && <small>{g.ownerName}</small>}</span>
                  {canEdit(g) && <button type="button" className="ka-iconbtn" aria-label={`Delete ${g.title}`} onClick={() => remove(g)}><Icon name="trash" size={16} /></button>}
                  <button type="button" className={`ka-goals__check ${g.done ? 'is-done' : ''}`} aria-pressed={g.done} aria-label={`${g.done ? 'Mark not done' : 'Mark done'}: ${g.title}`} disabled={!canEdit(g)} onClick={() => toggle(g)}><Icon name="check" size={16} /></button>
                </li>
              ))}
            </ul>
          ) : <p className="ka-muted ka-perf__center">No goals for {slot} yet. <button type="button" className="ka-link" onClick={openAdd}>Add one</button></p>}
          <p className="ka-localnote">Goals are saved in this browser until the KPILY API supports them.</p>
        </section>
      </div>

      <Modal open={adding} title="New Goal" onClose={() => setAdding(false)} width={760}>
        <form className="ka-goalform" onSubmit={add}>
          <div>
            <label className="ka-field">Goal title<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Decrease response time by 7%" required /></label>
            <label className="ka-field">Who is the goal for?<select value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })}>
              <option value={me}>Me</option>
              {isLead && members.filter((m) => m.email !== me).map((m) => <option key={m.id} value={m.email}>{m.fullname}</option>)}
            </select></label>
            <div className="ka-goalform__when">
              <span>Add to Goals:</span>
              <select aria-label="Period" value={draft.period} onChange={(e) => { const p = e.target.value as GoalPeriod; setDraft({ ...draft, period: p, slot: currentSlot(p) }) }}>
                {PERIODS.map(([p, , label]) => <option key={p} value={p}>{label}</option>)}
              </select>
              <select aria-label="When" value={draft.slot} onChange={(e) => setDraft({ ...draft, slot: e.target.value })}>
                {slotsFor(draft.period).map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <label className="ka-field">Goal details<textarea rows={6} value={draft.details} onChange={(e) => setDraft({ ...draft, details: e.target.value })} /></label>
          </div>
          <Evidence files={draft.files} links={draft.links} onChange={(v) => setDraft({ ...draft, ...v })} />
          {error && <p role="alert" className="ka-error">{error}</p>}
          <div className="ka-actions ka-goalform__actions">
            <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setAdding(false)}>Cancel</button>
            <button type="submit" className="ka-btn ka-btn--lg">Done</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!added} title="New Goal Added!" onClose={() => setAdded('')} width={420}>
        <div className="ka-done ka-done--modal">
          <span className="ka-done__icon" aria-hidden="true"><Icon name="check" size={36} /></span>
          <p>“{added}” is on your goals list.</p>
          <button type="button" className="ka-btn" onClick={() => setAdded('')}>Great</button>
        </div>
      </Modal>
    </div>
  )
}
