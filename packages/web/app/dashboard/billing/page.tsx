'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Icon from '@/components/app/Icon'
import { useProfile } from '@/components/app/ProfileContext'
import SkeletonCard from '@/components/app/SkeletonCard'
import { getSubscriptions, type Subscription } from '@/lib/kpily'
import { money } from '@/lib/plans'
import { usePlans } from '@/lib/usePlans'
import { useLocalSetting } from '@/lib/useLocalSetting'
import '@/styles/Settings.css'
import '@/styles/Billing.css'

const date = (unix?: number) => (unix ? new Date((unix > 1e12 ? unix : unix * 1000)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A')

export default function Billing() {
  const { profile } = useProfile()
  const plans = usePlans()
  const [subs, setSubs] = useState<Subscription[] | null>(null)
  const [error, setError] = useState('')
  const [now] = useState(() => Date.now())
  const [contact, setContact, loaded] = useLocalSetting('kpily.invoice-email', { mode: 'account', email: '' })

  useEffect(() => { getSubscriptions().then(setSubs).catch((e) => { setError(e.message); setSubs([]) }) }, [])

  const planOf = (s: Subscription) => plans.find((p) => p.apiId === s.planID)
  const isActive = (s: Subscription) => (s.status === undefined || s.status === 1) && (!s.endDate || (s.endDate > 1e12 ? s.endDate : s.endDate * 1000) > now)
  const active = (subs ?? []).filter(isActive)
  const inactive = (subs ?? []).filter((s) => !isActive(s))
  const current = active[0]
  const currentPlan = current ? planOf(current) : undefined
  const period = current?.subscriptionType === 2 ? 'annually' : 'monthly'

  const Plan = ({ s }: { s: Subscription }) => {
    const p = planOf(s)
    return (
      <div className="ka-bill__plan">
        <strong>{p?.name ?? s.planName ?? 'Plan'}</strong>
        <span>{s.accounts} user{s.accounts === 1 ? '' : 's'}</span>
        <span>{s.subscriptionType === 2 ? 'Billed annually' : 'Billed monthly'}</span>
        {typeof s.amount === 'number' && <span>{money(s.amount)}</span>}
        {s.endDate ? <span>Renews {date(s.endDate)}</span> : <span>No expiry</span>}
      </div>
    )
  }

  return (
    <div className="ka-set">
      <div className="ka-pagehead">
        <div><h1>Billing</h1><p>Update your payment information or switch plans according to your needs here.</p></div>
        <div className="ka-pagehead__actions">
          <Link className="ka-btn ka-btn--ghost" href={`/dashboard/pricing`}>Change billing period</Link>
          <Link className="ka-btn" href={currentPlan ? `/payment-gateway?plan=${currentPlan.id}&billing=${period}` : '/dashboard/pricing'}>Make Payment</Link>
        </div>
      </div>
      {error && <p role="alert" className="ka-error">{error}</p>}

      <section className="ka-bill__sec"><h2>Current Plan</h2>
        {subs === null ? <SkeletonCard lines={3} height={72} /> : current ? active.map((s, i) => <Plan key={s.id ?? i} s={s} />) : <p className="ka-bill__muted">You do not have an active subscription</p>}
      </section>
      <section className="ka-bill__sec"><h2>Inactive Plans</h2>
        {subs === null ? <SkeletonCard lines={3} height={72} /> : inactive.length ? inactive.map((s, i) => <Plan key={s.id ?? i} s={s} />) : <p className="ka-bill__muted">You do not have an inactive subscription</p>}
      </section>
      <section className="ka-bill__sec"><h2>Charges</h2>
        {subs?.some((s) => typeof s.amount === 'number') ? (
          <table className="ka-table"><thead><tr><th>Plan</th><th>Users</th><th>Amount</th><th>Ends</th></tr></thead>
            <tbody>{subs.filter((s) => typeof s.amount === 'number').map((s, i) => <tr key={s.id ?? i}><td>{planOf(s)?.name ?? s.planName}</td><td>{s.accounts}</td><td>{money(s.amount!)}</td><td>{date(s.endDate)}</td></tr>)}</tbody>
          </table>
        ) : <p className="ka-bill__muted">No charges yet</p>}
      </section>

      <section className="ka-set__row">
        <div className="ka-set__label"><h2>Contact Email</h2><p className="ka-set__plain">Where should invoices be sent?</p></div>
        {loaded && (
          <div className="ka-bill__radios">
            <label><input type="radio" name="invoice" checked={contact.mode === 'account'} onChange={() => setContact({ ...contact, mode: 'account' })} />Send to my account email</label>
            <small><Icon name="mail" size={14} />{profile?.email}</small>
            <label><input type="radio" name="invoice" checked={contact.mode === 'other'} onChange={() => setContact({ ...contact, mode: 'other' })} />Send to an alternative email</label>
            <input className="ka-set__ro" type="email" aria-label="Alternative invoice email" placeholder="billing@yourcompany.com" value={contact.email} disabled={contact.mode !== 'other'} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            <p className="ka-field__hint">Saved in this browser only. Contact support to set a permanent billing address.</p>
          </div>
        )}
      </section>
    </div>
  )
}
