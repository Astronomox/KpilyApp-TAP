# KPILY

Performance management for teams: real-time feedback, tasks, points and rewards.
A Next.js 16 + React 19 (TypeScript) app that talks to the live KPILY API.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`.

Config lives in `packages/web/.env.example` (the API base URL; the default points at the live API).

## Layout

```
packages/web/
├── app/            routes (App Router)
│   ├── page.tsx    marketing site: /, /about, /blogs, /pricing …
│   ├── login …     auth: login, register, forgot/change password, email links
│   └── dashboard/  signed-in app: overview, tasks, calendar, …
├── components/
│   ├── figma/      site + auth building blocks (pixel-matched to Figma)
│   └── app/        app shell: header, menu, ⌘K search, feed, modals
├── lib/            API client (kpily.ts), navigation, plans, hooks
├── styles/         plain CSS (kp- site/auth, ka- app)
└── public/         images and fonts
```

## Progress

See [docs/COMPLETION_PLAN.md](docs/COMPLETION_PLAN.md).
