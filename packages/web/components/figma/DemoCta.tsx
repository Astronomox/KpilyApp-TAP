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
          <p className="kp-cta__lead">A comprehensive solution that puts performance in the hands of the employees .</p>
        </div>
        <form className="kp-cta__form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
          <input aria-label="Company" name="companyName" placeholder="Company Name" required />
          <input aria-label="Work Email" name="email" type="email" placeholder="Work Email Address" required />
          <input aria-label="Full name" name="fullname" placeholder="Name" required />
          <button type="submit">{sent ? 'Thank you!' : 'Get Started'}</button>
        </form>
      </div>
    </section>
  )
}
