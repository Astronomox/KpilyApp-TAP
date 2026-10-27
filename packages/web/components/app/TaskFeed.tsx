'use client'

import Avatar from './Avatar'
import { RowMenu, timeAgo, type TaskAction } from './TaskBits'
import type { Task } from '@/lib/kpily'

// Figma "Task Dash" (node 1278:30686): an activity feed of tasks, newest first.

/** Who did what last, phrased like the Figma feed. */
function headline(t: Task): [string, string] {
  switch (t.status) {
    case 1: return ['Task Accepted by', t.assignee]
    case 2: return ['Task Review from', t.createdBy]
    case 3: return ['Task Approved by', t.createdBy]
    case 4: return ['Task Update from', t.assignee]
    default: return ['Task Assignment from', t.createdBy]
  }
}

export default function TaskFeed({ tasks, me, canManage, onOpen, onAction }: {
  tasks: Task[]; me?: string; canManage: boolean; onOpen: (t: Task) => void; onAction: (a: TaskAction, t: Task) => void
}) {
  return (
    <ul className="ka-feedlist">
      {tasks.map((t) => {
        const [verb, who] = headline(t)
        const isNew = t.status === 0 && t.assignee === me
        return (
          <li key={t.id} className="ka-feeditem">
            <span className="ka-feeditem__new">{isNew ? 'NEW' : ''}</span>
            <Avatar name={who} size={44} />
            <button type="button" className="ka-feeditem__body" onClick={() => onOpen(t)}>
              <small>{verb} {who}</small>
              <strong>{t.name}</strong>
            </button>
            <time className="ka-feeditem__time" dateTime={t.dateCreated}>{timeAgo(t.dateCreated)}</time>
            <RowMenu task={t} me={me} canManage={canManage} onAction={onAction} />
          </li>
        )
      })}
    </ul>
  )
}
