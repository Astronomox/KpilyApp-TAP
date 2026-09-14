import { FeedbackTask } from "@/components/dashboard/FeedbackTask";

export default function FeedbackPage() {
  return (
    <main style={{ padding: "40px 24px" }}>
      <h1 style={{ marginBottom: 24 }}>Real-Time Feedback</h1>
      <FeedbackTask
        points={200}
        message="Congratulations! You are making a big progress on blix projects, keep moving on."
        reviewer="Sarah Fosters"
        reviewerTag="Self-Reflect"
        assignedBy="Joseph S."
        assignedAt="Tuesday, Jan. 2, 2023 • 3:23pm"
      />
    </main>
  );
}
