"use client"

import Link from "next/link"
import type { AuthUser } from "@/lib/types"
import { CalorieRing } from "@/components/calorie-ring"
import { MacroCard } from "@/components/macro-card"
import { MealCard } from "@/components/meal-card"
import { BottomNav } from "@/components/bottom-nav"
import { PlusIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { TrialLockoutBanner } from "@/components/trial/trial-lockout-banner"
import { TrialStatusCard } from "@/components/trial/trial-status-card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface HomePageProps {
  user: AuthUser
  profile: any
  goals: any
  meals: any[]
  dailyStats: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  trial?: any
  completedReferrals?: number
}

export function HomePage({ user, profile, goals, meals, dailyStats, trial, completedReferrals = 0 }: HomePageProps) {
  const firstName = profile?.first_name || user.email?.split("@")[0] || "User"

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-text">
            Welcome back, <span className="text-primary">{firstName}</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:px-6 space-y-8">
        {trial ? (
          <>
            <TrialLockoutBanner
              trial={trial}
              completedReferrals={completedReferrals}
              onInviteClick={() => {
                window.location.href = "/referrals"
              }}
            />
            <TrialStatusCard trial={trial} completedReferrals={completedReferrals} />
          </>
        ) : (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-900">
              <p className="font-semibold mb-2">Trial System Setup Required</p>
              <p className="text-sm mb-3">To enable the referral trial system, run the database migration:</p>
              <code className="text-xs bg-blue-100 p-2 rounded block mb-3 overflow-x-auto">
                scripts/002_create_trial_referral_schema.sql
              </code>
              <p className="text-xs text-blue-800">
                After running the migration, new users will automatically get a 3-day free trial.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <section className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col items-center">
            <CalorieRing consumed={dailyStats.calories} goal={goals?.daily_calories || 2000} size={220} />
            <p className="text-center text-text-muted mt-6 text-sm">
              {dailyStats.calories < (goals?.daily_calories || 2000)
                ? `${(goals?.daily_calories || 2000) - dailyStats.calories} calories remaining`
                : "Goal reached! Great job!"}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Macronutrients</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MacroCard
              label="Protein"
              value={Math.round(dailyStats.protein)}
              goal={Math.round(goals?.daily_protein_g || 150)}
              unit="g"
              color="#50C878"
            />
            <MacroCard
              label="Carbs"
              value={Math.round(dailyStats.carbs)}
              goal={Math.round(goals?.daily_carbs_g || 200)}
              unit="g"
              color="#FFB347"
            />
            <MacroCard
              label="Fat"
              value={Math.round(dailyStats.fat)}
              goal={Math.round(goals?.daily_fat_g || 65)}
              unit="g"
              color="#4152E4"
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">Today's Meals</h2>
            <Link href="/add-meal">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                <PlusIcon className="w-4 h-4" />
                Add Meal
              </Button>
            </Link>
          </div>

          {meals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  name={meal.name}
                  calories={meal.calories}
                  protein={meal.protein_g || 0}
                  carbs={meal.carbs_g || 0}
                  fat={meal.fat_g || 0}
                  mealType={meal.meal_type}
                  imageUrl={meal.image_url}
                />
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-xl p-8 text-center">
              <p className="text-text-muted mb-4">No meals logged yet today</p>
              <Link href="/add-meal">
                <Button className="bg-primary hover:bg-primary/90 text-white">Log Your First Meal</Button>
              </Link>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
