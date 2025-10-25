"use client"

interface CalorieRingProps {
  consumed: number
  goal: number
  size?: number
}

export function CalorieRing({ consumed, goal, size = 200 }: CalorieRingProps) {
  const percentage = Math.min((consumed / goal) * 100, 100)
  const circumference = 2 * Math.PI * (size / 2 - 20)
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
        >
          {/* Background ring */}
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 20} fill="none" stroke="#E5E7EB" strokeWidth="16" />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 20}
            fill="none"
            stroke="#50C878"
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-text">{consumed}</div>
            <div className="text-sm text-text-muted">of {goal} cal</div>
          </div>
        </div>
      </div>
    </div>
  )
}
