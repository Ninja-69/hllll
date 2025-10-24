"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getDeviceId } from "@/lib/device-fingerprint"
import { getReferralCodeFromUrl } from "@/lib/trial-utils"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = getReferralCodeFromUrl()
    if (ref) {
      setReferralCode(ref)
    }
  }, [searchParams])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      })
      if (signUpError) throw signUpError

      const deviceId = getDeviceId()
      await fetch("/api/trial/log-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      }).catch((err) => console.warn("[v0] Failed to log device:", err))

      if (referralCode) {
        await fetch("/api/trial/apply-referral", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ referralCode }),
        }).catch((err) => console.warn("[v0] Failed to apply referral:", err))
      }

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-highlight via-background to-surface">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-primary mb-2">NutriTrack</h1>
            <p className="text-text-muted">Start tracking your nutrition today</p>
            {referralCode && <p className="text-xs text-success mt-2">Referred by a friend - Get 3 days free trial!</p>}
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Create account</CardTitle>
              <CardDescription>Join thousands tracking their nutrition</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-text">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-border"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-text">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-border"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password" className="text-text">
                      Confirm Password
                    </Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="border-border"
                    />
                  </div>
                  {error && (
                    <div className="p-3 bg-error/10 border border-error rounded-md">
                      <p className="text-sm text-error">{error}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-text-muted">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
