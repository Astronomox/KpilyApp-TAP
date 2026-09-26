'use client';

import Link from 'next/link'
import { useState } from 'react'
import Logo from '@/components/figma/Logo'
import '@/styles/Figma.css'

// Figma: Landing page, Sign up and Login → "Forgot password" (1074:18016)
export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <main className="kp kp-photo-split kp-forgot">
      <section className="kp-photo-split__panel">
        <h1 className="kp-h1">Forgot<br />password?</h1>
        <p className="kp-p1 kp-split__lead">Please input your email below and we will send you a link to create a new password.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true) }}>
          <label className="kp-label kp-label--p2" htmlFor="fp-email">Email address</label>
          <input id="fp-email" className="kp-input" type="email" placeholder="john@smith.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="kp-split__actions">
            <button type="submit" className="kp-btn">Request New Password</button>
          </div>
          {sent && <p role="status" className="kp-status">If an account exists for {email}, a reset link is on its way.</p>}
        </form>
        <div className="kp-help-footer">
          <p>Do you need help?</p>
          <Link href="mailto:support@kpily.com">Customer support</Link>
        </div>
      </section>
      <div className="kp-photo-split__art">
        <Logo className="kp-forgot__logo" />
        <img className="kp-forgot__photo" src="/figma/forgot/team.png" alt="A smiling team of five colleagues" />
      </div>
    </main>
  )
}
