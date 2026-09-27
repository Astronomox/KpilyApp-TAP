'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Avatar from '@/components/app/Avatar'
import { Gauge, grade } from '@/components/app/Charts'
import Icon from '@/components/app/Icon'
import Modal from '@/components/app/Modal'
import { useProfile } from '@/components/app/ProfileContext'
import {
  API_BASE, clearSession, endSession, getActiveSessions, getDashboard, getSelf, getTasks, getTeams, updateProfile, uploadProfileImage,
  type Dashboard, type Task, type Team,
} from '@/lib/kpily'
import { roleLabel } from '@/lib/nav'
import { check, profileFormSchema } from '@/lib/schemas'
import '@/styles/Overview.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const photoUrl = (alias: unknown) => (typeof alias === 'string' && alias ? `${API_BASE}/v1/file/get/${alias}` : null)

function PointsChart({ points }: { points: Dashboard['pointsThisYear'] }) {
  const values = MONTHS.map((_, i) => points.find((p) => p.month === i + 1)?.value ?? 0)
  const total = values.reduce((a, b) => a + b, 0)
  const max = Math.max(...values, 1)
  return (
    <figure className="ka-points">
      <figcaption>Total Team Point %</figcaption>
      <div className="ka-points__plot" role="img" aria-label={`Points earned this year by month: ${MONTHS.map((m, i) => `${m} ${values[i]}`).join(', ')}`}>
        {values.map((v, i) => (
          <div key={MONTHS[i]} className="ka-points__col" title={`${MONTHS[i]}: ${v} points (${total ? Math.round((v / total) * 100) : 0}%)`}>
            <span className="ka-points__val">{v ? `${Math.round((v / total) * 100)}%` : ''}</span>
            <span className="ka-points__bar" style={{ height: `${(v / max) * 100}%` }} />
            <span className="ka-points__m">{MONTHS[i]}</span>
          </div>
        ))}
      </div>
    </figure>
  )
}

