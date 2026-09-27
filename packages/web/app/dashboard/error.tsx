'use client'
import Link from 'next/link'
import { useEffect } from 'react'

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center', fontFamily: 'inherit' }}>
      <p style={{ fontSize: 40, marginBottom: 16 }}>&#9888;&#65039;</p>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ka-text)', margin: '0 0 12px' }}>This section failed to load</h2>
      <p style={{ fontSize: 14, color: 'var(--ka-muted)', maxWidth: 360, margin: '0 auto 28px', lineHeight: 1.6 }}>There was a problem loading this page. Your data is intact.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={reset} className="ka-btn ka-btn--ghost">Try again</button>
        <Link href="/dashboard/account-overview" className="ka-btn">Back to overview</Link>
      </div>
    </div>
  )
}
