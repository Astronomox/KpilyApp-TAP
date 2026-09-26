'use client';

import { useState } from 'react'
import SiteHeader from '@/components/figma/SiteHeader'
import '@/styles/Figma.css'
import '@/styles/FigmaSite.css'

const CONTACTS = [
  { title: 'Support', text: 'Our friendly team is here to help.', link: 'support@kpilycom', href: 'mailto:support@kpily.com' },
  { title: 'Sales', text: 'Questions or queries? Get in touch!', link: 'sales@kpily.com', href: 'mailto:sales@kpily.com' },
  { title: 'Phone', text: 'Mon-Fri from 8am to 5pm.', link: '+1 (555) 000-0000', href: 'tel:+15550000000' },
]

// Figma: Landing page, Sign up and Login → "Desktop" (About us / Contact, 1557:94652)
export default function About() {
  const [sent, setSent] = useState(false)
  const [agree, setAgree] = useState(false)

  return (
    <div className="kp kp-site">
      <SiteHeader />
      <main>
        <section className="kp-page-head kp-about-head">
          <p className="kp-eyebrow">About us</p>
          <h1>We’re a distributed team</h1>
          <p>We have offices and teams all around the world.</p>
        </section>
        <div className="kp-container kp-about-space" aria-hidden="true" />
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
          <p className="kp-contact-form__lead">We’d love to hear from you. Please fill out this form.</p>
          <form onSubmit={(e) => { e.preventDefault(); if (agree) setSent(true) }}>
            <div className="kp-contact-form__row">
              <label>First name<input placeholder="First name" required /></label>
              <label>Last name<input placeholder="Last name" required /></label>
            </div>
            <label>Email<input type="email" placeholder="you@company.com" required /></label>
            <label>Phone number
              <span className="kp-contact-form__phone">
                <select aria-label="Country"><option>US</option><option>UK</option><option>NG</option><option>KE</option><option>ZA</option></select>
                <input type="tel" placeholder="+1 (555) 000-0000" />
              </span>
            </label>
            <label>Message<textarea rows={5} required /></label>
            <label className="kp-contact-form__agree">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>You agree to our friendly <a href="#">privacy policy</a>.</span>
            </label>
            <button type="submit">{sent ? 'Message sent' : 'Send message'}</button>
          </form>
        </section>
        <section className="kp-container kp-press">
          <p>We’ve been mentioned in the press</p>
          <div>
            <img src="/figma/about/press-1.svg" alt="The Washington Post" width={274} height={40} />
            <img src="/figma/about/press-2.svg" alt="TechCrunch" width={238} height={40} />
            <img src="/figma/about/press-3.svg" alt="Bloomberg" width={180} height={40} />
            <img src="/figma/about/press-4.svg" alt="Gizmodo" width={165} height={40} />
            <img src="/figma/about/press-5.svg" alt="Forbes" width={115} height={40} />
          </div>
        </section>
      </main>
    </div>
  )
}
