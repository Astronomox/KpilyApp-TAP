"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./MobileNav.module.css";

export type NavLink = { label: string; href: string };

export function MobileNav({ navLinks }: { navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.menuButton}
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
          <line x1="0" y1="1" x2="20" y2="1" stroke="var(--kpily-text)" strokeWidth="1.6" />
          <line x1="0" y1="7" x2="20" y2="7" stroke="var(--kpily-text)" strokeWidth="1.6" />
          <line x1="0" y1="13" x2="20" y2="13" stroke="var(--kpily-text)" strokeWidth="1.6" />
        </svg>
      </button>

      {open && (
        <div className={styles.overlay}>
          <div className={styles.overlayHeader}>
            <span className={styles.overlayLang}>En</span>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <line x1="1" y1="1" x2="17" y2="17" stroke="var(--kpily-text)" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="17" y1="1" x2="1" y2="17" stroke="var(--kpily-text)" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className={styles.overlayLinks}>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.overlayActions}>
            <Link href="/login" className={styles.overlaySignIn} onClick={() => setOpen(false)}>
              Sign in
            </Link>
            <Link href="/register" className={styles.overlayTrial} onClick={() => setOpen(false)}>
              Start 15-day Free Trial
            </Link>
          </div>

          <div className={styles.overlayFooter}>
            <Link href="/register" className={styles.overlayGetStarted} onClick={() => setOpen(false)}>
              Get Started
            </Link>
            <a href="#how-it-works" className={styles.overlayHowItWorks} onClick={() => setOpen(false)}>
              <span className={styles.overlayPlay} aria-hidden="true">
                ▶
              </span>
              See how it works
            </a>
          </div>
        </div>
      )}
    </>
  );
}
