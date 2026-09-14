import { cookies } from "next/headers";
import Link from "next/link";
import { kpilyApi, KpilyApiError } from "@/lib/api/client";
import { accountContentSchema } from "@/lib/schemas/account";

// Links to the new screens, pending a real dashboard nav shell.
const DASHBOARD_LINKS = [
  { href: "/dashboard/leaderboard", label: "Leaderboard" },
  { href: "/dashboard/progress", label: "KPI Progress" },
  { href: "/dashboard/feedback", label: "Real-Time Feedback" },
] as const;

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kpily_session")?.value;

  let account;
  let loadError: string | null = null;

  try {
    account = await kpilyApi.get("/v1/get-self", accountContentSchema, {
      token,
    });
  } catch (err) {
    loadError =
      err instanceof KpilyApiError ? err.message : "Failed to load account";
  }

  if (loadError || !account) {
    return (
      <main>
        <p>Could not load dashboard: {loadError}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 24px" }}>
      <h1>Welcome, {account.preferredName ?? account.fullName}</h1>
      <p>Signed in as {account.email}</p>
      <nav style={{ display: "flex", gap: 16, marginTop: 24 }}>
        {DASHBOARD_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
