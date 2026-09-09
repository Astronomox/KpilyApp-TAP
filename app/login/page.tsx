"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { Button } from "@/components/auth/Button";
import { kpilyApi, KpilyApiError } from "@/lib/api/client";
import { authRequestSchema, authContentSchema } from "@/lib/schemas/account";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = authRequestSchema.safeParse({ data: { email, password } });
    if (!parsed.success) {
      setError("Enter a valid email and password.");
      return;
    }

    setLoading(true);
    try {
      const content = await kpilyApi.post("/v1/auth", authContentSchema, {
        body: parsed.data,
      });
      document.cookie = `kpily_session=${content.token}; path=/; ${
        rememberMe ? "max-age=2592000;" : ""
      }`;
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof KpilyApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitLayout
      heroImageSrc="/assets/auth-hero-panel.jpg"
      heroImageAlt="KPILY team member celebrating a completed task"
    >
      <h1 className={styles.headline}>Log In</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.groupLabelRow}>
          <span className={styles.groupLabel}>Account</span>
          <span className={styles.helpIcon} aria-hidden="true">
            ?
          </span>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.fieldRow}>
            <svg className={styles.fieldIcon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M2.5 14c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="email"
              placeholder="Email"
              className={styles.fieldInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.fieldDivider} />
          <div className={styles.fieldRow}>
            <svg className={styles.fieldIcon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="5.5" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M7.3 8.7 13 3M11 5l1.5 1.5M13 3l1.5 1.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="password"
              placeholder="Password"
              className={styles.fieldInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <p className={styles.formError}>{error}</p>}

        <div className={styles.rowBetween}>
          <label className={styles.rememberMe}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <Link href="/forgot-password" className={styles.forgotLink}>
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" disabled={loading} fullWidth={false} className={styles.submitButton}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <div className={styles.divider} />

        <Button variant="social" type="button" fullWidth={false} className={styles.socialButton} onClick={() => {}}>
          Sign in with Google
        </Button>
        <div style={{ height: 10 }} />
        <Button variant="social" type="button" fullWidth={false} className={styles.socialButton} onClick={() => {}}>
          Sign in with Microsoft
        </Button>
      </form>

      <p className={styles.registerRow}>
        Don&apos;t have an account yet?{" "}
        <Link href="/register">Register here</Link>
      </p>
    </AuthSplitLayout>
  );
}
