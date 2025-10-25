"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function SignUpSuccessPage() {
  const [trialDays] = useState(3)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    setShowAnimation(true)
  }, [])

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-highlight via-background to-surface">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-primary mb-2">NutriTrack</h1>
          </div>

          <Card className={`border-border shadow-lg ${showAnimation ? "animate-scale-in" : ""}`}>
            <CardHeader>
              <CardTitle className="text-2xl text-success">Account created!</CardTitle>
              <CardDescription>Welcome to your nutrition journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-1">Free Trial Activated</p>
                <p className="text-xs text-blue-700">
                  You have <span className="font-bold">{trialDays} days</span> of unlimited access to NutriTrack Pro!
                </p>
              </div>

              <p className="text-sm text-text-muted">
                We&apos;ve sent a confirmation link to your email. Click it to verify your account and start tracking
                your nutrition.
              </p>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-semibold text-green-900 mb-2">Invite friends to extend your trial</p>
                <p className="text-xs text-green-700 mb-3">Invite 3 friends and unlock 30 more days of Pro access!</p>
              </div>

              <div className="flex flex-col gap-2">
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">Back to login</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
