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
  const currentDate = new Date()

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-900">
                Good morning, <span className="gradient-text">{firstName}</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long", 
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5v5z" />
                </svg>
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
                <span className="text-white font-semibold text-sm">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Trial Banner */}
        {trial && (
          <div className="animate-slide-up">
            <TrialLockoutBanner
              trial={trial}
              completedReferrals={completedReferrals}
              onInviteClick={() => {
                window.location.href = "/referrals"
              }}
            />
          </div>
        )}

        {/* Invite Friends CTA */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-gradient-primary rounded-3xl p-8 text-white shadow-large card-hover">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Invite Friends</h3>
                    <p className="text-white/80 text-sm">Get Pro access for free!</p>
                  </div>
                </div>
                <p className="text-white/90 mb-4 leading-relaxed">
                  Invite 3 friends and unlock 30 days of Pro access. They get 3 extra days too!
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 px-4 py-2 rounded-full">
                    <span className="text-white font-semibold text-sm">
                      {completedReferrals}/3 friends
                    </span>
                  </div>
                  <span className="text-white/70 text-sm">
                    {completedReferrals >= 3 
                      ? "🎉 Pro Unlocked!" 
                      : `${3 - completedReferrals} more needed`
                    }
                  </span>
                </div>
              </div>
              <Link href="/referrals">
                <Button className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-2xl shadow-medium btn-hover">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Invite Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 card-hover">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dailyStats.calories}</p>
                  <p className="text-gray-500 text-sm">Calories</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 card-hover">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(dailyStats.protein)}g</p>
                  <p className="text-gray-500 text-sm">Protein</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 card-hover">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(dailyStats.carbs)}g</p>
                  <p className="text-gray-500 text-sm">Carbs</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 card-hover">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(dailyStats.fat)}g</p>
                  <p className="text-gray-500 text-sm">Fat</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calorie Progress */}
        <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100 card-hover">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Daily Progress</h2>
              <CalorieRing consumed={dailyStats.calories} goal={goals?.daily_calories || 2000} size={200} />
              <p className="text-gray-600 mt-6">
                {dailyStats.calories < (goals?.daily_calories || 2000)
                  ? `${(goals?.daily_calories || 2000) - dailyStats.calories} calories remaining`
                  : "🎉 Goal reached! Great job!"}
              </p>
            </div>
          </div>
        </section>

        {/* Today's Meals */}
        <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Today's Meals</h2>
            <Link href="/add-meal">
              <Button className="bg-gradient-primary text-white hover:opacity-90 px-6 py-3 rounded-2xl shadow-medium btn-hover">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Meal
              </Button>
            </Link>
          </div>

          {meals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meals.map((meal, index) => (
                <div key={meal.id} className="animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                  <MealCard
                    name={meal.name}
                    calories={meal.calories}
                    protein={meal.protein_g || 0}
                    carbs={meal.carbs_g || 0}
                    fat={meal.fat_g || 0}
                    mealType={meal.meal_type}
                    imageUrl={meal.image_url}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center shadow-soft border border-gray-100 card-hover">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No meals logged yet</h3>
              <p className="text-gray-500 mb-6">Start tracking your nutrition by adding your first meal</p>
              <Link href="/add-meal">
                <Button className="bg-gradient-primary text-white hover:opacity-90 px-8 py-3 rounded-2xl shadow-medium btn-hover">
                  Log Your First Meal
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}