'use client'

import { useEffect, useMemo, useState } from 'react'
import { Gauge, StatCard, grade } from '@/components/app/Charts'
import Icon from '@/components/app/Icon'
import Leaderboard from '@/components/app/Leaderboard'
import { useProfile } from '@/components/app/ProfileContext'
import { dueMs, getDashboard, getMembers, getTasks, type Dashboard, type Member, type Task } from '@/lib/kpily'
import '@/styles/Performance.css'

const TIPS = [
  'Be humble. Leaders who are humble share the success of the team with other team members.',
  'Give feedback early. Small, timely notes beat one big review at the end of the quarter.',
  'Celebrate progress, not just results. Recognition keeps momentum going.',
  'Break big goals into weekly tasks so progress is visible to everyone.',
  'Ask your team what is blocking them — then remove one blocker today.',
  'Clear expectations make great performance possible. Write them down.',
  'Listen more than you speak in one-on-ones.',
]
const quarterOf = (d: Date) => Math.floor(d.getMonth() / 3)

function Meter({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="ka-meter">
      <div><span>{label}</span><span>{value}/{max}</span></div>
      <progress value={value} max={max || 1} aria-label={`${label}: ${value} of ${max}`} />
    </div>
  )
}

export default function Scorecard() {
  const { profile } = useProfile()
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [members, setMembers] = useState<Member[] | null>(null)
  const [dash, setDash] = useState<Dashboard | null>(null)
  const [who, setWho] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [tip] = useState(() => TIPS[Math.floor(Date.now() / 864e5) % TIPS.length])
  const [now] = useState(() => new Date())
  const isLead = (profile?.privilege ?? 0) >= 40
  const email = who || profile?.email || ''
  const person = members?.find((m) => m.email === email)

  useEffect(() => {
    getTasks().then(setTasks).catch(() => setTasks([]))
    getMembers().then(setMembers).catch(() => setMembers([]))
    getDashboard().then(setDash).catch(() => {})
  }, [])

  const mine = useMemo(() => (tasks ?? []).filter((t) => t.assignee === email), [tasks, email])
  const done = mine.filter((t) => t.status === 3)
  const open = mine.filter((t) => t.status !== 3)
  const pct = mine.length ? (done.length / mine.length) * 100 : 0
  const q = quarterOf(now)
  const inQuarter = (t: Task, year: number, quarter: number) => { const d = new Date(dueMs(t)); return d.getFullYear() === year && quarterOf(d) === quarter }
  const thisQ = mine.filter((t) => inQuarter(t, now.getFullYear(), q))
  const lastQ = mine.filter((t) => (q ? inQuarter(t, now.getFullYear(), q - 1) : inQuarter(t, now.getFullYear() - 1, 3)))
  const score = (ts: Task[]) => ts.reduce((a, t) => a + t.finalReward, 0)
  const change = score(lastQ) ? Math.round(((score(thisQ) - score(lastQ)) / score(lastQ)) * 100) : score(thisQ) ? 100 : 0

  return (
    <div className="ka-score">
      <div className="ka-pagehead">
        <div><h1>{who ? `${person?.fullname ?? who}’s Scorecard` : 'Employee Scorecard'}</h1><p>Current score to date</p></div>
        {isLead && (
          <div className="ka-pop ka-pop--end">
            <button type="button" className="ka-btn" aria-expanded={filterOpen} onClick={() => setFilterOpen(!filterOpen)}><Icon name="filter" size={16} />Filter</button>
            {filterOpen && (
              <div className="ka-pop__menu ka-perf__filter">
                <label className="ka-field">Team member
                  <select value={who} onChange={(e) => { setWho(e.target.value); setFilterOpen(false) }}>
                    <option value="">Me</option>
                    {(members ?? []).filter((m) => m.email !== profile?.email).map((m) => <option key={m.id} value={m.email}>{m.fullname}</option>)}
                  </select>
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ka-score__row">
        <section className="ka-card ka-score__progress">
          <div className="ka-card__head"><h2>Progress</h2><span className="ka-ov-grade" aria-label={`Grade ${grade(pct)}`}>{grade(pct)}</span></div>
          <Gauge pct={pct} />
        </section>
        <StatCard title="Overall Task Completion Rate" rate={dash?.taskCompletionRate} />
        <div className="ka-score__side">
          <section className="ka-card ka-score__trend">
            <Icon name="up" size={72} className={change < 0 ? 'ka-flip' : ''} />
            <div><strong>{change >= 0 ? 'Great Job!' : 'Keep going!'}</strong><p>You’re {change >= 0 ? 'up' : 'down'} {Math.abs(change)}% vs. this time last quarter!</p></div>
          </section>
          <section className="ka-card ka-score__tip"><h2>Tip of the day</h2><p>“{tip}”</p></section>
        </div>
      </div>

      <div className="ka-score__two">
        <Leaderboard members={members} seeAll="/dashboard/performance-data/performance-data" />
        <section className="ka-card">
          <h2>Your Scorecard</h2>
          {tasks === null ? <p className="ka-muted">Loading…</p> : (
            <div className="ka-score__bars">
              <h3>Completed Task Points</h3>
              {done.length ? done.map((t) => <Meter key={t.id} label={t.name} value={t.finalReward} max={t.reward} />) : <p className="ka-muted">No completed tasks yet.</p>}
              <h3>Incomplete Tasks</h3>
              {open.length ? open.map((t) => <Meter key={t.id} label={t.name} value={t.finalReward} max={t.reward} />) : <p className="ka-muted">Nothing outstanding.</p>}
              <Meter label={`Q${q + 1} Score (In Progress)`} value={score(thisQ)} max={thisQ.reduce((a, t) => a + t.reward, 0)} />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
