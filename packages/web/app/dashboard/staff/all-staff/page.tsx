'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Avatar from '@/components/app/Avatar'
import EmptyState from '@/components/app/EmptyState'
import Icon from '@/components/app/Icon'
import Modal from '@/components/app/Modal'
import { useProfile } from '@/components/app/ProfileContext'
import { changeUserPrivilege, changeUserStatus, getMembers, getTeams, inviteUser, type Member, type Organization, type Team } from '@/lib/kpily'
import { ROLE, roleLabel } from '@/lib/nav'
import { inviteSchema } from '@/lib/schemas'
import '@/styles/People.css'

const STATUS: Record<number, [string, string]> = { 1: ['Active', 'active'], 0: ['Pending', 'pending'], [-1]: ['Archived', 'archived'] }
const title = (s?: string) => (s || '').replace(/\b\w/g, (c) => c.toUpperCase())
type Filters = { status: string; team: string; privilege: string }

function csv(rows: (string | number)[][]) {
  return rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n')
}

export default function AllStaff() {
  const { profile } = useProfile()
  const [members, setMembers] = useState<Member[] | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [sortDir, setSortDir] = useState<1 | -1>(1)
  const [filters, setFilters] = useState<Filters>({ status: '', team: '', privilege: '' })
  const [showFilter, setShowFilter] = useState(false)
  const [perPage, setPerPage] = useState(5)
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [inviting, setInviting] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [removing, setRemoving] = useState<Member | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const mine = profile?.privilege ?? 30
  const org = profile?.organization as Organization | undefined
  const location = [title(org?.state), title(org?.country)].filter(Boolean).join(', ') || ''
  const roles = Object.entries(ROLE).map(([k, v]) => [Number(k), v] as const).filter(([k]) => k <= mine && k !== 200).sort((a, b) => b[0] - a[0])

  const load = useCallback(() => {
    getMembers().then(setMembers).catch((e) => { setError(e instanceof Error ? e.message : String(e)); setMembers([]) })
    getTeams().then(setTeams).catch((e) => { setError(e instanceof Error ? e.message : String(e)) })
  }, [])
  useEffect(load, [load])

  const total = useMemo(() => (members ?? []).reduce((a, m) => a + (m.point || 0), 0), [members])
  const teamOf = (id?: string | null) => teams.find((t) => t.id === id)
  const rows = useMemo(() => (members ?? [])
    .filter((m) => m.status !== -2)
    .filter((m) => (filters.status === '' || String(m.status) === filters.status) && (!filters.team || m.team === filters.team) && (!filters.privilege || String(m.privilege) === filters.privilege))
    .sort((a, b) => a.fullname.localeCompare(b.fullname) * sortDir), [members, filters, sortDir])
  const pages = Math.max(1, Math.ceil(rows.length / perPage))
  const current = Math.min(page, pages - 1)
  const visible = rows.slice(current * perPage, current * perPage + perPage)
  const allOn = visible.length > 0 && visible.every((m) => selected.includes(m.id))
  const pct = (m: Member) => (total ? Math.round((m.point / total) * 100) : 0)

  function exportCsv() {
    const data = [['Name', 'Email', 'Points', 'Point %', 'Status', 'Team', 'Privilege', 'Role', 'Manager', 'Location'],
      ...rows.map((m) => [m.fullname, m.email, m.point, pct(m), STATUS[m.status]?.[0] ?? m.status, teamOf(m.team)?.teamName ?? '', roleLabel(m.privilege), m.designation ?? '', teamOf(m.team)?.teamLeader ?? '', location])]
    const url = URL.createObjectURL(new Blob([csv(data)], { type: 'text/csv' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: 'kpily-staff.csv' })
    a.click(); URL.revokeObjectURL(url)
  }

  async function run(fn: () => Promise<unknown>, done: () => void) {
    setBusy(true); setError('')
    try { await fn(); done(); load() } catch (e) { setError(e instanceof Error ? e.message : String(e)) } finally { setBusy(false) }
  }

  function submitInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const valid = inviteSchema.safeParse({ fullname: String(f.get('fullname')), email: String(f.get('email')).trim(), team: String(f.get('team')) || undefined, privilege: Number(f.get('privilege')), designation: String(f.get('designation')).trim() || undefined })
    if (!valid.success) { setError(valid.error.issues[0].message); return }
    run(() => inviteUser(valid.data), () => setInviting(false))
  }

  function submitEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editing) return
    const f = new FormData(e.currentTarget)
    const status = Number(f.get('status'))
    run(async () => {
      await changeUserPrivilege({ username: editing.email, team: String(f.get('team')) || undefined, privilege: Number(f.get('privilege')), designation: String(f.get('designation')).trim() || undefined })
      if (status !== editing.status) await changeUserStatus(editing.email, status)
    }, () => setEditing(null))
  }

  const teamSelect = (value?: string | null) => (
    <select name="team" defaultValue={value ?? ''}><option value="">No team</option>{teams.map((t) => <option key={t.id} value={t.id}>{t.teamName}</option>)}</select>
  )
  const roleSelect = (value?: number) => (
    <select name="privilege" defaultValue={value ?? 30}>{roles.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
  )

  return (
    <div className="ka-people ka-staff">
      <div className="ka-pagehead">
        <h1>All Staff</h1>
        <div className="ka-pagehead__actions">
          <button type="button" className="ka-btn" onClick={() => { setError(''); setInviting(true) }}><Icon name="plus" size={16} />Add New</button>
          <button type="button" className="ka-btn" aria-expanded={showFilter} onClick={() => setShowFilter(!showFilter)}><Icon name="filter" size={16} />Filter</button>
          <button type="button" className="ka-btn" onClick={exportCsv} disabled={!rows.length}><Icon name="download" size={16} />Export</button>
        </div>
      </div>

      {showFilter && (
        <div className="ka-filterbar">
          <label className="ka-field">Status<select value={filters.status} onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(0) }}><option value="">All</option><option value="1">Active</option><option value="0">Pending</option><option value="-1">Archived</option></select></label>
          <label className="ka-field">Team<select value={filters.team} onChange={(e) => { setFilters({ ...filters, team: e.target.value }); setPage(0) }}><option value="">All</option>{teams.map((t) => <option key={t.id} value={t.id}>{t.teamName}</option>)}</select></label>
          <label className="ka-field">Privilege<select value={filters.privilege} onChange={(e) => { setFilters({ ...filters, privilege: e.target.value }); setPage(0) }}><option value="">All</option>{Object.entries(ROLE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
          <button type="button" className="ka-link" onClick={() => setFilters({ status: '', team: '', privilege: '' })}>Clear</button>
        </div>
      )}

      {error && !inviting && !editing && !removing && <p role="alert" className="ka-error">{error}</p>}

      <section className="ka-card ka-grid">
        <div className="ka-tablewrap ka-tablewrap--flat">
          <table className="ka-table ka-table--grey">
            <thead>
              <tr>
                <th className="ka-table__check"><input type="checkbox" aria-label="Select all staff on this page" checked={allOn} onChange={() => setSelected(allOn ? [] : visible.map((m) => m.id))} /></th>
                <th aria-sort={sortDir === 1 ? 'ascending' : 'descending'}><button type="button" className="ka-sorthead" onClick={() => setSortDir(sortDir === 1 ? -1 : 1)}>Team Member <Icon name="up" size={16} className={sortDir === 1 ? '' : 'ka-flip'} /></button></th>
                <th>Point%</th><th>Status</th><th>Team</th><th>Privilege</th><th>Role</th><th>Manager</th><th>Location</th><th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {members === null ? <tr><td colSpan={10} className="ka-table__empty">Loading…</td></tr>
                : !visible.length ? <tr><td colSpan={10}><EmptyState /></td></tr>
                : visible.map((m) => {
                  const [label, tone] = STATUS[m.status] ?? ['Unknown', 'archived']
                  const team = teamOf(m.team)
                  const canEdit = m.email !== profile?.email && m.privilege <= mine
                  return (
                    <tr key={m.id}>
                      <td className="ka-table__check"><input type="checkbox" aria-label={`Select ${m.fullname}`} checked={selected.includes(m.id)} onChange={() => setSelected(selected.includes(m.id) ? selected.filter((x) => x !== m.id) : [...selected, m.id])} /></td>
                      <td><span className="ka-staffcell"><Avatar name={m.fullname} src={null} size={40} /><div>{m.fullname}<small>{m.email}</small></div></span></td>
                      <td>{pct(m)}</td>
                      <td><span className={`ka-badge ka-badge--${tone}`}>• {label}</span></td>
                      <td>{team?.teamName ?? ''}</td>
                      <td><span className="ka-badge ka-badge--role">{roleLabel(m.privilege)}</span></td>
                      <td>{m.designation ?? ''}</td>
                      <td>{team?.teamLeader && team.teamLeader !== m.email ? team.teamLeader : ''}</td>
                      <td>{location}</td>
                      <td className="ka-nowrap">
                        <button type="button" className="ka-sq ka-sq--edit" aria-label={`Edit ${m.fullname}`} disabled={!canEdit} onClick={() => { setError(''); setEditing(m) }}><Icon name="edit" size={16} /></button>
                        <button type="button" className="ka-sq ka-sq--del" aria-label={`Remove ${m.fullname}`} disabled={!canEdit} onClick={() => { setError(''); setRemoving(m) }}><Icon name="close" size={16} /></button>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
        <div className="ka-pager ka-pager--card">
          <span>Showing {rows.length ? `${current * perPage + 1} to ${current * perPage + visible.length} of ${rows.length}` : 0} results</span>
          <label>Rows per page:<select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0) }}>{[5, 10, 20, 50].map((n) => <option key={n}>{n}</option>)}</select></label>
          <div className="ka-pager__btns">
            <button type="button" aria-label="Previous page" disabled={current === 0} onClick={() => setPage(current - 1)}>‹</button>
            <span className="ka-pager__n">{current + 1}</span>
            <button type="button" aria-label="Next page" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>›</button>
          </div>
        </div>
      </section>

      <Modal open={inviting} title="Add New Staff" onClose={() => setInviting(false)}>
        <form onSubmit={submitInvite}>
          <div className="ka-row2">
            <label className="ka-field">Full name<input name="fullname" required /></label>
            <label className="ka-field">Work email<input name="email" type="email" required /></label>
            <label className="ka-field">Team{teamSelect()}</label>
            <label className="ka-field">Privilege{roleSelect()}</label>
          </div>
          <label className="ka-field">Role / designation<input name="designation" placeholder="e.g. Accounting Lead" /></label>
          <p className="ka-muted">An invitation link is emailed to them to finish setting up their account.</p>
          {error && <p role="alert" className="ka-error">{error}</p>}
          <div className="ka-actions">
            <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setInviting(false)}>Cancel</button>
            <button type="submit" className="ka-btn" disabled={busy}>{busy ? 'Sending…' : 'Send invite'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!editing} title={`Edit ${editing?.fullname ?? ''}`} onClose={() => setEditing(null)}>
        {editing && (
          <form onSubmit={submitEdit} key={editing.id}>
            <div className="ka-row2">
              <label className="ka-field">Team{teamSelect(editing.team)}</label>
              <label className="ka-field">Privilege{roleSelect(editing.privilege)}</label>
              <label className="ka-field">Role / designation<input name="designation" defaultValue={editing.designation ?? ''} /></label>
              <label className="ka-field">Status<select name="status" defaultValue={editing.status}><option value={1}>Active</option><option value={0}>Pending</option><option value={-1}>Archived</option></select></label>
            </div>
            {error && <p role="alert" className="ka-error">{error}</p>}
            <div className="ka-actions">
              <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="ka-btn" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!removing} title="Remove staff member" onClose={() => setRemoving(null)} width={440}>
        <p>Remove {removing?.fullname} ({removing?.email}) from your organisation? They will lose access to KPILY.</p>
        {error && <p role="alert" className="ka-error">{error}</p>}
        <div className="ka-actions">
          <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setRemoving(null)}>Cancel</button>
          <button type="button" className="ka-btn ka-btn--danger" disabled={busy} onClick={() => removing && run(() => changeUserStatus(removing.email, -2), () => setRemoving(null))}>{busy ? 'Removing…' : 'Remove'}</button>
        </div>
      </Modal>
    </div>
  )
}
