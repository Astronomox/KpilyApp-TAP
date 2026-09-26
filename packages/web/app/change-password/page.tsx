'use client';

import Link from 'next/link'
import { useState } from 'react'
import '@/styles/Figma.css'

// Strength meter: 12 segments, filled yellow by score (Figma shows 7 of 12).
function strength(pw: string) {
  let score = 0
  if (pw.length >= 1) score += 2
  if (pw.length >= 8) score += 3
  if (pw.length >= 12) score += 2
  if (/[A-Z]/.test(pw)) score += 2
  if (/\d/.test(pw)) score += 2
  if (/[^A-Za-z0-9]/.test(pw)) score += 1
  return Math.min(score, 12)
}

// Figma: Landing page, Sign up and Login → "Change password" (1074:18251)
export default function ChangePassword() {
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const filled = strength(pw)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pw !== confirm) { setError('Passwords must match.'); return }
    setError('')
    setDone(true)
  }

  return (
    <main className="kp kp-photo-split kp-change">
      <section className="kp-photo-split__panel">
        <h1 className="kp-h1">Change password</h1>
        <p className="kp-p1 kp-split__lead">Please input your new password below.</p>
        <form onSubmit={handleSubmit}>
          <div className="kp-field"><label className="kp-label" htmlFor="cp-new">New password</label><img className="kp-help" src="/figma/register/icon-help.svg" alt="" title="Use 8+ characters with a number and an uppercase letter" /></div>
          <input id="cp-new" className="kp-input" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} required />
          <div className="kp-meter" aria-label={`Password strength ${filled} of 12`}>
            {Array.from({ length: 12 }, (_, i) => <span key={i} className={i < filled ? 'is-on' : ''} />)}
          </div>
          <div className="kp-field" style={{ marginTop: 39 }}><label className="kp-label" htmlFor="cp-confirm">Connfirm new password</label><img className="kp-help" src="/figma/register/icon-help.svg" alt="" title="Re-enter your new password" /></div>
          <input id="cp-confirm" className="kp-input" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          {error && <p role="alert" className="kp-error">{error}</p>}
          {done && <p role="status" className="kp-status">Your password has been changed.</p>}
          <div className="kp-split__actions" style={{ marginTop: 39 }}>
            <button type="submit" className="kp-btn">Change Password</button>
          </div>
        </form>
        <div className="kp-help-footer">
          <p>Do you need help? </p>
          <Link href="mailto:support@kpily.com">Customer support</Link>
        </div>
      </section>
      <div className="kp-photo-split__art">
        <img className="kp-change__photo" src="/figma/change/cheering.png" alt="Two people cheering" />
      </div>
    </main>
  )
}
