'use client';

import Link from 'next/link'
import Navigation from '@/components/Navigation'
import '@/styles/Pages.css'

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'Getting Started with Real-time Collaboration',
      excerpt: 'Learn how to set up real-time collaboration features for your team.',
      author: 'John Doe',
      date: 'Sep 20, 2024',
      image: '/assets/landing/real-time-feedback.png'
    },
    {
      id: 2,
      title: 'Maximizing Your KPI Tracking',
      excerpt: 'Best practices for setting up and monitoring your key performance indicators.',
      author: 'Jane Smith',
      date: 'Sep 18, 2024',
      image: '/assets/landing/customizable-kpis.png'
    },
    {
      id: 3,
      title: 'Team Leaderboards: Gamify Your Workplace',
      excerpt: 'How to use leaderboards to motivate and engage your team.',
      author: 'Mike Johnson',
      date: 'Sep 15, 2024',
      image: '/assets/landing/leaderboard-tracking.png'
    },
    {
      id: 4,
      title: 'Security Best Practices',
      excerpt: 'Protecting your data with KPILY\'s enterprise security features.',
      author: 'Sarah Williams',
      date: 'Sep 12, 2024',
      image: '/assets/landing-testimonial.jpg'
    }
  ]

  return (
    <div className="blog-page">
      <Navigation />
      
      <section className="blog-header">
        <h1>KPILY Blog</h1>
        <p>Tips, tricks, and insights for team collaboration</p>
      </section>

      <section className="blog-grid">
        {posts.map((post) => (
          <article key={post.id} className="blog-card">
            <img src={post.image} alt={post.title} />
            <div className="blog-content">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="blog-meta">
                <span>{post.author}</span>
                <span>{post.date}</span>
              </div>
              <Link href='/blog-post' className="read-more">Read More →</Link>
            </div>
          </article>
        ))}
      </section>

      <footer className="footer">
        <p>&copy; 2024, KPILY. All Rights Reserved.</p>
      </footer>
    </div>
  )
}
