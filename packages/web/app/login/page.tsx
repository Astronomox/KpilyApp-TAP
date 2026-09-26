'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { login } from '@/lib/api'
import Logo from '@/components/figma/Logo'
import AuthHero from '@/components/figma/AuthHero'
import '@/styles/Figma.css'

// Figma: Landing page, Sign up and Login → "Log in" (1074:17485)
export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Unable to log in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="kp kp-auth kp-login">
      <section className="kp-auth__panel">
        <Logo />
        <div className="kp-auth__body kp-login__body">
          <h1 className="kp-h1">Log In</h1>
          <form onSubmit={handleSubmit} className="kp-login__form">
            <div className="kp-field">
              <label className="kp-label kp-label--p2" htmlFor="login-email">Account</label>
              <img className="kp-help" src="/figma/login/icon-help.svg" alt="" title="Use your work email and password" />
            </div>
            <div className="kp-field">
              <img className="kp-input-icon" src="/figma/login/icon-user.svg" alt="" />
              <input id="login-email" className="kp-input kp-input--icon" type="email" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="kp-field" style={{ marginTop: -1 }}>
              <img className="kp-input-icon" src="/figma/login/icon-key.svg" alt="" />
              <input className="kp-input kp-input--icon" type="password" placeholder="Password" aria-label="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="kp-login__row">
              <label className="kp-check">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="kp-text-btn">Forgot your password?</Link>
            </div>
            {error && <p role="alert" className="kp-error">{error}</p>}
            <button type="submit" className="kp-btn kp-btn--bold kp-login__submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
          </form>
          <img className="kp-login__divider" src="/figma/login/divider.svg" alt="" />
          <button type="button" className="kp-btn kp-btn--outlined kp-login__sso"><img src="/figma/login/google.png" alt="" />Sign in with Google</button>
          <button type="button" className="kp-btn kp-btn--outlined kp-login__sso"><img src="/figma/login/microsoft.png" alt="" />Sign in with Microsoft</button>
        </div>
        <div className="kp-auth__footer">
          <p>Don’t have an account yet?</p>
          <Link href="/signup">Register here</Link>
        </div>
      </section>
      <div className="kp-auth__art"><AuthHero /></div>
    </main>
  )
}
