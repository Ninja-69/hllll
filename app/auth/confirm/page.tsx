"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

function ConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()
      
      try {
        // Handle OAuth callback (Discord, etc.)
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Auth confirmation error:", error)
          setStatus("error")
          setTimeout(() => router.push("/auth/login?error=confirmation_failed"), 3000)
          return
        }

        if (data.session) {
          setStatus("success")
          // Redirect to home page on successful authentication
          setTimeout(() => router.push("/"), 1000)
        } else {
          // Handle email confirmation
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          if (accessToken && refreshToken) {
            setStatus("success")
            setTimeout(() => router.push("/"), 1000)
          } else {
            setStatus("error")
            setTimeout(() => router.push("/auth/login?error=no_session"), 3000)
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        setStatus("error")
        setTimeout(() => router.push("/auth/login?error=unexpected_error"), 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-highlight via-background to-surface">
      <div className="text-center p-8">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-4">Confirming your account...</h1>
            <p className="text-text-muted">Please wait while we verify your authentication.</p>
          </>
        )}
        
        {status === "success" && (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold mb-4 text-green-600">Success!</h1>
            <p className="text-text-muted">Redirecting you to your dashboard...</p>
          </>
        )}
        
        {status === "error" && (
          <>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Failed</h1>
            <p className="text-text-muted">Redirecting you back to login...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-highlight via-background to-surface">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  )
}