'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const items = [
  { href: '/about', label: 'About Us' },
  { href: '/blogs', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
]

// Top navigation, as on kpily.netlify.app, styled with the Figma tokens.
export default function SiteHeader() {
  const pathname = usePathname() || ''
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="kp-site-header">
      <div className="kp-site-header__inner">
        <Link href="/" className="kp-site-header__logo" aria-label="KPILY home" onClick={close}>
          <img src="/site/logo.svg" alt="KPILY Performance Management" width={144} height={48} />
        </Link>
        <nav className={`kp-site-header__nav ${open ? 'is-open' : ''}`} aria-label="Primary">
          <div className="kp-site-header__links">
            {items.map((i) => (
              <Link key={i.href} href={i.href} className={pathname.startsWith(i.href) ? 'is-active' : ''} onClick={close}>{i.label}</Link>
            ))}
          </div>
          <div className="kp-site-header__actions">
            <Link href="/login" onClick={close}>Sign in</Link>
            <Link href="/register" className="kp-site-header__cta" onClick={close}>Start 30-day Free Trial</Link>
          </div>
        </nav>
        {/* Language switch: present on the reference site, no behaviour yet. */}
        <button type="button" className="kp-site-header__lang" aria-label="Language: English">
          <img src="/site/lang-en.svg" alt="" width={34} height={34} />
        </button>
        <button type="button" className="kp-site-header__toggle" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
