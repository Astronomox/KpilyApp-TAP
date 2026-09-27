'use client'

// Small dependency-free SVG charts for the performance pages.
import { useEffect, useState } from 'react'
import type { Rate } from '@/lib/kpily'

export const BIMONTHS = ['Jan-Feb', 'Mar-Apr', 'May-Jun', 'Jul-Aug', 'Sep-Oct', 'Nov-Dec']

export type Series = { label: string; color: string; values: number[] }

const niceMax = (n: number) => {
  if (n <= 5) return 5
  const p = 10 ** Math.floor(Math.log10(n))
  return Math.ceil(n / (p / 2)) * (p / 2)
}
const ticks = (max: number) => Array.from({ length: 6 }, (_, i) => (max / 5) * i)
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

function Legend({ series }: { series: Series[] }) {
  return <ul className="ka-legend">{series.map((s) => <li key={s.label}><span style={{ background: s.color }} />{s.label}</li>)}</ul>
}

/** Vertical bars; several series stack. */
export function BarChart({ labels, series, height = 280, legend = series.length > 1, label }: { labels: string[]; series: Series[]; height?: number; legend?: boolean; label: string }) {
  const totals = labels.map((_, i) => series.reduce((a, s) => a + (s.values[i] || 0), 0))
  const max = niceMax(Math.max(...totals, 0))
  const W = 560, H = height, L = 40, B = 28, T = 10, plotH = H - B - T, step = (W - L) / Math.max(labels.length, 1), bw = Math.min(28, step * 0.5)
  return (
    <figure className="ka-chart">
      {legend && <Legend series={series} />}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}: ${labels.map((l, i) => `${l} ${series.map((s) => `${s.label} ${s.values[i] || 0}`).join(', ')}`).join('; ')}`}>
        {ticks(max).map((t) => { const y = T + plotH - (t / max) * plotH; return <g key={t}><line x1={L} x2={W} y1={y} y2={y} className="ka-chart__grid" /><text x={L - 8} y={y + 4} textAnchor="end" className="ka-chart__tick">{fmt(t)}</text></g> })}
        {labels.map((l, i) => {
          let y = T + plotH
          const x = L + step * i + (step - bw) / 2
          return (
            <g key={l}>
              {series.map((s) => { const h = ((s.values[i] || 0) / max) * plotH; y -= h; return h > 0 ? <rect key={s.label} x={x} y={y} width={bw} height={h} fill={s.color} rx={series.length > 1 ? 0 : 3}><title>{`${l} · ${s.label}: ${s.values[i] || 0}`}</title></rect> : null })}
              <text x={x + bw / 2} y={H - 8} textAnchor="middle" className="ka-chart__tick">{l}</text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}

/** Smoothed area line. */
export function LineChart({ labels, values, color = '#7a3fb0', height = 280, label }: { labels: string[]; values: number[]; color?: string; height?: number; label: string }) {
  const max = niceMax(Math.max(...values, 0))
  const W = 560, H = height, L = 40, B = 28, T = 10, plotH = H - B - T, step = (W - L - 20) / Math.max(labels.length - 1, 1)
  const pts = values.map((v, i) => [L + 10 + step * i, T + plotH - (v / max) * plotH])
  const d = pts.map(([x, y], i) => {
    if (!i) return `M${x},${y}`
    const [px, py] = pts[i - 1], cx = (px + x) / 2
    return `C${cx},${py} ${cx},${y} ${x},${y}`
  }).join(' ')
  const gid = `ka-area-${label.replace(/\W/g, '')}`
  return (
    <figure className="ka-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}: ${labels.map((l, i) => `${l} ${values[i]}`).join(', ')}`}>
        <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".18" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
        {ticks(max).map((t) => { const y = T + plotH - (t / max) * plotH; return <g key={t}><line x1={L} x2={W} y1={y} y2={y} className="ka-chart__grid ka-chart__grid--dash" /><text x={L - 8} y={y + 4} textAnchor="end" className="ka-chart__tick">{fmt(t)}</text></g> })}
        {pts.length > 1 && <path d={`${d} L${pts[pts.length - 1][0]},${T + plotH} L${pts[0][0]},${T + plotH} Z`} fill={`url(#${gid})`} />}
        <path d={d} fill="none" stroke={color} strokeWidth="2.5" />
        {pts.map(([x, y], i) => <circle key={labels[i]} cx={x} cy={y} r="8" fill="transparent"><title>{`${labels[i]}: ${values[i]}`}</title></circle>)}
        {labels.map((l, i) => <text key={l} x={L + 10 + step * i} y={H - 8} textAnchor="middle" className="ka-chart__tick">{l}</text>)}
      </svg>
    </figure>
  )
}

