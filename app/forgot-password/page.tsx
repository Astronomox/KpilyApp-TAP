"use client";

import { useState } from "react";
import Image from "next/image";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/auth/Button";
import { kpilyApi, KpilyApiError } from "@/lib/api/client";
import { resetPasswordRequestSchema } from "@/lib/schemas/account";
import { z } from "zod";
import styles from "./page.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = resetPasswordRequestSchema.safeParse({ data: { email } });
    if (!parsed.success) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await kpilyApi.post("/v1/reset-password/1", z.null(), {
        body: parsed.data,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof KpilyApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.formColumn}>
        <h1>Forgot password?</h1>
        <p className={styles.subtext}>
          Please input your email below and we will send you a link to create
          a new password.
        </p>

        {sent ? (
          <p className={styles.confirmation}>
            Check your inbox, we sent a reset link to {email}.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormField
              label="Email address"
              type="email"
              placeholder="john@smith.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error ?? undefined}
              required
            />
            <Button type="submit" disabled={loading} fullWidth={false}>
              {loading ? "Sending..." : "Request New Password"}
            </Button>
          </form>
        )}

        <p className={styles.helpText}>
          Do you need help? <a href="/support">Customer support</a>
        </p>
      </div>

      <div className={styles.heroColumn}>
        <Image
          src="/assets/logo.png"
          alt="KPILY"
          width={140}
          height={41}
          className={styles.logo}
        />
        <Image
          src="/assets/forgot-pw-panel.jpg"
          alt="KPILY team members"
          fill
          className={styles.heroImage}
        />
      </div>
    </div>
  );
}
