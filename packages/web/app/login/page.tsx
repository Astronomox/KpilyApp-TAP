'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { login } from '@/lib/kpily'
import Artboard from '@/components/figma/Artboard'
import FigHero from '@/components/figma/FigHero'
import MobileAuth from '@/components/figma/MobileAuth'
import PageLoader from '@/components/figma/PageLoader'
import { at, pop } from '@/lib/fig'
import '@/styles/Figma.css'

// Figma: Landing page, Sign up and Login → "Log in" (1074:17485), 1440×1018.
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
      const session = await login(email, password, remember)
      // New organisations without a subscription are sent to choose a plan first.
      router.push(session.redirectToPlanPage ? '/pricing' : '/dashboard')
    } catch (err) {
      setError(err.message || 'Unable to log in')
      setLoading(false)
    }
  }

  const note = pop(500, 12, 'normal', '#333', { letterSpacing: 0.5 })

  const mobile = (
    <MobileAuth title="Log In" footer={<><p>Don’t have an account yet?</p><Link href="/register">Register here</Link></>}>
      <form className="kp-m-form" onSubmit={handleSubmit}>
        <div className="kp-m-field">
          <label className="kp-m-label" htmlFor="m-login-email">Account <img src="/figma/login/icon-help.svg" alt="" title="Use your work email and password" /></label>
          <input id="m-login-email" className="kp-m-input kp-m-input--icon" type="email" placeholder="Email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <img className="kp-m-icon" src="/figma/login/icon-user.svg" alt="" />
        </div>
        <div className="kp-m-field">
          <input className="kp-m-input kp-m-input--icon" type="password" placeholder="Password" aria-label="Password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <img className="kp-m-icon" src="/figma/login/icon-key.svg" alt="" />
        </div>
        <div className="kp-m-row">
          <label className="kp-m-check"><input type="checkbox" className="kp-fx-check" checked={remember} onChange={(e) => setRemember(e.target.checked)} />Remember me</label>
          <Link href="/forgot-password">Forgot your password?</Link>
        </div>
        {error && <p role="alert" className="kp-m-error">{error}</p>}
        <button type="submit" className="kp-m-btn" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
        <hr className="kp-m-divider" />
        <button type="button" className="kp-m-btn kp-m-btn--outlined"><img src="/figma/login/google.png" alt="" />Sign in with Google</button>
        <button type="button" className="kp-m-btn kp-m-btn--outlined"><img src="/figma/login/microsoft.png" alt="" />Sign in with Microsoft</button>
      </form>
    </MobileAuth>
  )

  return (
    <>
    {loading && <PageLoader label="Signing in" />}
    <Artboard mobile={mobile}>
      <div style={at(28, 2, 590, 1016, { background: '#fff', boxShadow: '40px 0 40px rgba(0,0,0,.02)' })} />
      <img src="/figma/login/icon-english.svg" alt="" style={at(128, 372, 48, 48)} />

      <Link href="/" aria-label="KPILY home" style={at(84, 76)}><img src="/assets/logo-full.png" alt="KPILY Performance Management" style={{ width: 184 }} /></Link>
      <h1 style={at(129, 233, 388, 167, pop(600, 48, 56))}>Log In</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email" style={at(128, 320, 344, 33, pop(400, 14, 20, '#333'))}>Account</label>
        <img src="/figma/login/icon-help.svg" alt="" title="Use your work email and password" style={at(411, 320, 16, 16)} />
        <input id="login-email" className="kp-fx-input" type="email" placeholder="Email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)} style={at(128, 345, 300, 48, { paddingLeft: 36, paddingTop: 6 })} />
        <input className="kp-fx-input" type="password" placeholder="Password" aria-label="Password" autoComplete="current-password" required
          value={password} onChange={(e) => setPassword(e.target.value)} style={at(128, 392, 300, 48, { paddingLeft: 36, paddingTop: 6 })} />
        <img src="/figma/login/icon-user.svg" alt="" style={at(139, 363, 16, 16, { opacity: 0.2, pointerEvents: 'none' })} />
        <img src="/figma/login/icon-key.svg" alt="" style={at(139, 408, 16, 16, { opacity: 0.2, pointerEvents: 'none' })} />

        <label style={at(129, 446, undefined, undefined, { display: 'flex', gap: 5, alignItems: 'flex-end', cursor: 'pointer' })}>
          <input type="checkbox" className="kp-fx-check" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ width: 17, height: 17 }} />
          <span style={pop(400, 14, 20, '#6f6f6f', { width: 106, height: 17 })}>Remember me</span>
        </label>
        <Link href="/forgot-password" style={at(281, 448, 180, 33, { ...note, color: '#18684b' })}>Forgot your password?</Link>
        {error && <p role="alert" style={at(128, 478, 300, undefined, pop(400, 11, 16, '#b65a50'))}>{error}</p>}

        <button type="submit" className="kp-fx-btn kp-fx-btn--bold" disabled={loading} style={at(137, 510, 257)}>{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>

      <img src="/figma/login/divider.svg" alt="" style={at(120, 598, 299, 1)} />
      <button type="button" className="kp-fx-btn kp-fx-btn--outlined" style={at(137, 639, 257, 46)}>
        <img src="/figma/login/google.png" alt="" style={{ width: 26, height: 27, objectFit: 'cover' }} />
        <span style={{ padding: '10px 24px 10px 16px', fontWeight: 500 }}>Sign in with Google</span>
      </button>
      <button type="button" className="kp-fx-btn kp-fx-btn--outlined" style={at(137, 710, 257, 46)}>
        <span style={{ width: 26, height: 27 }} />
        <span style={{ padding: '10px 24px 10px 16px', fontWeight: 500 }}>Sign in with Microsoft</span>
      </button>
      <img src="/figma/login/microsoft.png" alt="" style={at(156, 721, 26, 26, { objectFit: 'cover', pointerEvents: 'none' })} />

      <p style={at(188, 914, 180, 33, { ...note, opacity: 0.3, textAlign: 'center' })}>Don’t have an account yet?</p>
      <Link href="/register" style={at(188, 950, 180, 33, { ...note, color: '#18684b', textAlign: 'center' })}>Register here</Link>

      <FigHero green={[618, -57]} photo={[618, -270, 737, 1704]} points={[867, 726]} received={[1015, 785]} />
    </Artboard>
    </>
  )
}
