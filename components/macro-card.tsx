interface MacroCardProps {
  label: string
  value: number
  goal: number
  unit: string
  color: string
}

export function MacroCard({ label, value, goal, unit, color }: MacroCardProps) {
  const percentage = Math.min((value / goal) * 100, 100)

  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-text">{label}</span>
        <span className="text-xs text-text-muted">
          {value}/{goal}
          {unit}
        </span>
      </div>
      <div className="w-full bg-border rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}
