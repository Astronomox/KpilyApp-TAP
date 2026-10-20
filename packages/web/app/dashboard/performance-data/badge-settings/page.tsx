'use client'

import { useState } from 'react'
import Icon from '@/components/app/Icon'
import { useLocalSetting } from '@/lib/useLocalSetting'
import '@/styles/Performance.css'

// Figma: Badge Settings (node 1908:75604). Achievement badges staff can earn.
// No API endpoint exists for these yet, so they are kept in this browser.
type Badge = { id: string; title: string; description: string; points: number; date: string }

const DESC = 'Congratulations! You are making a big progress on blix projects, keep moving on.'
const b = (title: string, points: number): Badge => ({ id: title, title, description: DESC, points, date: 'Jan 22, 2023' })
const DEFAULTS: Badge[] = [
  b('Making Progress!', 200), b('Nice Team work', 450),
  b('Good Working habits', 300), b('Noticeable Improvement', 200),
  b('Inspiration', 500), b('Positive Attitude', 100),
  b('Thumbs Up', 250), b('Super Thorough Work', 150),
]

export default function BadgeSettings() {
  const [badges, save, loaded] = useLocalSetting<Badge[]>('kpily.badge-settings', DEFAULTS)
  const [editing, setEditing] = useState(false)

  return (
    <div className="ka-score">
      <div className="ka-setbar">
        <h1>Badge Settings</h1>
        <div className="ka-setbar__actions">
          <button type="button" className="ka-btn" onClick={() => setEditing((v) => !v)}><Icon name="edit" size={16} />{editing ? 'Done' : 'Edit'}</button>
        </div>
      </div>

      {loaded && (
        <div className="ka-badgegrid">
          {badges.map((badge) => (
            <article key={badge.id} className="ka-badgecard">
              <span className="ka-badgecard__medal" aria-hidden="true"><Icon name="sparkle" size={30} /></span>
              <div className="ka-badgecard__body">
                <div className="ka-badgecard__top">
                  <h3>{badge.title}</h3>
                  <span className="ka-badgecard__pts">{badge.points}PTS</span>
                </div>
                <p className="ka-badgecard__desc">{badge.description}</p>
              </div>
              <span className="ka-badgecard__date">{badge.date}</span>
              {editing && <button type="button" className="ka-badgecard__del" aria-label={`Remove ${badge.title}`} onClick={() => save(badges.filter((x) => x.id !== badge.id))}><Icon name="trash" size={14} /></button>}
            </article>
          ))}
          {!badges.length && <p className="ka-muted">No badges yet.</p>}
        </div>
      )}
    </div>
  )
}
