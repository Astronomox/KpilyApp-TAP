'use client';

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import Logo from '@/components/figma/Logo'
import BillingToggle from '@/components/figma/BillingToggle'
import { getSession, subscribe } from '@/lib/kpily'
import { payWithPaystack } from '@/lib/paystack'
import { money } from '@/lib/plans'
import { usePlans } from '@/lib/usePlans'
import '@/styles/Figma.css'


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
  const plans = usePlans()
  const [planId, setPlanId] = useState(() => plans.find((p) => p.id === params.get('plan'))?.id ?? 'enterprise')
  const [billing, setBilling] = useState(params.get('billing') || 'annually')
  const [menu, setMenu] = useState(false)
  const [addOns, setAddOns] = useState({ psychometrics: true, games: true })
  const menuRef = useRef<HTMLDivElement>(null)
  const plan = plans.find((p) => p.id === planId) ?? plans[2]
  const [seats, setSeats] = useState<number | null>(null)
  const users = Math.min(Math.max(seats ?? plan.minEmployees, plan.minEmployees), plan.employees)
  const unit = billing === 'annually' ? plan.costPerYear : plan.costPerMonth
  const subtotal = unit * users
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  // Pay with Paystack, then record the subscription (free plans skip checkout).
  async function pay() {
    const session = getSession()
    if (!session?.token) { router.push(`/login?next=${encodeURIComponent(`/payment-gateway?plan=${plan.id}&billing=${billing}`)}`); return }
    if (!plan.apiId) { setError('Plans are still loading. Please try again in a moment.'); return }
    setPaying(true); setError('')
    try {
      if (subtotal > 0) {
        const ref = await payWithPaystack({ email: session.profile.email, amount: subtotal, metadata: { plan: plan.name, users, billing } })
        if (!ref) { setPaying(false); return }
      }
      await subscribe(plan.apiId, users, billing === 'annually' ? 2 : 1)
      router.push('/payment-success')
    } catch (e) { setError(e.message); setPaying(false) }
  }

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
          <div><dt>Subtotal <small>({users} user{users === 1 ? '' : 's'} × {money(unit)})</small></dt><dd>{money(subtotal)}</dd></div>
          <div><dt>Add-Ons</dt><dd>{money(0)}</dd></div>
          <div className="kp-pay__total"><dt>Total Amount</dt><dd>{money(subtotal)}</dd></div>
        </dl>
        <label className="kp-pay__users">Number of users
          <input type="number" min={plan.minEmployees} max={plan.employees} value={users} onChange={(e) => setSeats(Number(e.target.value))} />
          <small>{plan.minEmployees}–{plan.employees} users on this plan</small>
        </label>
        {error && <p role="alert" className="kp-error">{error}</p>}
        <button type="button" className="kp-btn kp-pay__now" disabled={paying} onClick={pay}>{paying ? 'Processing…' : subtotal > 0 ? 'Pay Now' : 'Start Free Plan'}</button>
      </section>
      <section className="kp-pay__plan">
        <h2 className="kp-pay__your">Your Plan</h2>
        <div className="kp-pay__card">
          <div className="kp-pay__picker" ref={menuRef}>
            <button type="button" aria-haspopup="listbox" aria-expanded={menu} onClick={() => setMenu(!menu)}>
              <img src={plan.icon} alt="" />{plan.name} Plan<img src="/figma/payment/arrow-drop-down.svg" alt="" className="kp-pay__caret" />
            </button>
            {menu && (
              <ul role="listbox">
                {plans.map((p) => (
                  <li key={p.id} role="option" aria-selected={p.id === planId} onClick={() => { setPlanId(p.id); setMenu(false) }}>{p.name} Plan</li>
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
