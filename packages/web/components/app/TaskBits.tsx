'use client'

import { useEffect, useRef, useState } from 'react'
import { dueMs, type Task } from '@/lib/kpily'

// Pieces shared by the Tasks table, feed and detail view.

export type TaskAction = 'view' | 'accept' | 'submit' | 'review' | 'complete' | 'edit' | 'delete'

export const fmtDue = (t: Task) => {
  const d = new Date(dueMs(t))
  return `${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} ${d.getHours() < 12 ? 'AM' : 'PM'}`
}

/** "5 min ago", "3 hrs ago", "2 days ago", then a date. Accepts seconds, milliseconds or a date string. */
export function timeAgo(when: number | string) {
  const ms = typeof when === 'number' ? (when > 1e12 ? when : when * 1000) : Date.parse(when)
  if (!Number.isFinite(ms)) return ''
  const mins = Math.round((Date.now() - ms) / 6e4)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`
  const days = Math.round(hrs / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function StatusIcon({ status }: { status: number }) {
  return <span className={`ka-status ka-status--${status}`} aria-hidden="true" />
}

/** What the signed-in user may do with a task, in menu order. */
export function taskActions(task: Task, me: string | undefined, canManage: boolean): [TaskAction, string][] {
  const mine = task.assignee === me
  const owner = canManage || task.createdBy === me
  const items: [TaskAction, string][] = [['view', 'View']]
  if (mine && task.status === 0) items.push(['accept', 'Accept'])
  if (mine && (task.status === 1 || task.status === 2)) items.push(['submit', 'Submit'])
  if (owner && task.status === 4) items.push(['review', 'Send back for review'], ['complete', 'Mark complete'])
  if (owner && task.status !== 3) items.push(['edit', 'Edit'])
  if (owner) items.push(['delete', 'Delete'])
  return items
}

export function RowMenu({ task, me, canManage, onAction }: { task: Task; me?: string; canManage: boolean; onAction: (a: TaskAction, t: Task) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])
  return (
    <div className="ka-rowmenu" ref={ref}>
      <button type="button" className="ka-iconbtn" aria-label={`Actions for ${task.name}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>•••</button>
      {open && (
        <div className="ka-cog__menu ka-rowmenu__list" role="menu">
          {taskActions(task, me, canManage).map(([a, label]) => (
            <button key={a} type="button" role="menuitem" className={a === 'delete' ? 'is-danger' : ''} onClick={() => { setOpen(false); onAction(a, task) }}>{label}</button>
          ))}
        </div>
      )}
    </div>
  )
}
