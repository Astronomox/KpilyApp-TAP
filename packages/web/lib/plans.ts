// Plans as published on kpily.netlify.app (home page + /pricing).
export type Plan = {
  id: 'growth' | 'starter' | 'enterprise'
  name: string
  price: string
  employees: number
  features: string[]
  icon: string
  tone: 'green' | 'blue' | 'gray'
  /** Live values from GET /v1/get-plans (fallbacks match the published prices). */
  costPerMonth: number
  costPerYear: number
  apiId?: string
}

export const PLANS: Plan[] = [
  { id: 'growth', name: 'Growth Track', price: '$49.99', employees: 50, costPerMonth: 49.99, costPerYear: 549.99, features: ['For up to 50 employees'], icon: '/figma/pricing/icon-zero.svg', tone: 'green' },
  { id: 'starter', name: 'Starter Pulse', price: '$0', employees: 5, costPerMonth: 0, costPerYear: 0, features: ['For up to 5 employees', 'Access to polls'], icon: '/figma/pricing/hand-waving.svg', tone: 'blue' },
  { id: 'enterprise', name: 'Enterprise Vision', price: '$199.99', employees: 1000, costPerMonth: 199.99, costPerYear: 2199.99, features: ['For up to 1000 employees', 'Access to polls'], icon: '/figma/pricing/users.svg', tone: 'gray' },
]

export const findPlan = (id?: string | null) => PLANS.find((p) => p.id === id) || PLANS[2]

const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`

/** Price label for the billing period, e.g. "$49.99 per month" / "$549.99 per year". */
export const priceLabel = (p: Plan, billing: string) =>
  billing === 'annually' ? `${money(p.costPerYear)} per year` : `${money(p.costPerMonth)} per month`

/** Overlay live API plans (matched by name) onto the static list. */
export function mergeLivePlans(live: { id: string; planName: string; maxEmployee: number; costPerMonth: number; costPerYear: number }[]): Plan[] {
  return PLANS.map((p) => {
    const l = live.find((x) => x.planName.trim().toLowerCase() === p.name.toLowerCase())
    return l ? { ...p, apiId: l.id, employees: l.maxEmployee, costPerMonth: l.costPerMonth, costPerYear: l.costPerYear } : p
  })
}
