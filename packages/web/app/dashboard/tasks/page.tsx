'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Avatar from '@/components/app/Avatar'
import Icon from '@/components/app/Icon'
import Modal from '@/components/app/Modal'
import TaskDetail from '@/components/app/TaskDetail'
import TaskFeed from '@/components/app/TaskFeed'
import TaskForm from '@/components/app/TaskForm'
import { RowMenu, StatusIcon, fmtDue, type TaskAction } from '@/components/app/TaskBits'
import { useProfile } from '@/components/app/ProfileContext'
import { TASK_STATUS, acceptTask, completeTask, deleteTask, dueMs, getTasks, reviewTask, searchTasks, submitTask, type Task } from '@/lib/kpily'
import { useLocalSetting } from '@/lib/useLocalSetting'
import '@/styles/Tasks.css'

type Col = 'name' | 'assignee' | 'createdBy' | 'point' | 'status' | 'due'
const COLS: [Col, string][] = [['name', 'Task'], ['assignee', 'Assignee'], ['createdBy', 'Assigned By'], ['point', 'Point'], ['status', 'Status'], ['due', 'Due Date']]
const CARD_ORDER = [0, 1, 2, 3, 4]
// Figma groups the five statuses into three feed tabs.
type Bucket = 'new' | 'updates' | 'approvals'
const BUCKETS: [Bucket, string][] = [['new', 'New Tasks'], ['updates', 'Task Updates'], ['approvals', 'Approvals']]
const inBucket = (t: Task, b: Bucket, me: string | undefined, canManage: boolean) =>
  b === 'new' ? t.status === 0 : b === 'updates' ? [1, 2, 4].includes(t.status) : t.status === 4 && (canManage || t.createdBy === me)
const sortVal = (t: Task, c: Col) => (c === 'point' ? t.finalReward : c === 'status' ? t.status : c === 'due' ? dueMs(t) : String(t[c]).toLowerCase())

