'use client';

import Link from 'next/link'
import Navigation from '@/components/Navigation'
import '@/styles/Pages.css'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for small teams',
      features: [
        'Up to 5 users',
        'Basic analytics',
        'Real-time collaboration',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'For growing businesses',
      features: [
        'Up to 25 users',
        'Advanced analytics',
        'Custom integrations',
        'Priority support',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: [
        'Unlimited users',
        'Custom analytics',
        'Dedicated support',
        'SSO & security',
        'On-premise option'
      ]
    }
  ]

  return (
    <div className="pricing-page">
      <Navigation />
      
      <section className="pricing-header">
        <h1>Flexible Pricing for Every Team</h1>
        <p>Choose the plan that works best for you</p>
      </section>

      <section className="pricing-cards">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h3>{plan.name}</h3>
            <div className="price">
              {plan.price}
              <span className="period">{plan.period}</span>
            </div>
            <p className="description">{plan.description}</p>
            
            <ul className="features">
              {plan.features.map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>

            <Link href='/sign-up' className="pricing-btn">Get Started</Link>
          </div>
        ))}
      </section>

      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-items">
          <div className="faq-item">
            <h4>Can I change plans anytime?</h4>
            <p>Yes, you can upgrade or downgrade your plan at any time.</p>
          </div>
          <div className="faq-item">
            <h4>Is there a free trial?</h4>
            <p>Yes, all plans come with a 14-day free trial.</p>
          </div>
          <div className="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We accept all major credit cards and bank transfers.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024, KPILY. All Rights Reserved.</p>
      </footer>
    </div>
  )
}
