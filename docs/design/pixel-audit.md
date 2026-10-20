# Pixel audit — dashboard pages vs Figma

Compared the built pages against their Figma frames (file `Y1OoVxv0KwePZAr6VE9xvS`,
screenshots in `docs/design/screens/`). Audited 2026-10-20.

Scope this pass: **Settings, All Staff, Tasks, Calendar** (the four highest-traffic
screens). The dashboard home was reviewed earlier. Remaining pages (Team, Organogram,
Performance data, Scorecard, Billing) are not yet audited — Figma Starter-plan request
budget was nearly spent.

Legend: 🔴 bug / clear defect · 🟡 gap vs design · 🔵 intentional divergence (code is
different, usually richer — listed so the choice is visible, not necessarily to "fix").

---

## All Staff (`staff/all-staff` vs node 1347:8770)

- 🔴 **Avatars never show photos.** The table passes `src={null}` to every `<Avatar>`,
  so members with a `profilePicture` still render as initials. Figma shows real photos.
  → fixed in this branch (use the member's picture via the file endpoint).
- 🟡 **Team column** shows plain team-name text; Figma shows coloured role pills
  (Admin / Sales / Design / PM / HR …), sometimes several per person.
- 🔵 Extra **Privilege** column present in code, not in Figma (Figma folds role into the
  Team pills). Code is more explicit.
- 🔵 Status label **"Pending"** (API status 0) where Figma says "Offline". Kept "Pending"
  — it reflects the real invite state the API returns; "Offline" would be misleading.
- ✅ Header actions (+Add New / +Filter / Export), checkboxes, edit/delete, pagination
  all match.

## Settings (`settings` vs node 1461:9992)

- 🟡 **Branding section missing** (Reports / Staff-lists "include logo" toggles).
- 🟡 **Performance-type section missing** (Rolling vs Quarter-cut-off toggles).
  Both would be local-only (no API endpoint), like point/badge settings.
- 🟡 Title copy: code "Settings" vs Figma "Company Settings"; subtitle differs slightly.
- 🟡 Verification label: code "Active ✓" vs Figma "Verified ✓".
- 🔵 Code uses **per-section Save** buttons; Figma has one global Cancel/Save in the
  header. Per-section is lower-risk (you save only what you touched) — kept deliberately.
- 🔵 Figma shows two logo lock-ups (dark + light); code shows the single stored logo.

