import Link from 'next/link'

export default function Logo({ href = '/', className = '' }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={`kp-logo ${className}`} aria-label="KPILY home">
      <img src="/assets/logo-full.png" alt="KPILY Performance Management" width={178} height={60} />
    </Link>
  )
}
