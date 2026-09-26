'use client';

import Link from 'next/link'
import { useState } from 'react'
import SiteHeader from '@/components/figma/SiteHeader'
import SiteFooter from '@/components/figma/SiteFooter'
import DemoCta from '@/components/figma/DemoCta'
import BillingToggle from '@/components/figma/BillingToggle'
import Reveal from '@/components/figma/Reveal'
import TestimonialCarousel from '@/components/figma/TestimonialCarousel'
import { priceLabel } from '@/lib/plans'
import { usePlans } from '@/lib/usePlans'
import '@/styles/Figma.css'
import '@/styles/FigmaSite.css'
import '@/styles/Home.css'

const CLIENTS = ['oracle', 'morpheus', 'samsung', 'monday', 'trudolegal', 'cowrywifi']

const REASONS = [
  { title: 'Feedback', color: 'var(--kp-secondary-20)', text: 'Real-time feedback system with points and gamification helps team members receive instant feedback and stay motivated to improve their performance. ' },
  { title: 'Transparency', color: '#81dfb7', text: 'Transparent and accessible information, teams can collaborate better, identify areas for improvement, and celebrate successes together.' },
  { title: 'Easy to use', color: '#5aca9a', text: 'User-friendly interface makes it easy for team members to use the platform and stay on top of their goals and metrics. ' },
  { title: 'Data driven', color: 'var(--kp-secondary)', text: 'Teams can track their performance with accuracy, identify areas to improve, and make data-backed decisions.' },
]


function GetStarted() {
  return <Link href="/register" className="kp-btn kp-home__btn">Get Started</Link>
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="kp-home__eyebrow">{children}</p>
}

