'use client';

import Link from 'next/link'
import { useState } from 'react'
import Logo from '@/components/figma/Logo'
import BillingToggle from '@/components/figma/BillingToggle'
import { priceLabel } from '@/lib/plans'
import { usePlans } from '@/lib/usePlans'
import '@/styles/Figma.css'

// Pricing — plans from kpily.netlify.app/pricing, card styling from Figma "Pricing Page" (1238:7963).
export default function PricingPage() {
  const [billing, setBilling] = useState('monthly')
  const plans = usePlans()

  return (
    <main className="kp kp-pricing">
      <div className="kp-pricing__logo"><Logo /></div>
      <header className="kp-pricing__head">
        <h1 className="kp-h1">Choose the Plan</h1>
        <BillingToggle value={billing} onChange={setBilling} />
      </header>
      <div className="kp-pricing__row">
        {plans.map((p) => (
          <article key={p.id} className="kp-plan">
            <h2 className="kp-plan__name"><img src={p.icon} alt="" />{p.name}</h2>
            <h3 className="kp-plan__get">What You’ll Get</h3>
            <ul className="kp-plan__list">
              {p.features.map((f) => <li key={f}><img src="/figma/pricing/check-circle.svg" alt="" />{f}</li>)}
            </ul>
            <div className="kp-plan__foot">
              <p className="kp-plan__price">{priceLabel(p, billing)} / user</p>
              <Link href={p.costPerMonth === 0 ? '/register' : `/payment-gateway?plan=${p.id}&billing=${billing}`} className="kp-btn kp-plan__start">Start</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
