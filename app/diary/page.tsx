import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DiaryPage } from "@/components/pages/diary-page"

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all meals for the user
  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  // Group meals by date
  const mealsByDate = (meals || []).reduce(
    (acc: Record<string, any[]>, meal: any) => {
      const date = meal.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(meal)
      return acc
    },
    {} as Record<string, any[]>,
  )

  return <DiaryPage mealsByDate={mealsByDate} userId={user.id} />
}
