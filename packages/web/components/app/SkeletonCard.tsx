type Props = { lines?: number; height?: number }

export default function SkeletonCard({ lines = 3, height = 120 }: Props) {
  return (
    <div className="ka-card ka-skeleton" style={{ minHeight: height }} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="ka-skeleton__line" style={{ width: i === 0 ? '40%' : i % 3 === 0 ? '60%' : '80%' }} />
      ))}
    </div>
  )
}
