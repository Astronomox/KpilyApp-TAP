'use client'

import { useState } from 'react'

// Gradient "Why choose us" request-demo band (home page and blog pages).
export default function DemoCta() {
  const [sent, setSent] = useState(false)
  return (
    <section className="kp-cta">
      <div className="kp-cta__inner">
        <div className="kp-cta__copy">
          <p className="kp-cta__eyebrow">Why choose us</p>
          <h2>KPILY drives team engagement and productivity.</h2>
          <p className="kp-cta__lead">A comprehensive solution that puts performance in the hands of the employees.</p>
        </div>
        <form className="kp-cta__form" onSubmit={(e) => {
          e.preventDefault()
          const f = new FormData(e.currentTarget)
          const name = String(f.get('fullname') ?? '').trim()
          const email = String(f.get('email') ?? '').trim()
          const company = String(f.get('companyName') ?? '').trim()
          const body = `Name: ${name}%0ACompany: ${company}%0AEmail: ${email}`
          window.open(`mailto:hello@kpily.com?subject=${encodeURIComponent('Demo Request from ' + company)}&body=${encodeURIComponent(`Name: ${name}\nCompany: ${company}\nEmail: ${email}`)}`)
          setSent(true)
        }}>
          <input aria-label="Company" name="companyName" placeholder="Company Name" required />
          <input aria-label="Work Email" name="email" type="email" placeholder="Work Email Address" required />
          <input aria-label="Full name" name="fullname" placeholder="Name" required />
          <button type="submit">{sent ? 'Thank you!' : 'Get Started'}</button>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', marginTop: 8, textAlign: 'center' }}>Clicking opens your mail app.</p>
        </form>
      </div>
    </section>
  )
}
