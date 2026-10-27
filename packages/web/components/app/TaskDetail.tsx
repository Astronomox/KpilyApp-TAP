'use client'

import { useCallback, useEffect, useState } from 'react'
import Avatar from './Avatar'
import Modal from './Modal'
import { StatusIcon, fmtDue, taskActions, timeAgo, type TaskAction } from './TaskBits'
import { TASK_STATUS, assignTask, getComments, searchUsers, submitComment, type Account, type Comment, type Task } from '@/lib/kpily'

// Task detail (Figma "Task Review", "Ask Question", "Add Contributor"): details, progress,
// the comment thread (the API's task chat) and adding contributors.

const STEPS: [number, string][] = [[0, 'Assigned'], [1, 'Accepted'], [4, 'Submitted'], [3, 'Completed']]
const reached = (status: number, step: number) => {
  const order = [0, 1, 2, 4, 3] // Reviewed (2) means it went back after being accepted
  return order.indexOf(status) >= order.indexOf(step)
}

/** Name to show for a comment's author; the API has returned both objects and plain usernames. */
function author(c: Comment) {
  const o = c.owner ?? c.createdBy ?? c.username
  if (o && typeof o === 'object') return String((o as { fullname?: string; username?: string }).fullname || (o as { username?: string }).username || '')
  return typeof o === 'string' ? o : 'Someone'
}

const personName = (p: unknown) => (p && typeof p === 'object' ? String((p as { fullname?: string; username?: string }).fullname || (p as { username?: string }).username || '') : String(p ?? ''))

function CommentBox({ taskID, parent, placeholder, onSent }: { taskID: string; parent?: string; placeholder: string; onSent: () => void }) {
  const [text, setText] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setBusy(true); setError('')
    try { await submitComment({ taskID, parent, message: text.trim(), files }); setText(''); setFiles([]); onSent() } catch (err) { setError(err instanceof Error ? err.message : String(err)) } finally { setBusy(false) }
  }
  return (
    <form className="ka-cbox" onSubmit={send}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} aria-label={placeholder} rows={parent ? 2 : 3} />
      <div className="ka-cbox__bar">
        <label className="ka-link ka-cbox__file">Attach file<input type="file" multiple hidden onChange={(e) => setFiles(Array.from(e.target.files ?? []))} /></label>
        {files.length > 0 && <small>{files.length} file{files.length > 1 ? 's' : ''}</small>}
        <button type="submit" className="ka-btn ka-btn--sm" disabled={busy || !text.trim()}>{busy ? 'Sending…' : parent ? 'Reply' : 'Send'}</button>
      </div>
      {error && <p role="alert" className="ka-error">{error}</p>}
    </form>
  )
}

function Thread({ taskID, parent, depth = 0 }: { taskID: string; parent: string; depth?: number }) {
  const [items, setItems] = useState<Comment[] | null>(null)
  const [error, setError] = useState('')
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const load = useCallback(() => { getComments(parent).then(setItems).catch((e) => { setError(e instanceof Error ? e.message : String(e)); setItems([]) }) }, [parent])
  useEffect(load, [load])

  return (
    <div className={depth ? 'ka-thread ka-thread--reply' : 'ka-thread'}>
      {items === null && <p className="ka-muted">Loading…</p>}
      {error && <p role="alert" className="ka-error">{error}</p>}
      {items?.length === 0 && !depth && <p className="ka-muted">No comments yet. Ask a question or leave an update.</p>}
      {items?.map((c) => (
        <article key={c.id} className="ka-comment">
          <Avatar name={author(c)} size={32} />
          <div>
            <header><strong>{author(c)}</strong> <time>{timeAgo(c.transDate)}</time></header>
            <p>{c.message}</p>
            {depth === 0 && (
              <button type="button" className="ka-link" onClick={() => setOpen({ ...open, [c.id]: !open[c.id] })}>
                {open[c.id] ? 'Hide replies' : c.replies ? `${c.replies} repl${c.replies === 1 ? 'y' : 'ies'}` : 'Reply'}
              </button>
            )}
            {open[c.id] && <Thread taskID={taskID} parent={c.id} depth={1} />}
          </div>
        </article>
      ))}
      <CommentBox taskID={taskID} parent={depth ? parent : undefined} placeholder={depth ? 'Write a reply…' : 'Ask a question or post an update…'} onSent={load} />
    </div>
  )
}

