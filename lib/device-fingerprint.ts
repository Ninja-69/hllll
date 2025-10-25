// Device fingerprinting utility for anti-fraud detection
// Generates a unique device ID and stores it in localStorage

const DEVICE_ID_KEY = "nutri_device_id"

/**
 * Generate a unique device fingerprint
 * Combines browser info, screen resolution, timezone, and random hash
 */
function generateDeviceFingerprint(): string {
  const navigator_info = {
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    language: typeof navigator !== "undefined" ? navigator.language : "",
    platform: typeof navigator !== "undefined" ? navigator.platform : "",
    hardwareConcurrency: typeof navigator !== "undefined" ? navigator.hardwareConcurrency : 0,
    deviceMemory: typeof navigator !== "undefined" ? (navigator as any).deviceMemory : 0,
  }

  const screen_info = {
    width: typeof window !== "undefined" ? window.screen.width : 0,
    height: typeof window !== "undefined" ? window.screen.height : 0,
    colorDepth: typeof window !== "undefined" ? window.screen.colorDepth : 0,
    pixelDepth: typeof window !== "undefined" ? window.screen.pixelDepth : 0,
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const fingerprint_data = JSON.stringify({
    navigator: navigator_info,
    screen: screen_info,
    timezone,
    timestamp: Date.now(),
  })

  // Simple hash function
  let hash = 0
  for (let i = 0; i < fingerprint_data.length; i++) {
    const char = fingerprint_data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36)
}

/**
 * Get or create device ID
 * Stores in localStorage for persistence across sessions
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "server-side"
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY)

  if (!deviceId) {
    deviceId = generateDeviceFingerprint()
    try {
      localStorage.setItem(DEVICE_ID_KEY, deviceId)
    } catch (e) {
      console.warn("[v0] Failed to store device ID in localStorage:", e)
    }
  }

  return deviceId
}

/**
 * Clear device ID (for testing or logout)
 */
export function clearDeviceId(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DEVICE_ID_KEY)
  }
}
