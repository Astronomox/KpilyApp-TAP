'use client';

import { useRouter } from 'next/navigation'
import Logo from '@/components/figma/Logo'
import SocialLinks from '@/components/figma/SocialLinks'
import '@/styles/Figma.css'

// Figma: Landing page, Sign up and Login → "Payment success page" (1277:8052)
export default function PaymentSuccess() {
  const router = useRouter()
  return (
    <main className="kp kp-center kp-center--pay">
      <Logo className="kp-center__logo" />
      <h1 className="kp-h1 kp-center__title">Thank you for subscribing!</h1>
      <p className="kp-center__lead kp-center__lead--tight">Please login to KPILY to onboard your company </p>
      <img className="kp-center__art" src="/figma/success/jumping.png" alt="Two people jumping with joy" />
      <SocialLinks />
      <button type="button" className="kp-btn kp-btn--bold" style={{ width: 204, marginTop: 43 }} onClick={() => router.push('/onboard-company')}>Onboard Company </button>
    </main>
  )
}
