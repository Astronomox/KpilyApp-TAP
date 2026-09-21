import { Link } from 'react-router-dom'
import './Navigation.css'

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src="/public/assets/logo.png" alt="KPILY" />
        </Link>
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/sign-up" className="cta-btn">Sign Up</Link></li>
        </ul>
      </div>
    </nav>
  )
}
