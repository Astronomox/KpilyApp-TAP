import Link from 'next/link'
import Avatar from './Avatar'
import type { Member } from '@/lib/kpily'

const ordinal = (n: number) => `${n}${[, 'st', 'nd', 'rd'][(n % 100 >> 3) ^ 1 && n % 10] || 'th'}`

/** Members ranked by points; the leader's row is highlighted. */
export default function Leaderboard({ title = 'Individual Leaderboard', members, limit = 5, seeAll }: { title?: string; members: Member[] | null; limit?: number; seeAll?: string }) {
  const ranked = [...(members ?? [])].sort((a, b) => b.point - a.point).slice(0, limit)
  return (
    <section className="ka-card ka-board">
      <div className="ka-card__head"><h2>{title}</h2>{seeAll && <Link className="ka-link" href={seeAll}>See all</Link>}</div>
      {members === null ? <p className="ka-muted">Loading…</p> : !ranked.length ? <p className="ka-muted">No members yet.</p> : (
        <ol className="ka-board__list">
          {ranked.map((m, i) => (
            <li key={m.id} className={i === 0 ? 'is-first' : ''}>
              <span className="ka-board__rank"><strong>{ordinal(i + 1)}</strong>{m.point} PTS</span>
              <Avatar name={m.fullname} src={null} size={32} />
              <span>{m.fullname}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
