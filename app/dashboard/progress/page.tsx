import { ProgressSummary } from "@/components/dashboard/ProgressSummary";

export default function ProgressPage() {
  return (
    <main style={{ padding: "40px 24px" }}>
      <h1 style={{ marginBottom: 24 }}>KPI Progress</h1>
      <ProgressSummary
        percent={35}
        pointsForTask={350}
        received={[
          {
            id: "1",
            amount: 550,
            fromName: "Michael V",
            avatarBg: "#f5a623",
          },
          {
            id: "2",
            amount: 350,
            fromName: "Michael V",
            avatarBg: "#6fb1e0",
          },
        ]}
        tags={["Life Saver", "Speedy", "High Quality"]}
      />
    </main>
  );
}
