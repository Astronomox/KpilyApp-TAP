// Full-screen loading state: KPILY symbol with a spinner beneath it
// (matches the dashboard's loader at kpily-dashboard.netlify.app).
export default function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="kp-loader" role="status" aria-live="polite">
      <img className="kp-loader__logo" src="/kpily/logo-symbol.png" alt="" width={200} height={198} />
      <span className="kp-loader__spinner" aria-hidden="true" />
      <span className="sr-only">{label}…</span>
    </div>
  )
}
