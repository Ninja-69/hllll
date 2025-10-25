"use client"

interface ModernMealCardProps {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  mealType: string
  imageUrl?: string
}

export function ModernMealCard({
  name,
  calories,
  protein,
  carbs,
  fat,
  mealType,
  imageUrl
}: ModernMealCardProps) {
  const getMealIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return '🌅'
      case 'lunch':
        return '☀️'
      case 'dinner':
        return '🌙'
      case 'snack':
        return '🍎'
      default:
        return '🍽️'
    }
  }

  const getMealTime = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return '08:30'
      case 'lunch':
        return '12:30'
      case 'dinner':
        return '19:00'
      case 'snack':
        return '15:30'
      default:
        return '12:00'
    }
  }

  return (
    <div className="bg-gradient-card rounded-3xl p-4 border border-border/50 card-hover">
      <div className="flex items-center gap-4">
        {/* Meal Image/Icon */}
        <div className="w-16 h-16 rounded-2xl bg-surface-elevated flex items-center justify-center flex-shrink-0 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">{getMealIcon(mealType)}</span>
          )}
        </div>

        {/* Meal Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-white font-semibold truncate">{name}</h3>
            <span className="text-text-muted text-sm">{getMealTime(mealType)}</span>
          </div>
          
          <p className="text-text-muted text-sm capitalize mb-2">{mealType}</p>
          
          {/* Macros */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-text-muted">{calories} cal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span className="text-text-muted">{protein}g P</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span className="text-text-muted">{carbs}g C</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-text-muted">{fat}g F</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center hover:bg-primary/20 transition-colors">
          <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}