function AddContributor({ task, onAdded }: { task: Task; onAdded: () => void }) {
  const [term, setTerm] = useState('')
  const [found, setFound] = useState<Account[]>([])
  const [msg, setMsg] = useState<{ error?: string; ok?: string }>({})
  useEffect(() => {
    if (term.trim().length < 2) return
    const id = setTimeout(() => { searchUsers(term.trim()).then(setFound).catch(() => setFound([])) }, 300)
    return () => clearTimeout(id)
  }, [term])
  async function add(a: Account) {
    setMsg({})
    try { await assignTask(task.id, a.username); setMsg({ ok: `${a.fullname} added.` }); setTerm(''); setFound([]); onAdded() } catch (e) { setMsg({ error: e instanceof Error ? e.message : String(e) }) }
  }
  return (
    <div className="ka-contrib">
      <input className="ka-filter" placeholder="Search people by name…" aria-label="Search people to add" value={term} onChange={(e) => setTerm(e.target.value)} />
      {term.trim().length >= 2 && found.length > 0 && (
        <ul className="ka-contrib__list">
          {found.map((a) => <li key={a.id}><button type="button" onClick={() => add(a)}><Avatar name={a.fullname} size={28} />{a.fullname}<small>{a.username}</small></button></li>)}
        </ul>
      )}
      {msg.error && <p role="alert" className="ka-error">{msg.error}</p>}
      {msg.ok && <p role="status" className="ka-ok">{msg.ok}</p>}
    </div>
  )
}

export default function TaskDetail({ task, me, canManage, onClose, onAction, onChanged }: {
  task: Task | null; me?: string; canManage: boolean; onClose: () => void; onAction: (a: TaskAction, t: Task) => void; onChanged: () => void
}) {
  const actions = task ? taskActions(task, me, canManage).filter(([a]) => a !== 'view') : []
  return (
    <Modal open={!!task} title={task?.name ?? ''} onClose={onClose} width={720}>
      {task && (
        <div className="ka-taskdetail">
          <ol className="ka-steps" aria-label="Progress">
            {STEPS.map(([s, label]) => <li key={s} className={reached(task.status, s) ? 'is-done' : ''}>{label}</li>)}
          </ol>
          {task.status === 2 && <p className="ka-note">Sent back for changes. See the comments below.</p>}

          <dl className="ka-detail">
            <dt>Status</dt><dd><span className="ka-statuscell"><StatusIcon status={task.status} />{TASK_STATUS[task.status]}</span></dd>
            <dt>Assignee</dt><dd>{task.assignee}</dd>
            <dt>Assigned by</dt><dd>{task.createdBy}</dd>
            <dt>Points</dt><dd>{task.finalReward}/{task.reward}</dd>
            <dt>Goal</dt><dd>{task.goal}</dd>
            <dt>Due</dt><dd>{fmtDue(task)}</dd>
            {task.teamName && <><dt>Team</dt><dd>{task.teamName}</dd></>}
            {task.contributors?.length > 0 && <><dt>Contributors</dt><dd>{task.contributors.map(personName).filter(Boolean).join(', ')}</dd></>}
            <dt>Details</dt><dd className="ka-detail__text">{task.details}</dd>
          </dl>

          {actions.length > 0 && (
            <div className="ka-actions ka-actions--start">
              {actions.map(([a, label]) => (
                <button key={a} type="button" className={`ka-btn ka-btn--sm ${a === 'delete' ? 'ka-btn--danger' : a === 'edit' ? 'ka-btn--ghost' : ''}`} onClick={() => onAction(a, task)}>{label}</button>
              ))}
            </div>
          )}

          {(canManage || task.createdBy === me) && task.status !== 3 && (
            <section><h3>Add contributor</h3><AddContributor task={task} onAdded={onChanged} /></section>
          )}

          <section><h3>Comments</h3><Thread key={task.id} taskID={task.id} parent={task.id} /></section>
        </div>
      )}
    </Modal>
  )
}
