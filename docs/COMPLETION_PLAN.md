# KPILY — path to an exact clone

Sources surveyed (Sep 2026):
- **Marketing site:** kpily.netlify.app
- **Live app:** kpily-dashboard.netlify.app. I signed in with the test account and read the route table from its JS bundle.
- **API docs:** the Postman collection at `documenter.getpostman.com/view/938562/2s93ecupat`
- **Figma** file `Y1OoVxv0KwePZAr6VE9xvS`:
  - "Design System"
  - "Landing page, Sign up and Login"
  - "Information Architecture", saved as [`design/information-architecture.png`](design/information-architecture.png)

## Headline findings

1. **The backend already exists.** It's live at `https://kpapis-cac9fhczeadxbvhm.uksouth-01.azurewebsites.net` and exposes 50 documented `/v1` endpoints. `next.config.js` points at `kpily-api.azurewebsites.net`, which is dead. The job is to **connect** the web app to this API, not to write a new backend. `packages/api` (Express, 2 routes) can be deleted or kept as a small proxy.
2. **The logged-in app is essentially unbuilt here.** `packages/dashboard` has 4 placeholder pages (32 lines in total). The live app has 25 screens.
3. **Payments go through Paystack.** The API already exposes `/v1/get-plans`, `/v1/org/get-subscription` and `/v1/org/subscribe`.
4. **Figma is blocked by the Starter-plan limit** (20 requests a month), and 3 design pages are still unread (nodes `3910:66868`, `1270:8118` and `1152:3576`). Until the limit resets, or the account gets a Dev/Full seat, the live app is the visual reference for dashboard screens.

## Live app screen inventory (target)

| Area | Route | Main API calls | Status here |
|---|---|---|---|
| Auth | `/auth/login` | `POST /v1/auth` | UI done (web `/login`), mock only |
| Auth | `/auth/register` | `POST /v1/mail-verify` | UI done (web `/register`), mock |
| Auth | `/auth/verify-email/:code` | `GET /v1/mail-verify/{code}` | missing |
| Auth | Company info / onboarding | `POST /v1/org/onboard`, `/v1/org/upload-image` | UI done, mock |
| Auth | `/auth/forgot-password` | `POST /v1/reset-password/1` | UI done, mock |
| Auth | `/auth/reset-password/:code` | `POST /v1/reset-password/2` | UI done (web `/change-password`), mock |
| Shell | header, search (⌘K), settings cog, slide-out menu, feed rail | `get-self`, `get-active-session`, `get-notification` | missing |
| Dashboard | `/dashboard/account-overview`: profile card, settings card, performance chart, teams, progress gauge, feed, your team | `get-dashboard`, `org/get-team`, `get-member` | missing |
| Tasks | `/dashboard/tasks`: status tabs (New, Accepted, Reviewed, Completed, Submitted), table, add task, row menu | `org/get-task`, `create/update/accept/submit/review/complete/assign-task`, `submit-comment`, `get-comment`, `search-task` | stub |
| Calendar | `/dashboard/calendar`: month, week, day and list views, filters, schedule event | `org/get-calender/{m}/{y}`, `create/update/get-event` | missing |
| Staff | `/dashboard/staff/all-staff`: table, add, filter, export, edit | `get-member`, `invite-user`, `change-user-status`, `org/change-user-privilege` | missing |
| Staff | `/dashboard/staff/organogram` | `org/get-team` | missing |
| Team | `/dashboard/team`: members, leaderboard, teams table, add team | `org/create-team`, `update-team`, `get-team` | missing |
| Performance | `/dashboard/performance-data/performance-data`: KPI tiles, charts, team and individual leaderboards | `get-dashboard` | missing |
| Performance | `/dashboard/performance-data/scorecard` | `get-dashboard`, `org/get-task` | missing |
| Performance | `point-settings`, `badge-settings` | not in Postman yet | missing |
| Billing | `/dashboard/billing` | `org/get-subscription`, `org/subscribe` (Paystack) | missing |
| Billing | `/dashboard/pricing` | `get-plans` | marketing version only |
| Settings | `/dashboard/settings`: company, logo, personal, photo, password | `org/update`, `update-profile`, `update-password`, `org/upload-*` | missing |
| Support | `/dashboard/support/help-center`, `contact-us`, `whats-new`, `terms`, `privacy-policy` | CMS on `localhost:1337` (a dev URL left in production, broken live) | missing |

The Figma Information Architecture also plans **Chat** (in-app, or via Slack), **Projects** (cards, timeline, KPI, teammates), a **Kanban / table / list view toggle** for Tasks, and **Notification settings and integrations** (Slack, other apps). None of these are in the live app yet.

## Plan (in order)

1. **API client:** point `NEXT_PUBLIC_KPILY_API_BASE` at the live host, type the 50 endpoints, handle the auth token and session, and switch off mock mode.
2. **Auth wiring:** connect login, register, email verification, onboarding, forgot password and reset. Add the two missing `:code` routes.
3. **App shell:** header, ⌘K search, menu, feed rail and route guard.
4. **Account overview**, then **Tasks** (the full lifecycle and comments), then **Calendar**.
5. **Staff** (all staff, organogram), **Team**, then **Performance** (data, scorecard, points and badges settings).
6. **Settings**, **Billing** (Paystack checkout and a verify callback), then **Support** (static content, since the CMS is dead).
7. **Figma-planned extras:** Projects, Chat and integrations. These need the unread Figma pages.
8. **Tests and CI:** smoke tests per route. PR #3 already fixes the Node version.

## Completion: 21%

| Section | Weight | Done |
|---|---|---|
| Marketing site | 10 | 95% |
| Auth UI + API wiring | 10 | 50% |
| Billing / Paystack | 8 | 35% |
| App shell (header, search, menu, feed) | 6 | 0% |
| Account overview | 6 | 5% |
| Tasks + comments | 12 | 5% |
| Calendar / events | 6 | 0% |
| Staff, organogram, team | 8 | 0% |
| Performance data, scorecard, points/badges | 10 | 0% |
| Settings | 5 | 0% |
| Support pages | 4 | 0% |
| Notifications / feed | 3 | 0% |
| API client layer | 6 | 5% |
| CI / deploy | 3 | 60% |
