# KPILY: completion status

Updated 2026-10-23. Replaces the September 2026 survey, which predated the dashboard build.

Sources:
- **API:** the live backend at `https://kpapis-cac9fhczeadxbvhm.uksouth-01.azurewebsites.net`
  (Postman: `documenter.getpostman.com/view/938562/2s93ecupat`). Do not build a new one.
- **Figma:** file `Y1OoVxv0KwePZAr6VE9xvS`. Frame inventory in [`design/figma-unread-pages.md`](design/figma-unread-pages.md),
  pixel audit in [`design/pixel-audit.md`](design/pixel-audit.md), and reference shots in [`design/screens/`](design/screens/).

## Screens

| Area | Route | API | Status |
|---|---|---|---|
| Marketing | `/`, `/about`, `/blog(s)`, `/pricing` | `get-plans` | Done |
| Auth | `/login`, `/register`, `/verify-email/:code`, onboarding, forgot/reset password | `auth`, `mail-verify`, `org/onboard`, `reset-password/1,2` | Done, wired |
| Shell | header, ⌘K search, menu by role, feed rail, route guard (`proxy.ts`) | `get-self`, `get-notification` | Done |
| Account overview | `/dashboard/account-overview` | `get-dashboard`, `get-task`, `get-team` | Done (+ Give Feedback / My Goals shortcuts) |
| Tasks | `/dashboard/tasks`: **Feed or Table** view, Figma tabs, detail with progress, **comments and replies**, **add contributor** | full task lifecycle, `submit/get-comment`, `assign-task`, `search-task`, `search-user` | Done |
| Calendar | `/dashboard/calendar`: month, week, day and list views, Schedule a Task / Check-In | `get-event`, `create/update-event` | Done |
| Staff | `/dashboard/staff/all-staff`, `/organogram` | `get-member`, `invite-user`, `change-user-status/privilege`, `get-team` | Done |
| Team | `/dashboard/team` | `create/update/get-team` | Done |
| Performance | `performance-data`, `scorecard` | `get-dashboard`, `get-task`, `get-member` | Done |
| Performance | `point-settings`, `badge-settings` | none yet | Done, stored in the browser |
| **Feedback** | `/dashboard/feedback`: messages, requests, give with tags, assign points, appeal | none yet | Done, stored in the browser |
| **Goals** | `/dashboard/goals`: live KPIs + quarterly, monthly and yearly goals | `get-dashboard`, `get-task` (goals: none yet) | Done, goals stored in the browser |
| **Rewards** | `/dashboard/rewards`: points leaderboard, give badges, my badges | `get-member` (badges: none yet) | Done, badges stored in the browser |
| Billing | `/dashboard/billing`, `/dashboard/pricing`, Paystack checkout | `get-subscription`, `subscribe`, `get-plans` | Done |
| Settings | `/dashboard/settings`: company, logo, branding, performance type, profile, photo, password, sessions | `org/update`, `update-profile`, `update-password`, uploads, sessions | Done (branding/perf-type stored in the browser) |
| Support | help center, contact, what's new, terms, privacy | static (the old CMS is dead) | Done |

## What "stored in the browser" means

The API has no endpoints for point and badge settings, feedback, feedback requests, appeals, goals or given badges.
These screens keep their data in `localStorage`, through `lib/useLocalSetting.ts`, under the keys listed in `lib/engagement.ts`.
**That data is not shared between users or devices.** For example, feedback you send only shows up for the recipient if they use the same browser.
The screens carry a note saying so. When the backend adds endpoints, swap `useLocalSetting` for API calls in `lib/kpily.ts`. The record types in `lib/engagement.ts` are ready to become the request shapes.

## Not built (no design or no data)

- **Chat** and **Projects**, planned in the Figma Information Architecture. They have no frames in the read pages.
- **Scorecard add-ons**: Psychometrics and Suggested Games. **Billing add-ons and saved cards.** These need backend products.
- **Notification settings and integrations** (Slack).

## Completion: about 90%

| Section | Weight | Done |
|---|---|---|
| Marketing site | 10 | 95% |
| Auth UI + API wiring | 10 | 95% |
| Billing / Paystack | 8 | 85% (no add-ons or saved cards) |
| App shell | 6 | 100% |
| Account overview | 6 | 100% |
| Tasks + comments | 12 | 100% |
| Calendar / events | 6 | 100% |
| Staff, organogram, team | 8 | 95% |
| Performance, scorecard, points/badges | 10 | 90% (scorecard add-ons) |
| Feedback, goals, rewards | 8 | 75% (need backend persistence) |
| Settings | 5 | 100% |
| Support pages | 4 | 100% |
| API client layer | 4 | 100% of documented endpoints used |
| CI / deploy | 3 | 80% (typecheck, lint, build; no route smoke tests yet) |

## Next

1. Backend endpoints for feedback, goals and badges, then move those screens off browser storage.
2. Smoke tests per route in CI.
3. Chat, Projects and integrations once they are designed.
