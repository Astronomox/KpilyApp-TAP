import styles from "./ProgressSummary.module.css";

export type PointsReceived = {
  id: string;
  amount: number;
  fromName: string;
  avatarBg: string;
};

// Semicircle gauge, arc length = percent of a 180deg half-circle.
// Radius/stroke chosen to match the proportions on the Figma frame.
function Gauge({ percent }: { percent: number }) {
  const radius = 120;
  const circumference = Math.PI * radius; // half circle length
  const filled = (Math.min(Math.max(percent, 0), 100) / 100) * circumference;

  return (
    <svg viewBox="0 0 280 150" className={styles.gauge} aria-hidden="true">
      <path
        d="M20 140 A120 120 0 0 1 260 140"
        fill="none"
        stroke="var(--kpily-gauge-track)"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M20 140 A120 120 0 0 1 260 140"
        fill="none"
        stroke="var(--kpily-mint)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference}`}
      />
    </svg>
  );
}

function StarBadgeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="var(--kpily-gold)"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
}

export function ProgressSummary({
  percent,
  pointsForTask,
  received,
  tags,
}: {
  percent: number;
  pointsForTask: number;
  received: PointsReceived[];
  tags: string[];
}) {
  return (
    <div className={styles.grid}>
      <div className={styles.gaugeCard}>
        <Gauge percent={percent} />
        <div className={styles.gaugeLabel}>
          <span className={styles.gaugePercent}>{percent}%</span>
          <span className={styles.gaugeCaption}>Complete</span>
        </div>
      </div>

      <div className={styles.taskPointsCard}>
        <StarBadgeIcon />
        <span className={styles.taskPointsLabel}>Received</span>
        <span className={styles.taskPointsValue}>{pointsForTask}</span>
        <span className={styles.taskPointsCaption}>Points for this task</span>
      </div>

      {received.map((entry) => (
        <div key={entry.id} className={styles.receivedCard}>
          <div
            className={styles.receivedAvatar}
            style={{ background: entry.avatarBg }}
            aria-hidden="true"
          />
          <div className={styles.receivedText}>
            <span className={styles.receivedAmount}>
              + {entry.amount} Points
            </span>
            <span className={styles.receivedFrom}>
              Received from {entry.fromName}
            </span>
          </div>
        </div>
      ))}

      <div className={styles.tagRow}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
