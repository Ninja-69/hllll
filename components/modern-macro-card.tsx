"use client"

interface ModernMacroCardProps {
  label: string
  value: number
  goal: number
  unit: string
  color: string
}

export function ModernMacroCard({ label, value, goal, unit, color }: ModernMacroCardProps) {
  const percentage = Math.min((value / goal) * 100, 100)
  
  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'protein':
        return '🥩'
      case 'carbs':
        return '🍞'
      case 'fat':
        return '🥑'
      default:
        return '📊'
    }
  }

  return (
    <div className="bg-gradient-card rounded-3xl p-6 border border-border/50 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getIcon(label)}</span>
          <div>
            <h3 className="text-white font-semibold">{label}</h3>
            <p className="text-text-muted text-sm">{value}/{goal} {unit}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white text-lg font-bold">{Math.round(percentage)}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface-elevated rounded-full h-2 mb-2">
        <div 
          className="h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-text-muted">
        <span>0 {unit}</span>
        <span>{goal} {unit}</span>
      </div>
    </div>
  )
}