export default function AccountOverview() {
  const router = useRouter()
  const { profile, setProfile } = useProfile()
  const [dash, setDash] = useState<Dashboard | null>(null)
  const [teams, setTeams] = useState<Team[] | null>(null)
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [editing, setEditing] = useState(false)
  const [confirmOut, setConfirmOut] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const file = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getDashboard().then(setDash).catch(() => {})
    getTeams().then(setTeams).catch(() => setTeams([]))
    getTasks().then(setTasks).catch(() => setTasks([]))
  }, [])

  const myTeam = teams?.find((t) => t.id === profile?.teamID || t.id === profile?.team)
  const done = tasks?.filter((t) => t.status === 3).length ?? 0
  const pct = tasks?.length ? (done / tasks.length) * 100 : 0
  const picture = photoUrl(profile?.profile)

  async function refresh() {
    const me = await getSelf()
    if (profile) setProfile({ ...profile, ...me })
  }

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setBusy(true); setError('')
    try { await uploadProfileImage(f); await refresh() } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  async function saveInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true); setError('')
    try {
      await updateProfile(check(profileFormSchema, { fullname: String(f.get('fullname')), phone: String(f.get('phone')).trim(), gender: String(f.get('gender')) }))
      await refresh()
      setEditing(false)
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  async function logoutEverywhere() {
    setBusy(true); setError('')
    try {
      const sessions = await getActiveSessions()
      await Promise.allSettled(sessions.filter((s) => s.active !== false).map((s) => endSession(s.id)))
      clearSession()
      router.replace('/login')
    } catch (err) { setError(err.message); setBusy(false) }
  }

  return (
    <div className="ka-overview">
      <section className="ka-card ka-ov-profile">
        <Avatar name={profile?.fullname} src={picture} size={160} />
        <h1>{profile?.fullname}</h1>
        <p>{roleLabel(profile?.privilege)}</p>
        <p className="ka-ov-profile__report">REPORTING TO: {myTeam?.teamLeader && myTeam.teamLeader !== profile?.email ? myTeam.teamLeader : ''}</p>
      </section>

      <section className="ka-card ka-ov-perf">
        <div className="ka-card__head"><h2>Performance Data</h2><Link className="ka-link" href="/dashboard/performance-data/performance-data">See all</Link></div>
        {dash ? <PointsChart points={dash.pointsThisYear || []} /> : <p className="ka-muted">Loading…</p>}
      </section>

      <section className="ka-card ka-ov-settings">
        <div className="ka-card__head"><h2>Settings</h2><Link href="/dashboard/settings" aria-label="All settings" className="ka-iconbtn"><Icon name="settings" size={22} gradient /></Link></div>
        {error && <p role="alert" className="ka-error">{error}</p>}
        <button type="button" className="ka-ov-row" onClick={() => file.current?.click()} disabled={busy}>
          <span><strong>Photo</strong><Avatar name={profile?.fullname} src={picture} size={48} /></span><Icon name="chevron" size={18} className="ka-flip" />
        </button>
        <input ref={file} type="file" accept="image/*" hidden onChange={onPhoto} />
        <button type="button" className="ka-ov-row" onClick={() => setEditing(true)}>
          <span><strong>Personal Info</strong>Email: {profile?.email}<br />Preferred Name: {profile?.fullname}</span><Icon name="chevron" size={18} className="ka-flip" />
        </button>
        <Link className="ka-ov-row" href="/change-password">
          <span><strong>Password</strong>Set a new password</span><Icon name="chevron" size={18} className="ka-flip" />
        </Link>
        <button type="button" className="ka-ov-row" onClick={() => setConfirmOut(true)}>
          <span><strong>Log out off all devices</strong>Log out</span><Icon name="chevron" size={18} className="ka-flip" />
        </button>
      </section>

      <section className="ka-card ka-ov-teams">
        <div className="ka-card__head"><h2>Teams</h2><Link className="ka-link" href="/dashboard/team">See all</Link></div>
        {teams === null ? <p className="ka-muted">Loading…</p> : !teams.length ? <p className="ka-muted">No teams yet.</p> : (
          <ul className="ka-ov-teamlist">
            {teams.slice(0, 5).map((t) => <li key={t.id}><span className="ka-dot" style={{ background: t.color || '#106190' }} />{t.teamName}</li>)}
          </ul>
        )}
      </section>

      <section className="ka-card ka-ov-progress">
        <div className="ka-card__head"><h2 className="ka-ov-progress__title">Progress</h2><span className="ka-ov-grade" aria-label={`Grade ${grade(pct)}`}>{grade(pct)}</span></div>
        <Gauge pct={pct} />
      </section>

      <Modal open={editing} title="Personal Info" onClose={() => setEditing(false)}>
        <form onSubmit={saveInfo}>
          <label className="ka-field">Full name<input name="fullname" required defaultValue={profile?.fullname} /></label>
          <label className="ka-field">Email<input value={profile?.email || ''} disabled /></label>
          <div className="ka-row2">
            <label className="ka-field">Phone<input name="phone" type="tel" defaultValue={String(profile?.phone ?? '')} /></label>
            <label className="ka-field">Gender
              <select name="gender" defaultValue={profile?.gender || 'Male'}><option>Male</option><option>Female</option></select>
            </label>
          </div>
          {error && <p role="alert" className="ka-error">{error}</p>}
          <div className="ka-actions">
            <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setEditing(false)}>Cancel</button>
            <button type="submit" className="ka-btn" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={confirmOut} title="Log out off all devices" onClose={() => setConfirmOut(false)} width={420}>
        <p>You will be signed out everywhere, including this browser.</p>
        {error && <p role="alert" className="ka-error">{error}</p>}
        <div className="ka-actions">
          <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setConfirmOut(false)}>Cancel</button>
          <button type="button" className="ka-btn ka-btn--danger" disabled={busy} onClick={logoutEverywhere}>{busy ? 'Logging out…' : 'Log out'}</button>
        </div>
      </Modal>
    </div>
  )
}
