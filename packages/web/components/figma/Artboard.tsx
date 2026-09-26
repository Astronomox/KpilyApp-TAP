'use client'

import { useEffect, useRef, useState } from 'react'
import PageLoader from './PageLoader'

// Renders a Figma frame at its native size (default 1440×1018) and scales it
// to the viewport width, so every child can use the frame's exact coordinates.
// Below `breakpoint` the `mobile` layout is rendered instead.
export default function Artboard({
  width = 1440, height = 1018, background = '#f9fffd', breakpoint = 900, mobile, children,
}: {
  width?: number; height?: number; background?: string; breakpoint?: number
  mobile?: React.ReactNode; children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [k, setK] = useState<number | null>(null)
  const [narrow, setNarrow] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => setNarrow(!!mobile && mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [breakpoint, mobile])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [width, narrow])

  if (narrow === null) return <PageLoader />
  if (narrow) return <main className="kp kp-m">{mobile}</main>

  return (
    <main className="kp kp-artboard" style={{ background }}>
      {!k && <PageLoader />}
      <div ref={ref} className="kp-artboard__fit" style={{ height: k ? height * k : undefined, aspectRatio: k ? undefined : `${width} / ${height}` }}>
        <div className="kp-artboard__canvas" style={{ width, height, background, transform: `scale(${k ?? 1})`, visibility: k ? 'visible' : 'hidden' }}>
          {children}
        </div>
      </div>
    </main>
  )
}
