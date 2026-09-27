'use client'

import { useEffect, useState } from 'react'
import Modal from './Modal'
import { createTask, dueMs, getMembers, updateTask, type Member, type Task } from '@/lib/kpily'
import { taskSchema } from '@/lib/schemas'

const pad = (n: number) => String(n).padStart(2, '0')
const toLocal = (ms: number) => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}` }

// Add Task / Edit Task dialog (multipart create-task / update-task).
export default function TaskForm({ open, task, defaultDate, onClose, onSaved }: { open: boolean; task?: Task | null; defaultDate?: Date; onClose: () => void; onSaved: () => void }) {
  const [members, setMembers] = useState<Member[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [details, setDetails] = useState(task?.details ?? '')
  const [nextWeek] = useState(() => Date.now() + 7 * 864e5)
  const MAX_DETAILS = 500

  useEffect(() => { if (open) { getMembers().then(setMembers).catch(() => {}); setDetails(task?.details ?? '') } }, [open, task?.details])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const input = {
      name: String(f.get('name')).trim(),
      details: String(f.get('details')).trim(),
      dueDate: new Date(String(f.get('dueDate'))),
      goal: Number(f.get('goal')),
      assignee: String(f.get('assignee')),
      reward: Number(f.get('reward')),
      files: (f.getAll('files') as File[]).filter((x) => x.size),
    }
    const valid = taskSchema.safeParse(input)
    if (!valid.success) { setError(valid.error.issues[0].message); return }
    setBusy(true); setError('')
    try {
      await (task ? updateTask(task.id, input) : createTask(input))
      onSaved(); onClose()
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  const due = task ? toLocal(dueMs(task)) : toLocal(new Date(defaultDate ?? nextWeek).setHours(17, 0, 0, 0))

  return (
    <Modal open={open} title={task ? 'Edit Task' : 'Add Task'} onClose={onClose} width={600}>
      <form onSubmit={submit} key={task?.id ?? due}>
        <label className="ka-field">Task name<input name="name" required defaultValue={task?.name} placeholder="e.g. Prepare Q4 report" /></label>
        <label className="ka-field">Details
          <textarea name="details" required value={details} maxLength={MAX_DETAILS}
            onChange={(e) => setDetails(e.target.value)} placeholder="What needs to be done?" />
          <span className={`ka-field__counter${details.length >= MAX_DETAILS ? ' is-max' : details.length > MAX_DETAILS * 0.8 ? ' is-warn' : ''}`}>{details.length}/{MAX_DETAILS}</span>
        </label>
        <div className="ka-row2">
          <label className="ka-field">Assignee
            <select name="assignee" required defaultValue={task?.assignee ?? ''}>
              <option value="" disabled>Select a team member</option>
              {task && !members.some((m) => m.email === task.assignee) && <option value={task.assignee}>{task.assignee}</option>}
              {members.map((m) => <option key={m.id} value={m.email}>{m.fullname} ({m.email})</option>)}
            </select>
          </label>
          <label className="ka-field">Due date<input name="dueDate" type="datetime-local" required defaultValue={due} /></label>
          <label className="ka-field">Points (reward)<input name="reward" type="number" min={0} required defaultValue={task?.reward ?? 100} /></label>
          <label className="ka-field">Goal<input name="goal" type="number" min={1} required defaultValue={task?.goal ?? 1} /></label>
        </div>
        <label className="ka-field">Attachments<input name="files" type="file" multiple /></label>
        {error && <p role="alert" className="ka-error">{error}</p>}
        <div className="ka-actions">
          <button type="button" className="ka-btn ka-btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="ka-btn" disabled={busy}>{busy ? 'Saving…' : task ? 'Save changes' : 'Add Task'}</button>
        </div>
      </form>
    </Modal>
  )
}