// Home page — content and structure from kpily.netlify.app, styling from the Figma design system.
export default function Home() {
  const [billing, setBilling] = useState('monthly')
  const plans = usePlans()
  const [signup, setSignup] = useState({ email: '', password: '' })

  return (
    <div className="kp kp-site kp-home">
      <SiteHeader />
      <main>
        <section className="kp-home__hero kp-home__container">
          <Reveal className="kp-home__hero-copy">
            <h1>Transform Your Business Performance with KPILY</h1>
            <p className="kp-home__hero-lead">Real-Time Feedback and Performance Tracking App for Your Team</p>
            <div className="kp-home__hero-actions">
              <GetStarted />
              <a href="#features" className="kp-home__how">See how it works</a>
            </div>
          </Reveal>
          <img className="kp-home__hero-img kp-float" src="/site/hero-img.png" alt="Employee receiving real-time feedback and points in KPILY" />
        </section>

        <section className="kp-home__clients kp-home__container">
          <Reveal as="h2">Over 32k+ Technology businesses growing with KPILY</Reveal>
          <div className="kp-home__logos">
            {CLIENTS.map((c, i) => <Reveal key={c} delay={i * 80} from="zoom"><img src={`/site/${c}.png`} alt={c} /></Reveal>)}
          </div>
        </section>

        <section id="features" className="kp-home__container kp-home__feature kp-home__feature--reverse">
          <Reveal className="kp-home__feature-copy">
            <Eyebrow>Our Features</Eyebrow>
            <h2 className="kp-home__h2">Real -Time Feedback</h2>
            <p className="kp-home__body kp-home__body--dark">KPILY&apos;s real-time feedback system uses points, keywords, and gamification to provide instant feedback and keep team members engaged and motivated. With advanced keyword recognition technology, you can easily track trends in your team&apos;s performance over time and make data-driven decisions.</p>
            <GetStarted />
          </Reveal>
          <img className="kp-home__feature-img kp-float kp-float--slow" src="/site/real-time-feedback.png" alt="Real-time feedback dashboard with points received" />
        </section>

        <section className="kp-home__container kp-home__rel">
          <img className="kp-home__birds kp-bob" src="/site/birds.png" alt="" aria-hidden="true" />
          <Reveal className="kp-home__card kp-home__rewards">
            <div>
              <Eyebrow>Our Features</Eyebrow>
              <h2 className="kp-home__h2">Innovative Rewards</h2>
              <p className="kp-home__body kp-home__body--light">Encourage employees to achieve their goals with gamified</p>
            </div>
            <form className="kp-home__signup" onSubmit={(e) => { e.preventDefault(); window.location.href = `/register?email=${encodeURIComponent(signup.email)}` }}>
              <h3>Get Started for Free</h3>
              <label className="sr-only" htmlFor="home-email">Work Email</label>
              <input id="home-email" type="email" placeholder="Email Address" required value={signup.email} onChange={(e) => setSignup({ ...signup, email: e.target.value })} />
              <label className="sr-only" htmlFor="home-password">Password</label>
              <input id="home-password" type="password" placeholder="Password" required value={signup.password} onChange={(e) => setSignup({ ...signup, password: e.target.value })} />
              <button type="submit" className="kp-btn kp-home__btn">Get Started</button>
            </form>
          </Reveal>
        </section>

        <section className="kp-home__container kp-home__feature">
          <Reveal className="kp-home__feature-copy">
            <Eyebrow>Our Features</Eyebrow>
            <h2 className="kp-home__h2">Customizable KPIs</h2>
            <p className="kp-home__body">Define your own KPIs that align with your business goals. </p>
            <GetStarted />
          </Reveal>
          <img className="kp-home__feature-img kp-float kp-float--slow" src="/site/customizable-kpis.png" alt="Customizable KPI progress card" />
        </section>

        <section className="kp-home__container kp-home__testimonials">
          <Eyebrow>Testimonials</Eyebrow>
          <Reveal as="h2">Check what our clients are saying</Reveal>
          <Reveal delay={120}><TestimonialCarousel /></Reveal>
        </section>

        <section className="kp-home__container">
          <Reveal className="kp-home__journey" from="zoom">
            <p>Start your company’s journey towards realistic performance tracking that puts the power in the hands of the employees for your company’s success. </p>
            <GetStarted />
          </Reveal>
        </section>

        <section className="kp-home__container kp-home__feature kp-home__rel">
          <Reveal className="kp-home__feature-copy">
            <Eyebrow>Our Features</Eyebrow>
            <h2 className="kp-home__h2">Leaderboard tracking for your team </h2>
            <p className="kp-home__body">Your employees can see their progress in real-time, as well as how they stack up against their peers. The leaderboard is designed to keep your team engaged and motivated, and it can be a powerful tool for driving performance. </p>
            <GetStarted />
          </Reveal>
          <img className="kp-home__feature-img kp-float kp-float--slow" src="/site/leaderboard-tracking.png" alt="Team leaderboard" />
        </section>

        <section className="kp-home__container kp-home__rel">
          <img className="kp-home__feathers kp-bob kp-home__feathers--tl" src="/site/feathers.png" alt="" aria-hidden="true" />
          <div className="kp-home__card kp-home__why">
            <Eyebrow>Why KPILY</Eyebrow>
            <h2 className="kp-home__h2">Why Choose Us</h2>
            <div className="kp-home__reasons">
              {REASONS.map((r, i) => (
                <Reveal as="article" key={r.title} delay={i * 120} from={i % 2 ? 'right' : 'left'}>
                  <span className="kp-home__dot kp-pulse" style={{ background: r.color }} />
                  <div><h3>{r.title}</h3><p>{r.text}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="kp-home__container kp-home__rel">
          <img className="kp-home__feathers kp-bob kp-home__feathers--tr" src="/site/feathers.png" alt="" aria-hidden="true" />
          <img className="kp-home__feathers kp-bob kp-home__feathers--bl" src="/site/feathers.png" alt="" aria-hidden="true" />
          <div className="kp-home__card kp-home__plans">
            <Eyebrow>Choose A Plan</Eyebrow>
            <BillingToggle value={billing} onChange={setBilling} />
            <div className="kp-home__plan-grid">
              {plans.map((p, i) => (
                <Reveal as="article" key={p.id} delay={i * 120} className={`kp-home__plan kp-home__plan--${p.tone}`}>
                  <h3>{p.name}</h3>
                  <p className="kp-home__plan-price">{priceLabel(p, billing)}</p>
                  <p>for up to {p.employees} employees</p>
                  <Link href={`/payment-gateway?plan=${p.id}&billing=${billing}`}>Start</Link>
                </Reveal>
              ))}
            </div>
            <p className="kp-home__trial">15-day free trial • Then recurring bill • Cancel anytime</p>
          </div>
        </section>
      </main>
      <DemoCta />
      <SiteFooter />
    </div>
  )
}
