import '@/styles/Support.css'

const UPDATES = [
  { title: 'Payments with Paystack', text: 'Choose a plan and pay securely from Pricing. Your subscription appears on the Billing page straight away.' },
  { title: 'Performance Data and Scorecards', text: 'Year-to-date KPIs, charts by team and individual scorecards with quarterly progress.' },
  { title: 'Staff, teams and organogram', text: 'Invite staff, set their access, group them into teams and see reporting lines at a glance.' },
  { title: 'Calendar', text: 'See tasks and events by month, week, day or as a list, and schedule events with your team.' },
  { title: 'Tasks', text: 'Assign work with points, accept and submit it, and review or complete it — all from one table.' },
  { title: 'Quick search', text: 'Press Ctrl/⌘ K anywhere to jump to any page.' },
]

export default function WhatsNew() {
  return (
    <div className="ka-help">
      <div className="ka-pagehead"><div><h1>What’s New?</h1><p>Learn about our latest updates</p></div></div>
      <ol className="ka-help__timeline">
        {UPDATES.map((u) => <li key={u.title} className="ka-card"><h2>{u.title}</h2><p>{u.text}</p></li>)}
      </ol>
    </div>
  )
}
