import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";

type SentPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function RegisterSentPage({
  searchParams,
}: SentPageProps) {
  // Next.js 16: searchParams is a Promise, must be awaited.
  const { email } = await searchParams;

  return (
    <AuthSplitLayout
      heroImageSrc="/assets/auth-hero-panel.jpg"
      heroImageAlt="KPILY team member celebrating a completed task"
    >
      <h1>Email Link Sent!</h1>
      <p style={{ marginTop: 16, color: "var(--kpily-text-muted)" }}>
        Please follow the link sent to {email ? <strong>{email}</strong> : "your email"} to
        verify your account and continue registration!
      </p>
      <p style={{ marginTop: 220, fontSize: 14 }}>
        Didn&apos;t get an email?{" "}
        <a href="/register" style={{ fontWeight: 600 }}>
          Send link again
        </a>
      </p>
    </AuthSplitLayout>
  );
}
