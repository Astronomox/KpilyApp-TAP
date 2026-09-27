'use client';

import Link from 'next/link'
import { useState } from 'react'
import SiteHeader from '@/components/figma/SiteHeader'
import SiteFooter from '@/components/figma/SiteFooter'
import DemoCta from '@/components/figma/DemoCta'
import BlogBadge from '@/components/figma/BlogBadge'
import '@/styles/Figma.css'
import '@/styles/FigmaSite.css'

const MORE = [
  { slug: 'ux-review-presentations', title: 'UX review presentations', excerpt: 'How do you create compelling presentations that wow your colleagues and impress your managers?', image: '/figma/post/card-1.png' },
  { slug: 'migrating-to-linear-101', title: 'Migrating to Linear 101', excerpt: 'Linear helps streamline software projects, sprints, tasks, and bug tracking. Here\'s how to get started.', image: '/figma/post/card-2.png' },
  { slug: 'building-your-api-stack', title: 'Building your API Stack', excerpt: 'The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.', image: '/figma/post/card-3.png' },
  { slug: 'bill-walsh-leadership-lessons', title: 'Bill Walsh leadership lessons', excerpt: 'Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?', image: '/figma/post/card-4.png' },
]

// Figma: Landing page, Sign up and Login → "Blog post" (1557:81179)
export default function BlogPost() {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => setCopied(true)).catch(() => {})
  }

  return (
    <div className="kp kp-site">
      <SiteHeader />
      <main>
        <header className="kp-page-head kp-post-head">
          <p className="kp-eyebrow kp-eyebrow--purple">Published 20 Jan 2022</p>
          <h1>UX review presentations</h1>
          <p>How do you create compelling presentations that wow your colleagues and impress your managers?</p>
          <div className="kp-card__tags kp-card__tags--center">
            <BlogBadge label="Design" color="purple" />
            <BlogBadge label="Research" color="indigo" />
            <BlogBadge label="Presentation" color="pink" />
          </div>
        </header>
        <div className="kp-container"><img className="kp-post-hero" src="/figma/post/hero.png" alt="Bright modern office" /></div>

        <article className="kp-prose">
          <p className="kp-prose__lead">A performance review presentation is more than a slide deck — it&apos;s the moment where months of work, data, and team effort get distilled into a narrative that guides decisions. Getting that narrative right matters far more than the template you use.</p>
          <hr />
          <h2>Introduction</h2>
          <p>Whether you&apos;re presenting to your leadership team, reporting to a board, or running a quarterly business review with your direct reports, the challenge is always the same: how do you turn raw KPI data into a story that actually lands?</p>
          <p>KPILY makes it easy to pull <a href="/dashboard">live performance data</a> into any presentation format. But the data is only half the job. The other half is knowing how to frame it — what to lead with, what to explain, and what to leave out. This post walks through the principles we&apos;ve seen work consistently across high-performing teams.</p>
          <figure>
            <img src="/figma/post/inline-1.png" alt="Desk with a laptop" />
            <figcaption>Image courtesy of Laura Davidson via <a href="https://unsplash.com/photos/QBAH4IldaZY" target="_blank" rel="noreferrer">Unsplash</a></figcaption>
          </figure>
          <blockquote>
            <p>"The best performance reviews are a conversation, not a verdict. Your slides should open a dialogue, not close one."</p>
            <cite>Olivia Rhye, Product Designer</cite>
          </blockquote>
          <p>Start with the outcome your audience cares about most — whether that&apos;s revenue attainment, task completion rate, or employee engagement score. Ground the room in one headline number before drilling down. If you open with twenty charts, you lose people before the important context arrives.</p>
          <p>From there, move through the story in three beats: where we aimed, where we landed, and what we learned. The KPILY dashboard structures data in exactly this sequence — your goal vs. actual rate, a trend line, and the delta from the previous period. Mirror that structure in your slides and your audience will follow without effort.</p>
          <p>Anticipate the hard questions before someone asks them. If a KPI missed its target, come prepared with at least one root cause and one corrective action. Presenters who name the problem themselves are seen as self-aware and trustworthy; those who wait to be challenged look defensive.</p>
          <h3>Tools and setup</h3>
          <p>KPILY exports performance snapshots as CSV and PDF, so you can pull a current data set moments before any presentation. Pair this with a slide tool that lets you embed live numbers — even a simple Google Sheet link updated by your KPILY export will ensure your figures are never stale on the day.</p>
          <h3>Further reading</h3>
          <p>The principles here apply whether you&apos;re a team lead presenting to a manager or a Head of People presenting to a CEO. The scale changes; the structure doesn&apos;t. For deeper dives, we recommend the KPILY Help Centre guides on setting KPI targets and reading the performance trend graph.</p>
          <ol>
            <li>Keep your headline metric to <a href="/dashboard">one number per slide</a> — let supporting data live in the appendix.</li>
            <li>Show the trend, not just the snapshot — a single data point without context <a href="/blogs">misleads more than it informs</a>.</li>
            <li>Close every review with explicit next steps — who owns what, and by when.</li>
          </ol>
          <figure>
            <img src="/figma/post/inline-2.png" alt="Person working on a laptop" />
            <figcaption>Image courtesy of Leon via <a href="https://unsplash.com/photos/bzqU01v-G54" target="_blank" rel="noreferrer">Unsplash</a></figcaption>
          </figure>
          <p>If your team uses KPILY&apos;s leaderboard, consider including a recognition slide at the end of your presentation — spotlight the top performers by name. Public recognition in a group setting is one of the highest-impact, lowest-cost motivators available to managers, and it gives your review a positive close that people remember.</p>
          <p>Finally, send the deck afterwards. A presentation that disappears after the meeting loses most of its value. Share a PDF with the key numbers and the agreed actions so everyone leaves with the same record.</p>
          <section className="kp-prose__box">
            <h2>Conclusion</h2>
            <p>A great performance review presentation does three things: it tells the truth about where the team stands, it explains why, and it points clearly toward what happens next. Everything else — colour schemes, animations, chart types — is secondary to those three things.</p>
            <p>KPILY is built around the belief that performance clarity should be continuous, not quarterly. The best presenters we&apos;ve seen are the ones who treat their review deck as a summary of conversations that have already happened — not a first reveal.</p>
            <p>If you&apos;re not already running frequent check-ins and capturing feedback in real time, that&apos;s where to start. The presentation will take care of itself when the underlying data is honest and up to date.</p>
            <p>Ready to make performance data a daily habit? <a href="/register">Start your free trial</a> and see what your team looks like with full KPI visibility.</p>
          </section>
          <hr />
          <div className="kp-author">
            <div className="kp-author__who">
              <img src="/figma/post/avatar-olivia.png" alt="" />
              <div><strong>Olivia Rhye</strong><span>Product Designer, Untitled</span></div>
            </div>
            <div className="kp-author__share">
              <button type="button" onClick={copyLink}><img src="/figma/post/copy.svg" alt="" />{copied ? 'Copied!' : 'Copy link'}</button>
              <a href="https://twitter.com/intent/tweet" target="_blank" rel="noreferrer" aria-label="Share on Twitter"><img src="/figma/post/social-1.svg" alt="" /></a>
              <a href="https://www.facebook.com/sharer/sharer.php" target="_blank" rel="noreferrer" aria-label="Share on Facebook"><img src="/figma/post/social-2.svg" alt="" /></a>
              <a href="https://www.linkedin.com/sharing/share-offsite/" target="_blank" rel="noreferrer" aria-label="Share on LinkedIn"><img src="/figma/post/social-3.svg" alt="" /></a>
            </div>
          </div>
        </article>

        <section className="kp-container kp-more">
          <h2>From the blog</h2>
          <p className="kp-more__lead">The latest industry news, interviews, technologies, and resources.</p>
          <div className="kp-grid2">
            {MORE.map((m) => (
              <article key={m.slug} className="kp-card kp-card--more">
                <img className="kp-card__img" src={m.image} alt="" />
                <h3>{m.title}</h3>
                <p className="kp-card__excerpt">{m.excerpt}</p>
                <Link href={`/blog-post?slug=${m.slug}`} className="kp-readmore">Read post <img src="/figma/post/arrow-up-right.svg" alt="" /></Link>
              </article>
            ))}
          </div>
          <div className="kp-more__action"><Link href="/blogs" className="kp-purple-btn">View all posts</Link></div>
        </section>

        <section className="kp-container">
          <div className="kp-newsletter">
            <div>
              <h2>Join 2,000+ subscribers</h2>
              <p>Stay in the loop with everything you need to know.</p>
            </div>
            <form className="kp-capture kp-capture--purple" onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true) }}>
              <div>
                <input type="email" aria-label="Email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <small>We care about your data in our <Link href="/about">privacy policy</Link></small>
              </div>
              <button type="submit">{subscribed ? 'Subscribed' : 'Subscribe'}</button>
            </form>
          </div>
        </section>
      </main>
      <DemoCta />
      <SiteFooter />
    </div>
  )
}
