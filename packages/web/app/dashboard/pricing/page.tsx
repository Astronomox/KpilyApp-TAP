'use client'

import Link from 'next/link'
import { useState } from 'react'
import BillingToggle from '@/components/figma/BillingToggle'
import { priceLabel } from '@/lib/plans'
import { usePlans } from '@/lib/usePlans'
import '@/styles/Figma.css'
import '@/styles/Billing.css'

// In-app plan picker ("Choose the Plan"); Start opens checkout for that plan.
export default function DashboardPricing() {
  const plans = usePlans()
  const [billing, setBilling] = useState('monthly')
  return (
    <div className="ka-plans">
      <h1>Choose the Plan</h1>
      <BillingToggle value={billing} onChange={setBilling} order={['monthly', 'annually']} />
      <div className="ka-plans__grid">
        {plans.map((p) => (
          <article key={p.id} className="ka-card ka-plans__card">
            <h2><img src={p.icon} alt="" />{p.name}</h2>
            <h3>What You’ll Get</h3>
            <ul>
              {[`For up to ${p.employees} employees`, 'Access to polls'].map((f) => <li key={f}><img src="/figma/pricing/check-circle.svg" alt="" />{f}</li>)}
            </ul>
            <p className="ka-plans__price">{priceLabel(p, billing)} / user</p>
            <Link className="ka-btn ka-plans__start" href={`/payment-gateway?plan=${p.id}&billing=${billing}`}>Start</Link>
          </article>
        ))}
      </div>
    </div>
  )
}
