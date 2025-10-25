// Check user's trial status and eligibility
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get trial subscription
    const { data: trial, error: trialError } = await supabase
      .from("trial_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (trialError) {
      return NextResponse.json({ error: "Trial not found" }, { status: 404 })
    }

    // Get referral code
    const { data: referralCode } = await supabase.from("referral_codes").select("code").eq("user_id", user.id).single()

    // Get completed referrals
    const { data: referrals } = await supabase
      .from("referrals")
      .select("*")
      .eq("referrer_id", user.id)
      .eq("is_verified", true)

    const completedReferrals = referrals?.length || 0

    return NextResponse.json({
      trial,
      referralCode: referralCode?.code,
      completedReferrals,
      referralsNeeded: 3,
    })
  } catch (error) {
    console.error("[v0] Error checking trial status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
