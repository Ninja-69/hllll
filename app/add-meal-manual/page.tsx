import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AddMealManualPage } from "@/components/pages/add-meal-manual-page"

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <AddMealManualPage userId={user.id} />
}
