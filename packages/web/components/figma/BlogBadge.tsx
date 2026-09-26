// Untitled-UI badge colours used on the Blog frames.
const palette: Record<string, [string, string]> = {
  purple: ['#f9f5ff', '#6941c6'],
  indigo: ['#eef4ff', '#3538cd'],
  pink: ['#fdf2fa', '#c11574'],
  blue: ['#f0f9ff', '#026aa2'],
  green: ['#ecfdf3', '#027a48'],
  gray: ['#f8f9fc', '#363f72'],
  orange: ['#fff6ed', '#c4320a'],
  rose: ['#fff1f3', '#c01048'],
}

export type BadgeColor = keyof typeof palette

export default function BlogBadge({ label, color }: { label: string; color: BadgeColor }) {
  const [bg, fg] = palette[color]
  return <span className="kp-badge" style={{ background: bg, color: fg }}>{label}</span>
}
