'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'
import '@/styles/Pages.css'

const Arrow = () => <span aria-hidden="true" className="arrow">↗</span>
const Play = () => <span aria-hidden="true" className="play">▶</span>

function Reveal({ children, className = '' }) {
  const [visible, setVisible] = useState<boolean>(false)
  useEffect(() => {
    const node = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setVisible(true)), { threshold: 0.12 })
    node.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])
  return <div data-reveal className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>
}

function Logo() {
  return <Link href='/' className="brand" aria-label="KPILY home"><img src="/assets/logo-full.png" alt="KPILY Performance Management" /></Link>
}

function Navigation() {
  const [open, setOpen] = useState<boolean>(false)
  return <header className="site-header">
    <div className="nav-shell">
            <Logo />
            <div className="nav-toggle-group">
        <button className="language language-mobile" type="button" aria-label="Choose language">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.1667 1.66669H4.16675C2.78604 1.66669 1.66675 2.78598 1.66675 4.16669V29.1667C1.66675 30.5474 2.78604 31.6667 4.16675 31.6667H29.1667C30.5475 31.6667 31.6667 30.5474 31.6667 29.1667V4.16669C31.6667 2.78598 30.5475 1.66669 29.1667 1.66669Z" stroke="currentColor" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.1667 10.8334H7.5V22.5H13.75M7.5 16.6667H13.75M18.3333 12.5V22.5V17.0834C18.3333 16.0888 18.7284 15.135 19.4317 14.4317C20.1349 13.7285 21.0888 13.3334 22.0833 13.3334C23.0779 13.3334 24.0317 13.7285 24.735 14.4317C25.4382 15.135 25.8333 16.0888 25.8333 17.0834V22.5" stroke="currentColor" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className={open ? 'menu-toggle is-open' : 'menu-toggle'} type="button" aria-label={open ? 'Close menu' : 'Toggle menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? <span className="menu-close" aria-hidden="true">✕</span> : <><span /><span /><span /></>}
        </button>
      </div>
      <nav className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        <div className="nav-links"><Link href='/#features' onClick={() => setOpen(false)}>About Us</Link><Link href='/blog' onClick={() => setOpen(false)}>Blog</Link><Link href='/pricing' onClick={() => setOpen(false)}>Pricing</Link></div>
        <div className="nav-actions"><Link href='/login' className="nav-signin" onClick={() => setOpen(false)}>Sign in</Link><Link href='/register' className="button button-primary nav-cta" onClick={() => setOpen(false)}>Start 30-day Free Trial</Link>
<button className="language language-desktop" type="button" aria-label="Choose language">
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.1667 1.66669H4.16675C2.78604 1.66669 1.66675 2.78598 1.66675 4.16669V29.1667C1.66675 30.5474 2.78604 31.6667 4.16675 31.6667H29.1667C30.5475 31.6667 31.6667 30.5474 31.6667 29.1667V4.16669C31.6667 2.78598 30.5475 1.66669 29.1667 1.66669Z" stroke="currentColor" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.1667 10.8334H7.5V22.5H13.75M7.5 16.6667H13.75M18.3333 12.5V22.5V17.0834C18.3333 16.0888 18.7284 15.135 19.4317 14.4317C20.1349 13.7285 21.0888 13.3334 22.0833 13.3334C23.0779 13.3334 24.0317 13.7285 24.735 14.4317C25.4382 15.135 25.8333 16.0888 25.8333 17.0834V22.5" stroke="currentColor" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</button>        </div>
      </nav>
    </div>
  </header>
}

const features = [
  { eyebrow: 'OUR FEATURES', title: 'Real -Time Feedback', copy: "KPILY's real-time feedback system uses points, keywords, and gamification to provide instant feedback and keep team members engaged and motivated. With advanced keyword recognition technology, you can easily track trends in your team's performance over time and make data-driven decisions." },
  { eyebrow: 'OUR FEATURES', title: 'Innovative Rewards', copy: 'Encourage employees to achieve their goals with gamified rewards.' },
  { eyebrow: 'OUR FEATURES', title: 'Customizable KPIs', copy: 'Define your own KPIs that align with your business goals.' },
  { eyebrow: 'OUR FEATURES', title: 'Leaderboard tracking for your team', copy: 'Your employees can see their progress in real-time, as well as how they stack up against their peers. The leaderboard is designed to keep your team engaged and motivated, and it can be a powerful tool for driving performance.' },
]

const reasons = [
  ['Feedback', 'Real-time feedback system with points and gamification helps team members receive instant feedback and stay motivated to improve their performance.'],
  ['Transparency', 'Transparent and accessible information lets teams collaborate better, identify areas for improvement, and celebrate successes together.'],
  ['Easy to use', 'User-friendly interface makes it easy for team members to use the platform and stay on top of their goals and metrics.'],
  ['Data driven', 'Teams can track their performance with accuracy, identify areas to improve, and make data-backed decisions.'],
]

export default function LandingPage() {
  const [billing, setBilling] = useState('monthly')
  const [testimonial, setTestimonial] = useState(0)
  const annual = billing === 'annual'
  const testimonials = [
    ['Angela Taylor', 'CEO SAMSUNG', 'Save Time Managing Social Media For Your Business', 'KPILY has completely transformed our performance tracking process. The real-time feedback has made a huge difference in employee engagement and productivity.'],
    ['Michael V', 'TEAM LEAD', 'A clearer path for every team member', 'The simple feedback loop keeps our teams aligned, motivated, and focused on the work that matters.'],
  ]
  const currentTestimonial = testimonials[testimonial]

  return <div className="landing-page" id="top">
    <Navigation />
    <main>
      <section className="hero-section contour-bg">
        <div className="section-shell hero-grid">
          <Reveal className="hero-copy">
            <h1>Transform Your<br />Business<br />Performance with <span>KPILY</span></h1>
            <p className="hero-subtitle">Real-Time Feedback and Performance Tracking App for Your Team</p>
            <div className="hero-actions"><Link href='/register' className="button button-primary">Get Started <Arrow /></Link><a href="#features" className="watch-link"><span className="play-circle"><Play /></span> See how it works</a></div>
          </Reveal>
          <Reveal className="hero-art"><img src="/assets/landing-hero-full.png" alt="KPILY performance dashboard" /></Reveal>
        </div>
      </section>

      <section className="client-strip"><div className="section-shell"><p>Over 32k+ Technology businesses growing with KPILY</p><div className="client-logos"><img src="/assets/logos/oracle.png" alt="Oracle" /><img src="/assets/logos/morpheus.png" alt="Morpheus" /><img src="/assets/logos/samsung.png" alt="Samsung" /><img src="/assets/logos/monday.png" alt="monday.com" /><img src="/kpily/trudolegal.png" alt="TruDo Legal" /><img src="/assets/logos/cowrywifi.png" alt="CowryWise" /></div></div></section>

      <section id="features" className="feature-section feature-mint contour-bg"><div className="section-shell feature-grid"><Reveal className="feature-art"><img src="/assets/landing/real-time-feedback.png" alt="Real-time feedback dashboard" /></Reveal><Reveal className="feature-copy"><p className="eyebrow">{features[0].eyebrow}</p><h2>{features[0].title}</h2><p>{features[0].copy}</p><Link href='/register' className="text-link">Get Started <Arrow /></Link></Reveal></div></section>

      <section className="feature-section rewards-section"><img className="marker marker-rewards" src="/assets/decorations/bird-marks.png" alt="" /><div className="section-shell feature-grid rewards-grid"><Reveal className="feature-copy"><p className="eyebrow">{features[1].eyebrow}</p><h2>{features[1].title}</h2><p>{features[1].copy}</p></Reveal><Reveal className="free-form"><h3>Get Started for Free</h3><input placeholder="Email Address" aria-label="Email Address" /><input placeholder="Password" type="password" aria-label="Password" /><button className="button button-primary" type="button">Get Started</button></Reveal></div></section>

      <section className="feature-section feature-blue contour-bg"><div className="section-shell feature-grid reverse"><Reveal className="feature-copy"><p className="eyebrow">{features[2].eyebrow}</p><h2>{features[2].title}</h2><p>{features[2].copy}</p><Link href='/register' className="text-link">Get Started <Arrow /></Link></Reveal><Reveal className="feature-art"><img src="/assets/landing/customizable-kpis.png" alt="Customizable KPIs dashboard" /></Reveal></div></section>

      <section className="testimonial-section"><img className="marker marker-testimonial" src="/assets/decorations/bird-marks.png" alt="" /><div className="section-shell"><Reveal><p className="eyebrow">TESTIMONIALS</p><h2>Check what our<br />clients are saying</h2></Reveal><div className="testimonial-grid"><Reveal className="testimonial-card"><img src="/assets/landing-testimonial.jpg" alt={currentTestimonial[0]} /><div className="testimonial-card-copy"><strong>{currentTestimonial[0]}</strong><span>{currentTestimonial[1]}</span></div></Reveal><Reveal className="testimonial-quote"><h3>{currentTestimonial[2]}</h3><p>{currentTestimonial[3]}</p><div className="stars">★★★★★</div><strong>{currentTestimonial[0]}</strong><span>{currentTestimonial[1]}</span></Reveal></div><div className="testimonial-controls"><button type="button" aria-label="Previous testimonial" onClick={() => setTestimonial((testimonial + testimonials.length - 1) % testimonials.length)}>←</button><button type="button" aria-label="Next testimonial" onClick={() => setTestimonial((testimonial + 1) % testimonials.length)}>→</button></div><div className="testimonial-bar"><p>Start your company’s journey towards realistic performance tracking that puts the power in the hands of the employees for your company’s success.</p><Link href='/register' className="button button-primary">Get Started <Arrow /></Link></div></div></section>

      <section className="feature-section leaderboard-section contour-bg"><img className="marker marker-leaderboard" src="/assets/decorations/bird-marks.png" alt="" /><div className="section-shell feature-grid reverse"><Reveal className="feature-copy"><p className="eyebrow">{features[3].eyebrow}</p><h2>{features[3].title}</h2><p>{features[3].copy}</p><Link href='/register' className="text-link">Get Started <Arrow /></Link></Reveal><Reveal className="feature-art"><img src="/assets/landing/leaderboard-tracking.png" alt="Leaderboard tracking dashboard" /></Reveal></div></section>

      <section className="why-section"><img className="marker marker-why" src="/assets/decorations/ink-strokes.png" alt="" /><div className="section-shell"><Reveal className="center-heading"><p className="eyebrow">WHY KPILY</p><h2>Why Choose Us</h2><p>Build a culture where people know what great work looks like and feel empowered to do it.</p></Reveal><div className="reason-grid">{reasons.map(([title, copy], index) => <Reveal key={title} className="reason-card"><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></Reveal>)}</div></div></section>

      <section className="pricing-section contour-bg"><img className="marker marker-pricing-top" src="/assets/decorations/ink-strokes.png" alt="" /><img className="marker marker-pricing-bottom" src="/assets/decorations/bird-marks.png" alt="" /><div className="section-shell"><Reveal className="center-heading"><p className="eyebrow">CHOOSE A PLAN</p><div className="billing-toggle"><button className={billing === 'monthly' ? 'active' : ''} onClick={() => setBilling('monthly')}>Monthly</button><button className={billing === 'annual' ? 'active' : ''} onClick={() => setBilling('annual')}>Annually</button></div></Reveal><div className="plan-grid"><Reveal className="plan-card plan-green"><p>Growth Track</p><strong>{annual ? '$549.99' : '$49.99'}</strong><small>{annual ? 'per year' : 'per month'}</small><span>for up to 50 employees</span><Link href='/pricing' className="plan-button">Start <Arrow /></Link></Reveal><Reveal className="plan-card plan-blue"><p>Starter Pulse</p><strong>$0</strong><small>{annual ? 'per year' : 'per month'}</small><span>for up to 5 employees</span><Link href='/pricing' className="plan-button">Start <Arrow /></Link></Reveal><Reveal className="plan-card plan-gray"><p>Enterprise Vision</p><strong>{annual ? '$2199.99' : '$199.99'}</strong><small>{annual ? 'per year' : 'per month'}</small><span>for up to 1000 employees</span><Link href='/pricing' className="plan-button">Start <Arrow /></Link></Reveal></div><p className="trial-note">15-day free trial <b>•</b> Then recurring bill <b>•</b> Cancel anytime</p></div></section>

      <section className="final-cta"><div className="section-shell final-grid"><Reveal><p className="eyebrow">WHY CHOOSE US</p><h2>KPILY drives team engagement and productivity.</h2><p>A comprehensive solution that puts performance in the hands of the employees.</p></Reveal><Reveal className="contact-form"><h3>Get Started for Free</h3><label>Company<input placeholder="Company Name" /></label><label>Work Email<input placeholder="Work Email Address" type="email" /></label><label>Full name<input placeholder="Name" /></label><button className="button button-primary" type="button">Get Started <Arrow /></button></Reveal></div></section>
    </main>
    <footer className="site-footer"><div className="section-shell footer-grid"><div><Logo />
      <p>Performance Management</p><div className="socials"><a href="https://m.facebook.com/100980035046229/">f</a><a href="https://www.instagram.com/kpilyapp/">◎</a><a href="https://www.linkedin.com/company/92823514/admin/feed/posts/?feedType=following">in</a></div></div><div><h4>Company</h4><Link href='/'>About Us</Link><Link href='/'>Press</Link><Link href='/blog'>Blog</Link></div><div><h4>Get Started</h4><Link href='/'>Request a demo</Link><Link href='/register'>Sign up</Link><Link href='/login'>Log in</Link></div><div><h4>Contact</h4><a href="tel:+2349024429918">+234 09024429918</a><a href="mailto:support@kpily.com">support@kpily.com</a></div></div><div className="section-shell footer-bottom">© 2025, KPILY. All rights reserved</div></footer>
  </div>
}
