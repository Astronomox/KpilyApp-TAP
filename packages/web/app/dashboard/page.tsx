'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { dashboardFixture, getDashboard, getSession, taskFixtures, teamFixtures } from '@/lib/api'
import '@/styles/Dashboard.css'

const navItems = [['⌂', 'Dashboard', '/dashboard'], ['◒', 'Performance', '/performance'], ['✓', 'Tasks', '/tasks'], ['▦', 'Projects', '/projects'], ['◉', 'Team', '/team'], ['◌', 'Chat', '/chat'], ['◷', 'Calendar', '/calendar'], ['◔', 'Notifications', '/notifications']]

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = usePathname()
  return <aside className={`app-sidebar ${open ? 'open' : ''}`}>
    <Link href='/' onClick={onClose}><img src="/assets/logo-full.png" alt="KPILY" className="app-logo" /></Link>
    <p className="sidebar-label">Workspace</p>
    <nav className="sidebar-nav">{navItems.map(([icon, label, path]) => <Link key={label} href={path} className={location === path ? 'active' : ''} onClick={onClose}><span className="sidebar-icon">{icon}</span>{label}</Link>)}</nav>
    <p className="sidebar-label" style={{ marginTop: 28 }}>Account</p>
    <nav className="sidebar-nav"><Link href='/settings/profile' onClick={onClose}><span className="sidebar-icon">⚙</span>Settings</Link><Link href='/login' onClick={onClose}><span className="sidebar-icon">↪</span>Log out</Link></nav>
    <div className="sidebar-bottom"><div className="profile-mini"><img src="/kpily/avatar-03.png" alt="Elias Akin" /><div><strong>Elias Akin</strong><span>Performance Lead</span></div></div></div>
  </aside>
}

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [summary, setSummary] = useState(dashboardFixture)
  const [tasks] = useState(taskFixtures)
  const session = getSession()
  useEffect(() => { let active = true; getDashboard(session?.token).then((data) => active && data && setSummary({ ...dashboardFixture, ...data })).catch(() => {}); return () => { active = false } }, [session?.token])
  const visibleTasks = useMemo(() => tasks.filter((task) => task.status !== 'Completed').slice(0, 3), [tasks])
  const userName = session?.user?.name || 'Elias Akin'
  return <div className="app-shell"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><div className="app-main">
    <header className="app-topbar"><div className="topbar-title"><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation">☰</button><div><h1>Dashboard</h1><p>Workspace / Overview</p></div></div><div className="topbar-actions"><label className="search-box">⌕<input aria-label="Search workspace" placeholder="Search workspace" /></label><button className="top-icon" aria-label="Notifications">♢</button><img className="top-avatar" src="/kpily/avatar-03.png" alt={userName} /></div></header>
    <main className="dashboard-content"><div className="welcome-row"><div><p className="eyebrow-dashboard">Good afternoon, {userName.split(' ')[0]}</p><h2>Keep your momentum going.</h2><p>Here is what is happening across your performance workspace.</p></div><Link className="primary-action" href='/tasks/new'>＋ Create new task</Link></div>
      <section className="metric-grid"><Metric label="Current points" value={summary.points.toLocaleString()} meta={`Level ${summary.level} · ${summary.pointsToNext} to next`} icon="✦" /><Metric label="Project completion" value={`${summary.projectCompletion}%`} meta="Across active projects" icon="◫" /><Metric label="Task completion" value={`${summary.taskCompletion}%`} meta={summary.performanceDelta + ' this period'} icon="✓" /><Metric label="Current reward" value={summary.currentReward} meta={`Next: ${summary.nextReward}`} icon="◇" /></section>
      <div className="content-grid"><section className="surface"><div className="surface-header"><h3>Tasks requiring attention</h3><Link href='/tasks'>View all →</Link></div><div className="task-list">{visibleTasks.length ? visibleTasks.map((task) => <Link className="task-row" href={`/tasks/${task.id}`} key={task.id}><div><h4>{task.name}</h4><p>{task.assignee} · {task.priority} priority · {task.reward} XP</p></div><div className="task-row-right"><span className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span><span className="task-due">{task.dueDate}</span></div></Link>) : <div className="empty-state">No tasks require attention.</div>}</div></section><section className="surface progress-card"><h3>Current performance</h3><p>Your performance is trending upward. Keep completing focused work to unlock the next reward.</p><div className="progress-ring"><div className="ring"><strong>{summary.taskCompletion}%</strong></div><div className="ring-copy"><strong>Strong momentum</strong><span>{summary.pointsToNext} XP until your next level.</span></div></div></section></div>
      <div className="content-grid"><section className="surface"><div className="surface-header"><h3>Recent activity</h3><Link href='/notifications'>See more →</Link></div><div className="activity-list">{summary.recentActivity.map((item) => <div className="activity-item" key={item.id}><span className={`activity-avatar ${item.tone}`}>{item.initials}</span><div><strong>{item.title}</strong><span>{item.meta}</span></div></div>)}</div></section><section className="surface progress-card"><h3>Team pulse</h3><p>People are active across your workspace. Review teammates and keep collaboration moving.</p><div className="assignee">{teamFixtures.slice(0, 3).map((member) => <img key={member.id} src={member.avatar} alt={member.name} title={member.name} />)}<span style={{ color: '#748c93', fontSize: 12 }}>+ 8 teammates</span></div><Link href='/team' className="primary-action" style={{ marginTop: 22 }}>Open team →</Link></section></div>
      <section className="quick-grid"><Quick icon="✓" title="Review tasks" text="See what needs your attention" href='/tasks' /><Quick icon="＋" title="Add teammate" text="Invite someone to your team" href='/team' /><Quick icon="◷" title="Plan an event" text="Keep your calendar aligned" href='/calendar' /></section>
    </main></div></div>
}

function Metric({ label, value, meta, icon }: { label: string; value: string; meta: string; icon: string }) { return <article className="metric-card"><div className="metric-card-top"><label>{label}</label><span className="metric-icon">{icon}</span></div><div className="metric-value">{value}</div><span className={`metric-meta ${meta.includes('Next') ? 'muted' : ''}`}>{meta}</span></article> }
function Quick({ icon, title, text, href }: { icon: string; title: string; text: string; href: string }) { return <Link className="quick-card" href={href}><span className="quick-card-icon">{icon}</span><span><strong>{title}</strong><span>{text}</span></span></Link> }
