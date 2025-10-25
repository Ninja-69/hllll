// Log device info for anti-fraud detection
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

    const { deviceId } = await request.json()

    // Get client IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown"

    const userAgent = request.headers.get("user-agent") || ""

    // Check if this IP already has a trial in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: existingIpTrial } = await supabase
      .from("ip_trial_locks")
      .select("*")
      .eq("ip_address", ip)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (existingIpTrial && existingIpTrial.user_id !== user.id) {
      return NextResponse.json({ error: "Trial already granted from this IP address" }, { status: 403 })
    }

    // Log device
    await supabase.from("device_logs").insert({
      user_id: user.id,
      device_id: deviceId,
      ip_address: ip,
      user_agent: userAgent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error logging device:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
