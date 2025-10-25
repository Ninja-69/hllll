"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { calculateDaysRemaining, isLockedOut } from "@/lib/trial-utils"

interface TrialStatusCardProps {
  trial: {
    is_trial_active: boolean
    trial_end_date: string
    trial_unlocked_by_referral: boolean
    pro_purchased: boolean
  }
  completedReferrals: number
}

export function TrialStatusCard({ trial, completedReferrals }: TrialStatusCardProps) {
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    const days = calculateDaysRemaining(trial.trial_end_date)
    setDaysRemaining(days)
    setIsLocked(isLockedOut(trial))
  }, [trial])

  if (trial.pro_purchased) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">Pro Unlocked</CardTitle>
          <CardDescription className="text-green-700">You have full access to NutriTrack Pro</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isLocked) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-900">Trial Expired</CardTitle>
          <CardDescription className="text-orange-700">
            Invite {3 - completedReferrals} more friends to unlock 30 days of Pro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-900">Referral Progress</span>
              <span className="text-sm font-bold text-orange-900">{completedReferrals}/3</span>
            </div>
            <div className="h-2 w-full rounded-full bg-orange-200">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-300"
                style={{ width: `${(completedReferrals / 3) * 100}%` }}
              />
            </div>
            <Button className="w-full bg-transparent" variant="outline">
              Invite Friends
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-900">Free Trial Active</CardTitle>
        <CardDescription className="text-blue-700">{daysRemaining} days remaining</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">Days Left</span>
            <span className="text-2xl font-bold text-blue-600">{daysRemaining}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-blue-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${Math.max(0, (daysRemaining / 3) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-blue-700">
            {trial.trial_unlocked_by_referral
              ? "Trial extended by referral rewards!"
              : "Invite friends to extend your trial"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
