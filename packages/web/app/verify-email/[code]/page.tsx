'use client';

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PageLoader from '@/components/figma/PageLoader'
import MobileAuth from '@/components/figma/MobileAuth'
import { verifyInvitation } from '@/lib/kpily'
import '@/styles/Figma.css'

// Target of the emailed verification link: GET /v1/mail-verify/{code},
// then continue to Company Info with the invitation prefilled.
export default function VerifyEmail() {
  const { code } = useParams<{ code: string }>()
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    let live = true
    verifyInvitation(code)
      .then((invitation) => {
        try { sessionStorage.setItem('kpily.invite', JSON.stringify(invitation)) } catch { /* ignore */ }
        if (live) router.replace(`/register/company?code=${encodeURIComponent(code)}`)
      })
      .catch((err) => { if (live) setError(err.message) })
    return () => { live = false }
  }, [code, router])

  if (!error) return <PageLoader label="Verifying your email" />
  return (
    <main className="kp kp-m kp-m--center-page">
      <MobileAuth title="Link not valid" art="/figma/signup/email-sent.png" align="center"
        lead={<>{error}. The link may have expired or already been used.</>}>
        <Link href="/register" className="kp-m-btn kp-m-center-btn">Send a new link</Link>
      </MobileAuth>
    </main>
  )
}
