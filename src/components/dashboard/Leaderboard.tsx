import Image from "next/image";
import styles from "./Leaderboard.module.css";

// No leaderboard endpoint exists in the API schemas yet (task.ts /
// account.ts don't cover points or ranking), so this is a local
// placeholder shape. Swap for a real fetch once the endpoint lands.
export type LeaderboardEntry = {
  rank: number;
  points: number;
  name: string;
  role: string;
  photoUrl: string | null;
  isCurrentUser?: boolean;
};

const RANK_LABELS = ["1ST", "2ND", "3RD", "4TH", "5TH"];

function Avatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={name}
        width={56}
        height={56}
        className={styles.avatarImg}
      />
    );
  }
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return <div className={styles.avatarFallback}>{initials}</div>;
}

export function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <li className={styles.row}>
      <div className={styles.rankBlock}>
        <span className={styles.rankLabel}>
          {RANK_LABELS[entry.rank - 1] ?? `${entry.rank}TH`}
        </span>
        <span className={styles.rankPoints}>
          {entry.points.toLocaleString()} PTS
        </span>
      </div>
      <Avatar name={entry.name} photoUrl={entry.photoUrl} />
      <div className={styles.identity}>
        <span
          className={
            entry.isCurrentUser ? styles.nameCurrentUser : styles.name
          }
        >
          {entry.isCurrentUser ? "It's YOU!" : entry.name}
        </span>
        <span className={styles.role}>
          {entry.isCurrentUser ? "Keep up the good work!" : entry.role}
        </span>
      </div>
      <button
        type="button"
        className={styles.expandButton}
        aria-label={`Show details for ${entry.name}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 6l5 5 5-5"
            stroke="#6b7280"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </li>
  );
}

export function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.blobGreen} aria-hidden="true" />
      <div className={styles.blobBlue} aria-hidden="true" />
      <div className={styles.blobMint} aria-hidden="true" />
      <ul className={styles.list}>
        {entries.map((entry) => (
          <LeaderboardRow key={entry.rank} entry={entry} />
        ))}
      </ul>
      <Image
        src="/assets/decorations/bird-marks.png"
        alt=""
        width={140}
        height={130}
        className={styles.marks}
        aria-hidden="true"
      />
    </div>
  );
}
