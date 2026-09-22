# Vite React to Next.js TypeScript Migration Guide

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Update values as needed.

### 3. Start Development Server
```bash
npm run dev
# Navigate to http://localhost:3000
```

## Key Changes from Vite/React to Next.js

### File Structure
```
OLD (Vite)                    NEW (Next.js)
pages/                        app/
  Login.jsx                     login/
  Dashboard.jsx                   page.tsx
  Tasks.jsx                     dashboard/
components/                       page.tsx
lib/                          tasks/
src/                            page.tsx
                                [id]/
                                  page.tsx
                            components/
                            lib/
                            styles/
                            public/
```

### Component Syntax Changes

#### 1. Route Imports
```jsx
// OLD (React Router)
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'

// NEW (Next.js)
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
```

#### 2. Client/Server Components
```tsx
// NEW: Add 'use client' at top for client components
'use client'

import { useState } from 'react'

export default function MyComponent() {
  // Now this is a client component with hooks
}
```

#### 3. Navigation
```jsx
// OLD
const navigate = useNavigate()
navigate('/dashboard')

// NEW
const router = useRouter()
router.push('/dashboard')
```

#### 4. Route Matching
```jsx
// OLD
const location = useLocation()
className={location === path ? 'active' : ''}

// NEW
const pathname = usePathname()
className={pathname === path ? 'active' : ''}
```

#### 5. Link Component
```jsx
// OLD
<Link to="/dashboard">Dashboard</Link>

// NEW
<Link href="/dashboard">Dashboard</Link>
```

## Type Definitions

All API functions are now fully typed:

```tsx
import { 
  Session, 
  Task, 
  Dashboard, 
  User,
  Comment,
  TeamMember,
  Credentials 
} from '@/lib/api'

// Now fully type-safe
const [tasks, setTasks] = useState<Task[]>([])
const [summary, setSummary] = useState<Dashboard>(dashboardFixture)
```

## API Integration

The API layer (`lib/api.ts`) includes:
- Full TypeScript types
- Server-side rendering safety (checks `typeof window`)
- Mock mode support (default)
- Proper error handling
- Session management via sessionStorage

### Using API Functions

```tsx
'use client'

import { getTasks, getSession, type Task } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const session = getSession()

  useEffect(() => {
    getTasks(session?.token)
      .then(setTasks)
      .catch(err => console.error(err))
  }, [session?.token])

  return <div>{/* render tasks */}</div>
}
```

## Environment Variables

All env vars must use `NEXT_PUBLIC_` prefix to be accessible in client code:

```
NEXT_PUBLIC_KPILY_API_BASE=https://api.example.com
NEXT_PUBLIC_KPILY_API_MODE=real
```

## CSS Integration

CSS files can be imported directly:
```tsx
import '@/styles/Dashboard.css'
import '@/styles/Auth.css'
```

Copy all `.css` files to `styles/` directory.

## Pages Converted

✅ Login (`/login`)
✅ Register (`/register`)
✅ Dashboard (`/dashboard`)
✅ Tasks (`/tasks`)
✅ Task Detail (`/tasks/[id]`)
✅ Forgot Password (`/forgot-password`)
✅ Change Password (`/change-password`)
✅ Blog (`/blog`)
✅ Blog Post (`/blog-post`)

## Still To Convert

These pages need similar conversion:
- LandingPage
- PricingPage
- PaymentGateway
- PaymentSuccess
- SignUp
- OnboardCompany
- SuccessRegister

**Pattern to follow:**
1. Add `'use client'` at top
2. Change imports: `react-router-dom` → `next/link`, `next/navigation`
3. Change Link: `to=` → `href=`
4. Change hooks: `useNavigate()` → `useRouter()`
5. Change location matching: `useLocation()` → `usePathname()`
6. Add TypeScript types for props/state
7. Update any `useState` hooks to include types

## Static Assets

Place all static assets in `public/`:
- `/public/assets/`
- `/public/kpily/`
- `/public/icons.svg`

Reference with absolute paths:
```tsx
<img src="/assets/logo.png" alt="KPILY" />
```

## Building for Production

```bash
npm run build
npm run start
```

## Type Checking

Full TypeScript strict mode enabled. Run type check:
```bash
npx tsc --noEmit
```

## Form Handling

All forms now use TypeScript event types:

```tsx
interface FormData {
  email: string
  password: string
}

const [formData, setFormData] = useState<FormData>({
  email: '',
  password: ''
})

function handleChange(e: ChangeEvent<HTMLInputElement>) {
  const { name, value } = e.currentTarget
  setFormData(prev => ({
    ...prev,
    [name]: value
  }))
}

function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
  // handle submission
}
```

## sessionStorage & SSR

API module handles SSR safely:

```tsx
// This is safe - checks for window before using sessionStorage
if (typeof window !== 'undefined') {
  sessionStorage.setItem('key', value)
}
```

## Deployment

Works on any Next.js-compatible host:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Self-hosted Node server

For Vercel:
```bash
npm i -g vercel
vercel
```

## Common Patterns

### Protected Route Redirect
```tsx
useEffect(() => {
  if (!session) {
    router.push('/login')
  }
}, [session, router])
```

### Loading State
```tsx
const [loading, setLoading] = useState(false)

async function handleAction() {
  setLoading(true)
  try {
    await apiCall()
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}
```

### Async Data Fetching
```tsx
useEffect(() => {
  let active = true

  fetchData()
    .then(data => {
      if (active) setData(data)
    })
    .catch(console.error)

  return () => { active = false }
}, [])
```

## Troubleshooting

### Issue: "ReferenceError: window is not defined"
**Solution:** Check component has `'use client'` or wrap in `typeof window !== 'undefined'`

### Issue: Import not found
**Solution:** Use path aliases from `tsconfig.json`: `@/` maps to root

### Issue: Type errors on props
**Solution:** Add type annotations to interface for component props

### Issue: CSS not loading
**Solution:** Import CSS in component: `import '@/styles/file.css'`

## Next Steps

1. Copy `styles/` folder from original project
2. Copy `public/` folder for static assets
3. Convert remaining pages following the pattern
4. Test all routes
5. Connect to real API by updating `.env.local`
6. Deploy to production
