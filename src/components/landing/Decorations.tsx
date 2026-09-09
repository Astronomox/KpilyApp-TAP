import styles from "./Decorations.module.css";

/** Flowing wavy background lines, used behind hero and feature sections */
export function WaveLines({ className }: { className?: string }) {
  return (
    <svg
      className={`${styles.waves} ${className ?? ""}`}
      viewBox="0 0 1400 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {[0, 40, 80, 120].map((offset) => (
        <path
          key={offset}
          d={`M-60 ${300 + offset}C120 ${200 + offset} 280 ${400 + offset} 460 ${320 + offset}S780 ${180 + offset} 960 ${280 + offset}S1240 ${400 + offset} 1460 ${300 + offset}`}
          stroke="#DCEEE4"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

/** Scatter of small checkmark / confetti marks */
export function ConfettiMarks({
  className,
  flip,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      className={`${styles.confetti} ${className ?? ""}`}
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <g fill="#1c1c1c">
        <path d="M20 15c2-5 6-8 8-6s-1 7-4 10-7 3-8 1 2-2 4-5z" />
        <path d="M45 10c2-4 5-7 7-5s-1 6-3 9-6 3-7 1 1-2 3-5z" />
        <path d="M70 18c2-5 6-8 8-6s-1 7-4 10-7 3-8 1 2-2 4-5z" />
        <path d="M95 12c2-4 5-7 7-5s-1 6-3 9-6 3-7 1 1-2 3-5z" />
        <path d="M30 45c2-5 6-8 8-6s-1 7-4 10-7 3-8 1 2-2 4-5z" />
        <path d="M55 40c2-4 5-7 7-5s-1 6-3 9-6 3-7 1 1-2 3-5z" />
        <path d="M80 48c2-5 6-8 8-6s-1 7-4 10-7 3-8 1 2-2 4-5z" />
        <path d="M15 70c2-4 5-7 7-5s-1 6-3 9-6 3-7 1 1-2 3-5z" />
        <path d="M50 75c2-5 6-8 8-6s-1 7-4 10-7 3-8 1 2-2 4-5z" />
        <path d="M85 68c2-4 5-7 7-5s-1 6-3 9-6 3-7 1 1-2 3-5z" />
      </g>
    </svg>
  );
}

/** Rain-like diagonal slash marks */
export function RainMarks({ className }: { className?: string }) {
  return (
    <svg
      className={`${styles.rain} ${className ?? ""}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round">
        <line x1="15" y1="10" x2="8" y2="30" />
        <line x1="30" y1="5" x2="23" y2="25" />
        <line x1="45" y1="15" x2="38" y2="35" />
        <line x1="60" y1="8" x2="53" y2="28" />
        <line x1="20" y1="40" x2="13" y2="60" />
        <line x1="40" y1="45" x2="33" y2="65" />
        <line x1="55" y1="38" x2="48" y2="58" />
        <line x1="70" y1="42" x2="63" y2="62" />
        <line x1="25" y1="70" x2="18" y2="90" />
        <line x1="50" y1="72" x2="43" y2="92" />
        <line x1="75" y1="68" x2="68" y2="88" />
      </g>
    </svg>
  );
}

/** Organic green blob shape, used near the hero photo */
export function GreenBlob({ className }: { className?: string }) {
  return (
    <svg
      className={`${styles.blob} ${className ?? ""}`}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M40 10C80-10 170 20 180 80S150 180 100 190S10 160 5 100S0 30 40 10Z"
        fill="#166448"
      />
    </svg>
  );
}

/** Soft mint blob accent */
export function MintBlob({ className }: { className?: string }) {
  return (
    <svg
      className={`${styles.blob} ${className ?? ""}`}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="80" cy="80" r="70" fill="#81DFB6" opacity="0.5" />
    </svg>
  );
}

/** Star icon for the received-points card */
export function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="#F5B400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
}
