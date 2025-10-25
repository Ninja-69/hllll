"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrialStatusCard } from "@/components/trial/trial-status-card"
import { ReferralProgress } from "@/components/trial/referral-progress"
import { TrialLockoutBanner } from "@/components/trial/trial-lockout-banner"

interface ReferralPageProps {
  trial: {
    is_trial_active: boolean
    trial_end_date: string
    trial_unlocked_by_referral: boolean
    pro_purchased: boolean
  }
  referralCode: string
  completedReferrals: number
  pendingReferrals: number
  referrals: Array<{
    referred_email: string
    is_verified: boolean
    verified_at: string | null
  }>
}

export function ReferralPage({
  trial,
  referralCode,
  completedReferrals,
  pendingReferrals,
  referrals,
}: ReferralPageProps) {
  const [showInviteModal, setShowInviteModal] = useState(false)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Referral Program</h1>
          <p className="text-muted-foreground">Invite friends and unlock Pro access</p>
        </div>

        {/* Trial Status Banner */}
        <TrialLockoutBanner
          trial={trial}
          completedReferrals={completedReferrals}
          onInviteClick={() => setShowInviteModal(true)}
        />

        {/* Trial Status Card */}
        <TrialStatusCard trial={trial} completedReferrals={completedReferrals} />

        {/* Referral Progress */}
        {referralCode && <ReferralProgress completedReferrals={completedReferrals} referralCode={referralCode} />}

        {/* Referral List */}
        {referrals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>
                {completedReferrals} verified, {pendingReferrals} pending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {referrals.map((referral, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{referral.referred_email}</p>
                      <p className="text-xs text-muted-foreground">
                        {referral.is_verified ? "Verified" : "Pending verification"}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        referral.is_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {referral.is_verified ? "Completed" : "Pending"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* How It Works */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-blue-800">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-semibold">Share your referral link</p>
                <p className="text-xs text-blue-700">Copy and share your unique referral code with friends</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-semibold">Friends sign up</p>
                <p className="text-xs text-blue-700">They create an account using your referral link</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-semibold">They verify their email</p>
                <p className="text-xs text-blue-700">Once verified, the referral counts toward your reward</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div>
                <p className="font-semibold">Unlock 30 days of Pro</p>
                <p className="text-xs text-blue-700">After 3 verified referrals, you get 30 more days free!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-foreground mb-1">Can I use multiple devices?</p>
              <p className="text-muted-foreground">
                Only one trial per device and IP address per 30 days. This prevents abuse.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">How long does verification take?</p>
              <p className="text-muted-foreground">
                Verification is instant once your friend confirms their email address.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Can I buy Pro instead?</p>
              <p className="text-muted-foreground">
                Yes! You can purchase Pro at any time for instant unlimited access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
