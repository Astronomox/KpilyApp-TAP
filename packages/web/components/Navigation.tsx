'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import '@/styles/Navigation.css'

const links = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="navigation" aria-label="Primary navigation">
      <div className="nav-container">
        <Link href="/" className="nav-logo" onClick={closeMenu}>
          <img src="/assets/logo-full.png" alt="KPILY" />
        </Link>

        <div className="nav-desktop-links" aria-label="Main links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-item">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-desktop-actions">
          <Link href="/login" className="nav-btn secondary">
            Log In
          </Link>
          <Link href="/register" className="nav-btn primary">
            Sign Up
          </Link>
        </div>

        <button
          type="button"
          className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`nav-mobile-panel ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="nav-mobile-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-mobile-link" onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nav-mobile-actions">
          <Link href="/login" className="nav-btn secondary" onClick={closeMenu}>
            Log In
          </Link>
          <Link href="/register" className="nav-btn primary" onClick={closeMenu}>
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}
