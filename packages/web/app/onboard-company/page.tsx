'use client';

import Link from 'next/link'
import { useRef, useState } from 'react'
import Logo from '@/components/figma/Logo'
import '@/styles/Figma.css'

// Figma: Landing page, Sign up and Login → "Onboard company steps" (1512:17997)
export default function OnboardCompany() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [verified, setVerified] = useState(true)
  const [uploaded, setUploaded] = useState<string>('')

  return (
    <main className="kp kp-onboard">
      <div className="kp-onboard__logo"><Logo /></div>
      <h1 className="kp-onboard__title"><img src="/figma/onboard/title.svg" alt="Onboard your company" /></h1>
      <ol className="kp-steps">
        <li className="kp-step">
          <img className="kp-step__drag" src="/figma/onboard/drag.svg" alt="" />
          <div className="kp-step__title"><strong>Step 1</strong></div>
          <span className="kp-step__div" />
          <div className="kp-step__who"><span className="kp-step__avatar"><img src="/figma/onboard/avatar-1.png" alt="" /><img className="kp-step__status" src="/figma/onboard/status.svg" alt="" /></span>Verify your email </div>
          <span className="kp-step__div" />
          <img className="kp-step__icon" src="/figma/onboard/icon-check.svg" alt={verified ? 'Verified' : ''} style={{ opacity: verified ? 1 : 0.3 }} />
          <span className="kp-step__div" />
          <button type="button" className="kp-step__btn" onClick={() => setVerified(true)}>Verify</button>
        </li>
        <li className="kp-step">
          <img className="kp-step__drag" src="/figma/onboard/drag.svg" alt="" />
          <div className="kp-step__title"><strong>Step 2</strong><img src="/figma/onboard/sub-step2.svg" alt="Upload your company documents" /></div>
          <span className="kp-step__div" />
          <div className="kp-step__who"><span className="kp-step__avatar"><img src="/figma/onboard/avatar-2.png" alt="" /><img className="kp-step__status" src="/figma/onboard/status.svg" alt="" /></span>{uploaded || 'Company Documents'}</div>
          <span className="kp-step__div" />
          <img className="kp-step__icon" src="/figma/onboard/icon-upload.svg" alt="" />
          <span className="kp-step__div" />
          <button type="button" className="kp-step__btn kp-step__btn--blue" onClick={() => fileInput.current?.click()}>Upload</button>
          <input ref={fileInput} type="file" multiple hidden onChange={(e) => setUploaded(e.target.files?.length ? `${e.target.files.length} file(s) uploaded` : '')} />
        </li>
        <li className="kp-step">
          <img className="kp-step__drag" src="/figma/onboard/drag.svg" alt="" />
          <div className="kp-step__title"><strong>Step 3</strong><img src="/figma/onboard/sub-step3.svg" alt="Login to onboard team" /></div>
          <span className="kp-step__div" />
          <div className="kp-step__who"><span className="kp-step__avatar"><img src="/figma/onboard/avatar-2.png" alt="" /><img className="kp-step__status" src="/figma/onboard/status.svg" alt="" /></span>Login to onboard team</div>
          <span className="kp-step__div" />
          <img className="kp-step__icon" src="/figma/onboard/icon-arrow.svg" alt="" />
          <span className="kp-step__div" />
          <Link href="/login" className="kp-step__btn">Login</Link>
        </li>
      </ol>
    </main>
  )
}
