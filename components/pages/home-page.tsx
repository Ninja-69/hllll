"use client"

import Link from "next/link"
import type { AuthUser } from "@/lib/types"
import { ModernCalorieRing } from "@/components/modern-calorie-ring"
import { ModernMacroCard } from "@/components/modern-macro-card"
import { ModernMealCard } from "@/components/modern-meal-card"
import { ModernBottomNav } from "@/components/modern-bottom-nav"
import { Button } from "@/components/ui/button"
import { TrialLockoutBanner } from "@/components/trial/trial-lockout-banner"

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
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      {/* Header */}
      <header className="relative px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-scale-in">
              <span className="text-white font-bold text-lg">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="animate-fade-in">
              <p className="text-text-muted text-sm">Keep Moving Today!</p>
              <h1 className="text-xl font-bold text-white">
                Hi, {firstName}
              </h1>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center animate-scale-in">
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H4l5-5v5z" />
            </svg>
          </div>
        </div>

        {/* Stay Active Card */}
        <div className="bg-gradient-to-r from-accent to-secondary rounded-3xl p-6 mb-6 animate-slide-up shadow-glow">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse-slow">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Stay Active</h3>
              <p className="text-white/80 text-sm">Your Daily Boost Of Energy!</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-8">
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

        {/* Your Recent Stats */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span>📊</span>
            Your Recent Stats
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Steps Card */}
            <div className="bg-gradient-card rounded-2xl p-4 border border-border/50 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-accent">👟</span>
                  <span className="text-text-muted text-sm">Steps</span>
                </div>
                <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-white text-xl font-bold">2,390</p>
                <p className="text-text-muted text-xs">2.51 km</p>
              </div>
            </div>

            {/* Calories Card */}
            <div className="bg-gradient-card rounded-2xl p-4 border border-border/50 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-primary">🔥</span>
                  <span className="text-text-muted text-sm">Calories</span>
                </div>
                <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-white text-xl font-bold">{dailyStats.calories}</p>
                <div className="w-full bg-surface-elevated rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-1000"
                    style={{ width: `${Math.min((dailyStats.calories / (goals?.daily_calories || 2000)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Chart Placeholder */}
          <div className="bg-gradient-card rounded-2xl p-4 border border-border/50 card-hover">
            <div className="flex items-center justify-center h-20">
              <div className="flex items-end gap-1">
                {[40, 60, 80, 100, 70, 90, 85].map((height, i) => (
                  <div
                    key={i}
                    className={`w-6 rounded-t transition-all duration-1000 animate-slide-up ${
                      i === 6 ? 'bg-accent' : 'bg-surface-elevated'
                    }`}
                    style={{ 
                      height: `${height}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Your Activities */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Your Activities</h2>
            <div className="flex items-center gap-2">
              <span className="bg-accent text-black text-xs px-3 py-1 rounded-full font-medium">
                Today, {currentDate.getDate()} {currentDate.toLocaleDateString('en', { month: 'short' })}
              </span>
            </div>
          </div>

          {/* Main Calorie Ring */}
          <div className="bg-gradient-card rounded-3xl p-8 border border-border/50 mb-6 card-hover">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <span className="text-primary mr-2">🔥</span>
                <span className="text-text-muted">Calories</span>
                <div className="ml-auto">
                  <select className="bg-transparent text-text-muted text-sm border-none outline-none">
                    <option>Weekly</option>
                    <option>Daily</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
              
              <div className="relative mb-6">
                <ModernCalorieRing 
                  consumed={dailyStats.calories} 
                  goal={goals?.daily_calories || 2000} 
                  size={200} 
                />
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-accent">👟</span>
                  <div>
                    <p className="text-white font-semibold">2,390</p>
                    <p className="text-text-muted text-xs">Steps</p>
                  </div>
                  <svg className="w-4 h-4 text-text-muted ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-blue-400">💧</span>
                  <div>
                    <p className="text-white font-semibold">1,000</p>
                    <p className="text-text-muted text-xs">Water</p>
                  </div>
                  <svg className="w-4 h-4 text-text-muted ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Invite Friends CTA */}
        <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-gradient-primary rounded-3xl p-6 shadow-glow card-hover">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">🎁 Invite Friends</h3>
                <p className="text-white/80 text-sm mb-3">
                  Get 30 days Pro free when 3 friends join!
                </p>
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <span className="bg-white/20 px-2 py-1 rounded-full text-white font-medium">
                    {completedReferrals}/3
                  </span>
                  <span>•</span>
                  <span>
                    {completedReferrals >= 3 
                      ? "🎉 Pro Unlocked!" 
                      : `${3 - completedReferrals} more needed`
                    }
                  </span>
                </div>
              </div>
              <Link href="/referrals">
                <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-3 rounded-2xl shadow-md btn-hover">
                  Invite Now
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Macronutrients */}
        <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-white font-semibold mb-4">Macronutrients</h2>
          <div className="grid grid-cols-1 gap-4">
            <ModernMacroCard
              label="Protein"
              value={Math.round(dailyStats.protein)}
              goal={Math.round(goals?.daily_protein_g || 150)}
              unit="g"
              color="#50C878"
            />
            <ModernMacroCard
              label="Carbs"
              value={Math.round(dailyStats.carbs)}
              goal={Math.round(goals?.daily_carbs_g || 200)}
              unit="g"
              color="#FFB347"
            />
            <ModernMacroCard
              label="Fat"
              value={Math.round(dailyStats.fat)}
              goal={Math.round(goals?.daily_fat_g || 65)}
              unit="g"
              color="#4152E4"
            />
          </div>
        </section>

        {/* Today's Meals */}
        <section className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Today's Meals</h2>
            <Link href="/add-meal">
              <Button className="bg-accent text-black hover:bg-accent/90 font-semibold rounded-2xl btn-hover">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Meal
              </Button>
            </Link>
          </div>

          {meals.length > 0 ? (
            <div className="space-y-4">
              {meals.map((meal, index) => (
                <div key={meal.id} className="animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                  <ModernMealCard
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
            <div className="bg-gradient-card rounded-3xl p-8 text-center border border-border/50 card-hover">
              <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-text-muted mb-4">No meals logged yet today</p>
              <Link href="/add-meal">
                <Button className="bg-accent text-black hover:bg-accent/90 font-semibold rounded-2xl btn-hover">
                  Log Your First Meal
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>

      <ModernBottomNav />
    </div>
  )
}