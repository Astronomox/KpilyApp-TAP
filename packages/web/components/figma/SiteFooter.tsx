import Link from 'next/link'

const SOCIAL = [
  { name: 'Twitter', icon: 'twitter', href: '#twitter-link' },
  { name: 'Facebook', icon: 'facebook', href: 'https://m.facebook.com/100980035046229/' },
  { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/kpilyapp/' },
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/company/92823514/' },
  { name: 'YouTube', icon: 'youtube', href: '#youtube-link' },
]

// Footer from kpily.netlify.app.
export default function SiteFooter() {
  return (
    <footer className="kp-footer">
      <div className="kp-footer__inner">
        <div className="kp-footer__brand">
          <Link href="/" aria-label="KPILY home"><img className="kp-footer__logo" src="/site/logo-white.svg" alt="KPILY Performance Management" width={277} height={98} /></Link>
          <p className="kp-footer__copy">© {new Date().getFullYear()}, KPILY. All rights reserved</p>
          <div className="kp-social kp-social--dark kp-footer__social">
            {SOCIAL.map((s) => (
              <a key={s.icon} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={s.name}>
                <img src={`/figma/social/${s.icon}.svg`} alt="" />
              </a>
            ))}
          </div>
        </div>
        <div className="kp-footer__cols">
          <div className="kp-footer__col">
            <h3>Company</h3>
            <Link href="/about">About Us</Link>
            <Link href="/about">Press</Link>
            <Link href="/blogs">Blog</Link>
          </div>
          <div className="kp-footer__col">
            <h3>Get Started</h3>
            <Link href="/about">Request a demo</Link>
            <Link href="/register">Sign up</Link>
            <Link href="/login">Log in</Link>
          </div>
          <div className="kp-footer__col">
            <h3>Contact</h3>
            <span>Phone</span>
            <a className="kp-footer__contact" href="tel:+2349024429918">+234 09024429918</a>
            <span>Email</span>
            <a className="kp-footer__contact" href="mailto:support@kpily.com?subject=Customer from KPILY Website">support@kpily.com</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
