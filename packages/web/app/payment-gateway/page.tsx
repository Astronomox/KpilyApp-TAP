'use client';

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import Logo from '@/components/figma/Logo'
import BillingToggle from '@/components/figma/BillingToggle'
import '@/styles/Figma.css'

const PLANS = [
  { id: 'starter', name: 'Starter Plan', icon: '/figma/pricing/hand-waving.svg', features: ['For up to 50 employees', 'Access to polls'] },
  { id: 'team', name: 'Team Plan', icon: '/figma/pricing/users.svg', features: ['For up to 250 employees', 'Access to polls'] },
  { id: 'company', name: 'Company Plan ', icon: '/figma/payment/icon-company.svg', features: ['For up to 1000 employees', 'Access to all add ons'] },
]

function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={`kp-switch ${on ? 'is-on' : ''}`} onClick={onToggle}>
      <span />
    </button>
  )
}

function PaymentGateway() {
  const router = useRouter()
  const params = useSearchParams()
  const [planId, setPlanId] = useState(params.get('plan') || 'company')
  const [billing, setBilling] = useState(params.get('billing') || 'annually')
  const [menu, setMenu] = useState(false)
  const [addOns, setAddOns] = useState({ psychometrics: true, games: true })
  const menuRef = useRef<HTMLDivElement>(null)
  const plan = PLANS.find((p) => p.id === planId) || PLANS[2]

  useEffect(() => {
    const close = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <main className="kp kp-pay">
      <section className="kp-pay__summary">
        <Logo />
        <h1 className="kp-h1 kp-pay__title">Order Summary </h1>
        <dl className="kp-pay__lines">
          <div><dt>Subtotal</dt><dd>$8,000</dd></div>
          <div><dt>Add-Ons</dt><dd>$453.00</dd></div>
          <div className="kp-pay__total"><dt>Total Amount</dt><dd>$8,453.00</dd></div>
        </dl>
        <button type="button" className="kp-btn kp-pay__now" onClick={() => router.push('/payment-success')}>Pay Now</button>
      </section>
      <section className="kp-pay__plan">
        <h2 className="kp-pay__your">Your Plan</h2>
        <div className="kp-pay__card">
          <div className="kp-pay__picker" ref={menuRef}>
            <button type="button" aria-haspopup="listbox" aria-expanded={menu} onClick={() => setMenu(!menu)}>
              <img src={plan.icon} alt="" />{plan.name}<img src="/figma/payment/arrow-drop-down.svg" alt="" className="kp-pay__caret" />
            </button>
            {menu && (
              <ul role="listbox">
                {PLANS.map((p) => (
                  <li key={p.id} role="option" aria-selected={p.id === planId} onClick={() => { setPlanId(p.id); setMenu(false) }}>{p.name}</li>
                ))}
              </ul>
            )}
          </div>
          <BillingToggle value={billing} onChange={setBilling} order={['annually', 'monthly']} />
          <h3 className="kp-plan__get">What You’ll Get</h3>
          <ul className="kp-plan__list">
            {plan.features.map((f) => <li key={f}><img src="/figma/pricing/check-circle.svg" alt="" />{f}</li>)}
          </ul>
          <div className="kp-addons">
            <div className="kp-addons__head">
              <h3>Add - On Products</h3>
              <img src="/figma/payment/more.svg" alt="" />
            </div>
            <div className="kp-addons__row">
              <span className="kp-addons__icon"><img src="/figma/payment/icon-psych.svg" alt="" /></span>
              <span>Psychometrics </span>
              <Switch label="Psychometrics" on={addOns.psychometrics} onToggle={() => setAddOns((a) => ({ ...a, psychometrics: !a.psychometrics }))} />
            </div>
            <div className="kp-addons__row">
              <span className="kp-addons__icon"><img src="/figma/payment/icon-games.svg" alt="" /></span>
              <span>Games </span>
              <Switch label="Games" on={addOns.games} onToggle={() => setAddOns((a) => ({ ...a, games: !a.games }))} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// Figma: Landing page, Sign up and Login → "Payment Gateway page" (1233:7605)
export default function PaymentGatewayPage() {
  return <Suspense><PaymentGateway /></Suspense>
}
