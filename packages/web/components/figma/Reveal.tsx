'use client'

import { useEffect, useRef, useState } from 'react'

// Fades/slides its children in the first time they scroll into view.
export default function Reveal({
  children, as: Tag = 'div', className = '', delay = 0, from = 'up',
}: {
  children: React.ReactNode
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  delay?: number
  from?: 'up' | 'left' | 'right' | 'zoom'
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect() }
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    io.observe(node)
    return () => io.disconnect()
  }, [])

  const Comp = Tag as React.ElementType
  return (
    <Comp ref={ref} className={`kp-reveal kp-reveal--${from} ${shown ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Comp>
  )
}
