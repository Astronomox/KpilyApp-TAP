// "No Data" illustration used by empty tables.
export default function EmptyState({ label = 'No Data' }: { label?: string }) {
  return (
    <div className="ka-empty">
      <svg viewBox="0 0 128 128" width="128" height="128" aria-hidden="true">
        <circle cx="64" cy="64" r="64" fill="#e7efec" />
        <path d="M14 100a64 64 0 0 0 100 0c-10-8-30-12-50-12s-40 4-50 12z" fill="#1e6b50" />
        <path d="M44 88V52a20 20 0 0 1 40 0v36l-5-4-5 4-5-4-5 4-5-4-5 4-5-4z" fill="#fff" stroke="#252525" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="57" cy="54" r="2" fill="#252525" /><circle cx="71" cy="54" r="2" fill="#252525" />
        <path d="M60 62q4 3 8 0" fill="none" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <strong>{label}</strong>
    </div>
  )
}
