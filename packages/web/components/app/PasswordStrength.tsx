type Props = { value: string; max?: number }

function score(pw: string): number {
  let s = 0
  if (pw.length >= 1)  s += 2
  if (pw.length >= 8)  s += 3
  if (pw.length >= 12) s += 2
  if (/[A-Z]/.test(pw))      s += 2
  if (/\d/.test(pw))         s += 2
  if (/[^A-Za-z0-9]/.test(pw)) s += 1
  return Math.min(s, 12)
}

const labels = ['', 'Too weak', 'Too weak', 'Weak', 'Weak', 'Fair', 'Fair', 'Good', 'Good', 'Strong', 'Strong', 'Very strong', 'Very strong']
const color  = (s: number) => s < 4 ? '#e5395b' : s < 8 ? '#e6a700' : '#1e7a5a'

export default function PasswordStrength({ value, max = 12 }: Props) {
  const filled = score(value)
  const c = color(filled)
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < filled ? c : '#e6e6e6', transition: 'background .2s' }} />
        ))}
      </div>
      {value && <span style={{ fontSize: 12, color: c }}>{labels[filled]}</span>}
    </div>
  )
}
