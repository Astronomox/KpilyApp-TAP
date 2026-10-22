// Feedback, goals, points and badges. The KPILY API has no endpoints for these yet,
// so they are kept in this browser through useLocalSetting under the keys below.

// ---------- Point tags (Point Settings) ----------

export type Point = { id: string; label: string; value: number }
export type Points = { positive: Point[]; negative: Point[] }
export const POINTS_KEY = 'kpily.point-settings'

export const pointTag = (label: string, value: number): Point => ({ id: `${label}-${value}`, label, value })
export const POINT_DEFAULTS: Points = {
  positive: [
    pointTag('Assistance', 50), pointTag('Great Communication', 100), pointTag('Life Saver', 200), pointTag('THANK YOU!', 25),
    pointTag('Collaboration', 100), pointTag('High Quality', 100), pointTag('Speedy', 100), pointTag('Well-Balanced Work', 75),
    pointTag('Creative', 75), pointTag('Inspirational', 50), pointTag('Task Complete', 150),
    pointTag('Flexible', 25), pointTag('Noticeable improvement', 75), pointTag('Team Player', 50),
  ],
  negative: [
    pointTag('Be Patient', 25), pointTag('Too rushed', 25),
    pointTag('Needs Improvement', 50), pointTag('Wrong Direction', 50),
    pointTag('Not thorough enough', 50),
    pointTag('Review again for errors', 75),
  ],
}

// ---------- Badges (Badge Settings, Rewards) ----------

export type Badge = { id: string; title: string; description: string; points: number; date: string }
export const BADGES_KEY = 'kpily.badge-settings'

export const BADGE_DESC = 'Congratulations! You are making a big progress on blix projects, keep moving on.'
const b = (title: string, points: number): Badge => ({ id: title, title, description: BADGE_DESC, points, date: 'Jan 22, 2023' })
export const BADGE_DEFAULTS: Badge[] = [
  b('Making Progress!', 200), b('Nice Team work', 450),
  b('Good Working habits', 300), b('Noticeable Improvement', 200),
  b('Inspiration', 500), b('Positive Attitude', 100),
  b('Thumbs Up', 250), b('Super Thorough Work', 150),
]

/** A badge given to someone from the Rewards leaderboard. */
export type Award = { id: string; badgeId: string; title: string; description: string; points: number; to: string; toName: string; from: string; fromName: string; date: number }
export const AWARDS_KEY = 'kpily.awards'

// ---------- Feedback ----------

export type Appeal = { reason: string; links: string[]; files: string[]; date: number }
export type Feedback = {
  id: string; from: string; fromName: string; to: string; toName: string; subject: string
  worked: string; different: string; tags: string[]; points: number; date: number; read: boolean; appeal?: Appeal
}
export type FeedbackRequest = { id: string; from: string; fromName: string; to: string; toName: string; subject: string; date: number }
export const FEEDBACK_KEY = 'kpily.feedback'
export const FEEDBACK_REQUESTS_KEY = 'kpily.feedback-requests'

/** Net points for a set of tag ids: positive tags add, negative tags subtract. */
export function tagPoints(tags: string[], points: Points) {
  const sum = (list: Point[]) => list.filter((t) => tags.includes(t.id)).reduce((a, t) => a + t.value, 0)
  return sum(points.positive) - sum(points.negative)
}

// ---------- Goals ----------

export type GoalPeriod = 'quarter' | 'month' | 'year'
export type Goal = {
  id: string; title: string; owner: string; ownerName: string; createdBy: string
  period: GoalPeriod; slot: string; details: string; links: string[]; files: string[]; done: boolean; date: number
}
export const GOALS_KEY = 'kpily.goals'

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']

/** Slot names for a period, e.g. Q1-Q4, Jan-Dec, or this year and the next two. */
export function slotsFor(period: GoalPeriod) {
  const y = new Date().getFullYear()
  return period === 'quarter' ? QUARTERS : period === 'month' ? MONTHS : [String(y), String(y + 1), String(y + 2)]
}

/** The slot "now" falls in, so the goals card opens on the current quarter, month or year. */
export function currentSlot(period: GoalPeriod) {
  const d = new Date()
  return period === 'quarter' ? QUARTERS[Math.floor(d.getMonth() / 3)] : period === 'month' ? MONTHS[d.getMonth()] : String(d.getFullYear())
}

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
