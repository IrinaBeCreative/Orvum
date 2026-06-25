const stats = [
  { value: '500+', label: 'Projects Completed' },
  { value: '5.0', label: 'Google Rating' },
  { value: '1 Day', label: 'Avg Turnaround' },
  { value: '2 Year', label: 'Warranty Offered' },
]

export default function TrustBar() {
  return (
    <div className="bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-6 px-6 text-center ${i < stats.length - 1 ? 'border-r border-border' : ''} flex flex-col items-center gap-1`}
            >
              <div className="font-display text-3xl font-light text-gold">{s.value}</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
