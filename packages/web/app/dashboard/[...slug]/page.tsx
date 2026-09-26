import { notFound } from 'next/navigation'
import { NAV, flatNav } from '@/lib/nav'

// Placeholder for app pages not built yet (steps 3–5 replace these with real routes).
export default async function Pending({ params }: { params: Promise<{ slug: string[] }> }) {
  const path = `/dashboard/${(await params).slug.join('/')}`
  const page = [...NAV, ...flatNav(NAV)].find((i) => i.path === path)
  if (!page) notFound()
  return (
    <section className="kp-page">
      <h1>{page.title}</h1>
      <p>This page is coming soon.</p>
    </section>
  )
}
