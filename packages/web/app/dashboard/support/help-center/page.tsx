import Link from 'next/link'
import Icon from '@/components/app/Icon'
import '@/styles/Support.css'

const CARDS = [
  { icon: 'wave', title: 'Getting Started', text: 'A step by step guide to understanding your company’s performance data with KPILY', href: '#getting-started' },
  { icon: 'help', title: 'FAQs', text: 'Frequent asked questions about KPILY', href: '#faqs' },
  { icon: 'performance', title: 'Performance Data', text: 'Tips and tricks on getting the most out of your data', href: '#performance-data' },
  { icon: 'folder', title: 'Resources', text: 'Helpful guides and additional information about using KPILY', href: '#resources' },
  { icon: 'chat', title: 'Contact Us', text: 'We are available via email of WhatsApp to chat', href: '/dashboard/support/contact-us' },
  { icon: 'sparkle', title: 'What’s New?', text: 'Learn about our latest updates', href: '/dashboard/support/whats-new' },
] as const

const FAQS = [
  ['How are points calculated?', 'Every task carries a reward. When the person who assigned it marks it complete, they award up to that many points. Point Settings lets admins tune the defaults.'],
  ['Who can create tasks?', 'Team Leads, HR, Admins and Super Admins can create and assign tasks. Everyone can accept, work on and submit the tasks assigned to them.'],
  ['How do I invite my team?', 'Go to Staff → All Staff and choose Add New. Each person gets an email link to finish setting up their account.'],
  ['What does my grade mean?', 'Your grade reflects the share of your tasks that are completed: A from 90%, B from 80%, C from 70%, D from 60%, otherwise F.'],
  ['How do I change my plan?', 'Open Pricing from the menu, pick a plan and billing period, then pay securely with Paystack. Billing shows your current subscription.'],
  ['Can I use KPILY on my phone?', 'Yes. Every page adapts to small screens, so you can check tasks and your scorecard on the go.'],
]

export default function HelpCenter() {
  return (
    <div className="ka-help">
      <div className="ka-pagehead"><h1>Help Center</h1></div>
      <div className="ka-help__grid">
        {CARDS.map((c) => (
          <Link key={c.title} href={c.href} className="ka-card ka-help__card">
            <h2>{c.title} <Icon name={c.icon} size={30} /></h2>
            <p>{c.text}</p>
          </Link>
        ))}
      </div>

      <section id="getting-started" className="ka-card ka-help__sec">
        <h2>Getting Started</h2>
        <ol>
          <li><strong>Set up your company.</strong> Add your company details and logo in Settings.</li>
          <li><strong>Invite your people.</strong> Add staff from Staff → All Staff and group them into teams on the Team page.</li>
          <li><strong>Assign tasks.</strong> Create tasks with a due date and points from Tasks or the Calendar.</li>
          <li><strong>Review and reward.</strong> When work is submitted, mark it complete to award points, or send it back for review.</li>
          <li><strong>Track performance.</strong> Performance Data and each person’s Scorecard update as tasks move.</li>
        </ol>
      </section>

      <section id="faqs" className="ka-card ka-help__sec">
        <h2>FAQs</h2>
        {FAQS.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </section>

      <section id="performance-data" className="ka-card ka-help__sec">
        <h2>Performance Data</h2>
        <ul>
          <li>Use the Filter on Performance Data to focus on one team or a past year.</li>
          <li>Annual KPI shows how many tasks were completed, in progress or awaiting approval every two months.</li>
          <li>Compare teams with Points per Team and Task Completion Rate per Team to spot who needs support.</li>
          <li>Leads can open anyone’s Scorecard from its Filter to prepare for one-on-ones.</li>
        </ul>
      </section>

      <section id="resources" className="ka-card ka-help__sec">
        <h2>Resources</h2>
        <ul>
          <li><Link href="/blogs">KPILY blog</Link>: articles on performance management and team culture.</li>
          <li><Link href="/dashboard/support/terms">Terms of Service</Link> and <Link href="/dashboard/support/privacy-policy">Privacy Policy</Link>.</li>
          <li><Link href="/dashboard/support/contact-us">Contact support</Link> for anything else.</li>
        </ul>
      </section>
    </div>
  )
}
