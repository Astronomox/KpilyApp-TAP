"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/auth/Button";
import { kpilyApi, KpilyApiError } from "@/lib/api/client";
import { resetPasswordConfirmSchema } from "@/lib/schemas/account";
import { z } from "zod";
import styles from "./page.module.css";

function passwordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score; // 0-4
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);
  const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][strength];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }

    const parsed = resetPasswordConfirmSchema.safeParse({
      data: { code, newPassword: password },
    });
    if (!parsed.success) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await kpilyApi.post("/v1/reset-password/2", z.null(), {
        body: parsed.data,
      });
      router.push("/login");
    } catch (err) {
      setError(err instanceof KpilyApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.formColumn}>
        <h1>Change password</h1>
        <p className={styles.subtext}>Please input your new password below.</p>

        <form onSubmit={handleSubmit}>
          <label className={styles.label}>New password</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className={styles.strengthBar}>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={i < strength ? styles.strengthFillActive : styles.strengthFill}
              />
            ))}
          </div>
          {password.length > 0 && (
            <span className={styles.strengthLabel}>{strengthLabel}</span>
          )}

          <label className={styles.label} style={{ marginTop: 20 }}>
            Confirm new password
          </label>
          <input
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className={styles.formError}>{error}</p>}

          <div style={{ marginTop: 24 }}>
            <Button type="submit" disabled={loading} fullWidth={false}>
              {loading ? "Saving..." : "Change Password"}
            </Button>
          </div>
        </form>

        <p className={styles.helpText}>
          Do you need help? <a href="/support">Customer support</a>
        </p>
      </div>

      <div className={styles.heroColumn}>
        <Logo className={styles.logo} />
        <Image
          src="/assets/change-pw-panel.jpg"
          alt="KPILY team members celebrating"
          fill
          className={styles.heroImage}
        />
      </div>
    </div>
  );
}
