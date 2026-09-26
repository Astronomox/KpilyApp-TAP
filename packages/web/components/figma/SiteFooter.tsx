'use client'

import Link from 'next/link'
import { useState } from 'react'
import SocialLinks from './SocialLinks'

// "Section Footer CTA" + dark footer from the Blog / Blog post frames.
export default function SiteFooter() {
  const [sent, setSent] = useState(false)

  return (
    <footer className="kp-site-footer">
      <section className="kp-cta" style={{ backgroundImage: "url('/figma/blog/cta-bg.png')" }}>
        <div className="kp-cta__inner">
          <div className="kp-cta__copy">
            <p className="kp-cta__eyebrow">Why Choose Us</p>
            <h2>KPILY drives team engagement and productivity.</h2>
            <p className="kp-cta__lead">A comprehensive solution that puts performance in the hands of the employees .</p>
          </div>
          <form className="kp-cta__form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <input aria-label="Company Name" placeholder="Company Name" required />
            <input aria-label="Work Email Address" type="email" placeholder="Work Email Address" required />
            <input aria-label="Name" placeholder="Name " required />
            <button type="submit">{sent ? 'Request sent' : 'Request Demo '}</button>
          </form>
        </div>
      </section>
      <div className="kp-footer">
        <div className="kp-footer__inner">
          <div className="kp-footer__brand">
            <div className="kp-footer__logo" aria-label="KPILY Performance Management">
              <img src="/kpily/logo-symbol.png" alt="" />
              <span><strong>KPILY</strong><small>Performance Management</small></span>
            </div>
            <SocialLinks dark />
          </div>
          <div className="kp-footer__col">
            <h3>Company</h3>
            <Link href="/about">About Us</Link>
            <Link href="/about">Press</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div className="kp-footer__col">
            <h3>Get Started</h3>
            <Link href="/about">Request a demo</Link>
            <Link href="/signup">Sign Up</Link>
            <Link href="/login">Log In</Link>
          </div>
          <div className="kp-footer__col">
            <h3>Contact</h3>
            <span>Phone</span>
            <a href="tel:+234">+234 XXX XXX XXXX</a>
            <span>Email</span>
            <a href="mailto:support@kpily.com">support@kpily.com</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
