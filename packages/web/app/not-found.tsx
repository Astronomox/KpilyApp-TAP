import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Poppins', system-ui, sans-serif",
      background: '#f7f8fa',
      padding: '32px 24px',
      textAlign: 'center',
    }}>
      <img src="/assets/logo-full.png" alt="KPILY" style={{ width: 160, marginBottom: 48 }} />

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <p style={{
          fontSize: 'clamp(96px, 20vw, 160px)',
          fontWeight: 800,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #47be94 0%, #106190 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          letterSpacing: '-4px',
          userSelect: 'none',
        }}>404</p>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#252525', margin: '0 0 12px' }}>
        Page not found
      </h1>
      <p style={{ fontSize: 16, color: '#666', maxWidth: 440, margin: '0 0 40px', lineHeight: 1.6 }}>
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 28px', borderRadius: 10,
          border: '1.5px solid #d0d5dd', background: '#fff',
          color: '#252525', fontWeight: 600, fontSize: 15,
          textDecoration: 'none',
        }}>
          ← Home
        </Link>
        <Link href="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 28px', borderRadius: 10,
          background: 'linear-gradient(135deg, #47be94 0%, #106190 100%)',
          color: '#fff', fontWeight: 600, fontSize: 15,
          textDecoration: 'none',
        }}>
          Go to Dashboard
        </Link>
      </div>

      <p style={{ marginTop: 64, fontSize: 13, color: '#aaa' }}>
        Need help?{' '}
        <a href="mailto:support@kpily.com" style={{ color: '#106190', textDecoration: 'none', fontWeight: 500 }}>
          support@kpily.com
        </a>
      </p>
    </div>
  )
}
