import { Leaderboard, type LeaderboardEntry } from "@/components/dashboard/Leaderboard";

// Placeholder standings straight off the Figma leaderboard frame.
// No avatar assets were exported separately, so photoUrl stays null
// and the row falls back to initials until real ones are wired in.
const STANDINGS: LeaderboardEntry[] = [
  {
    rank: 1,
    points: 4000,
    name: "You",
    role: "",
    photoUrl: null,
    isCurrentUser: true,
  },
  {
    rank: 2,
    points: 3200,
    name: "Jessica Lee",
    role: "Events Coordinator",
    photoUrl: null,
  },
  {
    rank: 3,
    points: 3000,
    name: "Corey Duggins",
    role: "Project Liason",
    photoUrl: null,
  },
];

export default function LeaderboardPage() {
  return (
    <main style={{ padding: "40px 24px" }}>
      <h1 style={{ marginBottom: 24 }}>Leaderboard</h1>
      <Leaderboard entries={STANDINGS} />
    </main>
  );
}
