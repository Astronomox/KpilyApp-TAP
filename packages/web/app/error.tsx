'use client'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', system-ui, sans-serif", background: '#f7f8fa', padding: '32px 24px', textAlign: 'center' }}>
      <img src="/assets/logo-full.png" alt="KPILY" style={{ width: 140, marginBottom: 40 }} />
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#252525', margin: '0 0 12px' }}>Something went wrong</h1>
      <p style={{ fontSize: 15, color: '#666', maxWidth: 400, margin: '0 0 32px', lineHeight: 1.6 }}>An unexpected error occurred. Your data is safe  -  try refreshing or go back to the dashboard.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={reset} style={{ padding: '10px 24px', borderRadius: 8, border: '1.5px solid #d0d5dd', background: '#fff', color: '#252525', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Try again</button>
        <Link href="/dashboard" style={{ padding: '10px 24px', borderRadius: 8, background: 'linear-gradient(135deg, #1e7a5a, #106190)', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Go to Dashboard</Link>
      </div>
    </div>
  )
}
