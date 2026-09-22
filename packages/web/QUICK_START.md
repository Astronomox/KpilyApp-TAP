# 🚀 KPILY Next.js 16 - Quick Start Guide

## Installation (3 commands)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

Visit `http://localhost:3000`

---

## Available Routes

All routes are automatically available through Next.js file-based routing:

```
/                          → Root (create app/page.tsx if needed)
/login                     → Login page
/register                  → Register page
/signup                    → Sign up page
/dashboard                 → Dashboard
/tasks                     → Tasks list
/tasks/[id]               → Task detail
/blog                      → Blog page
/blog-post                → Blog post page
/landing                  → Landing page
/forgot-password          → Forgot password
/change-password          → Change password
/onboard-company          → Onboard company
/payment-gateway          → Payment gateway
/payment-success          → Payment success
/pricing                  → Pricing page
/success-register         → Success register
/task-detail              → Task detail page
```

---

## Project Commands

```bash
# Development
npm run dev                # Start dev server (port 3000)

# Building
npm run build              # Build for production
npm start                  # Start production server

# Type checking
npx tsc --noEmit          # Check TypeScript without building
```

---

## Environment Variables

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=KPILY
```

Update paths in `lib/api.ts` if your API is on a different endpoint.

---

## Understanding the Structure

### Pages (`app/*/page.tsx`)
- Each route has its own folder
- Every folder must have a `page.tsx` file
- Pages are automatically server-rendered (client with `'use client'`)

### Components (`components/`)
- Reusable React components
- Import with `@/components/ComponentName`

### Utilities (`lib/`)
- `api.ts` - All API calls with TypeScript types
- `utils.ts` - Helper functions

### Styles (`styles/`)
- Global CSS in `globals.css`
- Component CSS files (Auth.css, Dashboard.css, Pages.css)
- Import with `@/styles/filename.css`

---

## Common Tasks

### Adding a New Page

Create `app/my-page/page.tsx`:

```tsx
'use client';

export default function MyPage() {
  return <div>My Page</div>
}
```

Visit `/my-page` - it works! 🎉

### Making an API Call

```tsx
'use client';

import { useState } from 'react';
import { loginUser } from '@/lib/api';  // or use your API function

export default function MyComponent() {
  const [data, setData] = useState(null);
  
  async function fetchData() {
    try {
      const result = await loginUser({ email, password });
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  return <button onClick={fetchData}>Load Data</button>
}
```

### Adding TypeScript Types

```tsx
interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

const user: User = { id: '1', email: 'user@example.com', name: 'John' };
```

---

## Proxy Setup (No Middleware)

`next.config.js` uses rewrites for API proxying:

```javascript
async rewrites() {
  return {
    beforeFiles: [
      {
        source: '/api/:path*',
        destination: 'http://backend-url:port/:path*'
      }
    ]
  }
}
```

Call `/api/endpoint` from your frontend - it proxies to your backend.

---

## Important Notes

✅ **What Works Out of the Box**
- TypeScript strict mode
- CSS imports
- Image optimization (`next/image`)
- Link prefetching (`next/link`)
- Client/Server component routing
- API routes (if you add `app/api/` endpoints)

⚠️ **Things to Setup**
- Backend API URL in `.env.local`
- Database connection (if needed)
- Authentication provider (JWT, sessions, etc.)
- Image assets (copy from original if needed)

🚫 **Removed (from React Router)**
- `useNavigate()` → use `useRouter()` instead
- `<Router>` wrapper → not needed in Next.js
- Client-side routing state → use `useState` + Next.js routing

---

## Performance Tips

1. **Use `next/image` for images**
   ```tsx
   import Image from 'next/image';
   
   <Image src="/assets/logo.png" alt="Logo" width={200} height={200} />
   ```

2. **Dynamic imports for heavy components**
   ```tsx
   import dynamic from 'next/dynamic';
   const HeavyComponent = dynamic(() => import('@/components/Heavy'));
   ```

3. **Cache API calls**
   ```tsx
   const response = fetch(url, { 
     next: { revalidate: 3600 } // Cache for 1 hour
   });
   ```

---

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Traditional Server
```bash
npm run build
npm start
```

---

## Debugging

Enable debug logs:

```bash
# Terminal
DEBUG=* npm run dev

# Or in code
console.log('Debug info', variable)
```

Check TypeScript types:
```bash
npx tsc --noEmit
```

---

## Need Help?

1. **TypeScript error?** Check `tsconfig.json` - strict mode is ON
2. **Page not found?** Make sure route folder has `page.tsx`
3. **Import error?** Use `@/` alias (e.g., `@/components/Nav`)
4. **Styling issue?** Check CSS imports in `app/layout.tsx`

---

## Summary

You now have a production-ready Next.js 16 application with:
- ✅ 16 pre-built pages
- ✅ TypeScript strict mode
- ✅ Full API integration
- ✅ All styling preserved
- ✅ Proxy setup ready
- ✅ Zero config needed

**Just run `npm install && npm run dev` and start building! 🚀**

---

*Built with Next.js 16 • React 19 • TypeScript • Proxy API Setup*
