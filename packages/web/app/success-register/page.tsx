'use client';

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Logo from '@/components/figma/Logo'
import SocialLinks from '@/components/figma/SocialLinks'
import '@/styles/Figma.css'

// Figma: Landing page, Sign up and Login → "Success register" (1074:17071)
export default function SuccessRegister() {
  const router = useRouter()
  const [resent, setResent] = useState(false)

  return (
    <main className="kp kp-center">
      <Logo className="kp-center__logo" />
      <h1 className="kp-h1 kp-center__title">Thank you for signing up!</h1>
      <p className="kp-center__lead">An activation email was just sent to your inbox to get started.<br />Set up only takes a few minutes!</p>
      <img className="kp-center__art" src="/figma/success/jumping.png" alt="Two people jumping with joy" />
      <SocialLinks />
      <button type="button" className="kp-btn kp-btn--bold kp-center__btn" style={{ width: 115, marginTop: 43 }} onClick={() => router.push('/login')}>Close</button>
      <p className="kp-center__note" role="status">
        {resent ? 'Activation email sent again.' : <>If you do not receive the email, please <button type="button" onClick={() => setResent(true)}>click here</button> to resend.</>}
      </p>
    </main>
  )
}
