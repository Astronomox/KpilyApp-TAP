'use client';

import Link from 'next/link'
import { useState } from 'react'
import Logo from '@/components/figma/Logo'
import BillingToggle from '@/components/figma/BillingToggle'
import '@/styles/Figma.css'

type Plan = { id: string; name: string; icon: string; price: string; features: string[]; blue?: boolean }

const PLANS: Plan[] = [
  { id: 'free', name: 'Free plan', icon: '/figma/pricing/icon-zero.svg', price: '$0', features: ['For up to 0- 10 employees'] },
  { id: 'starter', name: 'Starter ', icon: '/figma/pricing/hand-waving.svg', price: '$7', features: ['For up to 50 employees', 'Access to polls'] },
  { id: 'team', name: 'Team', icon: '/figma/pricing/users.svg', price: '$6', features: ['For up to 250 employees', 'Access to polls'] },
  { id: 'company', name: 'Company ', icon: '/figma/pricing/users-four.svg', price: '$5', features: ['For up to 1000 employees', 'Access to polls'], blue: true },
]

// Figma: Landing page, Sign up and Login → "Pricing Page" (1238:7963)
export default function PricingPage() {
  const [billing, setBilling] = useState('monthly')

  return (
    <main className="kp kp-pricing">
      <div className="kp-pricing__logo"><Logo /></div>
      <header className="kp-pricing__head">
        <h1 className="kp-h1">Choose the plan</h1>
        <BillingToggle value={billing} onChange={setBilling} />
      </header>
      <div className="kp-pricing__row">
        <aside className="kp-pricing__promo">
          <h2>Save more with volume discounts</h2>
          <p>Choose a plan and get onboard in minutes. </p>
          <img src="/figma/pricing/woman.png" alt="Smiling professional woman" />
        </aside>
        {PLANS.map((p) => (
          <article key={p.id} className="kp-plan">
            <h2 className="kp-plan__name"><img src={p.icon} alt="" />{p.name}</h2>
            <h3 className="kp-plan__get">What You’ll Get</h3>
            <ul className="kp-plan__list">
              {p.features.map((f) => <li key={f}><img src="/figma/pricing/check-circle.svg" alt="" />{f}</li>)}
            </ul>
            <div className="kp-plan__foot">
              <p className="kp-plan__price">{p.price} per month/user </p>
              <Link
                href={p.id === 'free' ? '/register' : `/payment-gateway?plan=${p.id}&billing=${billing}`}
                className={`kp-btn kp-plan__start ${p.blue ? 'kp-btn--blue' : ''}`}
              >Start</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
