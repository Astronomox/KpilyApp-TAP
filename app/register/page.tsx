"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/auth/Button";
import { kpilyApi, KpilyApiError } from "@/lib/api/client";
import { mailVerifyRequestSchema } from "@/lib/schemas/account";
import { z } from "zod";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = mailVerifyRequestSchema.safeParse({ data: { email } });
    if (!parsed.success) {
      setError("Enter a valid work email.");
      return;
    }

    setLoading(true);
    try {
      await kpilyApi.post("/v1/mail-verify", z.null(), {
        body: parsed.data,
      });
      router.push(`/register/sent?email=${encodeURIComponent(email)}`);
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
      <h1>Register</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
        <FormField
          label="Work Email"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error ?? undefined}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Link"}
        </Button>
      </form>
      <p style={{ marginTop: 24, fontSize: 14, color: "var(--kpily-text-muted)" }}>
        Already a member?{" "}
        <Link href="/login">Log in</Link>
      </p>
    </AuthSplitLayout>
  );
}
