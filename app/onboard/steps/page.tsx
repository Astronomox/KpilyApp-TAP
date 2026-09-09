import { Logo } from "@/components/Logo";
import Link from "next/link";
import type { Route } from "next";
import styles from "./page.module.css";

type Step = {
  number: number;
  title: string;
  subtitle?: string;
  actionLabel: string;
  href: Route;
  done: boolean;
};

const STEPS: Step[] = [
  {
    number: 1,
    title: "Verify your email",
    actionLabel: "Verify",
    href: "/register",
    done: true,
  },
  {
    number: 2,
    title: "Company Documents",
    subtitle: "Upload your company documents",
    actionLabel: "Upload",
    href: "/onboard/documents",
    done: false,
  },
  {
    number: 3,
    title: "Login to onboard team",
    subtitle: "Login to onboard team",
    actionLabel: "Login",
    href: "/login",
    done: false,
  },
];

export default function OnboardStepsPage() {
  return (
    <div className={styles.pageOuter}>
      <div className={styles.page}>
        <Logo className={styles.logo} />
        <h1 className={styles.heading}>Onboard your company</h1>

        <div className={styles.stepList}>
          {STEPS.map((step) => (
            <div key={step.number} className={styles.stepCard}>
              <div className={styles.stepLabel}>
                <span className={styles.stepNumber}>Step {step.number}</span>
                {step.subtitle && (
                  <span className={styles.stepSubtitle}>{step.subtitle}</span>
                )}
              </div>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepStatus}>
                {step.done ? (
                  <span className={styles.doneIcon} aria-label="Complete">
                    ✓
                  </span>
                ) : (
                  <span className={styles.pendingIcon} aria-hidden="true" />
                )}
              </div>
              <Link
                href={step.href}
                className={[
                  styles.stepAction,
                  step.done ? styles.stepActionDone : "",
                ].join(" ")}
              >
                {step.actionLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
