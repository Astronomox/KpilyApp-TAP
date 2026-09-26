import Link from 'next/link'

// Phone layout shared by the auth pages: logo bar, optional art banner,
// heading, content and a footer area. Same tokens as the Figma frames.
export default function MobileAuth({
  title, lead, art = 'hero', children, footer, align = 'left',
}: {
  title: React.ReactNode; lead?: React.ReactNode; art?: 'hero' | 'none' | string
  children: React.ReactNode; footer?: React.ReactNode; align?: 'left' | 'center'
}) {
  return (
    <div className={`kp-m__page kp-m__page--${align}`}>
      <header className="kp-m__bar">
        <Link href="/" aria-label="KPILY home"><img src="/assets/logo-full.png" alt="KPILY Performance Management" width={132} height={45} /></Link>
      </header>
      {art === 'hero' && (
        <div className="kp-m__banner" aria-hidden="true">
          <img className="kp-m__banner-photo" src="/figma/login/hero.png" alt="" />
          <div className="kp-m__points"><img src="/figma/login/star.svg" alt="" /><small>Received</small><strong>350</strong><small>Points for this task</small></div>
          <div className="kp-m__received"><img src="/figma/login/avatar-jackline.png" alt="" /><div><span>+ 500 Points</span><em>Received from Jackline</em></div></div>
        </div>
      )}
      {art !== 'hero' && art !== 'none' && <img className="kp-m__art" src={art} alt="" aria-hidden="true" />}
      <section className="kp-m__body">
        <h1 className="kp-m__title">{title}</h1>
        {lead && <p className="kp-m__lead">{lead}</p>}
        {children}
      </section>
      {footer && <footer className="kp-m__footer">{footer}</footer>}
    </div>
  )
}