export default function Tasks() {
  const { profile } = useProfile()
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [statuses, setStatuses] = useState<number[]>([])
  const [statusOpen, setStatusOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [hidden, setHidden] = useState<Col[]>([])
  const [sort, setSort] = useState<{ col: Col; dir: 1 | -1 }>({ col: 'due', dir: -1 })
  const [selected, setSelected] = useState<string[]>([])
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(0)
  const [form, setForm] = useState<{ open: boolean; task?: Task | null }>({ open: false })
  const [viewing, setViewing] = useState<Task | null>(null)
  const [pending, setPending] = useState<{ action: 'review' | 'complete' | 'delete'; task: Task } | null>(null)
  const [busy, setBusy] = useState(false)
  const canManage = (profile?.privilege ?? 0) >= 40
  const me = profile?.email
  const [mode, setMode] = useLocalSetting<'feed' | 'table'>('kpily.tasks.view', 'feed')
  const [bucket, setBucket] = useState<Bucket | null>(null)
  // Server-side keyword search (names and details); the local name filter still applies meanwhile.
  const [hits, setHits] = useState<{ q: string; ids: Set<string> } | null>(null)
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) return
    const id = setTimeout(() => { searchTasks(q).then((r) => setHits({ q, ids: new Set(r.map((t) => t.id)) })).catch(() => {}) }, 300)
    return () => clearTimeout(id)
  }, [query])

  const load = useCallback(() => { getTasks().then(setTasks).catch((e) => { setError(e instanceof Error ? e.message : String(e)); setTasks([]) }) }, [])
  useEffect(load, [load])

  const counts = useMemo(() => TASK_STATUS.map((_, i) => tasks?.filter((t) => t.status === i).length ?? 0), [tasks])
  const bucketCounts = useMemo(() => Object.fromEntries(BUCKETS.map(([b]) => [b, tasks?.filter((t) => inBucket(t, b, me, canManage)).length ?? 0])) as Record<Bucket, number>, [tasks, me, canManage])
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const serverHits = hits && hits.q.toLowerCase() === q ? hits.ids : null
    return (tasks ?? [])
      .filter((t) => (!q || t.name.toLowerCase().includes(q) || !!serverHits?.has(t.id)) && (!statuses.length || statuses.includes(t.status)))
      .sort((a, b) => { const x = sortVal(a, sort.col), y = sortVal(b, sort.col); return (x < y ? -1 : x > y ? 1 : 0) * sort.dir })
  }, [tasks, query, statuses, sort, hits])
  const feed = useMemo(() => rows
    .filter((t) => (!bucket || inBucket(t, bucket, me, canManage)))
    .sort((a, b) => Date.parse(b.dateCreated) - Date.parse(a.dateCreated) || b.dueDate - a.dueDate), [rows, bucket, me, canManage])
  const pages = Math.max(1, Math.ceil(rows.length / perPage))
  const current = Math.min(page, pages - 1)
  const visible = rows.slice(current * perPage, current * perPage + perPage)
  const show = (c: Col) => !hidden.includes(c)

  async function run(fn: () => Promise<unknown>) {
    setBusy(true); setError('')
    try { await fn(); setPending(null); load() } catch (e) { setError(e instanceof Error ? e.message : String(e)) } finally { setBusy(false) }
  }

  function onAction(a: TaskAction, t: Task) {
    if (a === 'view') setViewing(t)
    else if (a === 'edit') { setViewing(null); setForm({ open: true, task: t }) }
    else if (a === 'accept') run(() => acceptTask(t.id))
    else if (a === 'submit') run(() => submitTask(t.id))
    else { setViewing(null); setPending({ action: a, task: t }) }
  }

  function confirmPending(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!pending) return
    const f = new FormData(e.currentTarget)
    const { action, task } = pending
    run(() => action === 'delete' ? deleteTask(task.id) : action === 'complete' ? completeTask(task.id, Number(f.get('point'))) : reviewTask(task.id, String(f.get('message'))))
  }

  const allOnPage = visible.length > 0 && visible.every((t) => selected.includes(t.id))

  return (
    <div className="ka-tasks">
      <div className="ka-tasks__head">
        <h1>Tasks</h1>
        <div className="ka-seg ka-tasks__mode" role="group" aria-label="Layout">
          {(['feed', 'table'] as const).map((m) => <button key={m} type="button" aria-pressed={mode === m} className={mode === m ? 'is-on' : ''} onClick={() => setMode(m)}>{m === 'feed' ? 'Feed' : 'Table'}</button>)}
        </div>
        {canManage && <button type="button" className="ka-btn" onClick={() => setForm({ open: true, task: null })}>+ Create New Task</button>}
      </div>

      {mode === 'feed' ? (
        <section className="ka-card ka-taskfeed">
          <div className="ka-buckets" role="tablist" aria-label="Task groups">
            {BUCKETS.map(([b, label]) => (
              <button key={b} type="button" role="tab" aria-selected={bucket === b} className={`ka-bucket ka-bucket--${b} ${bucket === b ? 'is-on' : ''}`} onClick={() => setBucket(bucket === b ? null : b)}>
                <strong>{bucketCounts[b]}</strong>{label}
              </button>
            ))}
          </div>
          <div className="ka-taskfeed__search">
            <Icon name="search" size={22} />
            <input placeholder="Search tasks by name, keyword, team member, etc." aria-label="Search tasks" value={query} onChange={(e) => setQuery(e.target.value)} />
            {(query || bucket !== null) && <button type="button" className="ka-link" onClick={() => { setQuery(''); setBucket(null) }}>Reset</button>}
          </div>
          {error && <p role="alert" className="ka-error">{error}</p>}
          {tasks === null ? <p className="ka-table__empty">Loading…</p> : !feed.length ? <p className="ka-table__empty">No tasks here yet.</p>
            : <TaskFeed tasks={feed} me={me} canManage={canManage} onOpen={setViewing} onAction={onAction} />}
        </section>
      ) : (<>
      <div className="ka-tasks__stats">
        {CARD_ORDER.map((i) => (
          <button key={i} type="button" className={`ka-stat ${statuses.length === 1 && statuses[0] === i ? 'is-on' : ''}`} aria-pressed={statuses.length === 1 && statuses[0] === i}
            onClick={() => { setStatuses(statuses.length === 1 && statuses[0] === i ? [] : [i]); setPage(0) }}>
            <strong>{counts[i]}</strong>{TASK_STATUS[i]}
          </button>
        ))}
      </div>

      <section className="ka-card ka-tasks__table">
        <div className="ka-tasks__tools">
          <input className="ka-filter" placeholder="Filter tasks..." aria-label="Filter tasks" value={query} onChange={(e) => { setQuery(e.target.value); setPage(0) }} />
          <div className="ka-pop">
            <button type="button" className="ka-chip" aria-expanded={statusOpen} onClick={() => setStatusOpen(!statusOpen)}>
              <span className="ka-chip__plus">+</span>Status{statuses.length > 0 && <em>{statuses.length}</em>}
            </button>
            {statusOpen && (
              <div className="ka-pop__menu" onMouseLeave={() => setStatusOpen(false)}>
                {TASK_STATUS.map((s, i) => (
                  <label key={s}><input type="checkbox" checked={statuses.includes(i)} onChange={() => { setStatuses(statuses.includes(i) ? statuses.filter((x) => x !== i) : [...statuses, i]); setPage(0) }} />
                    <StatusIcon status={i} />{s}<span className="ka-pop__n">{counts[i]}</span></label>
                ))}
                {statuses.length > 0 && <button type="button" className="ka-pop__clear" onClick={() => setStatuses([])}>Clear filters</button>}
              </div>
            )}
          </div>
          {(query || statuses.length > 0) && <button type="button" className="ka-link" onClick={() => { setQuery(''); setStatuses([]) }}>Reset</button>}
          <div className="ka-pop ka-pop--end">
            <button type="button" className="ka-chip ka-chip--solid" aria-expanded={viewOpen} onClick={() => setViewOpen(!viewOpen)}>☰ View</button>
            {viewOpen && (
              <div className="ka-pop__menu" onMouseLeave={() => setViewOpen(false)}>
                <p className="ka-pop__title">Toggle columns</p>
                {COLS.filter(([c]) => c !== 'name').map(([c, label]) => (
                  <label key={c}><input type="checkbox" checked={show(c)} onChange={() => setHidden(show(c) ? [...hidden, c] : hidden.filter((x) => x !== c))} />{label}</label>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && <p role="alert" className="ka-error">{error}</p>}

        <div className="ka-tablewrap">
          <table className="ka-table">
            <thead>
              <tr>
                <th className="ka-table__check"><input type="checkbox" aria-label="Select all on this page" checked={allOnPage}
                  onChange={() => setSelected(allOnPage ? selected.filter((id) => !visible.some((t) => t.id === id)) : [...new Set([...selected, ...visible.map((t) => t.id)])])} /></th>
                {COLS.filter(([c]) => show(c)).map(([c, label]) => (
                  <th key={c} aria-sort={sort.col === c ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
                    <button type="button" onClick={() => setSort({ col: c, dir: sort.col === c ? (-sort.dir as 1 | -1) : 1 })}>{label}<span className="ka-sort" aria-hidden="true">{sort.col === c ? (sort.dir === 1 ? '▲' : '▼') : '⇅'}</span></button>
                  </th>
                ))}
                <th><span className="ka-sr">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {tasks === null ? <tr><td colSpan={2 + COLS.filter(([c]) => show(c)).length} className="ka-table__empty">Loading…</td></tr> : !visible.length ? <tr><td colSpan={2 + COLS.filter(([c]) => show(c)).length} className="ka-table__empty">No results.</td></tr> : visible.map((t) => (
                <tr key={t.id} className={selected.includes(t.id) ? 'is-selected' : ''}>
                  <td className="ka-table__check"><input type="checkbox" aria-label={`Select ${t.name}`} checked={selected.includes(t.id)} onChange={() => setSelected(selected.includes(t.id) ? selected.filter((x) => x !== t.id) : [...selected, t.id])} /></td>
                  {show('name') && <td><button type="button" className="ka-table__name" onClick={() => setViewing(t)}>{t.name}</button></td>}
                  {show('assignee') && <td><span className="ka-person"><Avatar name={t.assignee} size={40} />{t.assignee}</span></td>}
                  {show('createdBy') && <td><span className="ka-person"><Avatar name={t.createdBy} size={40} />{t.createdBy}</span></td>}
                  {show('point') && <td>{t.finalReward}/{t.reward}</td>}
                  {show('status') && <td><span className="ka-statuscell"><StatusIcon status={t.status} />{TASK_STATUS[t.status] ?? ''}</span></td>}
                  {show('due') && <td className="ka-nowrap">{fmtDue(t)}</td>}
                  <td><RowMenu task={t} me={me} canManage={canManage} onAction={onAction} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ka-pager">
          <span>{selected.length} of {rows.length} row(s) selected.</span>
          <label>Rows per page
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0) }}>{[10, 20, 30, 40, 50].map((n) => <option key={n}>{n}</option>)}</select>
          </label>
          <span>Page {current + 1} of {pages}</span>
          <div className="ka-pager__btns">
            <button type="button" aria-label="First page" disabled={current === 0} onClick={() => setPage(0)}>«</button>
            <button type="button" aria-label="Previous page" disabled={current === 0} onClick={() => setPage(current - 1)}>‹</button>
            <button type="button" aria-label="Next page" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>›</button>
            <button type="button" aria-label="Last page" disabled={current >= pages - 1} onClick={() => setPage(pages - 1)}>»</button>
          </div>
        </div>
      </section>
      </>)}

      <TaskForm open={form.open} task={form.task} onClose={() => setForm({ open: false })} onSaved={load} />

      <TaskDetail task={viewing} me={me} canManage={canManage} onClose={() => setViewing(null)} onAction={onAction} onChanged={load} />

      <Modal open={!!pending} title={pending?.action === 'delete' ? 'Delete task' : pending?.action === 'complete' ? 'Mark task complete' : 'Send back for review'} onClose={() => setPending(null)} width={460}>
        <form onSubmit={confirmPending}>
          {pending?.action === 'delete' && <p>Delete “{pending.task.name}”? This cannot be undone.</p>}
          {pending?.action === 'complete' && <label className="ka-field">Points awarded (max {pending.task.reward})<input name="point" type="number" min={0} max={pending.task.reward} required defaultValue={pending.task.reward} /></label>}
          {pending?.action === 'review' && <label className="ka-field">What needs to change?<textarea name="message" required /></label>}
          {error && <p role="alert" className="ka-error">{error}</p>}
          <div className="ka-actions">
            <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setPending(null)}>Cancel</button>
            <button type="submit" className={`ka-btn ${pending?.action === 'delete' ? 'ka-btn--danger' : ''}`} disabled={busy}>{busy ? 'Working…' : pending?.action === 'delete' ? 'Delete' : 'Confirm'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
