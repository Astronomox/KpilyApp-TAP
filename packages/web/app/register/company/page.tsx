'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import Artboard from '@/components/figma/Artboard'
import MobileAuth from '@/components/figma/MobileAuth'
import FigHero from '@/components/figma/FigHero'
import { at, pop } from '@/lib/fig'
import '@/styles/Figma.css'

const RANGES: [string, number][] = [['0<20', 103], ['20<50', 179.97], ['50<100', 256.94], ['>100', 333.9]]
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Other']
const label = pop(500, 12, 'normal', '#333', { letterSpacing: 0.5 })
const note = pop(400, 10, 'normal', '#000', { letterSpacing: 0.25, whiteSpace: 'nowrap' })

// Figma: Landing page, Sign up and Login → "Register" / Company Info (1074:16717), 1440×1018.
export default function CompanyInfo() {
  const router = useRouter()
  const file = useRef<HTMLInputElement>(null)
  const [f, setF] = useState({
    firstName: '', lastName: '', company: '', email: '', employees: '50<100', code: '', phone: '',
    industry: '', logo: '', country: '', state: '', password: '', confirm: '', agree: false,
  })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const rules = [
    { ok: f.password.length >= 8, text: 'At least 8 characters. ', top: 836 },
    { ok: /\d/.test(f.password), text: 'One numeral.', top: 852 },
    { ok: /[A-Z]/.test(f.password), text: 'One uppercase.', top: 868 },
  ]
  const matches = f.password.length > 0 && f.password === f.confirm
  const valid = rules.every((r) => r.ok) && matches && f.agree

  const markAt = (ok: boolean, left: number, top: number) => ok
    ? <img src="/figma/register/check-small.svg" alt="met" style={at(left - 13, top - 2, 17, 17)} />
    : <span aria-label="not met" style={at(left - 3, top, 6, 18, { ...note, textAlign: 'center', letterSpacing: 0.5 })}>x</span>

  const input = (id: keyof typeof f, left: number, top: number, extra: React.InputHTMLAttributes<HTMLInputElement> = {}, pad = 16) => (
    <input id={`rg-${id}`} className="kp-fx-input kp-fx-input--roboto" value={f[id] as string} onChange={set(id)}
      style={at(left, top, 300, 48, { paddingLeft: pad })} {...extra} />
  )

  const submit = (e: React.FormEvent) => { e.preventDefault(); if (valid) router.push('/success-register') }
  const mInput = (id: keyof typeof f, lbl: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}, help?: string) => (
    <div className="kp-m-field">
      <label className="kp-m-label" htmlFor={`m-rg-${id}`}>{lbl}{help && <img src="/figma/register/icon-help.svg" alt="" title={help} />}</label>
      <input id={`m-rg-${id}`} className="kp-m-input" value={f[id] as string} onChange={set(id)} {...extra} />
    </div>
  )
  const mark = (ok: boolean) => ok ? <img src="/figma/register/check-small.svg" alt="met" /> : <span aria-label="not met">x</span>
  const mobile = (
    <MobileAuth title={'Company  Info'} art="none" footer={<><p>Allready a member?</p><Link href="/login">Log in</Link></>}>
      <form className="kp-m-form" onSubmit={submit}>
        {mInput('firstName', 'First name', { placeholder: 'John', required: true })}
        {mInput('lastName', 'Last name', { placeholder: 'Smith', required: true })}
        {mInput('company', 'Company', { placeholder: 'KPILY', required: true })}
        {mInput('email', 'Work email', { placeholder: 'john@kpily.com', type: 'email', required: true })}
        <p className="kp-m-section">Company details</p>
        <div className="kp-m-field">
          <span className="kp-m-label">Number of employees</span>
          <div className="kp-m-seg">
            {RANGES.map(([r]) => <button key={r} type="button" aria-pressed={f.employees === r} className={f.employees === r ? 'is-on' : ''} onClick={() => setF((x) => ({ ...x, employees: r }))}>{r}</button>)}
          </div>
        </div>
        <div className="kp-m-field">
          <label className="kp-m-label" htmlFor="m-rg-phone">Phone number</label>
          <div className="kp-m-phone">
            <select className="kp-m-input" aria-label="Country code" value={f.code} onChange={set('code')}><option value="">+000</option><option>+1</option><option>+44</option><option>+234</option><option>+254</option><option>+27</option></select>
            <input id="m-rg-phone" className="kp-m-input" type="tel" placeholder="00 000 000" value={f.phone} onChange={set('phone')} />
          </div>
        </div>
        <div className="kp-m-field">
          <label className="kp-m-label" htmlFor="m-rg-industry">Industry</label>
          <select id="m-rg-industry" className="kp-m-input" value={f.industry} onChange={set('industry')}><option value="" />{INDUSTRIES.map((i) => <option key={i}>{i}</option>)}</select>
        </div>
        <div className="kp-m-field">
          <label className="kp-m-label" htmlFor="m-rg-logo">Company Logo (Optional) </label>
          <div className="kp-m-upload">
            <input id="m-rg-logo" readOnly className="kp-m-input" value={f.logo} onClick={() => file.current?.click()} />
            <button type="button" onClick={() => file.current?.click()}>Upload</button>
          </div>
        </div>
        {mInput('country', 'Country ')}
        {mInput('state', 'State ')}
        <p className="kp-m-section">Security</p>
        <div>
          {mInput('password', 'Password', { type: 'password', autoComplete: 'new-password', required: true }, 'At least 8 characters, one numeral and one uppercase letter')}
          <ul className="kp-m-note">{rules.map((r) => <li key={r.text}>{mark(r.ok)}{r.text}</li>)}</ul>
        </div>
        <div>
          {mInput('confirm', 'Confirm password', { type: 'password', autoComplete: 'new-password', required: true }, 'Re-enter your password')}
          <ul className="kp-m-note"><li>{mark(matches)}Passwords must match.</li></ul>
        </div>
        <hr className="kp-m-divider" />
        <label className="kp-m-check" style={{ font: "500 12px/18px 'Poppins', sans-serif", color: '#404040', letterSpacing: 0.5 }}>
          <input type="checkbox" className="kp-fx-check" checked={f.agree} onChange={set('agree')} />
          <span>I agree with <Link href="/about" style={{ color: '#18684b' }}>terms and conditions</Link>.</span>
        </label>
        <button type="submit" className="kp-m-btn">Register</button>
      </form>
    </MobileAuth>
  )

  return (
    <Artboard mobile={mobile}>
      <img src="/figma/login/green-panel.svg" alt="" style={at(912, -78, 456, 1121)} />
      <div style={at(-18, -20, 844, 1521, { background: '#fff', boxShadow: '40px 0 40px rgba(0,0,0,.02)' })} />
      <Link href="/" aria-label="KPILY home" style={at(88, 84)}><img src="/assets/logo-full.png" alt="KPILY Performance Management" style={{ width: 184 }} /></Link>
      <h1 style={at(101, 211, 389, 167, pop(600, 48, 56, '#252525', { whiteSpace: 'pre-wrap' }))}>{'Company  Info'}</h1>

      <Link href="/login" style={at(564, 86, 180, 33, { ...label, color: '#18684b', textAlign: 'center' })}>Allready a member?</Link>
      <img src="/figma/register/icon-member.svg" alt="" style={at(728, 86, 16, 16)} />

      <form onSubmit={(e) => { e.preventDefault(); if (valid) router.push('/success-register') }}>
        <img src="/figma/register/dashed-line.svg" alt="" style={at(101, 298, 645, 1)} />
        <label htmlFor="rg-firstName" style={at(100, 309, 236, 25, label)}>First name</label>
        {input('firstName', 100, 334, { placeholder: 'John', required: true })}
        <label htmlFor="rg-lastName" style={at(444, 309, 236, 25, label)}>Last name</label>
        {input('lastName', 444, 334, { placeholder: 'Smith', required: true })}
        <label htmlFor="rg-company" style={at(103, 397, 236, 25, label)}>Company</label>
        {input('company', 103, 422, { placeholder: 'KPILY', required: true })}
        <label htmlFor="rg-email" style={at(444, 397, 236, 25, label)}>Work email</label>
        {input('email', 444, 422, { placeholder: 'john@kpily.com', type: 'email', required: true })}

        <img src="/figma/register/dashed-line.svg" alt="" style={at(95, 483, 645, 1)} />
        <p style={at(103, 492, 236, 25, label)}>Number of employees</p>
        {RANGES.map(([r, left]) => {
          const on = f.employees === r
          return (
            <button key={r} type="button" aria-pressed={on} onClick={() => setF((s) => ({ ...s, employees: r }))}
              style={at(left, 517, 68.097, 48, {
                background: '#fff', border: `1px solid ${on ? '#106190' : '#d1d1d1'}`, boxShadow: on ? '0 0 14px rgba(71,67,224,.2)' : 'none', cursor: 'pointer',
                fontFamily: 'Roboto, sans-serif', fontSize: 14, lineHeight: '28px', letterSpacing: 0.25, color: on ? '#106190' : 'rgba(0,0,0,.5)', padding: 0,
              })}>{r}</button>
          )
        })}

        <label htmlFor="rg-phone" style={at(444, 492, 236, 25, label)}>Phone number</label>
        <div style={at(444, 517, 300, 48, { border: '1px solid #d1d1d1', background: '#fff' })} />
        <select aria-label="Country code" value={f.code} onChange={set('code')}
          style={at(445, 518, 88, 46, { appearance: 'none', border: 0, background: 'transparent', paddingLeft: 16, fontFamily: 'Roboto, sans-serif', fontSize: 14, color: f.code ? '#000' : 'rgba(0,0,0,.4)', outline: 'none', cursor: 'pointer' })}>
          <option value="">+000</option><option>+1</option><option>+44</option><option>+234</option><option>+254</option><option>+27</option>
        </select>
        <img src="/figma/register/caret.svg" alt="" style={at(514, 547, 8, 6, { pointerEvents: 'none' })} />
        <img src="/figma/register/vline.svg" alt="" style={at(534, 518, 1, 48, { pointerEvents: 'none' })} />
        <input id="rg-phone" type="tel" placeholder="00 000 000" value={f.phone} onChange={set('phone')} className="kp-fx-input--roboto"
          style={at(535, 518, 208, 46, { border: 0, outline: 'none', paddingLeft: 14, fontSize: 14, background: 'transparent' })} />

        <label htmlFor="rg-industry" style={at(104, 580, 236, 25, label)}>Industry</label>
        <select id="rg-industry" className="kp-fx-input" value={f.industry} onChange={set('industry')} style={at(104, 605, 300, 48, { appearance: 'none', paddingLeft: 16, cursor: 'pointer' })}>
          <option value="" />
          {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
        </select>
        <img src="/figma/register/caret.svg" alt="" style={at(368, 628, 8, 6, { pointerEvents: 'none' })} />

        <label htmlFor="rg-logo" style={at(444, 580, 236, 25, label)}>{'Company Logo (Optional) '}</label>
        <input id="rg-logo" readOnly className="kp-fx-input" value={f.logo} onClick={() => file.current?.click()} style={at(444, 605, 300, 48, { paddingLeft: 16, paddingRight: 100, cursor: 'pointer' })} />
        <button type="button" onClick={() => file.current?.click()} style={at(649, 614, 86, 31, { background: '#d9d9d9', border: 0, cursor: 'pointer', padding: '3px 0 0 19px', textAlign: 'left', ...pop(400, 14, 20, '#6f6f6f') })}>Upload</button>
        <input ref={file} type="file" accept="image/*" hidden onChange={(e) => setF((s) => ({ ...s, logo: e.target.files?.[0]?.name || '' }))} />

        <label htmlFor="rg-country" style={at(104, 668, 236, 25, label)}>{'Country '}</label>
        {input('country', 104, 693)}
        <label htmlFor="rg-state" style={at(440, 668, 236, 25, label)}>{'State '}</label>
        {input('state', 440, 693)}

        <label htmlFor="rg-password" style={at(104, 756, 236, 25, label)}>Password</label>
        <img src="/figma/register/icon-help.svg" alt="" title="At least 8 characters, one numeral and one uppercase letter" style={at(387, 756, 16, 16)} />
        {input('password', 104, 781, { type: 'password', autoComplete: 'new-password', required: true })}
        <label htmlFor="rg-confirm" style={at(440, 756, 236, 25, label)}>Confirm password</label>
        <img src="/figma/register/icon-help.svg" alt="" title="Re-enter your password" style={at(723, 756, 16, 16)} />
        {input('confirm', 440, 781, { type: 'password', autoComplete: 'new-password', required: true })}

        {rules.map((r) => (
          <div key={r.text}>
            {markAt(r.ok, 109, r.top === 836 ? 834 : r.top)}
            <p style={at(119, r.top, undefined, undefined, note)}>{r.text}</p>
          </div>
        ))}
        {markAt(matches, 443, 834)}
        <p style={at(453, 834, 125, undefined, note)}>Passwords must match.</p>

        <img src="/figma/register/dashed-line.svg" alt="" style={at(101, 886, 645, 1)} />
        <input type="checkbox" className="kp-fx-check" aria-label="I agree with terms and conditions" checked={f.agree} onChange={set('agree')} style={at(296, 896, 24, 24)} />
        <p style={at(328, 899, undefined, 18, pop(500, 12, 'normal', '#404040', { letterSpacing: 0.5, whiteSpace: 'nowrap' }))}>
          {'I agree with '}<Link href="/about" style={{ color: '#18684b' }}>terms and conditions</Link>.
        </p>
        <button type="submit" className="kp-fx-btn kp-fx-btn--bold" style={at(290, 928, 268)}>Register</button>
      </form>

      <img src="/figma/login/hero.png" alt="" aria-hidden="true" style={at(826, -27, 658, 1361, { objectFit: 'cover' })} />
      <FigHero points={[982, 726]} received={[1130, 793]} solid />
    </Artboard>
  )
}
