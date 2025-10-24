import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AddMealPage } from "@/components/pages/add-meal-page"

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <AddMealPage userId={user.id} />
}
