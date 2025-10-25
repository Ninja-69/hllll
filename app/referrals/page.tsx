import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ReferralPage } from "@/components/pages/referral-page"

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get trial subscription
  const { data: trial } = await supabase.from("trial_subscriptions").select("*").eq("user_id", user.id).single()

  // Get referral code
  const { data: referralCode } = await supabase.from("referral_codes").select("code").eq("user_id", user.id).single()

  // Get completed referrals
  const { data: referrals } = await supabase
    .from("referrals")
    .select("referred_email, is_verified, verified_at")
    .eq("referrer_id", user.id)
    .order("verified_at", { ascending: false })

  const completedReferrals = referrals?.filter((r: any) => r.is_verified) || []
  const pendingReferrals = referrals?.filter((r: any) => !r.is_verified) || []

  return (
    <ReferralPage
      trial={trial}
      referralCode={referralCode?.code || ""}
      completedReferrals={completedReferrals.length}
      pendingReferrals={pendingReferrals.length}
      referrals={referrals || []}
    />
  )
}
