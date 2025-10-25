"use client"

import { TrashIcon } from "./icons"

interface MealCardProps {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  mealType: string
  imageUrl?: string
  onDelete?: () => void
}

export function MealCard({ name, calories, protein, carbs, fat, mealType, imageUrl, onDelete }: MealCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow animate-slide-up">
      {imageUrl && (
        <div className="w-full h-32 bg-surface overflow-hidden">
          <img src={imageUrl || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-text">{name}</h3>
            <p className="text-xs text-text-muted capitalize">{mealType}</p>
          </div>
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 hover:bg-surface rounded-lg transition-colors"
              aria-label="Delete meal"
            >
              <TrashIcon className="w-4 h-4 text-error" />
            </button>
          )}
        </div>

        <div className="mb-3 p-2 bg-surface rounded-lg">
          <p className="text-lg font-bold text-primary">{calories} cal</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <p className="text-text-muted">Protein</p>
            <p className="font-semibold text-text">{protein}g</p>
          </div>
          <div className="text-center">
            <p className="text-text-muted">Carbs</p>
            <p className="font-semibold text-text">{carbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-text-muted">Fat</p>
            <p className="font-semibold text-text">{fat}g</p>
          </div>
        </div>
      </div>
    </div>
  )
}
