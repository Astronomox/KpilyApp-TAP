'use client';

import Link from 'next/link'
import { useState } from 'react'
import Artboard from '@/components/figma/Artboard'
import MobileAuth from '@/components/figma/MobileAuth'
import { at, pop } from '@/lib/fig'
import '@/styles/Figma.css'

// Figma: Landing page, Sign up and Login → "Forgot password" (1074:18016), 1440×1018.
export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const note = pop(500, 12, 'normal', '#333', { letterSpacing: 0.5, textAlign: 'center' })

  const mobile = (
    <MobileAuth title={<>Forgot<br />password?</>} art="/figma/forgot/team.png"
      lead="Please input your email below and we will send you a link to create a new password."
      footer={<><p>Do you need help?</p><a href="mailto:support@kpily.com" style={{ color: '#468eb8' }}>Customer support</a></>}>
      <form className="kp-m-form" onSubmit={(e) => { e.preventDefault(); if (email) setSent(true) }}>
        <div className="kp-m-field">
          <label className="kp-m-label" htmlFor="m-fp-email">Email address</label>
          <input id="m-fp-email" className="kp-m-input" type="email" placeholder="john@smith.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit" className="kp-m-btn">Request New Password</button>
        {sent && <p role="status" className="kp-m-status">If an account exists for {email}, a reset link is on its way.</p>}
      </form>
    </MobileAuth>
  )

  return (
    <Artboard mobile={mobile}>
      <div style={at(0, 2, 480, 1016, { background: '#fff', boxShadow: '40px 0 40px rgba(0,0,0,.02)' })} />
      <h1 style={at(90, 176, 277, 167, pop(600, 48, 56))}>Forgot<br />password?</h1>
      <p style={at(90, 337, 300, 183, pop(500, 16, 24, '#404040', { opacity: 0.99 }))}>Please input your email below and we will send you a link to create a new password.</p>
      <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true) }}>
        <label htmlFor="fp-email" style={at(91, 448, 344, 33, pop(400, 14, 20, '#333'))}>Email address</label>
        <input id="fp-email" className="kp-fx-input" type="email" placeholder="john@smith.com" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)} style={at(91, 473, 300, 48, { paddingLeft: 16 })} />
        <button type="submit" className="kp-fx-btn" style={at(122, 563)}>Request New Password</button>
        {sent && <p role="status" style={at(91, 625, 300, undefined, pop(500, 12, 18, '#166448'))}>If an account exists for {email}, a reset link is on its way.</p>}
      </form>
      <p style={at(152, 914, 180, 33, { ...note, opacity: 0.3 })}>Do you need help?</p>
      <a href="mailto:support@kpily.com" style={at(152, 950, 180, 33, { ...note, color: '#468eb8' })}>Customer support</a>
      <img src="/figma/forgot/team.png" alt="A smiling team of five colleagues" style={at(494, 79, 959, 945)} />
      <Link href="/" aria-label="KPILY home" style={at(1174, 84)}><img src="/assets/logo-full.png" alt="KPILY Performance Management" style={{ width: 184 }} /></Link>
    </Artboard>
  )
}
