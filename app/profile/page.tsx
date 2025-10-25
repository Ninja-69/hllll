import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfilePage } from "@/components/pages/profile-page"

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

  return <ProfilePage user={user} profile={profile} goals={goals} />
}
