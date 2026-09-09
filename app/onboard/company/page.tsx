"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FormField } from "@/components/auth/FormField";
import { Button } from "@/components/auth/Button";
import { kpilyApi, KpilyApiError } from "@/lib/api/client";
import {
  onboardRequestSchema,
  employeeBandSchema,
} from "@/lib/schemas/account";
import { z } from "zod";
import styles from "./page.module.css";

const EMPLOYEE_BANDS = employeeBandSchema.options;

export default function CompanyInfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    workEmail: "",
    employeeBand: "" as (typeof EMPLOYEE_BANDS)[number] | "",
    phoneCountryCode: "+000",
    phoneNumber: "",
    industry: "",
    country: "",
    state: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordChecks = useMemo(
    () => ({
      length: form.password.length >= 8,
      numeral: /[0-9]/.test(form.password),
      uppercase: /[A-Z]/.test(form.password),
      match: form.password.length > 0 && form.password === form.confirmPassword,
    }),
    [form.password, form.confirmPassword],
  );

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = onboardRequestSchema.safeParse({
      data: { ...form, code, agreedToTerms: form.agreedToTerms || undefined },
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form for errors.");
      return;
    }

    setLoading(true);
    try {
      await kpilyApi.post("/v1/org/onboard", z.null(), {
        body: parsed.data,
      });
      router.push("/register/success");
    } catch (err) {
      setError(err instanceof KpilyApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Image src="/assets/logo.png" alt="KPILY" width={140} height={41} />
        <Link href="/login" className={styles.memberLink}>
          Already a member?
        </Link>
      </div>

      <div className={styles.body}>
        <h1>Company Info</h1>

        <form onSubmit={handleSubmit} className={styles.grid}>
          <FormField
            label="First name"
            placeholder="John"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            required
          />
          <FormField
            label="Last name"
            placeholder="Smith"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            required
          />
          <FormField
            label="Company"
            placeholder="KPILY"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            required
          />
          <FormField
            label="Work email"
            type="email"
            placeholder="john@kpily.com"
            value={form.workEmail}
            onChange={(e) => update("workEmail", e.target.value)}
            required
          />

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Number of employees</label>
            <div className={styles.bandRow}>
              {EMPLOYEE_BANDS.map((band) => (
                <button
                  type="button"
                  key={band}
                  className={[
                    styles.bandButton,
                    form.employeeBand === band ? styles.bandButtonActive : "",
                  ].join(" ")}
                  onClick={() => update("employeeBand", band)}
                >
                  {band}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Phone number</label>
            <div className={styles.phoneRow}>
              <input
                className={styles.phoneCode}
                value={form.phoneCountryCode}
                onChange={(e) => update("phoneCountryCode", e.target.value)}
                aria-label="Country code"
              />
              <input
                className={styles.phoneNumber}
                placeholder="00 000 000"
                value={form.phoneNumber}
                onChange={(e) => update("phoneNumber", e.target.value)}
                aria-label="Phone number"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Industry</label>
            <select
              className={styles.select}
              value={form.industry}
              onChange={(e) => update("industry", e.target.value)}
            >
              <option value="">Select industry</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Company logo (optional)</label>
            <div className={styles.uploadRow}>
              <input type="file" accept="image/*" className={styles.fileInput} />
              <span className={styles.uploadButton}>Upload</span>
            </div>
          </div>

          <FormField
            label="Country"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            required
          />
          <FormField
            label="State"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            required
          />

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
            />
            <ul className={styles.checklist}>
              <li className={passwordChecks.length ? styles.checkOk : styles.checkFail}>
                At least 8 characters
              </li>
              <li className={passwordChecks.numeral ? styles.checkOk : styles.checkFail}>
                One numeral
              </li>
              <li className={passwordChecks.uppercase ? styles.checkOk : styles.checkFail}>
                One uppercase
              </li>
            </ul>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Confirm password</label>
            <input
              type="password"
              className={styles.input}
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              required
            />
            {form.confirmPassword.length > 0 && (
              <span className={passwordChecks.match ? styles.checkOk : styles.checkFail}>
                Passwords must match
              </span>
            )}
          </div>

          <label className={styles.termsRow}>
            <input
              type="checkbox"
              checked={form.agreedToTerms}
              onChange={(e) => update("agreedToTerms", e.target.checked)}
            />
            I agree with <a href="/terms">terms and conditions</a>.
          </label>

          {error && <p className={styles.formError}>{error}</p>}

          <Button type="submit" disabled={loading} fullWidth={false}>
            {loading ? "Submitting..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
