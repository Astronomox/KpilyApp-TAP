import { cookies } from "next/headers";
import { kpilyApi, KpilyApiError } from "@/lib/api/client";
import { accountContentSchema } from "@/lib/schemas/account";

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
    <main>
      <h1>Welcome, {account.preferredName ?? account.fullName}</h1>
      <p>Signed in as {account.email}</p>
    </main>
  );
}
