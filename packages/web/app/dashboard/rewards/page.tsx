'use client'

import { useEffect, useMemo, useState } from 'react'
import Avatar from '@/components/app/Avatar'
import Icon from '@/components/app/Icon'
import Modal from '@/components/app/Modal'
import { useProfile } from '@/components/app/ProfileContext'
import { AWARDS_KEY, BADGES_KEY, BADGE_DEFAULTS, newId, type Award, type Badge } from '@/lib/engagement'
import { fileUrl, getMembers, type Member } from '@/lib/kpily'
import { useLocalSetting } from '@/lib/useLocalSetting'
import '@/styles/Performance.css'
import '@/styles/Engagement.css'

// Figma "Rewards" (node 1278:28955): points leaderboard with a podium, Give Badges per person,
// and the badges you have received. Points are live; given badges are kept in this browser.
const ordinal = (n: number) => `${n}${['ST', 'ND', 'RD'][n - 1] ?? 'TH'}`
const fmtDate = (ms: number) => new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function Rewards() {
  const { profile } = useProfile()
  const me = profile?.email ?? ''
  const [members, setMembers] = useState<Member[] | null>(null)
  const [error, setError] = useState('')
  const [badges] = useLocalSetting<Badge[]>(BADGES_KEY, BADGE_DEFAULTS)
  const [awards, saveAwards, loaded] = useLocalSetting<Award[]>(AWARDS_KEY, [])
  const [giving, setGiving] = useState<Member | null>(null)
  const [picked, setPicked] = useState('')
  const [sent, setSent] = useState('')

  useEffect(() => { getMembers().then(setMembers).catch((e) => { setError(e instanceof Error ? e.message : String(e)); setMembers([]) }) }, [])

  const ranked = useMemo(() => [...(members ?? [])].filter((m) => m.status !== -1).sort((a, b) => b.point - a.point), [members])
  const podium = [ranked[1], ranked[0], ranked[2]] // 2nd, 1st, 3rd, as drawn in Figma
  const myBadges = awards.filter((a) => a.to === me).sort((a, b) => b.date - a.date)

  function give(e: React.FormEvent) {
    e.preventDefault()
    const badge = badges.find((b) => b.id === picked)
    if (!giving || !badge) return
    saveAwards([...awards, { id: newId(), badgeId: badge.id, title: badge.title, description: badge.description, points: badge.points, to: giving.email, toName: giving.fullname, from: me, fromName: profile?.fullname ?? me, date: Date.now() }])
    setSent(`${badge.title} sent to ${giving.fullname}.`)
    setGiving(null)
  }

  return (
    <div className="ka-eng ka-rewards">
      <section className="ka-card ka-rewards__board">
        <h1 className="ka-rewards__h">Leaderboard</h1>
        {error && <p role="alert" className="ka-error">{error}</p>}
        {members === null ? <p className="ka-muted">Loading…</p> : !ranked.length ? <p className="ka-muted">No members yet.</p> : (
          <>
            <div className="ka-podium" aria-hidden="true">
              {podium.map((m, i) => m && (
                <div key={m.id} className={`ka-podium__col ka-podium__col--${[2, 1, 3][i]}`}>
                  <Avatar name={m.fullname} src={fileUrl(m.profilePicture)} size={i === 1 ? 44 : 38} />
                  <span className="ka-podium__name">{m.fullname}</span>
                  <div className="ka-podium__bar"><strong>{ordinal([2, 1, 3][i])}</strong><span>{m.point.toLocaleString()} PTS</span></div>
                </div>
              ))}
            </div>
            <ol className="ka-rank">
              {ranked.map((m, i) => (
                <li key={m.id} className={m.email === me ? 'is-me' : ''}>
                  <span className="ka-rank__pos"><strong>{ordinal(i + 1)}</strong>{m.point.toLocaleString()} PTS</span>
                  <Avatar name={m.fullname} src={fileUrl(m.profilePicture)} size={36} />
                  <span className="ka-rank__who">{m.email === me ? <><strong className="ka-rank__you">It’s YOU!</strong><small>Keep up the good work!</small></> : <><strong>{m.fullname}</strong><small>{m.designation ?? ''}</small></>}</span>
                  {m.email !== me && <button type="button" className="ka-btn ka-btn--sm" onClick={() => { setPicked(badges[0]?.id ?? ''); setGiving(m) }}>Give Badges</button>}
                </li>
              ))}
            </ol>
          </>
        )}
      </section>

      <section className="ka-card ka-rewards__mine">
        <h1 className="ka-rewards__h">My Badges</h1>
        {sent && <p role="status" className="ka-ok">{sent}</p>}
        {!loaded ? null : myBadges.length ? (
          <div className="ka-rewards__badges">
            {myBadges.map((a) => (
              <article key={a.id} className="ka-badgecard">
                <span className="ka-badgecard__medal" aria-hidden="true"><Icon name="sparkle" size={30} /></span>
                <div className="ka-badgecard__body">
                  <div className="ka-badgecard__top"><h3>{a.title}</h3><span className="ka-badgecard__pts">{a.points}PTS</span></div>
                  <p className="ka-badgecard__desc">{a.description}</p>
                  <small className="ka-muted">From {a.fromName}</small>
                </div>
                <span className="ka-badgecard__date">{fmtDate(a.date)}</span>
              </article>
            ))}
          </div>
        ) : <p className="ka-muted">No badges yet. Teammates can send you one from the leaderboard.</p>}
        <p className="ka-localnote">Badges are saved in this browser until the KPILY API supports them.</p>
      </section>

      <Modal open={!!giving} title={`Give a badge to ${giving?.fullname ?? ''}`} onClose={() => setGiving(null)} width={560}>
        <form onSubmit={give}>
          <div className="ka-badgepick" role="radiogroup" aria-label="Badge">
            {badges.map((b) => (
              <label key={b.id} className={picked === b.id ? 'is-on' : ''}>
                <input type="radio" name="badge" value={b.id} checked={picked === b.id} onChange={() => setPicked(b.id)} />
                <Icon name="sparkle" size={20} /><span>{b.title}</span><small>{b.points}PTS</small>
              </label>
            ))}
            {!badges.length && <p className="ka-muted">No badges set up. An admin can add them in Badge Settings.</p>}
          </div>
          <div className="ka-actions">
            <button type="button" className="ka-btn ka-btn--ghost" onClick={() => setGiving(null)}>Cancel</button>
            <button type="submit" className="ka-btn" disabled={!picked}>Give badge</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
