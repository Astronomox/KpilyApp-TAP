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
  { slug: 'migrating-to-linear-101', title: 'Migrating to Linear 101', excerpt: 'Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get started.', image: '/figma/post/card-2.png' },
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
          <p className="kp-prose__lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper mattis lorem non. Ultrices praesent amet ipsum justo massa. Eu dolor aliquet risus gravida nunc at feugiat consequat purus. Non massa enim vitae duis mattis. Vel in ultricies vel fringilla.</p>
          <hr />
          <h2>Introduction</h2>
          <p>Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.</p>
          <p>Eget quis mi enim, leo lacinia pharetra, semper. Eget in <a href="#">volutpat mollis</a> at volutpat lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit <a href="#">tristique risus</a>, at donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat. </p>
          <figure>
            <img src="/figma/post/inline-1.png" alt="Desk with a laptop" />
            <figcaption>Image courtesy of Laura Davidson via <a href="https://unsplash.com/photos/QBAH4IldaZY" target="_blank" rel="noreferrer">Unsplash</a></figcaption>
          </figure>
          <blockquote>
            <p>“In a world older and more complete than ours they move finished and complete, gifted with extensions of the senses we have lost or never attained, living by voices we shall never hear.”</p>
            <cite>— Olivia Rhye, Product Designer</cite>
          </blockquote>
          <p>Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi <a href="#">bibendum diam</a>. Tempor integer aliquam in vitae malesuada fringilla.</p>
          <p>Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat <a href="#">auctor aliquam</a>. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.</p>
          <p>Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh orci.</p>
          <h3>Software and tools</h3>
          <p>Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor. Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac pellentesque ac.</p>
          <h3>Other resources</h3>
          <p>Sagittis et eu at elementum, quis in. Proin praesent volutpat egestas sociis sit lorem nunc nunc sit. Eget diam curabitur mi ac. Auctor rutrum lacus malesuada massa ornare et. Vulputate consectetur ac ultrices at diam dui eget fringilla tincidunt. Arcu sit dignissim massa erat cursus vulputate gravida id. Sed quis auctor vulputate hac elementum gravida cursus dis.</p>
          <ol>
            <li>Lectus id duis vitae porttitor enim <a href="#">gravida morbi</a>.</li>
            <li>Eu turpis <a href="#">posuere semper feugiat</a> volutpat elit, ultrices suspendisse. Auctor vel in vitae placerat.</li>
            <li>Suspendisse maecenas ac <a href="#">donec scelerisque</a> diam sed est duis purus.</li>
          </ol>
          <figure>
            <img src="/figma/post/inline-2.png" alt="Person working on a laptop" />
            <figcaption>Image courtesy of Leon via <a href="https://unsplash.com/photos/bzqU01v-G54" target="_blank" rel="noreferrer">Unsplash</a></figcaption>
          </figure>
          <p>Lectus leo massa amet posuere. Malesuada mattis non convallis quisque. Libero sit et imperdiet bibendum quisque dictum vestibulum in non. Pretium ultricies tempor non est diam. Enim ut enim amet amet integer cursus. Sit ac commodo pretium sed etiam turpis suspendisse at.</p>
          <p>Tristique odio senectus nam posuere ornare leo metus, ultricies. Blandit duis ultricies vulputate morbi feugiat cras placerat elit. Aliquam tellus lorem sed ac. Montes, sed mattis pellentesque suscipit accumsan. Cursus viverra aenean magna risus elementum faucibus molestie pellentesque. Arcu ultricies sed mauris vestibulum.</p>
          <section className="kp-prose__box">
            <h2>Conclusion</h2>
            <p>Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus id scelerisque est ultricies ultricies. Duis est sit sed leo nisl, blandit elit sagittis. Quisque tristique consequat quam sed. Nisl at scelerisque amet nulla purus habitasse.</p>
            <p>Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas condimentum mi massa. In tincidunt pharetra consectetur sed duis facilisis metus. Etiam egestas in nec sed et. Quis lobortis at sit dictum eget nibh tortor commodo cursus.</p>
            <p>Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce aliquet. Nam elementum urna nisi aliquet erat dolor enim. Ornare id morbi eget ipsum. Aliquam senectus neque ut id eget consectetur dictum. Donec posuere pharetra odio consequat scelerisque et, nunc tortor.</p>
            <p>Nulla adipiscing erat a erat. Condimentum lorem posuere gravida enim posuere cursus diam.</p>
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
