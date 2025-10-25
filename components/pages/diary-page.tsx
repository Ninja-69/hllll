"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { BottomNav } from "@/components/bottom-nav"
import { MealCard } from "@/components/meal-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusIcon } from "@/components/icons"

interface DiaryPageProps {
  mealsByDate: Record<string, any[]>
  userId: string
}

export function DiaryPage({ mealsByDate, userId }: DiaryPageProps) {
  const [meals, setMeals] = useState(mealsByDate)

  const handleDeleteMeal = async (mealId: string, date: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase.from("meals").delete().eq("id", mealId)

      if (error) throw error

      // Update local state
      setMeals((prev) => ({
        ...prev,
        [date]: prev[date].filter((meal) => meal.id !== mealId),
      }))
    } catch (err) {
      console.error("[v0] Delete error:", err)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  const dates = Object.keys(meals).sort().reverse()

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-4 md:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Meal Diary</h1>
            <p className="text-sm text-text-muted mt-1">View all your logged meals</p>
          </div>
          <Link href="/add-meal">
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
              <PlusIcon className="w-4 h-4" />
              Add
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:px-6 space-y-8">
        {dates.length > 0 ? (
          dates.map((date) => {
            const dateMeals = meals[date]
            const totalCalories = dateMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
            const totalProtein = dateMeals.reduce((sum, meal) => sum + (meal.protein_g || 0), 0)
            const totalCarbs = dateMeals.reduce((sum, meal) => sum + (meal.carbs_g || 0), 0)
            const totalFat = dateMeals.reduce((sum, meal) => sum + (meal.fat_g || 0), 0)

            return (
              <section key={date} className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <h2 className="text-lg font-semibold text-text mb-3">{formatDate(date)}</h2>
                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <div>
                      <p className="text-text-muted">Calories</p>
                      <p className="font-bold text-primary">{totalCalories}</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Protein</p>
                      <p className="font-bold text-text">{Math.round(totalProtein)}g</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Carbs</p>
                      <p className="font-bold text-accent">{Math.round(totalCarbs)}g</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Fat</p>
                      <p className="font-bold text-secondary">{Math.round(totalFat)}g</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dateMeals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      name={meal.name}
                      calories={meal.calories}
                      protein={meal.protein_g || 0}
                      carbs={meal.carbs_g || 0}
                      fat={meal.fat_g || 0}
                      mealType={meal.meal_type}
                      imageUrl={meal.image_url}
                      onDelete={() => handleDeleteMeal(meal.id, date)}
                    />
                  ))}
                </div>
              </section>
            )
          })
        ) : (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <p className="text-text-muted mb-4">No meals logged yet</p>
            <Link href="/add-meal">
              <Button className="bg-primary hover:bg-primary/90 text-white">Log Your First Meal</Button>
            </Link>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
