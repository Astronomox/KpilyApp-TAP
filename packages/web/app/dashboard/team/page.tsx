'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import Avatar from '@/components/app/Avatar'
import EmptyState from '@/components/app/EmptyState'
import Icon from '@/components/app/Icon'
import Leaderboard from '@/components/app/Leaderboard'
import Modal from '@/components/app/Modal'
import { useProfile } from '@/components/app/ProfileContext'
import { createTeam, getMembers, getTeams, updateTeam, type Member, type Team } from '@/lib/kpily'
import { teamSchema } from '@/lib/schemas'
import '@/styles/People.css'

const COLORS = ['#106190', '#1e7a5a', '#793079', '#e8590c', '#e5395b', '#f2b705']

function TeamForm({ open, team, members, onClose, onSaved }: { open: boolean; team: Team | null; members: Member[]; onClose: () => void; onSaved: () => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const input = { teamName: String(f.get('teamName')).trim(), teamLeader: String(f.get('teamLeader')), reportsTo: String(f.get('reportsTo')), color: String(f.get('color')) }
    const valid = teamSchema.safeParse(input)
    if (!valid.success) { setError(valid.error.issues[0].message); return }
    setBusy(true); setError('')
    try { await (team ? updateTeam(team.id, input) : createTeam(input)); onSaved(); onClose() } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  const people = (name: string, value?: string) => (
    <select name={name} required defaultValue={value ?? ''}>
      <option value="" disabled>Select a team member</option>
      {value && !members.some((m) => m.email === value) && <option value={value}>{value}</option>}
      {members.map((m) => <option key={m.id} value={m.email}>{m.fullname} ({m.email})</option>)}
    </select>
  )

  return (
    <Modal open={open} title={team ? 'Edit Team' : 'Add Team'} onClose={onClose}>
      <form onSubmit={submit} key={team?.id ?? 'new'}>
        <label className="ka-field">Team name<input name="teamName" required defaultValue={team?.teamName} placeholder="e.g. Accounting" /></label>
        <label className="ka-field">Team leader{people('teamLeader', team?.teamLeader)}</label>
        <label className="ka-field">Reports to{people('reportsTo', team?.reportsTo)}</label>
        <fieldset className="ka-field ka-colors">
          <legend>Colour</legend>
          {COLORS.map((c, i) => (
            <label key={c} style={{ background: c }}><input type="radio" name="color" value={c} defaultChecked={team?.color ? team.color === c : i === 0} aria-label={c} /></label>
          ))}
        </fieldset>
        {error && <p role="alert" className="ka-error">{error}</p>}
        <div className="ka-actions">
          <button type="button" className="ka-btn ka-btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="ka-btn" disabled={busy}>{busy ? 'Saving…' : team ? 'Save changes' : 'Add Team'}</button>
        </div>
      </form>
    </Modal>
  )
}

export default function TeamPage() {
  const { profile } = useProfile()
  const [members, setMembers] = useState<Member[] | null>(null)
  const [teams, setTeams] = useState<Team[] | null>(null)
  const [form, setForm] = useState<{ open: boolean; team: Team | null }>({ open: false, team: null })
  const [perPage, setPerPage] = useState(5)
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const canManage = (profile?.privilege ?? 0) >= 50

  const load = useCallback(() => {
    getMembers().then(setMembers).catch(() => setMembers([]))
    getTeams().then(setTeams).catch(() => setTeams([]))
  }, [])
  useEffect(load, [load])

  const name = (email?: string) => members?.find((m) => m.email === email)?.fullname || email || ''
  const list = teams ?? []
  const pages = Math.max(1, Math.ceil(list.length / perPage))
  const current = Math.min(page, pages - 1)
  const rows = list.slice(current * perPage, current * perPage + perPage)
  const allOn = rows.length > 0 && rows.every((t) => selected.includes(t.id))

  return (
    <div className="ka-people">
      <div className="ka-pagehead"><h1>Team</h1></div>

      <div className="ka-people__top">
        <section className="ka-card ka-board">
          <div className="ka-card__head"><h2>Team Members</h2><Link className="ka-link" href="/dashboard/staff/all-staff">See all</Link></div>
          {members === null ? <p className="ka-muted">Loading…</p> : !members.length ? <p className="ka-muted">No members yet.</p> : (
            <ul className="ka-board__list ka-board__list--plain">
              {members.slice(0, 5).map((m) => <li key={m.id}><Avatar name={m.fullname} src={null} size={32} /><span>{m.fullname}</span></li>)}
            </ul>
          )}
        </section>
        <Leaderboard members={members} seeAll="/dashboard/performance-data/performance-data" />
      </div>

      {canManage && <div className="ka-people__bar"><button type="button" className="ka-btn" onClick={() => setForm({ open: true, team: null })}><Icon name="plus" size={16} />Add Team</button></div>}

      <section className="ka-card ka-grid">
        <div className="ka-tablewrap ka-tablewrap--flat">
          <table className="ka-table ka-table--grey">
            <thead>
              <tr>
                <th className="ka-table__check"><input type="checkbox" aria-label="Select all teams on this page" checked={allOn} onChange={() => setSelected(allOn ? [] : rows.map((t) => t.id))} /></th>
                <th>Team Name</th><th>Team Leader</th><th>Reports To</th>{canManage && <th>Edit</th>}
              </tr>
            </thead>
            <tbody>
              {teams === null ? <tr><td colSpan={5} className="ka-table__empty">Loading…</td></tr>
                : !rows.length ? <tr><td colSpan={5}><EmptyState /></td></tr>
                : rows.map((t) => (
                  <tr key={t.id}>
                    <td className="ka-table__check"><input type="checkbox" aria-label={`Select ${t.teamName}`} checked={selected.includes(t.id)} onChange={() => setSelected(selected.includes(t.id) ? selected.filter((x) => x !== t.id) : [...selected, t.id])} /></td>
                    <td><span className="ka-teamname"><span className="ka-dot" style={{ background: t.color || 'var(--ka-blue)' }} />{t.teamName}</span></td>
                    <td>{name(t.teamLeader)}</td>
                    <td>{name(t.reportsTo)}</td>
                    {canManage && <td><button type="button" className="ka-sq ka-sq--edit" aria-label={`Edit ${t.teamName}`} onClick={() => setForm({ open: true, team: t })}><Icon name="edit" size={16} /></button></td>}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="ka-pager ka-pager--card">
          <span>Showing {list.length ? `${current * perPage + 1} to ${current * perPage + rows.length} of ${list.length}` : 0} results</span>
          <label>Rows per page:<select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0) }}>{[5, 10, 20].map((n) => <option key={n}>{n}</option>)}</select></label>
          <div className="ka-pager__btns">
            <button type="button" aria-label="Previous page" disabled={current === 0} onClick={() => setPage(current - 1)}>‹</button>
            <button type="button" aria-label="Next page" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>›</button>
          </div>
        </div>
      </section>

      <TeamForm open={form.open} team={form.team} members={members ?? []} onClose={() => setForm({ open: false, team: null })} onSaved={load} />
    </div>
  )
}
