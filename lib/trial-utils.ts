// Trial and referral utility functions

/**
 * Calculate days remaining in trial
 */
export function calculateDaysRemaining(trialEndDate: string): number {
  const endDate = new Date(trialEndDate)
  const now = new Date()
  const diffTime = endDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

/**
 * Check if trial is expired
 */
export function isTrialExpired(trialEndDate: string): boolean {
  return calculateDaysRemaining(trialEndDate) <= 0
}

/**
 * Check if user is locked out (trial expired and no referral unlock)
 */
export function isLockedOut(trial: {
  is_trial_active: boolean
  trial_end_date: string
  trial_unlocked_by_referral: boolean
  pro_purchased: boolean
}): boolean {
  if (trial.pro_purchased) return false
  if (trial.trial_unlocked_by_referral) return false
  return isTrialExpired(trial.trial_end_date)
}

/**
 * Generate referral link
 */
export function generateReferralLink(referralCode: string, baseUrl = ""): string {
  const url = baseUrl || (typeof window !== "undefined" ? window.location.origin : "")
  return `${url}/auth/sign-up?ref=${referralCode}`
}

/**
 * Extract referral code from URL
 */
export function getReferralCodeFromUrl(): string | null {
  if (typeof window === "undefined") return null
  const params = new URLSearchParams(window.location.search)
  return params.get("ref")
}

/**
 * Format referral progress
 */
export function formatReferralProgress(completed: number, required = 3): string {
  return `${completed}/${required}`
}

/**
 * Calculate referral completion percentage
 */
export function calculateReferralPercentage(completed: number, required = 3): number {
  return Math.min(100, Math.round((completed / required) * 100))
}
