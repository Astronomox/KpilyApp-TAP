import type { BadgeColor } from '@/components/figma/BlogBadge'

export type BlogPost = {
  slug: string
  author: string
  date: string
  title: string
  excerpt: string
  image: string
  tags: { label: string; color: BadgeColor }[]
}

// Content exactly as it appears on the Figma "Blog" frame (1557:37197).
export const recentPosts: BlogPost[] = [
  { slug: 'ux-review-presentations', author: 'Olivia Rhye', date: '20 Jan 2022', title: 'UX review presentations', excerpt: 'How do you create compelling presentations that wow your colleagues and impress your managers?', image: '/figma/blog/post-0.png', tags: [{ label: 'Design', color: 'purple' }, { label: 'Research', color: 'indigo' }, { label: 'Presentation', color: 'pink' }] },
  { slug: 'migrating-to-linear-101', author: 'Phoenix Baker', date: '19 Jan 2022', title: 'Migrating to Linear 101', excerpt: 'Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get...', image: '/figma/blog/post-1.png', tags: [{ label: 'Design', color: 'blue' }, { label: 'Research', color: 'pink' }] },
  { slug: 'building-your-api-stack', author: 'Lana Steiner', date: '18 Jan 2022', title: 'Building your API Stack', excerpt: 'The rise of RESTful APIs has been met by a rise in tools for creating, testing, and manag...', image: '/figma/blog/post-2.png', tags: [{ label: 'Design', color: 'green' }, { label: 'Research', color: 'pink' }] },
]

export const allPosts: BlogPost[] = [
  { slug: 'bill-walsh-leadership-lessons', author: 'Alec Whitten', date: '17 Jan 2022', title: 'Bill Walsh leadership lessons', excerpt: 'Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?', image: '/figma/blog/post-3.png', tags: [{ label: 'Leadership', color: 'purple' }, { label: 'Management', color: 'gray' }] },
  { slug: 'pm-mental-models', author: 'Demi WIlkinson', date: '16 Jan 2022', title: 'PM mental models', excerpt: 'Mental models are simple expressions of complex processes or relationships.', image: '/figma/blog/post-4.png', tags: [{ label: 'Product', color: 'blue' }, { label: 'Research', color: 'indigo' }, { label: 'Frameworks', color: 'orange' }] },
  { slug: 'what-is-wireframing', author: 'Candice Wu', date: '15 Jan 2022', title: 'What is Wireframing?', excerpt: 'Introduction to Wireframing and its Principles. Learn from the best in the industry.', image: '/figma/blog/post-5.png', tags: [{ label: 'Design', color: 'purple' }, { label: 'Research', color: 'indigo' }] },
  { slug: 'how-collaboration-makes-us-better-designers', author: 'Natali Craig', date: '14 Jan 2022', title: 'How collaboration makes us better designers', excerpt: 'Collaboration can make our teams stronger, and our individual designs better.', image: '/figma/blog/post-6.png', tags: [{ label: 'Design', color: 'purple' }, { label: 'Research', color: 'indigo' }] },
  { slug: 'our-top-10-javascript-frameworks-to-use', author: 'Drew Cano', date: '13 Jan 2022', title: 'Our top 10 Javascript frameworks to use', excerpt: 'JavaScript frameworks make development easy with extensive features and functionalities.', image: '/figma/blog/post-7.png', tags: [{ label: 'Software Development', color: 'green' }, { label: 'Tools', color: 'pink' }, { label: 'SaaS', color: 'rose' }] },
  { slug: 'podcast-creating-a-better-cx-community', author: 'Orlando Diggs', date: '12 Jan 2022', title: 'Podcast: Creating a better CX Community', excerpt: 'Starting a community doesn’t need to be complicated, but how do you get started?', image: '/figma/blog/post-8.png', tags: [{ label: 'Podcasts', color: 'purple' }, { label: 'Customer Success', color: 'gray' }] },
]
