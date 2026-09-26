'use client'

import { useEffect, useState } from 'react'
import { getPlans } from './kpily'
import { PLANS, mergeLivePlans, type Plan } from './plans'

/** Plans from GET /v1/get-plans, falling back to the published list. */
export function usePlans(): Plan[] {
  const [plans, setPlans] = useState<Plan[]>(PLANS)
  useEffect(() => {
    let live = true
    getPlans().then((p) => { if (live) setPlans(mergeLivePlans(p)) }).catch(() => { /* keep fallback */ })
    return () => { live = false }
  }, [])
  return plans
}
