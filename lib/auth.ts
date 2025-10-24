// Custom Supabase auth using fetch - no external packages needed
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export interface AuthUser {
  id: string
  email?: string
  user_metadata?: Record<string, any>
}

export interface AuthResponse {
  user: AuthUser | null
  session: { access_token: string; refresh_token: string } | null
  error: string | null
}

// Sign up with email and password
export async function signUp(email: string, password: string): Promise<AuthResponse> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { user: null, session: null, error: "Supabase configuration missing" }
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { user: null, session: null, error: data.message || "Sign up failed" }
    }

    return {
      user: data.user,
      session: data.session,
      error: null,
    }
  } catch (error) {
    return { user: null, session: null, error: "Network error" }
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { user: null, session: null, error: "Supabase configuration missing" }
  }
  
  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { user: null, session: null, error: error.message }
    }

    return {
      user: data.user,
      session: data.session,
      error: null,
    }
  } catch (error) {
    return { user: null, session: null, error: "Network error" }
  }
}

// Sign out
export async function signOut(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("supabase_access_token")
    localStorage.removeItem("supabase_refresh_token")
  }
}

// Get current user
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (typeof window === "undefined") return null
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null

  const token = localStorage.getItem("supabase_access_token")
  if (!token) return null

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch {
    return null
  }
}

// Get access token
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("supabase_access_token")
}
