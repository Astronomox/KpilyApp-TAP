import Link from 'next/link'
import '@/styles/Navigation.css'

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <img src="/assets/logo-full.png" alt="KPILY" />
        </Link>

        <div className="nav-menu">
          <Link href="/" className="nav-item">
            Home
          </Link>
          <Link href="/blog" className="nav-item">
            Blog
          </Link>
          <Link href="/pricing" className="nav-item">
            Pricing
          </Link>
        </div>

        <div className="nav-actions">
          <Link href="/login" className="nav-btn secondary">
            Log In
          </Link>
          <Link href="/register" className="nav-btn primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}
