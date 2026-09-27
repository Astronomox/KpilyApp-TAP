// Paystack Inline checkout (https://paystack.com/docs/payments/accept-payments/#popup).
// Needs NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY; amounts are in the currency's main unit.

type PaystackPop = { setup(o: Record<string, unknown>): { openIframe(): void } }
declare global { interface Window { PaystackPop?: PaystackPop } }

export const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''
export const PAYSTACK_CURRENCY = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY || 'USD'

let loading: Promise<void> | null = null
function loadScript() {
  if (window.PaystackPop) return Promise.resolve()
  loading ??= new Promise<void>((resolve, reject) => {
    const s = Object.assign(document.createElement('script'), { src: 'https://js.paystack.co/v1/inline.js', async: true })
    s.onload = () => resolve()
    s.onerror = () => { loading = null; reject(new Error('Could not load Paystack. Check your connection and try again.')) }
    document.head.appendChild(s)
  })
  return loading
}

/** Opens the Paystack popup; resolves with the transaction reference, or null if the buyer closes it. */
export async function payWithPaystack({ email, amount, metadata }: { email: string; amount: number; metadata?: Record<string, unknown> }): Promise<string | null> {
  if (!PAYSTACK_KEY) throw new Error('Payments are not set up yet: add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to the environment.')
  await loadScript()
  const ref = `kpily-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return new Promise((resolve) => {
    window.PaystackPop!.setup({
      key: PAYSTACK_KEY, email, currency: PAYSTACK_CURRENCY, ref, metadata,
      amount: Math.round(amount * 100),
      callback: (res: { reference: string }) => resolve(res.reference),
      onClose: () => resolve(null),
    }).openIframe()
  })
}
