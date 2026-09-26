'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Testimonial = { name: string; role: string; title: string; quote: string; photo: string }

// Placeholder testimonials carried over from the previous landing page.
const TESTIMONIALS: Testimonial[] = [
  { name: 'Angela Taylor', role: 'CEO SAMSUNG', title: 'Save Time Managing Social Media For Your Business', quote: 'KPILY has completely transformed our performance tracking process. The real-time feedback has made a huge difference in employee engagement and productivity.', photo: '/assets/landing-testimonial.jpg' },
  { name: 'Michael V', role: 'TEAM LEAD', title: 'A clearer path for every team member', quote: 'The simple feedback loop keeps our teams aligned, motivated, and focused on the work that matters.', photo: '/site/testimonial-michael.jpg' },
]

const AUTOPLAY_MS = 6000

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const drag = useRef<{ x: number; dx: number } | null>(null)
  const [dragX, setDragX] = useState(0)
  const count = TESTIMONIALS.length

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + count) % count), [count])

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => go(1), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [paused, go, index])

  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, dx: 0 }; setPaused(true) }
  const onMove = (e: React.PointerEvent) => { if (!drag.current) return; drag.current.dx = e.clientX - drag.current.x; setDragX(drag.current.dx) }
  const onUp = () => {
    if (drag.current && Math.abs(drag.current.dx) > 60) go(drag.current.dx < 0 ? 1 : -1)
    drag.current = null; setDragX(0); setPaused(false)
  }

  return (
    <div
      className="kp-carousel"
      role="region" aria-roledescription="carousel" aria-label="Client testimonials"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1) }}
      tabIndex={0}
    >
      <div className="kp-carousel__viewport" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={() => drag.current && onUp()}>
        <div className={`kp-carousel__track ${dragX ? 'is-dragging' : ''}`} style={{ transform: `translateX(calc(${-index * 100}% + ${dragX}px))` }}>
          {TESTIMONIALS.map((t, i) => (
            <article key={t.name} className={`kp-slide ${i === index ? 'is-active' : ''}`} aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} aria-hidden={i !== index}>
              <figure className="kp-slide__photo">
                <div className="kp-slide__frame"><img src={t.photo} alt={t.name} draggable={false} /></div>
                <figcaption><strong>{t.name}</strong><span>{t.role}</span></figcaption>
              </figure>
              <blockquote className="kp-slide__quote">
                <span className="kp-slide__mark" aria-hidden="true">“</span>
                <h3>{t.title}</h3>
                <p>{t.quote}</p>
                <div className="kp-slide__stars" aria-label="5 out of 5 stars">★★★★★</div>
                <cite><strong>{t.name}</strong><span>{t.role}</span></cite>
              </blockquote>
            </article>
          ))}
        </div>
      </div>
      <div className="kp-carousel__controls">
        <button type="button" className="kp-home__arrow" aria-label="Previous testimonial" onClick={() => go(-1)}>←</button>
        <button type="button" className="kp-home__arrow" aria-label="Next testimonial" onClick={() => go(1)}>→</button>
        <div className="kp-carousel__dots" role="tablist" aria-label="Choose testimonial">
          {TESTIMONIALS.map((t, i) => (
            <button key={t.name} type="button" role="tab" aria-selected={i === index} aria-label={`Show testimonial ${i + 1}`} className={i === index ? 'is-active' : ''} onClick={() => setIndex(i)}>
              {i === index && !paused && <span className="kp-carousel__progress" key={index} style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{TESTIMONIALS[index].name}: {TESTIMONIALS[index].quote}</p>
    </div>
  )
}
