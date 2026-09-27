import type { Metadata } from 'next'
import '../styles/fonts.css'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'KPILY - Performance Management',
  description: 'Track KPIs, manage tasks, and celebrate team achievements.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'KPILY – Performance Management',
    description: 'Real-time feedback, KPI tracking, and team performance tools for modern businesses.',
    url: 'https://kpily.com',
    siteName: 'KPILY',
    images: [{ url: '/site/og-image.png', width: 1200, height: 630, alt: 'KPILY Performance Management' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KPILY – Performance Management',
    description: 'Real-time feedback, KPI tracking, and team performance tools for modern businesses.',
    images: ['/site/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
