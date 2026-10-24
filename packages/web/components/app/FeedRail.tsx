'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Icon from './Icon'
import Avatar from './Avatar'
import { timeAgo } from './TaskBits'
import { fileUrl, getMembers, getNotifications, type Member, type Notification } from '@/lib/kpily'

// Turns the API's raw-user-agent login message into something human:
// "A new login on Mozilla/5.0 (Windows NT 10.0…) …Chrome/155… was successful." → "New sign-in from Chrome on Windows".
function prettyMessage(message: string) {
  const m = message.match(/^A new login on (.+?) was successful\.?$/i)
  if (!m) return message
  const ua = m[1]
  const browser =
    /\bEdg[\/ ]/i.test(ua) ? 'Edge' : /\b(OPR|Opera)[\/ ]/i.test(ua) ? 'Opera' : /\b(Chrome|CriOS|HeadlessChrome)[\/ ]/i.test(ua) ? 'Chrome'
    : /\bFirefox[\/ ]/i.test(ua) ? 'Firefox' : /\bSafari[\/ ]/i.test(ua) ? 'Safari' : /\bcurl[\/ ]/i.test(ua) ? 'curl' : ''
  const os =
    /Windows/i.test(ua) ? 'Windows' : /(iPhone|iPad|iPod|iOS)/i.test(ua) ? 'iOS' : /(Mac OS X|Macintosh)/i.test(ua) ? 'macOS'
    : /Android/i.test(ua) ? 'Android' : /Linux/i.test(ua) ? 'Linux' : ''
  if (browser && os) return `New sign-in from ${browser} on ${os}`
  if (browser) return `New sign-in via ${browser}`
  return 'New sign-in to your account'
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
    <aside className="ka-rail" aria-label="Feed and team">
      <section>
        <h2>Feed</h2>
        {feed === null ? <p className="ka-rail__muted">Loading…</p> : !feed.length ? <p className="ka-rail__muted">No activity yet.</p> : (
          <ul className="ka-feed">
            {feed.slice(0, 8).map((n) => (
              <li key={n.id} className={n.read ? '' : 'is-unread'}>
                <span className="ka-feed__icon"><Icon name="user" size={18} /></span>
                <div><p>{prettyMessage(n.message)}</p><small>{timeAgo(n.transDate)}</small></div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <div className="ka-rail__head"><h2>Your Team</h2><Link href="/dashboard/team">See all</Link></div>
        {team === null ? <p className="ka-rail__muted">Loading…</p> : !team.length ? <p className="ka-rail__muted">No team members yet.</p> : (
          <ul className="ka-team">
            {team.slice(0, 8).map((m) => (
              <li key={m.id}><Avatar name={m.fullname} src={fileUrl(m.profilePicture)} size={40} /><span>{m.fullname}</span></li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  )
}
