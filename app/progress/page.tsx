import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProgressPage } from "@/components/pages/progress-page"

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch meals from last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0]

  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", thirtyDaysAgoStr)
    .order("date", { ascending: true })

  // Fetch user goals
  const { data: goals } = await supabase.from("goals").select("*").eq("user_id", user.id).single()

  // Calculate daily stats
  const dailyStats: Record<string, any> = {}
  meals?.forEach((meal: any) => {
    if (!dailyStats[meal.date]) {
      dailyStats[meal.date] = {
        date: meal.date,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    }
    dailyStats[meal.date].calories += meal.calories || 0
    dailyStats[meal.date].protein += meal.protein_g || 0
    dailyStats[meal.date].carbs += meal.carbs_g || 0
    dailyStats[meal.date].fat += meal.fat_g || 0
  })

  const chartData = Object.values(dailyStats).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return <ProgressPage chartData={chartData} goals={goals} />
}
