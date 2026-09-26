'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSelf, getSession, type Profile, type Session } from './kpily'

/** Requires a signed-in user: redirects to /login?next=… otherwise, and refreshes the profile. */
export function useRequireSession() {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const s = getSession()
    if (!s?.token) { router.replace(`/login?next=${encodeURIComponent(pathname || '/dashboard')}`); return }
    // Deferred so the first client render matches the server's (loader) output.
    queueMicrotask(() => { setSession(s); setProfile(s.profile); setReady(true) })
    getSelf().then((me) => setProfile((p) => ({ ...(p as Profile), ...me }))).catch((err) => {
      if (err.httpStatus === 401 || err.code === 'NO_SESSION') router.replace(`/login?next=${encodeURIComponent(pathname || '/dashboard')}`)
    })
  }, [router, pathname])

  return { session, profile, ready }
}
