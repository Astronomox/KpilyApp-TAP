import { cookies } from "next/headers";
import { kpilyApi, KpilyApiError } from "@/lib/api/client";
import { taskContentSchema } from "@/lib/schemas/task";

type TaskPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TaskDetailPage({ params }: TaskPageProps) {
  // Next.js 16: params is a Promise, must be awaited before use.
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("kpily_session")?.value;

  let task;
  let loadError: string | null = null;

  try {
    task = await kpilyApi.get(`/v1/org/get-task/${id}`, taskContentSchema, {
      token,
    });
  } catch (err) {
    loadError =
      err instanceof KpilyApiError ? err.message : "Failed to load task";
  }

  if (loadError || !task) {
    return (
      <main>
        <p>Could not load task {id}: {loadError}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>{task.name}</h1>
      <p>{task.details}</p>
      <p>Reward: {task.reward}</p>
    </main>
  );
}
