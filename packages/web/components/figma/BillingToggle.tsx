// Monthly / Annually pill switch (Pricing and Payment Gateway frames).
export default function BillingToggle({ value, onChange, order = ['monthly', 'annually'] }: { value: string; onChange: (v: string) => void; order?: string[] }) {
  return (
    <div className="kp-toggle" role="radiogroup" aria-label="Billing period">
      {order.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={value === o} className={value === o ? 'is-active' : ''} onClick={() => onChange(o)}>
          {o === 'monthly' ? 'Monthly' : 'Annually'}
        </button>
      ))}
    </div>
  )
}
