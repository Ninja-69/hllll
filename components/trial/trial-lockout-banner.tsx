"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { isLockedOut } from "@/lib/trial-utils"

interface TrialLockoutBannerProps {
  trial: {
    is_trial_active: boolean
    trial_end_date: string
    trial_unlocked_by_referral: boolean
    pro_purchased: boolean
  }
  completedReferrals: number
  onInviteClick?: () => void
}

export function TrialLockoutBanner({ trial, completedReferrals, onInviteClick }: TrialLockoutBannerProps) {
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    setIsLocked(isLockedOut(trial))
  }, [trial])

  if (!isLocked || trial.pro_purchased) {
    return null
  }

  return (
    <Alert className="border-orange-300 bg-orange-50">
      <AlertTitle className="text-orange-900">Trial Expired</AlertTitle>
      <AlertDescription className="mt-2 space-y-3 text-orange-800">
        <p>
          To unlock 30 more days of Pro, invite {3 - completedReferrals} friends! Each friend must sign up and verify
          their email.
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={onInviteClick} className="bg-orange-600 text-white hover:bg-orange-700">
            Invite Friends
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-orange-300 text-orange-900 hover:bg-orange-100 bg-transparent"
          >
            Buy Pro
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
