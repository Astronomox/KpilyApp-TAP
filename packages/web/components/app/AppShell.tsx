'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icon'
import Avatar from './Avatar'
import CommandPalette from './CommandPalette'
import FeedRail from './FeedRail'
import PageLoader from '@/components/figma/PageLoader'
import { getActiveSessions, logout, type Profile } from '@/lib/kpily'
import { navFor, roleLabel, type NavItem } from '@/lib/nav'
import { useRequireSession } from '@/lib/useSession'
import '@/styles/App.css'

const fmtLogin = (unix?: number) => {
  const d = unix ? new Date(unix * 1000) : new Date()
  return `${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
}

function Drawer({ open, onClose, nav, profile, lastLogin }: { open: boolean; onClose: () => void; nav: NavItem[]; profile: Profile | null; lastLogin?: number }) {
  const pathname = usePathname() || ''
  const [expanded, setExpanded] = useState<string | null>(() => nav.find((i) => i.children?.some((c) => pathname.startsWith(c.path)))?.path ?? null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => { if (open) panel.current?.focus() }, [open])

  return (
    <div className={`kp-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="kp-drawer__scrim" onClick={onClose} />
      <div ref={panel} className="kp-drawer__panel" role="dialog" aria-modal="true" aria-label="Main menu" tabIndex={-1}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}>
        <div className="kp-drawer__head">
          <Link href="/dashboard/account-overview" onClick={onClose} aria-label="KPILY home"><img src="/assets/logo-full.png" alt="KPILY Performance Management" width={148} /></Link>
          <button type="button" className="kp-iconbtn" aria-label="Close menu" onClick={onClose}><Icon name="chevron" /></button>
        </div>
        <div className="kp-drawer__profile">
          <Avatar name={profile?.fullname} size={160} />
          <strong>{profile?.fullname}</strong>
          <span>{roleLabel(profile?.privilege)}</span>
          <small>Last login: {fmtLogin(lastLogin)}</small>
        </div>
        <nav className="kp-drawer__nav" aria-label="Main">
          {nav.map((item) => {
            const hasKids = !!item.children?.length
            const active = pathname.startsWith(item.path)
            const isOpen = expanded === item.path
            return (
              <div key={item.path}>
                {hasKids ? (
                  <button type="button" className={`kp-nav ${active ? 'is-active' : ''}`} aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : item.path)}>
                    <Icon name={item.icon} gradient /><span>{item.title}</span><Icon name="caret" size={14} className={`kp-nav__caret ${isOpen ? 'is-open' : ''}`} />
                  </button>
                ) : (
                  <Link href={item.path} className={`kp-nav ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined} onClick={onClose}>
                    <Icon name={item.icon} gradient /><span>{item.title}</span>
                  </Link>
                )}
                {hasKids && isOpen && (
                  <div className="kp-nav__children">
                    {item.children!.map((c) => (
                      <Link key={c.path} href={c.path} className={`kp-nav kp-nav--child ${pathname === c.path ? 'is-active' : ''}`} aria-current={pathname === c.path ? 'page' : undefined} onClick={onClose}>{c.title}</Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

// Signed-in app frame: dark header, slide-out menu, ⌘K palette, settings menu and Feed rail.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { profile, ready } = useRequireSession()
  const [menu, setMenu] = useState(false)
  const [palette, setPalette] = useState(false)
  const [cog, setCog] = useState(false)
  const [lastLogin, setLastLogin] = useState<number>()
  const [leaving, setLeaving] = useState(false)
  const cogRef = useRef<HTMLDivElement>(null)
  const nav = useMemo(() => navFor(profile?.privilege ?? 30), [profile?.privilege])

  useEffect(() => {
    if (!ready) return
    getActiveSessions().then((s) => setLastLogin(s[s.length - 1]?.dateCreated)).catch(() => {})
  }, [ready])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p) }
    }
    const onClick = (e: MouseEvent) => { if (cogRef.current && !cogRef.current.contains(e.target as Node)) setCog(false) }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [])

  async function signOut() {
    setLeaving(true)
    await logout().catch(() => {})
    router.replace('/login')
  }

  if (!ready || leaving) return <PageLoader label={leaving ? 'Logging out' : 'Loading'} />

  return (
    <div className="kp-app">
      <header className="kp-topbar">
        <button type="button" className="kp-iconbtn kp-iconbtn--light" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}><Icon name="menu" size={26} /></button>
        <Link href="/dashboard/account-overview" className="kp-topbar__logo" aria-label="KPILY home"><img src="/site/logo-white.svg" alt="KPILY Performance Management" /></Link>
        <button type="button" className="kp-search" onClick={() => setPalette(true)}>
          <Icon name="search" size={24} className="kp-search__icon" />
          <span>Search for team members, tasks, rewards, etc.</span>
          <kbd>⌘ K</kbd>
        </button>
        <div className="kp-cog" ref={cogRef}>
          <button type="button" className={`kp-iconbtn kp-iconbtn--light ${cog ? 'is-on' : ''}`} aria-label="Account menu" aria-haspopup="menu" aria-expanded={cog} onClick={() => setCog(!cog)}><Icon name="cog" size={24} /></button>
          {cog && (
            <div className="kp-cog__menu" role="menu">
              <Link role="menuitem" href="/dashboard/settings" onClick={() => setCog(false)}><Icon name="cog" size={16} />Settings</Link>
              <button role="menuitem" type="button" onClick={signOut}><Icon name="logout" size={16} />Logout</button>
            </div>
          )}
        </div>
      </header>

      <Drawer open={menu} onClose={() => setMenu(false)} nav={nav} profile={profile} lastLogin={lastLogin} />
      <CommandPalette open={palette} onClose={() => setPalette(false)} nav={nav} />

      <main className="kp-app__main">{children}</main>
      <FeedRail />
    </div>
  )
}
