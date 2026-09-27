'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { BIMONTHS, BarChart, HBarChart, LineChart, Pie, Ring, StatCard } from '@/components/app/Charts'
import Icon from '@/components/app/Icon'
import Leaderboard from '@/components/app/Leaderboard'
import { dueMs, getDashboard, getMembers, getTasks, getTeams, type Dashboard, type Member, type Task, type Team } from '@/lib/kpily'
import '@/styles/Performance.css'

const GREEN = { dark: '#1a6b4f', mid: '#2fa37a', light: '#a3e8cd' }
const RING = ['#3f8fc6', '#7a3fb0', '#e0a800', '#1a6b4f', '#106190', '#e8590c']

export default function PerformanceData() {
  const [dash, setDash] = useState<Dashboard | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[] | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [team, setTeam] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    getDashboard().then(setDash).catch(() => {})
    getTasks().then(setTasks).catch(() => {})
    getMembers().then(setMembers).catch(() => setMembers([]))
    getTeams().then(setTeams).catch(() => {})
  }, [])

  const years = useMemo(() => [...new Set([new Date().getFullYear(), ...tasks.map((t) => new Date(dueMs(t)).getFullYear())])].sort((a, b) => b - a), [tasks])
  const scoped = useMemo(() => tasks.filter((t) => new Date(dueMs(t)).getFullYear() === year && (!team || t.teamID === team)), [tasks, year, team])
  const people = useMemo(() => (members ?? []).filter((m) => !team || m.team === team), [members, team])
  const bi = (t: Task) => Math.floor(new Date(dueMs(t)).getMonth() / 2)

  const annual = useMemo(() => {
    const s = (pred: (t: Task) => boolean) => BIMONTHS.map((_, i) => scoped.filter((t) => bi(t) === i && pred(t)).length)
    return [
      { label: 'Completed', color: GREEN.dark, values: s((t) => t.status === 3) },
      { label: 'WIP', color: GREEN.mid, values: s((t) => t.status === 1 || t.status === 2) },
      { label: 'Awaiting Approval', color: GREEN.light, values: s((t) => t.status === 4) },
    ]
  }, [scoped])
  const avgPoints = BIMONTHS.map((_, i) => { const ts = scoped.filter((t) => bi(t) === i); return ts.length ? Math.round(ts.reduce((a, t) => a + t.reward, 0) / ts.length) : 0 })
  const totalPoints = BIMONTHS.map((_, i) => year === new Date().getFullYear()
    ? (dash?.pointsThisYear ?? []).filter((p) => Math.floor((p.month - 1) / 2) === i).reduce((a, p) => a + p.value, 0)
    : scoped.filter((t) => bi(t) === i && t.status === 3).reduce((a, t) => a + t.finalReward, 0))
  const teamPoints = teams.map((t) => (members ?? []).filter((m) => m.team === t.id).reduce((a, m) => a + m.point, 0))
  const progress = dash?.teamProgress ?? []
  const teamRates = teams.map((t) => { const ts = scoped.filter((x) => x.teamID === t.id); return ts.length ? (ts.filter((x) => x.status === 3).length / ts.length) * 100 : 0 })
  const rankedTeams = teams.map((t, i) => ({ t, pts: teamPoints[i] })).sort((a, b) => b.pts - a.pts)
  const areas = [
    { label: 'Collaboration', value: dash?.feedBackRate.value ?? 0, color: '#4591bf' },
    { label: 'Tasks', value: dash?.taskCompletionRate.value ?? 0, color: '#0d4d73' },
    { label: 'Communication', value: dash?.responseRate.value ?? 0, color: '#a8cde0' },
  ]

  return (
    <div className="ka-perf">
      <div className="ka-pagehead">
        <h1>{year === new Date().getFullYear() ? 'Year to Date' : year} Performance Data</h1>
        <div className="ka-pop ka-pop--end">
          <button type="button" className="ka-btn" aria-expanded={filterOpen} onClick={() => setFilterOpen(!filterOpen)}><Icon name="filter" size={16} />Filter</button>
          {filterOpen && (
            <div className="ka-pop__menu ka-perf__filter">
              <label className="ka-field">Year<select value={year} onChange={(e) => setYear(Number(e.target.value))}>{years.map((y) => <option key={y}>{y}</option>)}</select></label>
              <label className="ka-field">Team<select value={team} onChange={(e) => setTeam(e.target.value)}><option value="">All teams</option>{teams.map((t) => <option key={t.id} value={t.id}>{t.teamName}</option>)}</select></label>
            </div>
          )}
        </div>
      </div>

      <div className="ka-perf__stats">
        <StatCard title="Overall Task Completion Rate" rate={dash?.taskCompletionRate} />
        <StatCard title="Overall Positive Feedback" rate={dash?.positiveFeedback} />
        <StatCard title="Overall Response Rate" rate={dash?.responseRate} />
        <section className="ka-card ka-statcard"><h2>Overall Achievement Areas</h2><Pie slices={areas} label="Achievement areas" /></section>
      </div>

      <div className="ka-perf__two">
        <section className="ka-card"><h2 className="ka-perf__center">Total Team Point</h2><BarChart labels={BIMONTHS} series={[{ label: 'Points', color: GREEN.dark, values: totalPoints }]} label="Total team points" /></section>
        <section className="ka-card"><h2 className="ka-perf__center">Average Points Given</h2><LineChart labels={BIMONTHS} values={avgPoints} label="Average points given per task" /></section>
      </div>

      <div className="ka-perf__two">
        <section className="ka-card"><h2>Overall Team Progress</h2>
          {progress.length ? <HBarChart rows={progress.map((p) => p.teamName || 'No team')} label="Team progress"
            series={[{ label: 'Completed', color: GREEN.dark, values: progress.map((p) => p.completed) }, { label: 'WIP', color: GREEN.mid, values: progress.map((p) => p.workInProgress) }, { label: 'Awaiting Approval', color: GREEN.light, values: progress.map((p) => p.awaitingApproval) }]} />
            : <p className="ka-muted">No team progress yet.</p>}
        </section>
        <section className="ka-card"><h2>Points per Team</h2>
          {teams.length ? <BarChart labels={teams.map((t) => t.teamName)} series={[{ label: 'Points', color: '#7a3fb0', values: teamPoints }]} legend label="Points per team" /> : <p className="ka-muted">Create teams to compare their points.</p>}
        </section>
      </div>

      <div className="ka-perf__two">
        <section className="ka-card ka-board">
          <div className="ka-card__head"><h2>Team Leaderboard</h2></div>
          {!rankedTeams.length ? <p className="ka-muted">No teams yet.</p> : (
            <ol className="ka-board__list">
              {rankedTeams.slice(0, 5).map(({ t, pts }, i) => (
                <li key={t.id} className={i === 0 ? 'is-first' : ''}>
                  <span className="ka-board__rank"><strong>{i + 1}{['st', 'nd', 'rd'][i] ?? 'th'}</strong>{pts} PTS</span>
                  <span className="ka-dot" style={{ background: t.color || '#106190' }} /><span className="ka-grow">{t.teamName}</span>
                  <Link className="ka-btn ka-btn--sm" href="/dashboard/team">View</Link>
                </li>
              ))}
            </ol>
          )}
        </section>
        <Leaderboard members={people} seeAll="/dashboard/staff/all-staff" />
      </div>

      <div className="ka-perf__kpi">
        <section className="ka-card"><h2>Annual KPI</h2><BarChart labels={BIMONTHS} series={annual} label="Tasks by status" /></section>
        <section className="ka-card"><h2 className="ka-perf__center">Task Completion Rate per Team</h2>
          {teams.length ? <div className="ka-perf__rings">{teams.map((t, i) => <Ring key={t.id} pct={teamRates[i]} color={RING[i % RING.length]} label={t.teamName} />)}</div> : <p className="ka-muted ka-perf__center">No teams yet.</p>}
        </section>
      </div>
    </div>
  )
}