/** Horizontal stacked bars, one row per category. */
export function HBarChart({ rows, series, label }: { rows: string[]; series: Series[]; label: string }) {
  const totals = rows.map((_, i) => series.reduce((a, s) => a + (s.values[i] || 0), 0))
  const max = niceMax(Math.max(...totals, 0))
  return (
    <figure className="ka-chart">
      <Legend series={series} />
      <div className="ka-hbar" role="img" aria-label={`${label}: ${rows.map((r, i) => `${r} ${series.map((s) => `${s.label} ${s.values[i] || 0}`).join(', ')}`).join('; ')}`}>
        {rows.map((r, i) => (
          <div key={r} className="ka-hbar__row">
            <span className="ka-hbar__label">{r}</span>
            <div className="ka-hbar__track">
              {series.map((s) => (s.values[i] ? <span key={s.label} style={{ width: `${(s.values[i] / max) * 100}%`, background: s.color }} title={`${r} · ${s.label}: ${s.values[i]}`} /> : null))}
            </div>
            <span className="ka-hbar__n">{totals[i]}</span>
          </div>
        ))}
      </div>
    </figure>
  )
}

/** Pie with labelled slices. */
export function Pie({ slices, size = 120, label }: { slices: { label: string; value: number; color: string }[]; size?: number; label: string }) {
  const total = slices.reduce((a, s) => a + s.value, 0)
  const r = size / 2
  let angle = -Math.PI / 2
  return (
    <figure className="ka-pie">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={`${label}: ${slices.map((s) => `${s.label} ${total ? Math.round((s.value / total) * 100) : 0}%`).join(', ')}`}>
        {!total ? <circle cx={r} cy={r} r={r} fill="#e6e6e6" /> : slices.map((s) => {
          const a = (s.value / total) * Math.PI * 2
          if (a >= Math.PI * 2 - 1e-6) return <circle key={s.label} cx={r} cy={r} r={r} fill={s.color}><title>{s.label}</title></circle>
          const [x1, y1] = [r + r * Math.cos(angle), r + r * Math.sin(angle)]
          angle += a
          const [x2, y2] = [r + r * Math.cos(angle), r + r * Math.sin(angle)]
          return <path key={s.label} d={`M${r},${r} L${x1},${y1} A${r},${r} 0 ${a > Math.PI ? 1 : 0} 1 ${x2},${y2} Z`} fill={s.color} stroke="#fff" strokeWidth="1"><title>{`${s.label}: ${Math.round((s.value / total) * 100)}%`}</title></path>
        })}
      </svg>
      <ul className="ka-legend">{slices.map((s) => <li key={s.label}><span style={{ background: s.color }} />{s.label}</li>)}</ul>
    </figure>
  )
}

/** Progress ring with the percentage in the middle. */
export function Ring({ pct, color, label, size = 56 }: { pct: number; color: string; label: string; size?: number }) {
  const r = size / 2 - 4, c = 2 * Math.PI * r
  return (
    <figure className="ka-ring" title={label}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={`${label}: ${Math.round(pct)}%`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e6e6e6" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="12">{Math.round(pct)}%</text>
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  )
}

/** Semicircle gauge used by the Progress cards. */
export function Gauge({ pct }: { pct: number }) {
  const len = Math.PI * 90
  return (
    <div className="ka-gauge">
      <svg viewBox="0 0 220 124" aria-hidden="true">
        <path d="M20 110 A90 90 0 0 1 200 110" fill="none" stroke="var(--ka-border-mid, #d9d9d9)" strokeWidth="22" strokeLinecap="round" />
        {pct > 0 && <path d="M20 110 A90 90 0 0 1 200 110" fill="none" stroke="var(--ka-green, #1e7a5a)" strokeWidth="22" strokeLinecap="round" strokeDasharray={`${(pct / 100) * len} ${len}`} />}
      </svg>
      <p><strong>{Math.round(pct)}%</strong>Complete</p>
    </div>
  )
}

/** Letter grade for a completion percentage. */
export const grade = (pct: number) => (pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F')

/** Headline percentage with its change against the previous 30 days. */
export function StatCard({ title, rate }: { title: string; rate?: Rate }) {
  const target = rate ? Math.round(rate.value) : 0
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (!target) { setDisplayed(0); return }
    const start = performance.now()
    const duration = 600
    const frame = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setDisplayed(Math.round(target * (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)))
      if (t < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [target])

  const diff = typeof rate?.difference === 'number' ? rate.difference : 0
  return (
    <section className="ka-card ka-statcard">
      <h2>{title}</h2>
      <strong>{displayed}%</strong>
      <span className={diff < 0 ? 'is-down' : 'is-up'}>{diff > 0 ? '+' : ''}{Math.round(diff)}%</span>
      <p>vs previous 30 days</p>
    </section>
  )
}

