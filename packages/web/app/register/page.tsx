'use client';

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Logo from '@/components/figma/Logo'
import AuthHero from '@/components/figma/AuthHero'
import '@/styles/Figma.css'

// Figma: Landing page, Sign up and Login →
//   "Sign Up" (1467:27926)  – Register with work email (button text "Get Code" per kpily.netlify.app/register)
//   "Sign Up" (1467:28077)  – "Email Link Sent!" confirmation
function SignUp() {
  // Prefilled from the home page "Get Started for Free" form (?email=...).
  const [email, setEmail] = useState(useSearchParams().get('email') || '')
  const [sent, setSent] = useState(false)
  const [resent, setResent] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email) setSent(true)
  }

  return (
    <main className="kp kp-auth kp-signup">
      <section className="kp-auth__panel">
        <Logo />
        {!sent ? (
          <div className="kp-auth__body kp-signup__body">
            <h1 className="kp-h1">Register</h1>
            <form onSubmit={handleSubmit} className="kp-signup__form">
              <div className="kp-field">
                <label className="kp-label kp-label--p2" htmlFor="signup-email">Work Email</label>
                <img className="kp-help" src="/figma/login/icon-help.svg" alt="" title="Use the email address you use at work" />
              </div>
              <div className="kp-field">
                <img className="kp-input-icon" src="/figma/login/icon-user.svg" alt="" />
                <input id="signup-email" className="kp-input kp-input--icon" type="email" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="kp-btn kp-btn--bold kp-signup__submit">Get Code</button>
            </form>
          </div>
        ) : (
          <div className="kp-auth__body kp-sent">
            <h1 className="kp-h1">Email Link Sent!</h1>
            <p className="kp-sent__text">Please follow the link sent to your email to verify your account and continue registration! </p>
            <img className="kp-sent__art" src="/figma/signup/email-sent.png" alt="Email with a check mark" />
            <p className="kp-sent__again" role="status">
              Didn’t get an email?{' '}
              <button type="button" onClick={() => setResent(true)}>{resent ? 'Link sent again' : 'Send link again '}</button>
            </p>
          </div>
        )}
      </section>
      <div className="kp-auth__art"><AuthHero /></div>
    </main>
  )
}

export default function RegisterPage() {
  return <Suspense><SignUp /></Suspense>
}
