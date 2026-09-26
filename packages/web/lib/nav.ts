// App navigation, mirroring kpily-dashboard.netlify.app (privileges per item).
export type NavItem = { title: string; icon: IconName; path: string; privileges: number[]; children?: NavItem[] }
export type IconName = 'overview' | 'performance' | 'team' | 'staff' | 'tasks' | 'calendar' | 'pricing' | 'billing' | 'settings' | 'support'

const ALL = [200, 100, 50, 40, 35, 30]
const LEADS = [200, 100, 50, 40]
const ADMINS = [200, 100, 50]

export const NAV: NavItem[] = [
  { title: 'Account Overview', icon: 'overview', path: '/dashboard/account-overview', privileges: ALL },
  { title: 'Performance Data', icon: 'performance', path: '/dashboard/performance-data', privileges: LEADS, children: [
    { title: 'Performance Data', icon: 'performance', path: '/dashboard/performance-data/performance-data', privileges: LEADS },
    { title: 'Scorecard', icon: 'performance', path: '/dashboard/performance-data/scorecard', privileges: LEADS },
    { title: 'Point Settings', icon: 'performance', path: '/dashboard/performance-data/point-settings', privileges: ADMINS },
    { title: 'Badge Settings', icon: 'performance', path: '/dashboard/performance-data/badge-settings', privileges: ADMINS },
  ] },
  { title: 'Team', icon: 'team', path: '/dashboard/team', privileges: ALL },
  { title: 'Staff', icon: 'staff', path: '/dashboard/staff', privileges: LEADS, children: [
    { title: 'All Staff', icon: 'staff', path: '/dashboard/staff/all-staff', privileges: LEADS },
    { title: 'Organogram', icon: 'staff', path: '/dashboard/staff/organogram', privileges: LEADS },
  ] },
  { title: 'Tasks', icon: 'tasks', path: '/dashboard/tasks', privileges: ALL },
  { title: 'Calendar', icon: 'calendar', path: '/dashboard/calendar', privileges: ALL },
  { title: 'Pricing', icon: 'pricing', path: '/dashboard/pricing', privileges: ADMINS },
  { title: 'Billing', icon: 'billing', path: '/dashboard/billing', privileges: ADMINS },
  { title: 'Settings', icon: 'settings', path: '/dashboard/settings', privileges: ALL },
  // Live app gives these children privilege [2] (visible to no one); shown to all here.
  { title: 'Support', icon: 'support', path: '/dashboard/support', privileges: ALL, children: [
    { title: 'Help Center, FAQ', icon: 'support', path: '/dashboard/support/help-center', privileges: ALL },
    { title: 'Contact Us', icon: 'support', path: '/dashboard/support/contact-us', privileges: ALL },
    { title: 'What’s New?', icon: 'support', path: '/dashboard/support/whats-new', privileges: ALL },
    { title: 'Terms of Service', icon: 'support', path: '/dashboard/support/terms', privileges: ALL },
    { title: 'Privacy Policy', icon: 'support', path: '/dashboard/support/privacy-policy', privileges: ALL },
  ] },
]

export function navFor(privilege: number): NavItem[] {
  return NAV.filter((i) => i.privileges.includes(privilege)).map((i) => ({ ...i, children: i.children?.filter((c) => c.privileges.includes(privilege)) }))
}

/** Flat list of every page (for the ⌘K palette and route titles). */
export const flatNav = (items: NavItem[]) => items.flatMap((i) => (i.children?.length ? i.children : [i]))

export const ROLE: Record<number, string> = { 200: 'Super Admin', 100: 'Admin', 50: 'HR', 40: 'Team Lead', 35: 'Unit Lead', 30: 'Member' }
export const roleLabel = (privilege?: number) => (privilege !== undefined && ROLE[privilege]) || 'Member'
