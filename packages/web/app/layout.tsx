import type { Metadata } from 'next'
import '../styles/fonts.css'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'KPILY - Performance Management',
  description: 'Track KPIs, manage tasks, and celebrate team achievements.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
