'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Icon from '@/components/app/Icon'
import Modal from '@/components/app/Modal'
import TaskForm from '@/components/app/TaskForm'
import { useProfile } from '@/components/app/ProfileContext'
import { TASK_STATUS, createEvent, dueMs, getEvents, getMembers, getTasks, updateEvent, type CalEvent, type Member, type Task } from '@/lib/kpily'
import { eventSchema } from '@/lib/schemas'
import '@/styles/Calendar.css'

type Kind = (typeof TASK_STATUS)[number] | 'Event'
const KINDS: Kind[] = [...TASK_STATUS, 'Event']
type Item = { id: string; title: string; start: Date; end: Date; kind: Kind; task?: Task; event?: CalEvent }
type View = 'Month' | 'Week' | 'Day' | 'List'

const DAY = 864e5
const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MINI = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const monthGrid = (d: Date) => { const first = new Date(d.getFullYear(), d.getMonth(), 1); const s = addDays(first, -first.getDay()); return Array.from({ length: 42 }, (_, i) => addDays(s, i)) }
const time = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const onDay = (it: Item, d: Date) => startOfDay(it.start) <= d && d <= startOfDay(it.end)
const pad = (n: number) => String(n).padStart(2, '0')
const toLocal = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`

function MiniCalendar({ value, onPick }: { value: Date; onPick: (d: Date) => void }) {
  const [month, setMonth] = useState(new Date(value.getFullYear(), value.getMonth(), 1))
  const [seen, setSeen] = useState(value)
  if (seen !== value) { setSeen(value); setMonth(new Date(value.getFullYear(), value.getMonth(), 1)) }
  const today = new Date()
  return (
    <div className="ka-mini">
      <div className="ka-mini__head">
        <button type="button" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button>
        <strong>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong>
        <button type="button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
      </div>
      <div className="ka-mini__grid">
        {MINI.map((d) => <span key={d} className="ka-mini__dow">{d}</span>)}
        {monthGrid(month).map((d) => (
          <button key={d.toISOString()} type="button" onClick={() => onPick(d)}
            className={`${d.getMonth() !== month.getMonth() ? 'is-out' : ''} ${sameDay(d, today) ? 'is-today' : ''} ${sameDay(d, value) ? 'is-picked' : ''}`}
            aria-label={d.toDateString()} aria-pressed={sameDay(d, value)}>{d.getDate()}</button>
        ))}
      </div>
    </div>
  )
}

function Chip({ it, onOpen }: { it: Item; onOpen: (it: Item) => void }) {
  return (
    <button type="button" className={`ka-ev ka-ev--${it.kind.toLowerCase()}`} onClick={(e) => { e.stopPropagation(); onOpen(it) }} title={it.title}>
      {it.kind === 'Event' && <span className="ka-ev__time">{time(it.start)}</span>}{it.title}
    </button>
  )
}

function EventForm({ open, event, date, onClose, onSaved }: { open: boolean; event?: CalEvent | null; date: Date; onClose: () => void; onSaved: () => void }) {
  const [members, setMembers] = useState<Member[]>([])
  const [memberError, setMemberError] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [openedFor, setOpenedFor] = useState<string | null>(null)
  const key = open ? event?.id ?? 'new' : null
  if (key !== openedFor) { setOpenedFor(key); setPicked(event?.attendees.map((a) => a.username) ?? []); setError(''); setMemberError('') }

  useEffect(() => { if (open) getMembers().then(setMembers).catch(() => setMemberError('Could not load members. You can still create the event.')) }, [open])

  const start = event ? new Date(event.time * 1000) : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9)
  const end = event?.endTime ? new Date(event.endTime * 1000) : new Date(start.getTime() + 36e5)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const s = new Date(String(f.get('start'))), en = new Date(String(f.get('end')))
    const valid = eventSchema.safeParse({ name: String(f.get('name')), start: s, end: en, onlineLocation: String(f.get('link')).trim() })
    if (!valid.success) { setError(valid.error.issues[0].message); return }
    const attendees = members.filter((m) => picked.includes(m.email)).map((m) => ({ id: m.id, fullname: m.fullname, username: m.email }))
    const input = {
      name: String(f.get('name')).trim(), details: String(f.get('details')).trim(),
      time: Math.floor(s.getTime() / 1000), endTime: Math.floor(en.getTime() / 1000), attendees,
      phyicalLocation: String(f.get('place')).trim(), onlineLocation: String(f.get('link')).trim(),
    }
    setBusy(true); setError('')
    try { await (event ? updateEvent(event.id, input) : createEvent(input)); onSaved(); onClose() } catch (err) { setError(err instanceof Error ? err.message : String(err)) } finally { setBusy(false) }
  }

  return (
    <Modal open={open} title={event ? 'Edit Event' : 'Schedule Event'} onClose={onClose} width={600}>
      <form onSubmit={submit} key={key ?? ''}>
        <label className="ka-field">Title<input name="name" required defaultValue={event?.name} placeholder="e.g. Project catch-up" /></label>
        <div className="ka-row2">
          <label className="ka-field">Starts<input name="start" type="datetime-local" required defaultValue={toLocal(start)} /></label>
          <label className="ka-field">Ends<input name="end" type="datetime-local" required defaultValue={toLocal(end)} /></label>
        </div>
        <fieldset className="ka-field ka-attendees">
          <legend>Attendees</legend>
          {memberError ? <p role="alert" className="ka-error">{memberError}</p> : members.length ? members.map((m) => (
            <label key={m.id}><input type="checkbox" checked={picked.includes(m.email)} onChange={() => setPicked(picked.includes(m.email) ? picked.filter((x) => x !== m.email) : [...picked, m.email])} />{m.fullname} <small>{m.email}</small></label>
          )) : <small>Loading members…</small>}
        </fieldset>
        <div className="ka-row2">
          <label className="ka-field">Location<input name="place" defaultValue={event?.phyicalLocation ?? ''} placeholder="Office address" /></label>
          <label className="ka-field">Online link<input name="link" type="url" defaultValue={event?.onlineLocation ?? ''} placeholder="https://" /></label>
        </div>
        <label className="ka-field">Description<textarea name="details" defaultValue={event?.details} /></label>
        {error && <p role="alert" className="ka-error">{error}</p>}
        <div className="ka-actions">
          <button type="button" className="ka-btn ka-btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="ka-btn" disabled={busy}>{busy ? 'Saving…' : event ? 'Save changes' : 'Schedule'}</button>
        </div>
      </form>
    </Modal>
  )
}

export default function Calendar() {
  const { profile } = useProfile()
  const [date, setDate] = useState(() => startOfDay(new Date()))
  const [view, setView] = useState<View>('Month')
  const [tasks, setTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<CalEvent[]>([])
  const [shown, setShown] = useState<Kind[]>(KINDS)
  const [opened, setOpened] = useState<Item | null>(null)
  const [taskForm, setTaskForm] = useState<{ open: boolean; date?: Date }>({ open: false })
  const [eventForm, setEventForm] = useState<{ open: boolean; event?: CalEvent | null }>({ open: false })
  const [error, setError] = useState('')
  const canManage = (profile?.privilege ?? 0) >= 40

  const load = useCallback(() => {
    getTasks().then(setTasks).catch((e) => setError(e.message))
    getEvents().then(setEvents).catch((e) => setError(e.message))
  }, [])
  useEffect(load, [load])

  const items = useMemo<Item[]>(() => [
    ...tasks.map((t) => { const d = new Date(dueMs(t)); return { id: t.id, title: t.name, start: d, end: d, kind: TASK_STATUS[t.status] ?? 'New', task: t } }),
    ...events.map((e) => ({ id: e.id, title: e.name, start: new Date(e.time * 1000), end: new Date((e.endTime ?? e.time) * 1000), kind: 'Event' as Kind, event: e })),
  ].filter((i) => shown.includes(i.kind)).sort((a, b) => +a.start - +b.start), [tasks, events, shown])

  const today = startOfDay(new Date())
  const step = (n: number) => setDate(view === 'Month' || view === 'List' ? new Date(date.getFullYear(), date.getMonth() + n, 1) : addDays(date, n * (view === 'Week' ? 7 : 1)))
  const weekStart = addDays(date, -date.getDay())
  const title = view === 'Day' ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : view === 'Week' ? `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${addDays(weekStart, 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const toggle = (k: Kind) => setShown(shown.includes(k) ? shown.filter((x) => x !== k) : [...shown, k])
  const allOn = shown.length === KINDS.length
  const pickDay = (d: Date) => { if (canManage) setEventForm({ open: true, event: null }); setDate(d) }

  const listItems = items.filter((i) => i.start.getMonth() === date.getMonth() && i.start.getFullYear() === date.getFullYear())

  return (
    <div className="ka-cal ka-card">
      <aside className="ka-cal__side">
        <div className="ka-cal__btns">
          {canManage && <button type="button" className="ka-btn" onClick={() => setTaskForm({ open: true, date })}>+ Add Task</button>}
          {canManage && <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setEventForm({ open: true, event: null })}>+ Schedule Event</button>}
        </div>
        <MiniCalendar value={date} onPick={(d) => { setDate(d); if (view === 'Month' && d.getMonth() !== date.getMonth()) setView('Month') }} />
        <div className="ka-cal__filters">
          <p>FILTERS</p>
          <label className="ka-filt ka-filt--all"><input type="checkbox" checked={allOn} onChange={() => setShown(allOn ? [] : KINDS)} />View All</label>
          {KINDS.map((k) => <label key={k} className={`ka-filt ka-filt--${k.toLowerCase()}`}><input type="checkbox" checked={shown.includes(k)} onChange={() => toggle(k)} />{k}</label>)}
        </div>
      </aside>

      <section className="ka-cal__main">
        <div className="ka-cal__bar">
          <button type="button" className="ka-iconbtn ka-cal__nav" aria-label="Previous" onClick={() => step(-1)}><Icon name="chevron" size={20} /></button>
          <button type="button" className="ka-iconbtn ka-cal__nav" aria-label="Next" onClick={() => step(1)}><Icon name="chevron" size={20} className="ka-flip" /></button>
          <h1>{title}</h1>
          {!sameDay(date, today) && <button type="button" className="ka-link" onClick={() => setDate(today)}>Today</button>}
          <div className="ka-seg" role="group" aria-label="View">
            {(['Month', 'Week', 'Day', 'List'] as View[]).map((v) => <button key={v} type="button" aria-pressed={view === v} className={view === v ? 'is-on' : ''} onClick={() => setView(v)}>{v}</button>)}
          </div>
        </div>
        {error && <p role="alert" className="ka-error ka-cal__err">{error}</p>}

        {view === 'Month' && (
          <div className="ka-month">
            {WEEK.map((d) => <div key={d} className="ka-month__dow">{d}</div>)}
            {monthGrid(date).map((d) => {
              const day = items.filter((i) => onDay(i, d))
              return (
                <div key={d.toISOString()} className={`ka-month__cell ${d.getMonth() !== date.getMonth() ? 'is-out' : ''} ${sameDay(d, today) ? 'is-today' : ''}`}
                  onClick={() => pickDay(d)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pickDay(d)}
                  role="button" tabIndex={0} aria-label={`${d.toDateString()}${day.length ? `, ${day.length} item${day.length > 1 ? 's' : ''}` : ''}`}>
                  <span className="ka-month__n">{d.getDate()}</span>
                  {day.slice(0, 3).map((it) => <Chip key={it.kind + it.id} it={it} onOpen={setOpened} />)}
                  {day.length > 3 && <button type="button" className="ka-month__more" onClick={(e) => { e.stopPropagation(); setDate(d); setView('Day') }}>+{day.length - 3} more</button>}
                </div>
              )
            })}
          </div>
        )}

        {(view === 'Week' || view === 'Day') && (
          <div className={`ka-week ${view === 'Day' ? 'ka-week--day' : ''}`}>
            {(view === 'Week' ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)) : [date]).map((d) => {
              const day = items.filter((i) => onDay(i, d))
              return (
                <div key={d.toISOString()} className={`ka-week__col ${sameDay(d, today) ? 'is-today' : ''}`}>
                  <div className="ka-week__head">{WEEK[d.getDay()]} <strong>{d.getDate()}</strong></div>
                  <div className="ka-week__body" onClick={() => pickDay(d)}>
                    {day.length ? day.map((it) => <Chip key={it.kind + it.id} it={it} onOpen={setOpened} />) : <span className="ka-week__none">No items</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {view === 'List' && (
          <div className="ka-list">
            {!listItems.length ? <p className="ka-list__none">No events to display</p> : listItems.map((it, i) => (
              <div key={it.kind + it.id}>
                {(i === 0 || !sameDay(listItems[i - 1].start, it.start)) && <h3>{it.start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>}
                <button type="button" className="ka-list__row" onClick={() => setOpened(it)}>
                  <span className="ka-list__time">{it.kind === 'Event' ? `${time(it.start)} – ${time(it.end)}` : 'all-day'}</span>
                  <span className={`ka-list__dot ka-ev--${it.kind.toLowerCase()}`} />{it.title}<small>{it.kind}</small>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Modal open={!!opened} title={opened?.title ?? ''} onClose={() => setOpened(null)} width={520}>
        {opened?.task && (
          <dl className="ka-cal-detail">
            <dt>Type</dt><dd>Task · {opened.kind}</dd>
            <dt>Due</dt><dd>{opened.start.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</dd>
            <dt>Assignee</dt><dd>{opened.task.assignee}</dd>
            <dt>Points</dt><dd>{opened.task.finalReward}/{opened.task.reward}</dd>
            <dt>Details</dt><dd>{opened.task.details}</dd>
          </dl>
        )}
        {opened?.event && (
          <>
            <dl className="ka-cal-detail">
              <dt>When</dt><dd>{opened.start.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })} – {time(opened.end)}</dd>
              {opened.event.organizer && <><dt>Organizer</dt><dd>{opened.event.organizer.fullname || opened.event.organizer.username}</dd></>}
              <dt>Attendees</dt><dd>{[...new Set(opened.event.attendees.map((a) => a.fullname || a.username))].join(', ') || 'None'}</dd>
              {opened.event.phyicalLocation && <><dt>Location</dt><dd>{opened.event.phyicalLocation}</dd></>}
              {opened.event.onlineLocation && <><dt>Online</dt><dd><a href={opened.event.onlineLocation} target="_blank" rel="noreferrer">{opened.event.onlineLocation}</a></dd></>}
              {opened.event.details && <><dt>Details</dt><dd>{opened.event.details}</dd></>}
            </dl>
            {canManage && <div className="ka-actions"><button type="button" className="ka-btn" onClick={() => { setEventForm({ open: true, event: opened.event }); setOpened(null) }}>Edit event</button></div>}
          </>
        )}
      </Modal>

      <TaskForm open={taskForm.open} defaultDate={taskForm.date} onClose={() => setTaskForm({ open: false })} onSaved={load} />
      <EventForm open={eventForm.open} event={eventForm.event} date={date} onClose={() => setEventForm({ open: false })} onSaved={load} />
    </div>
  )
}
