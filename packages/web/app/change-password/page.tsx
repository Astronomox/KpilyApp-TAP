'use client';

import { useState } from 'react'
import Artboard from '@/components/figma/Artboard'
import MobileAuth from '@/components/figma/MobileAuth'
import { at, pop } from '@/lib/fig'
import '@/styles/Figma.css'

// 12-segment strength meter (Figma shows 7 of 12 filled).
function strength(pw: string) {
  let s = 0
  if (pw.length >= 1) s += 2
  if (pw.length >= 8) s += 3
  if (pw.length >= 12) s += 2
  if (/[A-Z]/.test(pw)) s += 2
  if (/\d/.test(pw)) s += 2
  if (/[^A-Za-z0-9]/.test(pw)) s += 1
  return Math.min(s, 12)
}

// Figma: Landing page, Sign up and Login → "Change password" (1074:18251), 1440×1018.
export default function ChangePassword() {
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const filled = strength(pw)
  const label = pop(500, 12, 'normal', '#333', { letterSpacing: 0.5 })
  const note = pop(500, 12, 'normal', '#333', { letterSpacing: 0.5, textAlign: 'center' })

  const submit = (e: React.FormEvent) => { e.preventDefault(); setMsg(pw === confirm ? { ok: true, text: 'Your password has been changed.' } : { ok: false, text: 'Passwords must match.' }) }
  const mobile = (
    <MobileAuth title="Change password" art="/figma/change/cheering.png" lead="Please input your new password below."
      footer={<><p>Do you need help? </p><a href="mailto:support@kpily.com" style={{ color: '#468eb8' }}>Customer support</a></>}>
      <form className="kp-m-form" onSubmit={submit}>
        <div className="kp-m-field">
          <label className="kp-m-label" htmlFor="m-cp-new">New password <img src="/figma/register/icon-help.svg" alt="" title="Use 8+ characters with a number and an uppercase letter" /></label>
          <input id="m-cp-new" className="kp-m-input" type="password" autoComplete="new-password" required value={pw} onChange={(e) => setPw(e.target.value)} />
          <div className="kp-m-meter" aria-label={`Password strength ${filled} of 12`}>{Array.from({ length: 12 }, (_, i) => <span key={i} className={i < filled ? 'is-on' : ''} />)}</div>
        </div>
        <div className="kp-m-field">
          <label className="kp-m-label" htmlFor="m-cp-confirm">Connfirm new password <img src="/figma/register/icon-help.svg" alt="" title="Re-enter your new password" /></label>
          <input id="m-cp-confirm" className="kp-m-input" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {msg && <p role={msg.ok ? 'status' : 'alert'} className={msg.ok ? 'kp-m-status' : 'kp-m-error'}>{msg.text}</p>}
        <button type="submit" className="kp-m-btn">Change Password</button>
      </form>
    </MobileAuth>
  )

  return (
    <Artboard mobile={mobile}>
      <div style={at(0, 2, 480, 1016, { background: '#fff', boxShadow: '40px 0 40px rgba(0,0,0,.02)' })} />
      <img src="/figma/change/cheering.png" alt="Two people cheering" style={at(417, -203, 1023, 1680, { objectFit: 'cover' })} />
      <h1 style={at(93, 176, 389, 167, pop(600, 48, 56))}>Change password</h1>
      <p style={at(91, 337, 319, 112, pop(500, 16, 24, '#404040', { opacity: 0.99 }))}>Please input your new password below.</p>
      <form onSubmit={(e) => { e.preventDefault(); setMsg(pw === confirm ? { ok: true, text: 'Your password has been changed.' } : { ok: false, text: 'Passwords must match.' }) }}>
        <label htmlFor="cp-new" style={at(92, 393, 344, 33, label)}>New password</label>
        <img src="/figma/register/icon-help.svg" alt="" title="Use 8+ characters with a number and an uppercase letter" style={at(375, 393, 16, 16)} />
        <input id="cp-new" className="kp-fx-input" type="password" autoComplete="new-password" required value={pw} onChange={(e) => setPw(e.target.value)} style={at(92, 418, 300, 48, { paddingLeft: 16 })} />
        <div aria-label={`Password strength ${filled} of 12`}>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} style={at(92 + i * 25, 473, 24, 6, { background: i < filled ? '#f3c652' : '#eaeaea' })} />
          ))}
        </div>
        <label htmlFor="cp-confirm" style={at(92, 518, 344, 33, label)}>Connfirm new password</label>
        <img src="/figma/register/icon-help.svg" alt="" title="Re-enter your new password" style={at(375, 518, 16, 16)} />
        <input id="cp-confirm" className="kp-fx-input" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} style={at(92, 543, 300, 48, { paddingLeft: 16 })} />
        <button type="submit" className="kp-fx-btn" style={at(144, 630)}>Change Password</button>
        {msg && <p role={msg.ok ? 'status' : 'alert'} style={at(92, 690, 300, undefined, pop(500, 12, 18, msg.ok ? '#166448' : '#b65a50', { textAlign: 'center' }))}>{msg.text}</p>}
      </form>
      <p style={at(152, 914, 180, 33, { ...note, opacity: 0.3 })}>{'Do you need help? '}</p>
      <a href="mailto:support@kpily.com" style={at(152, 950, 180, 33, { ...note, color: '#468eb8' })}>Customer support</a>
    </Artboard>
  )
}
