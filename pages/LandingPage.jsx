import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import './Pages.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navigation />
      
      <section className="hero">
        <div className="hero-content">
          <h1>Describe your idea and make it come to life</h1>
          <p>Make a shared drawing space with real-time collaboration and sticky notes.</p>
          <Link to="/sign-up" className="cta-btn-large">Get Started</Link>
        </div>
        <div className="hero-image">
          <img src="/public/assets/landing/customizable-kpis.png" alt="Hero" />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <img src="/public/assets/landing/real-time-feedback.png" alt="Real-time Feedback" />
          <h3>Real-time Feedback</h3>
          <p>Get instant insights from your team collaboration</p>
        </div>
        <div className="feature-card">
          <img src="/public/assets/landing/customizable-kpis.png" alt="Customizable KPIs" />
          <h3>Customizable KPIs</h3>
          <p>Track metrics that matter to your business</p>
        </div>
        <div className="feature-card">
          <img src="/public/assets/landing/leaderboard-tracking.png" alt="Leaderboard" />
          <h3>Leaderboard Tracking</h3>
          <p>Motivate teams with transparent performance tracking</p>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-card">
          <img src="/public/assets/landing-testimonial.jpg" alt="Testimonial" />
          <p>"This platform changed how we collaborate. Highly recommended!"</p>
          <span>- Happy Customer</span>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to get started?</h2>
        <Link to="/sign-up" className="cta-btn-large">Sign Up Free</Link>
      </section>

      <footer className="footer">
        <p>&copy; 2024, KPILY. All Rights Reserved.</p>
      </footer>
    </div>
  )
}
