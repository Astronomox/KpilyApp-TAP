import Image from "next/image";
import { Logo } from "@/components/Logo";
import styles from "./page.module.css";

const SOCIALS = [
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

export default function RegisterSuccessPage() {
  return (
    <div className={styles.page}>
      <Logo className={styles.logo} />

      <div className={styles.content}>
        <h1>Thank you for signing up!</h1>
        <p>
          An activation email was just sent to your inbox to get started.
          Set up only takes a few minutes!
        </p>

        <div className={styles.illustrationWrap}>
          <Image
            src="/assets/success-illustration.png"
            alt="Two KPILY team members celebrating"
            width={340}
            height={340}
            className={styles.illustration}
          />
        </div>

        <div className={styles.socialRow}>
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} aria-label={s.label} className={styles.socialIcon}>
              {s.label[0]}
            </a>
          ))}
        </div>

        <button className={styles.closeButton}>Close</button>

        <p className={styles.resend}>
          If you do not receive the email, please{" "}
          <a href="/register">click here</a> to resend.
        </p>
      </div>
    </div>
  );
}
