// Get user's referral information
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

    return NextResponse.json({
      referralCode: referralCode?.code,
      completedReferrals: completedReferrals.length,
      pendingReferrals: pendingReferrals.length,
      referrals: referrals || [],
    })
  } catch (error) {
    console.error("[v0] Error getting referrals:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
