"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { createClient } from "@/lib/supabase/client"
import type { AuthUser } from "@/lib/types"

interface InviteFriendsSectionProps {
  user: AuthUser
}

interface ReferralData {
  referralCode: string
  completedReferrals: number
  pendingReferrals: number
  referrals: Array<{
    referred_email: string
    is_verified: boolean
    verified_at: string | null
    created_at: string
  }>
  trial: {
    is_trial_active: boolean
    trial_end_date: string
    trial_days_remaining: number
    trial_unlocked_by_referral: boolean
  }
}

export function InviteFriendsSection({ user }: InviteFriendsSectionProps) {
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showReferrals, setShowReferrals] = useState(false)

  useEffect(() => {
    fetchReferralData()
  }, [user.id])

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/trial/get-referrals')
      if (response.ok) {
        const data = await response.json()
        setReferralData(data)
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const referralLink = referralData?.referralCode 
    ? `${window.location.origin}/auth/signup?ref=${referralData.referralCode}`
    : ''

  const handleCopyLink = async () => {
    if (referralLink) {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    if (navigator.share && referralLink) {
      try {
        await navigator.share({
          title: 'Join NutriTrack - Track Your Nutrition!',
          text: 'I\'ve been using NutriTrack to track my nutrition and it\'s amazing! Join me and get 3 extra days free!',
          url: referralLink,
        })
      } catch (error) {
        // Fallback to copy
        handleCopyLink()
      }
    } else {
      handleCopyLink()
    }
  }

  const progressPercentage = referralData 
    ? Math.min((referralData.completedReferrals / 3) * 100, 100)
    : 0

  if (loading) {
    return (
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              🎁 Invite Friends
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {referralData?.completedReferrals || 0}/3
              </Badge>
            </CardTitle>
            <p className="text-sm text-blue-700 mt-1">
              Get 30 days Pro free when 3 friends join!
            </p>
          </div>
          <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                How it works
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-blue-900">How Referrals Work</DialogTitle>
                <DialogDescription className="text-blue-700">
                  Follow these simple steps to unlock Pro access
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Copy your invite link</p>
                    <p className="text-sm text-gray-600">Use the "Copy Link" button below</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Share with friends</p>
                    <p className="text-sm text-gray-600">Send via WhatsApp, email, or social media</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Friends sign up</p>
                    <p className="text-sm text-gray-600">They create account using your link</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-green-700">Get 30 days Pro free!</p>
                    <p className="text-sm text-gray-600">After 3 verified friends join</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Pro tip:</strong> Friends also get 3 extra days free when they use your link!
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">Progress</span>
            <span className="text-sm text-blue-700">
              {referralData?.completedReferrals || 0} of 3 friends joined
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-blue-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {referralData && referralData.completedReferrals >= 3 ? (
            <p className="text-sm text-green-700 font-medium">
              🎉 Congratulations! You've unlocked 30 days of Pro!
            </p>
          ) : (
            <p className="text-sm text-blue-700">
              {3 - (referralData?.completedReferrals || 0)} more friends needed for Pro access
            </p>
          )}
        </div>

        {/* Referral Link */}
        <div className="space-y-2">
          <Label className="text-blue-900 font-medium">Your Invite Link</Label>
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="font-mono text-sm bg-white border-blue-300"
              placeholder="Loading your invite link..."
            />
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100 whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleShare}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            📱 Share Link
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            📋 Copy Link
          </Button>
        </div>

        {/* Referral Code Display */}
        {referralData?.referralCode && (
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-700 font-medium">Your Referral Code</p>
                <code className="text-lg font-bold text-blue-900 font-mono">
                  {referralData.referralCode}
                </code>
              </div>
              <Badge variant="outline" className="border-blue-300 text-blue-700">
                Code
              </Badge>
            </div>
          </div>
        )}

        {/* Referrals List */}
        {referralData && referralData.referrals.length > 0 && (
          <Collapsible open={showReferrals} onOpenChange={setShowReferrals}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-blue-700 hover:bg-blue-100"
              >
                <span>View Your Referrals ({referralData.referrals.length})</span>
                <span className={`transform transition-transform ${showReferrals ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {referralData.referrals.map((referral, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {referral.referred_email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={referral.is_verified ? "default" : "secondary"}
                    className={
                      referral.is_verified
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-yellow-100 text-yellow-700 border-yellow-300"
                    }
                  >
                    {referral.is_verified ? "✓ Verified" : "⏳ Pending"}
                  </Badge>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Trial Status */}
        {referralData?.trial && (
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Trial Status</p>
                <p className="text-xs text-gray-600">
                  {referralData.trial.is_trial_active
                    ? `${referralData.trial.trial_days_remaining} days remaining`
                    : "Trial expired"}
                </p>
              </div>
              <Badge
                variant={referralData.trial.is_trial_active ? "default" : "secondary"}
                className={
                  referralData.trial.is_trial_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }
              >
                {referralData.trial.is_trial_active ? "Active" : "Expired"}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}