'use client';

import Link from 'next/link'
import { useState } from 'react'
import Artboard from '@/components/figma/Artboard'
import MobileAuth from '@/components/figma/MobileAuth'
import FigSocial from '@/components/figma/FigSocial'
import { at, pop } from '@/lib/fig'
import '@/styles/Figma.css'

// Figma: Landing page, Sign up and Login → "Success register" (1074:17071), 1440×1018.
export default function SuccessRegister() {
  const [resent, setResent] = useState(false)
  const mobile = (
    <MobileAuth title="Thank you for signing up!" art="/figma/success/jumping.png" align="center"
      lead={<>An activation email was just sent to your inbox to get started. Set up only takes a few minutes!</>}
      footer={<p role="status" style={{ color: '#909090' }}>{resent ? 'We sent the activation email again.' : <>If you do not receive the email, please <button type="button" className="kp-fx-link" onClick={() => setResent(true)} style={{ textDecoration: 'underline' }}>click here</button> to resend.</>}</p>}>
      <div className="kp-m-social">
        {['twitter', 'facebook', 'instagram', 'linkedin', 'youtube'].map((i) => (
          <a key={i} href={`https://${i}.com`} target="_blank" rel="noreferrer" aria-label={i}><img src={`/figma/social/${i}.svg`} alt="" /></a>
        ))}
      </div>
      <Link href="/login" className="kp-m-btn kp-m-center-btn">Close</Link>
    </MobileAuth>
  )

  return (
    <Artboard mobile={mobile}>
      <img src="/figma/success/jumping.png" alt="Two people jumping with joy" style={at(268, 227, 880, 578, { objectFit: 'cover', mixBlendMode: 'darken' })} />
      <Link href="/" aria-label="KPILY home" style={at(79, 84)}><img src="/assets/logo-full.png" alt="KPILY Performance Management" style={{ width: 184 }} /></Link>
      <h1 style={at(398, 160, 644, 63, pop(600, 48, 56, '#252525', { textAlign: 'center' }))}>Thank you for signing up!</h1>
      <div style={at(324, 255, 793, 72, pop(500, 20, 24, '#404040', { textAlign: 'center', letterSpacing: 0.5, opacity: 0.99 }))}>
        <p style={{ margin: 0 }}>An activation email was just sent to your inbox to get started.</p>
        <p style={{ margin: 0 }}>Set up only takes a few minutes!</p>
      </div>
      <FigSocial />
      <Link href="/login" className="kp-fx-btn kp-fx-btn--bold" style={at(661, 843, 115, 48, { padding: 0 })}>Close</Link>
      <p role="status" style={at(514, 916, 411, 64, pop(500, 12, 'normal', '#909090', { textAlign: 'center', letterSpacing: 0.5, opacity: 0.99 }))}>
        {resent ? 'We sent the activation email again.' : <>If you do not receive the email, please <button type="button" className="kp-fx-link" onClick={() => setResent(true)} style={{ textDecoration: 'underline' }}>click here</button> to resend.</>}
      </p>
    </Artboard>
  )
}
