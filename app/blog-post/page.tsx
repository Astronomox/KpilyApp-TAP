'use client';

import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import '@/styles/Pages.css'

export default function BlogPost() {
  return (
    <div className="blog-post-page">
      <Navigation />
      
      <article className="blog-post">
        <header className="post-header">
          <h1>Getting Started with Real-time Collaboration</h1>
          <div className="post-meta">
            <span className="author">By John Doe</span>
            <span className="date">Sep 20, 2024</span>
            <span className="read-time">5 min read</span>
          </div>
        </header>

        <img src="/assets/landing/real-time-feedback.png" alt="Hero" className="post-hero" />

        <div className="post-content">
          <h2>Introduction</h2>
          <p>
            Real-time collaboration has become essential for modern teams. In this guide, we'll walk you through 
            setting up KPILY's collaboration features to maximize your team's productivity.
          </p>

          <h2>Getting Started</h2>
          <p>
            The first step is to invite your team members to your KPILY workspace. You can do this from the 
            settings page by clicking "Invite Team Members".
          </p>

          <h2>Using Shared Workspaces</h2>
          <p>
            Create a shared workspace for your team to collaborate on projects in real-time. All members can 
            see changes as they happen and leave comments on specific items.
          </p>

          <h2>Best Practices</h2>
          <ul>
            <li>Keep your workspace organized with clear folder structures</li>
            <li>Use descriptive names for files and projects</li>
            <li>Leverage comments for feedback and discussions</li>
            <li>Set up notifications to stay updated on changes</li>
          </ul>

          <h2>Conclusion</h2>
          <p>
            By following these practices, you'll be able to harness the full power of KPILY's real-time 
            collaboration features. Happy collaborating!
          </p>
        </div>

        <section className="post-navigation">
          <Link href='/blog' className="back-to-blog">← Back to Blog</Link>
        </section>
      </article>

      <section className="related-posts">
        <h3>Related Articles</h3>
        <div className="related-grid">
          <article className="related-card">
            <h4>Maximizing Your KPI Tracking</h4>
            <Link href='/blog-post'>Read More →</Link>
          </article>
          <article className="related-card">
            <h4>Team Leaderboards: Gamify Your Workplace</h4>
            <Link href='/blog-post'>Read More →</Link>
          </article>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024, KPILY. All Rights Reserved.</p>
      </footer>
    </div>
  )
}
