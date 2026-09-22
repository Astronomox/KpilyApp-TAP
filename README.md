# KPILY Monorepo

Full-stack KPI tracking platform. Next.js frontend + React dashboard + Node.js API.

## 📦 Structure

```
packages/
├── web/       → Next.js 16 (Public: login, signup, landing)
├── dashboard/ → React 18 (Internal: dashboard, tasks, blog)
├── api/       → Node.js/Express (Backend)
└── types/     → Shared TypeScript
```

## 🚀 Start

```bash
npm install
npm run dev
```

- Web: http://localhost:3000
- Dashboard: http://localhost:3001
- API: http://localhost:8000

## 🌍 Deploy

GitHub → GitHub Actions → Vercel (web) + Netlify (dashboard) + Railway (API)

## 📝 Docs

- `packages/web/.env.example` - Web config
- `packages/api/.env.example` - API config
- `packages/types/index.ts` - Shared types
