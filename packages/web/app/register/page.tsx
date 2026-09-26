'use client';

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import Artboard from '@/components/figma/Artboard'
import MobileAuth from '@/components/figma/MobileAuth'
import FigHero from '@/components/figma/FigHero'
import { at, pop } from '@/lib/fig'
import '@/styles/Figma.css'

// Figma: Landing page, Sign up and Login →
//   "Sign Up" (1467:27926) – Register with work email
//   "Sign Up" (1467:28077) – "Email Link Sent!" confirmation
function SignUp() {
  // Prefilled from the home page "Get Started for Free" form (?email=...).
  const [email, setEmail] = useState(useSearchParams().get('email') || '')
  const [sent, setSent] = useState(false)
  const [resent, setResent] = useState(false)

  const mobile = !sent ? (
    <MobileAuth title="Register" footer={<><p>Already have an account?</p><Link href="/login">Log in</Link></>}>
      <form className="kp-m-form" onSubmit={(e) => { e.preventDefault(); if (email) setSent(true) }}>
        <div className="kp-m-field">
          <label className="kp-m-label" htmlFor="m-register-email">Work Email <img src="/figma/login/icon-help.svg" alt="" title="Use the email address you use at work" /></label>
          <input id="m-register-email" className="kp-m-input kp-m-input--icon" type="email" placeholder="Email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <img className="kp-m-icon" src="/figma/login/icon-user.svg" alt="" />
        </div>
        <button type="submit" className="kp-m-btn">Send Link</button>
      </form>
    </MobileAuth>
  ) : (
    <MobileAuth title="Email Link Sent!" art="/figma/signup/email-sent.png" align="center"
      lead="Please follow the link sent to your email to verify your account and continue registration! "
      footer={<p role="status" style={{ color: '#000', fontSize: 14 }}>{resent ? 'We sent the link again. ' : 'Didn’t get an email? '}<button type="button" className="kp-fx-link" onClick={() => setResent(true)} style={{ fontWeight: 600, color: '#106190' }}>Send link again </button></p>}>
      <span />
    </MobileAuth>
  )

  return (
    <Artboard mobile={mobile}>
      <div style={at(56, 74, 590, 1016, { background: '#fff', boxShadow: '40px 0 40px rgba(0,0,0,.02)' })} />
      <Link href="/" aria-label="KPILY home" style={at(84, 76)}><img src="/assets/logo-full.png" alt="KPILY Performance Management" style={{ width: 184 }} /></Link>

      {!sent ? (
        <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true) }}>
          <h1 style={at(173, 401, 389, 167, pop(600, 48, 56))}>Register</h1>
          <label htmlFor="register-email" style={at(173, 478, 344, 33, pop(400, 14, 20, '#333'))}>Work Email</label>
          <img src="/figma/login/icon-help.svg" alt="" title="Use the email address you use at work" style={at(456, 479, 16, 16)} />
          <input id="register-email" className="kp-fx-input" type="email" placeholder="Email" autoComplete="email" required
            value={email} onChange={(e) => setEmail(e.target.value)} style={at(173, 503, 299.128, 48, { paddingLeft: 39, paddingTop: 6 })} />
          <img src="/figma/login/icon-user.svg" alt="" style={at(181, 517, 16, 16, { opacity: 0.2, pointerEvents: 'none' })} />
          <button type="submit" className="kp-fx-btn kp-fx-btn--bold" style={at(165, 582, 257)}>Send Link</button>
        </form>
      ) : (
        <div>
          <h1 style={at(138, 330, 389, 167, pop(600, 48, 56))}>Email Link Sent!</h1>
          <p style={at(137, 408, 371, undefined, pop(500, 16, 24, '#000', { textAlign: 'center' }))}>Please follow the link sent to your email to verify your account and continue registration! </p>
          <img src="/figma/signup/email-sent.png" alt="Envelope with a check mark" style={at(157, 496, 370, 331, { objectFit: 'cover' })} />
          <p role="status" style={at(0, 947, 646, 24, pop(400, 16, 'normal', '#000', { textAlign: 'center' }))}>
            {resent ? 'We sent the link again. ' : 'Didn’t get an email? '}
            <button type="button" className="kp-fx-link" onClick={() => setResent(true)} style={{ fontWeight: 600, color: '#106190' }}>Send link again </button>
          </p>
        </div>
      )}

      <FigHero green={[646, -57]} photo={[646, -270, 737, 1704]} points={[867, 726]} received={[1015, 785]} />
    </Artboard>
  )
}

export default function RegisterPage() {
  return <Suspense><SignUp /></Suspense>
}
