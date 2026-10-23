# Pixel audit — dashboard pages vs Figma

Compared the built pages against their Figma frames (file `Y1OoVxv0KwePZAr6VE9xvS`,
screenshots in `docs/design/screens/`). Audited 2026-10-20; second pass and fixes 2026-10-23.

First pass: **Settings, All Staff, Tasks, Calendar**. Second pass: **Team, Organogram,
Performance Data, Scorecard, Billing**, plus the new **Feedback, Goals, Rewards** pages.

Legend: 🔴 bug / clear defect · 🟡 gap vs design · 🔵 intentional divergence (code is
different, usually richer — listed so the choice is visible, not necessarily to "fix").

---

## All Staff (`staff/all-staff` vs node 1347:8770)

- 🔴 **Avatars never show photos.** The table passes `src={null}` to every `<Avatar>`,
  so members with a `profilePicture` still render as initials. Figma shows real photos.
  ✅ fixed (member picture via the file endpoint).
- ✅ **Team column** is now a coloured pill (the team's colour, or a stable palette pick).
  Figma sometimes shows several pills per person; the API gives one team per member.
- 🔵 Extra **Privilege** column present in code, not in Figma (Figma folds role into the
  Team pills). Code is more explicit.
- 🔵 Status label **"Pending"** (API status 0) where Figma says "Offline". Kept "Pending"
  — it reflects the real invite state the API returns; "Offline" would be misleading.
- ✅ Header actions (+Add New / +Filter / Export), checkboxes, edit/delete, pagination
  all match.

## Settings (`settings` vs node 1461:9992)

- ✅ **Branding** section added (Reports / Staff-lists "include logo" toggles).
- ✅ **Performance type** section added (Rolling vs Quarter cut-off).
  Both are stored in the browser (no API endpoint), like point/badge settings.
- ✅ Title is now "Company Settings".
- ✅ Verification label is now "Verified ✓".
- 🔵 Code uses **per-section Save** buttons; Figma has one global Cancel/Save in the
  header. Per-section is lower-risk (you save only what you touched) — kept deliberately.
- 🔵 Figma shows two logo lock-ups (dark + light); code shows the single stored logo.

## Tasks (`tasks` vs node 1278:30686)

- ✅ **Feed view added**, matching Figma (NEW marker, avatar, "Task Assignment from …",
  time ago), with the **New Tasks / Task Updates / Approvals** tabs and counts. A
  **Feed | Table** toggle keeps the richer table; the choice is remembered per browser.
- ✅ Task detail now covers Figma's Task Review / Ask Question / Add Contributor: progress
  steps, a comment thread with replies and attachments, and adding contributors.
- ✅ Button reads "+ Create New Task".
- 🔵 Header: Figma centres the "Tasks" title in the dark top bar with a "< Back" link and a
  "Create New Task" button; code uses the shared shell header + a left title + "+ Add Task".

## Calendar (`calendar` vs node 1278:28137)

- 🔵 **Code exceeds the design**: Month / Week / Day / List views, a mini-calendar, type
  filters, add-task and schedule-event. Figma shows only a month grid plus two buttons.
- ✅ Buttons are "Schedule a Task" / "Schedule a Check-In". A check-in is an event whose
  title is prefilled "Check-In" (the data model has no separate type).
- ✅ Month heading is large and green; the chevrons and view switcher stay.

---

## Cross-cutting note — header pattern

Several Figma frames (Tasks, Calendar) centre the page name inside the dark top bar and add
a "< Back" link. The app instead keeps one consistent shell header (logo · search · org ·
settings) and puts each page's title in the content area, left-aligned. This is a
deliberate, app-wide IA decision and is more consistent than per-page centred titles;
not treated as a defect.

## Team (`team` vs node 1278:27768)

- ✅ Member and leaderboard avatars show photos (were always initials).
- ✅ Leaderboard marks your row "It's YOU! Keep up the good work!" as in Figma.
- 🔵 Figma's per-member "Team Progress Overview" bars and "Chat" buttons: there is no chat,
  and the API reports progress per team, not per person. The code shows team progress.
- 🔵 Figma's mini calendar card is not repeated here; Calendar has its own page.

## Organogram (`staff/organogram` vs node 1467:31265)

- ✅ Photos on every node (were initials).
- ✅ Title "<Company> Organogram", an Add Team action and a team-colour legend, as in Figma.
- 🔵 Figma charts **people** (CEO → heads → staff, with location). The API only records who
  each **team** reports to, so the code charts teams with their leader and members.

## Performance Data (`performance-data/performance-data` vs node 1155:5612)

- ✅ Added the bottom row of rate tiles: Employee Feedback, Improvement, Recognition.
  The API's `get-dashboard` already returned them.
- 🔵 Badge Engagement per Month, Badges per Team and Contest Engagement have no API data.

## Scorecard (`performance-data/scorecard` vs node 1563:67971)

- ✅ Progress grade + gauge, task completion, Great Job, Tip of the day, leaderboard and
  "Your Scorecard" bars all match.
- 🔵 Psychometrics and Suggested Games are paid add-ons with no backend.

## Billing (`billing` vs node 1487:28108)

- ✅ Header copy, Change billing period / Make Payment, contact email radios and charges match.
- 🔵 Add-ons (Polls, Psychometrics, Brain Games) and saved cards are not offered by the API;
  payment goes through Paystack checkout.

## New pages built from Figma

| Page | Frames | Notes |
|---|---|---|
| Feedback | 1278:30531, 1278:26724, 1278:27483, 1278:26881 | Feed + tabs, give with tags, assign points, appeal with evidence. Browser-stored. |
| Goals | 1278:28723, 1466:27878/28285/28484 | KPI tiles and chart are live; goals are browser-stored. Add Goal is a dialog rather than a separate page. |
| Rewards | 1278:28955 | Podium + ranked list use live points; given badges are browser-stored. |

## Recommended next actions

1. Backend endpoints for feedback, goals and badges (see `lib/engagement.ts`), so these
   records are shared between users instead of living in one browser.
2. Re-check the new pages against Figma at full resolution once more request budget is free.
