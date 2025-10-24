"use client"

export default function DebugPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
      <div className="space-y-2">
        <p><strong>Supabase URL:</strong> {supabaseUrl || 'NOT SET'}</p>
        <p><strong>Supabase Key:</strong> {supabaseKey ? 'SET (hidden)' : 'NOT SET'}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
      </div>
    </div>
  )
}