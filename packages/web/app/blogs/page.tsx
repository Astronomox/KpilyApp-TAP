'use client';

import Link from 'next/link'
import { useState } from 'react'
import SiteHeader from '@/components/figma/SiteHeader'
import SiteFooter from '@/components/figma/SiteFooter'
import DemoCta from '@/components/figma/DemoCta'
import BlogBadge from '@/components/figma/BlogBadge'
import { allPosts, recentPosts, type BlogPost } from '@/lib/blogPosts'
import '@/styles/Figma.css'
import '@/styles/FigmaSite.css'

const PAGES = ['1', '2', '3', '...', '8', '9', '10']

function Meta({ p }: { p: BlogPost }) {
  return <p className="kp-card__meta">{p.author} • {p.date}</p>
}

function Tags({ p }: { p: BlogPost }) {
  return <div className="kp-card__tags">{p.tags.map((t) => <BlogBadge key={t.label} {...t} />)}</div>
}

function Card({ p, large = false }: { p: BlogPost; large?: boolean }) {
  return (
    <Link href={`/blog-post?slug=${p.slug}`} className={`kp-card ${large ? 'kp-card--large' : ''}`}>
      <img className="kp-card__img" src={p.image} alt="" />
      <div className="kp-card__body">
        <Meta p={p} />
        <div className="kp-card__heading"><h3>{p.title}</h3><img src="/figma/blog/arrow-up-right.svg" alt="" /></div>
        <p className="kp-card__excerpt">{p.excerpt}</p>
        <Tags p={p} />
      </div>
    </Link>
  )
}

function SideCard({ p }: { p: BlogPost }) {
  return (
    <Link href={`/blog-post?slug=${p.slug}`} className="kp-card kp-card--side">
      <img className="kp-card__img" src={p.image} alt="" />
      <div className="kp-card__body">
        <Meta p={p} />
        <h3 className="kp-card__small-title">{p.title}</h3>
        <p className="kp-card__excerpt">{p.excerpt}</p>
        <Tags p={p} />
      </div>
    </Link>
  )
}

// Figma: Landing page, Sign up and Login → "Blog" (1557:37197)
export default function Blog() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [page, setPage] = useState('1')

  return (
    <div className="kp kp-site">
      <SiteHeader />
      <main>
        <section className="kp-page-head">
          <h1>Stories and interviews</h1>
          <p>Subscribe to learn about new performance content product features, the latest in technology, solutions, and updates.</p>
          <form className="kp-capture" onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true) }}>
            <div>
              <input type="email" aria-label="Email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <small>We care about your data in our <Link href="/about">privacy policy</Link></small>
            </div>
            <button type="submit" className={email ? 'is-ready' : ''}>{subscribed ? 'Subscribed' : 'Subscribe'}</button>
          </form>
        </section>

        <section className="kp-container kp-section">
          <h2 className="kp-section__title">Recent blog posts</h2>
          <div className="kp-recent">
            <Card p={recentPosts[0]} large />
            <div className="kp-recent__side">
              {recentPosts.slice(1).map((p) => <SideCard key={p.slug} p={p} />)}
            </div>
          </div>
        </section>

        <section className="kp-container kp-section">
          <h2 className="kp-section__title">All blog posts</h2>
          <div className="kp-grid3">
            {allPosts.map((p) => <Card key={p.slug} p={p} />)}
          </div>
          <nav className="kp-pager" aria-label="Pagination">
            <button type="button" onClick={() => setPage(String(Math.max(1, Number(page) - 1)))}><img src="/figma/blog/arrow-left.svg" alt="" />Previous</button>
            <div className="kp-pager__nums">
              {PAGES.map((n, i) => (
                n === '...' ? <span key={i}>...</span>
                  : <button type="button" key={n} className={n === page ? 'is-active' : ''} aria-current={n === page ? 'page' : undefined} onClick={() => setPage(n)}>{n}</button>
              ))}
            </div>
            <button type="button" onClick={() => setPage(String(Math.min(10, Number(page) + 1)))}>Next<img src="/figma/blog/arrow-right.svg" alt="" /></button>
          </nav>
        </section>
      </main>
      <DemoCta />
      <SiteFooter />
    </div>
  )
}
