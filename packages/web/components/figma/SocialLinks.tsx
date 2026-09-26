const links = [
  { name: 'Twitter', icon: 'twitter', href: 'https://twitter.com' },
  { name: 'Facebook', icon: 'facebook', href: 'https://facebook.com' },
  { name: 'Instagram', icon: 'instagram', href: 'https://instagram.com' },
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://linkedin.com' },
  { name: 'YouTube', icon: 'youtube', href: 'https://youtube.com' },
]

export default function SocialLinks({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <div className={`kp-social ${dark ? 'kp-social--dark' : ''} ${className}`}>
      {links.map((l) => (
        <a key={l.icon} href={l.href} target="_blank" rel="noreferrer" aria-label={l.name}>
          <img src={`/figma/social/${l.icon}.svg`} alt="" />
        </a>
      ))}
    </div>
  )
}
