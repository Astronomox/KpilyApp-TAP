import styles from "./FeedbackTask.module.css";

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <path
        d="M12 2l7 3v6c0 5-3.4 8.4-7 10-3.6-1.6-7-5-7-10V5l7-3z"
        fill="var(--kpily-white)"
      />
      <path
        d="M8.5 12l2.3 2.3 4.7-4.7"
        stroke="var(--kpily-teal)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <path
        d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.3 6.8 19.3l1-5.9L3.5 9.2l5.9-.9L12 3z"
        stroke="var(--kpily-white)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        fill="var(--kpily-blue)"
      />
      <path d="M3 9h18" stroke="var(--kpily-white)" strokeWidth="1.2" />
    </svg>
  );
}

export function FeedbackTask({
  points,
  message,
  reviewer,
  reviewerTag,
  assignedBy,
  assignedAt,
}: {
  points: number;
  message: string;
  reviewer: string;
  reviewerTag: string;
  assignedBy: string;
  assignedAt: string;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.shieldBadge} aria-hidden="true">
        <ShieldCheckIcon />
      </div>

      <div className={styles.progressCard}>
        <div className={styles.starBadge} aria-hidden="true">
          <StarOutlineIcon />
        </div>
        <h2 className={styles.headline}>Making Progress!</h2>
        <p className={styles.body}>{message}</p>
        <div className={styles.pointsBar}>
          <span className={styles.pointsValue}>{points} Points</span>
        </div>
      </div>

      <div className={styles.reviewerCard}>
        <div className={styles.reviewerAvatar} aria-hidden="true" />
        <span className={styles.reviewerTag}>{reviewerTag}</span>
        <span className={styles.reviewerName}>{reviewer}</span>
        <div className={styles.calendarIcon}>
          <CalendarIcon />
        </div>
      </div>

      <div className={styles.assignedCard}>
        <div className={styles.assignedAvatar} aria-hidden="true" />
        <div className={styles.assignedText}>
          <span>Task Assigned by {assignedBy}</span>
          <span className={styles.assignedAt}>{assignedAt}</span>
        </div>
      </div>
    </div>
  );
}
