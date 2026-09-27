'use client';

import { useState } from 'react'
import SiteHeader from '@/components/figma/SiteHeader'
import SiteFooter from '@/components/figma/SiteFooter'
import '@/styles/Figma.css'
import '@/styles/FigmaSite.css'

const CONTACTS = [
  { title: 'Support', text: 'Our friendly team is here to help.', link: 'support@kpily.com', href: 'mailto:support@kpily.com' },
  { title: 'Sales', text: 'Questions or queries? Get in touch!', link: 'sales@kpily.com', href: 'mailto:sales@kpily.com' },
  { title: 'Phone', text: 'Mon-Fri from 8am to 5pm.', link: '+234 090 2442 9918', href: 'tel:+2349024429918' },
]

// Figma: Landing page, Sign up and Login → "Desktop" (About us / Contact, 1557:94652)
export default function About() {
  const [sent, setSent] = useState(false)

  return (
    <div className="kp kp-site">
      <SiteHeader />
      <main>
        <section className="kp-page-head kp-about-head">
          <p className="kp-eyebrow">About us</p>
          <h1>We're a distributed team</h1>
          <p>We have offices and teams all around the world.</p>
        </section>
        <div className="kp-about-copy">
          <p>KPILY was built around one belief: great performance starts with clear goals, honest feedback and recognition that matters. We set out to give every organisation (whether a fast-growing startup or an established enterprise) a single platform where managers and employees stay aligned, work gets tracked, and achievements are celebrated in real time.</p>
          <p>Our platform combines task management, KPI tracking, points and badges, and in-depth analytics into one product that&apos;s easy to roll out and even easier to use day-to-day. With KPILY, performance reviews become a continuous conversation rather than a once-a-year event, so your people always know where they stand and what to focus on next.</p>
        </div>
        <section className="kp-container kp-contacts">
          {CONTACTS.map((c) => (
            <div key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <a href={c.href}>{c.link}</a>
            </div>
          ))}
        </section>
        <section className="kp-green-band" aria-hidden="true" />
        <section className="kp-contact-form">
          <p className="kp-eyebrow">Contact us</p>
          <h2>Get in touch</h2>
          <p className="kp-contact-form__lead">We'd love to hear from you. Please fill out this form.</p>
          <form onSubmit={(e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            const first = String(f.get('firstName') ?? '').trim()
            const last  = String(f.get('lastName')  ?? '').trim()
            const email = String(f.get('email')     ?? '').trim()
            const msg   = String(f.get('message')   ?? '').trim()
            const body  = `Name: ${first} ${last}\nEmail: ${email}\n\n${msg}`
            window.open(`mailto:contact@kpily.com?subject=${encodeURIComponent(`Message from ${first} ${last}`)}&body=${encodeURIComponent(body)}`)
            setSent(true)
          }}>
            <div className="kp-contact-form__row">
              <label>First name<input name="firstName" placeholder="First name" required /></label>
              <label>Last name<input name="lastName" placeholder="Last name" required /></label>
            </div>
            <label>Email<input name="email" type="email" placeholder="Email Address" required /></label>
            <label>Phone number
              <span className="kp-contact-form__phone">
                <select aria-label="Country code"><option>+000</option><option>+1</option><option>+44</option><option>+234</option><option>+254</option><option>+27</option></select>
                <input type="tel" placeholder="000 000 000" />
              </span>
            </label>
            <label>Message<textarea name="message" rows={5} required /></label>
            <p className="kp-contact-form__hint">Clicking Send message will open your default mail app.</p>
            <button type="submit">{sent ? 'Mail app opened ✓' : 'Send message'}</button>
          </form>
        </section>
        <section className="kp-container kp-press">
          <p>We've been mentioned in the press</p>
          <div>
            <img src="/figma/about/press-1.svg" alt="The Washington Post" width={274} height={40} />
            <img src="/figma/about/press-2.svg" alt="TechCrunch" width={238} height={40} />
            <img src="/figma/about/press-3.svg" alt="Bloomberg" width={180} height={40} />
            <img src="/figma/about/press-4.svg" alt="Gizmodo" width={165} height={40} />
            <img src="/figma/about/press-5.svg" alt="Forbes" width={115} height={40} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
