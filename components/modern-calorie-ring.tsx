"use client"

import { useEffect, useState } from "react"

interface ModernCalorieRingProps {
  consumed: number
  goal: number
  size?: number
}

export function ModernCalorieRing({ consumed, goal, size = 200 }: ModernCalorieRingProps) {
  const [animatedConsumed, setAnimatedConsumed] = useState(0)
  const percentage = Math.min((consumed / goal) * 100, 100)
  const radius = (size - 40) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConsumed(consumed)
    }, 500)
    return () => clearTimeout(timer)
  }, [consumed])

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2a2a2a"
          strokeWidth="12"
          fill="transparent"
          className="opacity-30"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="12"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-2000 ease-out"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(255, 140, 66, 0.4))'
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff8c42" />
            <stop offset="100%" stopColor="#ffe066" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">
            {Math.round(percentage)}%
          </div>
          <div className="text-white text-lg font-semibold mb-1">
            {animatedConsumed} kcal
          </div>
          <div className="text-text-muted text-sm">
            of {goal}
          </div>
        </div>
      </div>
    </div>
  )
}