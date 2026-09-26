// Plans as published on kpily.netlify.app (home page + /pricing).
export type Plan = {
  id: 'growth' | 'starter' | 'enterprise'
  name: string
  price: string
  employees: number
  features: string[]
  icon: string
  tone: 'green' | 'blue' | 'gray'
}

export const PLANS: Plan[] = [
  { id: 'growth', name: 'Growth Track', price: '$49.99', employees: 50, features: ['For up to 50 employees'], icon: '/figma/pricing/icon-zero.svg', tone: 'green' },
  { id: 'starter', name: 'Starter Pulse', price: '$0', employees: 5, features: ['For up to 5 employees', 'Access to polls'], icon: '/figma/pricing/hand-waving.svg', tone: 'blue' },
  { id: 'enterprise', name: 'Enterprise Vision', price: '$199.99', employees: 1000, features: ['For up to 1000 employees', 'Access to polls'], icon: '/figma/pricing/users.svg', tone: 'gray' },
]

export const findPlan = (id?: string | null) => PLANS.find((p) => p.id === id) || PLANS[2]
