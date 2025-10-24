"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()
      
      try {
        const { error } = await supabase.auth.getSession()
        if (error) {
          console.error("Auth confirmation error:", error)
          router.push("/auth/login?error=confirmation_failed")
          return
        }
        
        // Redirect to home page on successful confirmation
        router.push("/")
      } catch (error) {
        console.error("Unexpected error:", error)
        router.push("/auth/login?error=unexpected_error")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Confirming your account...</h1>
        <p className="text-gray-600">Please wait while we verify your email.</p>
      </div>
    </div>
  )
}