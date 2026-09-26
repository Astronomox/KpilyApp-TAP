'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Logo from './Logo'

const items = [
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
]

// Top navigation from the Blog / Blog post / About frames.
export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const active = (href: string) => pathname === href || (href === '/blog' && pathname?.startsWith('/blog'))

  return (
    <header className="kp-site-header">
      <div className="kp-site-header__inner">
        <Logo />
        <button type="button" className="kp-site-header__toggle" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <nav className={`kp-site-header__nav ${open ? 'is-open' : ''}`} aria-label="Primary">
          <div className="kp-site-header__links">
            {items.map((i) => (
              <Link key={i.href} href={i.href} className={active(i.href) ? 'is-active' : ''} onClick={() => setOpen(false)}>{i.label}</Link>
            ))}
          </div>
          <div className="kp-site-header__actions">
            <Link href="/login" onClick={() => setOpen(false)}>Sign In</Link>
            <Link href="/signup" className="kp-site-header__cta" onClick={() => setOpen(false)}>Start 15-day Free Trial</Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
