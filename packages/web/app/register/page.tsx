'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import Logo from '@/components/figma/Logo'
import AuthHero from '@/components/figma/AuthHero'
import '@/styles/Figma.css'

const EMPLOYEE_RANGES = ['0<20', '20<50', '50<100', '>100']
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Other']

// Figma: Landing page, Sign up and Login → "Register" / Company Info (1074:16717)
export default function Register() {
  const router = useRouter()
  const fileInput = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    firstName: '', lastName: '', company: '', email: '',
    employees: '50<100', phoneCode: '', phone: '', industry: '',
    logo: '', country: '', state: '', password: '', confirmPassword: '', agree: false,
  })

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const rules = [
    { ok: form.password.length >= 8, text: 'At least 8 characters. ' },
    { ok: /\d/.test(form.password), text: 'One numeral.' },
    { ok: /[A-Z]/.test(form.password), text: 'One uppercase.' },
  ]
  const matches = form.password.length > 0 && form.password === form.confirmPassword
  const valid = rules.every((r) => r.ok) && matches && form.agree

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (valid) router.push('/success-register')
  }

  return (
    <main className="kp kp-auth kp-register">
      <section className="kp-auth__panel kp-register__panel">
        <div className="kp-register__top">
          <Logo />
          <Link href="/login" className="kp-text-btn kp-register__member">
            Allready a member? <img src="/figma/register/icon-member.svg" alt="" />
          </Link>
        </div>
        <h1 className="kp-h1 kp-register__title">Company&nbsp; Info</h1>
        <form onSubmit={handleSubmit} className="kp-register__form">
          <hr className="kp-dash" />
          <div className="kp-register__grid">
            <div><label className="kp-label" htmlFor="rg-first">First name</label><input id="rg-first" className="kp-input kp-input--roboto" placeholder="John" value={form.firstName} onChange={set('firstName')} required /></div>
            <div><label className="kp-label" htmlFor="rg-last">Last name</label><input id="rg-last" className="kp-input kp-input--roboto" placeholder="Smith" value={form.lastName} onChange={set('lastName')} required /></div>
            <div><label className="kp-label" htmlFor="rg-company">Company</label><input id="rg-company" className="kp-input kp-input--roboto" placeholder="KPILY" value={form.company} onChange={set('company')} required /></div>
            <div><label className="kp-label" htmlFor="rg-email">Work email</label><input id="rg-email" type="email" className="kp-input kp-input--roboto" placeholder="john@kpily.com" value={form.email} onChange={set('email')} required /></div>
          </div>
          <hr className="kp-dash" />
          <div className="kp-register__grid">
            <fieldset className="kp-register__range">
              <legend className="kp-label">Number of employees</legend>
              <div className="kp-seg">
                {EMPLOYEE_RANGES.map((r) => (
                  <button type="button" key={r} className={form.employees === r ? 'is-active' : ''} aria-pressed={form.employees === r} onClick={() => setForm((f) => ({ ...f, employees: r }))}>{r}</button>
                ))}
              </div>
            </fieldset>
            <div>
              <label className="kp-label" htmlFor="rg-phone">Phone number</label>
              <div className="kp-phone">
                <select aria-label="Country code" value={form.phoneCode} onChange={set('phoneCode')}>
                  <option value="">+000</option><option>+1</option><option>+44</option><option>+234</option><option>+254</option><option>+27</option>
                </select>
                <span className="kp-phone__sep" />
                <input id="rg-phone" type="tel" placeholder="00 000 000" value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div>
              <label className="kp-label" htmlFor="rg-industry">Industry</label>
              <select id="rg-industry" className="kp-input" value={form.industry} onChange={set('industry')}>
                <option value="" />
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="kp-label" htmlFor="rg-logo">Company Logo (Optional) </label>
              <div className="kp-upload">
                <input id="rg-logo" readOnly className="kp-input" value={form.logo} onClick={() => fileInput.current?.click()} />
                <button type="button" onClick={() => fileInput.current?.click()}>Upload</button>
                <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => setForm((f) => ({ ...f, logo: e.target.files?.[0]?.name || '' }))} />
              </div>
            </div>
            <div><label className="kp-label" htmlFor="rg-country">Country </label><input id="rg-country" className="kp-input" value={form.country} onChange={set('country')} /></div>
            <div><label className="kp-label" htmlFor="rg-state">State </label><input id="rg-state" className="kp-input" value={form.state} onChange={set('state')} /></div>
            <div>
              <div className="kp-field"><label className="kp-label" htmlFor="rg-pass">Password</label><img className="kp-help" src="/figma/register/icon-help.svg" alt="" title="At least 8 characters, one numeral and one uppercase letter" /></div>
              <input id="rg-pass" type="password" className="kp-input" autoComplete="new-password" value={form.password} onChange={set('password')} required />
              <ul className="kp-rules">
                {rules.map((r) => (
                  <li key={r.text}>{r.ok ? <img src="/figma/register/check-small.svg" alt="met" /> : <span aria-label="not met">x</span>}{r.text}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="kp-field"><label className="kp-label" htmlFor="rg-confirm">Confirm password</label><img className="kp-help" src="/figma/register/icon-help.svg" alt="" title="Re-enter your password" /></div>
              <input id="rg-confirm" type="password" className="kp-input" autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
              <ul className="kp-rules">
                <li>{matches ? <img src="/figma/register/check-small.svg" alt="met" /> : <span aria-label="not met">x</span>}Passwords must match.</li>
              </ul>
            </div>
          </div>
          <hr className="kp-dash" />
          <label className="kp-register__agree">
            <input type="checkbox" checked={form.agree} onChange={set('agree')} />
            <span>I agree with <Link href="/about">terms and conditions</Link>.</span>
          </label>
          <button type="submit" className="kp-btn kp-btn--bold kp-register__submit">Register</button>
        </form>
      </section>
      <div className="kp-auth__art"><AuthHero variant="register" /></div>
    </main>
  )
}
