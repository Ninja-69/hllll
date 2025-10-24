// Apply referral code to unlock trial extension
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { referralCode } = await request.json()

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code required" }, { status: 400 })
    }

    // Find the referrer
    const { data: referrerCode } = await supabase
      .from("referral_codes")
      .select("user_id")
      .eq("code", referralCode)
      .single()

    if (!referrerCode) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 })
    }

    const referrerId = referrerCode.user_id

    // Check if already referred
    const { data: existingReferral } = await supabase
      .from("referrals")
      .select("*")
      .eq("referrer_id", referrerId)
      .eq("referred_user_id", user.id)
      .single()

    if (existingReferral) {
      return NextResponse.json({ error: "Already referred by this user" }, { status: 400 })
    }

    // Create referral record
    await supabase.from("referrals").insert({
      referrer_id: referrerId,
      referred_user_id: user.id,
      referral_code: referralCode,
      referred_email: user.email,
      is_verified: true, // Mark as verified since user signed up
      verification_method: "email",
    })

    // Check if referrer now has 3 completed referrals
    const { data: referrals } = await supabase
      .from("referrals")
      .select("*")
      .eq("referrer_id", referrerId)
      .eq("is_verified", true)

    if (referrals && referrals.length >= 3) {
      // Unlock 30 more days for referrer
      const newTrialEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

      await supabase
        .from("trial_subscriptions")
        .update({
          trial_end_date: newTrialEndDate,
          trial_days_remaining: 30,
          trial_unlocked_by_referral: true,
          referral_unlock_date: new Date().toISOString(),
        })
        .eq("user_id", referrerId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error applying referral:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
