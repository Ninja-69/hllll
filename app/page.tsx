import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HomePage } from "@/components/pages/home-page"

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user goals
  const { data: goals } = await supabase.from("goals").select("*").eq("user_id", user.id).single()

  // Create profile and goals if they don't exist (for existing users)
  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email || "",
    }).select().single()
  }

  if (!goals) {
    await supabase.from("goals").insert({
      user_id: user.id,
    }).select().single()
  }

  // Fetch today's meals
  const today = new Date().toISOString().split("T")[0]
  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .order("created_at", { ascending: false })

  // Calculate daily totals
  const dailyStats = {
    calories: meals?.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0) || 0,
    protein: meals?.reduce((sum: number, meal: any) => sum + (meal.protein_g || 0), 0) || 0,
    carbs: meals?.reduce((sum: number, meal: any) => sum + (meal.carbs_g || 0), 0) || 0,
    fat: meals?.reduce((sum: number, meal: any) => sum + (meal.fat_g || 0), 0) || 0,
  }

  let trial = null
  let completedReferrals = 0

  try {
    const { data: trialData, error: trialError } = await supabase
      .from("trial_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (!trialError && trialData) {
      trial = trialData

      // Get completed referrals
      const { data: referrals } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .eq("is_verified", true)

      completedReferrals = referrals?.length || 0
    }
  } catch (error) {
    console.log("[v0] Trial tables may not exist yet. Run migration: scripts/002_create_trial_referral_schema.sql")
  }

  return (
    <HomePage
      user={user}
      profile={profile}
      goals={goals}
      meals={meals || []}
      dailyStats={dailyStats}
      trial={trial}
      completedReferrals={completedReferrals}
    />
  )
}
