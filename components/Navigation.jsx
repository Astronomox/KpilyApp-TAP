import { Link } from 'react-router-dom'
import './Navigation.css'

export default function Navigation() {
  return (
    <header className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo" aria-label="KPILY home"><img src="/assets/logo-full.png" alt="KPILY Performance Management" /></Link>
        <nav className="nav-menu" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/login">Sign in</Link>
          <Link to="/register" className="cta-btn">Start 30-day Free Trial</Link>
        </nav>
      </div>
    </header>
  )
}
