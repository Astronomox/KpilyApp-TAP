'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Icon from './Icon'
import Avatar from './Avatar'
import { getMembers, getNotifications, type Member, type Notification } from '@/lib/kpily'

const ago = (unix: number) => {
  const s = Math.max(0, Date.now() / 1000 - unix)
  if (s < 60) return 'just now'
  const [n, u] = s < 3600 ? [s / 60, 'minute'] : s < 86400 ? [s / 3600, 'hour'] : s < 2592000 ? [s / 86400, 'day'] : s < 31536000 ? [s / 2592000, 'month'] : [s / 31536000, 'year']
  const v = Math.floor(n)
  return `${v} ${u}${v === 1 ? '' : 's'} ago`
}

// Right-hand rail: recent notifications ("Feed") and the organisation's members ("Your Team").
export default function FeedRail() {
  const [feed, setFeed] = useState<Notification[] | null>(null)
  const [team, setTeam] = useState<Member[] | null>(null)

  useEffect(() => {
    getNotifications().then((n) => setFeed([...n].sort((a, b) => b.transDate - a.transDate))).catch(() => setFeed([]))
    getMembers().then(setTeam).catch(() => setTeam([]))
  }, [])

  return (
    <aside className="kp-rail" aria-label="Feed and team">
      <section>
        <h2>Feed</h2>
        {feed === null ? <p className="kp-rail__muted">Loading…</p> : !feed.length ? <p className="kp-rail__muted">No activity yet.</p> : (
          <ul className="kp-feed">
            {feed.slice(0, 8).map((n) => (
              <li key={n.id} className={n.read ? '' : 'is-unread'}>
                <span className="kp-feed__icon"><Icon name="user" size={18} /></span>
                <div><p>{n.message}</p><small>{ago(n.transDate)}</small></div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <div className="kp-rail__head"><h2>Your Team</h2><Link href="/dashboard/team">See all</Link></div>
        {team === null ? <p className="kp-rail__muted">Loading…</p> : !team.length ? <p className="kp-rail__muted">No team members yet.</p> : (
          <ul className="kp-team">
            {team.slice(0, 8).map((m) => (
              <li key={m.id}><Avatar name={m.fullname} src={m.profilePicture} size={40} /><span>{m.fullname}</span></li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  )
}
