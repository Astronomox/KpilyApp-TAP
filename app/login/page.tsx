"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { FormField } from "@/components/auth/FormField";
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
      const content = await kpilyApi.post(
        "/v1/auth",
        authContentSchema,
        { body: parsed.data },
      );
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
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
        <label className={styles.groupLabel}>Account</label>
        <FormField
          label="Email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormField
          label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error ?? undefined}
          required
        />

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

        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <div className={styles.divider} />

        <Button variant="social" type="button" onClick={() => {}}>
          Sign in with Google
        </Button>
        <div style={{ height: 10 }} />
        <Button variant="social" type="button" onClick={() => {}}>
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
