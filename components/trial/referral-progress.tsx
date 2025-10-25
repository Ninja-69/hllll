"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { calculateReferralPercentage, formatReferralProgress } from "@/lib/trial-utils"

interface ReferralProgressProps {
  completedReferrals: number
  referralCode: string
}

export function ReferralProgress({ completedReferrals, referralCode }: ReferralProgressProps) {
  const [copied, setCopied] = useState(false)
  const referralsNeeded = 3

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/sign-up?ref=${referralCode}`
  const percentage = calculateReferralPercentage(completedReferrals, referralsNeeded)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join NutriTrack",
        text: "Track your nutrition with me on NutriTrack!",
        url: referralLink,
      })
    } else {
      handleCopyLink()
    }
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-900">Referral Progress</CardTitle>
        <CardDescription className="text-green-700">Invite friends and unlock 30 days of Pro</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress visualization */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-900">Friends Invited</span>
            <span className="text-lg font-bold text-green-600">{formatReferralProgress(completedReferrals)}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-green-200">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-green-700">
            {completedReferrals >= referralsNeeded
              ? "Congratulations! You've unlocked 30 days of Pro!"
              : `${referralsNeeded - completedReferrals} more to unlock Pro`}
          </p>
        </div>

        {/* Referral code display */}
        <div className="rounded-lg bg-white p-3">
          <p className="mb-2 text-xs font-medium text-green-900">Your Referral Code</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-green-100 px-3 py-2 font-mono text-sm font-bold text-green-900">
              {referralCode}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="border-green-300 text-green-900 hover:bg-green-100 bg-transparent"
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex gap-2">
          <Button onClick={handleShareLink} className="flex-1 bg-green-600 text-white hover:bg-green-700">
            Share Link
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-green-300 text-green-900 hover:bg-green-100 bg-transparent"
            onClick={handleCopyLink}
          >
            Copy Link
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
