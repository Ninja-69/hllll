"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function DebugPage() {
  const [testResult, setTestResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const testConnection = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setTestResult(`❌ Connection Error: ${error.message}`)
      } else {
        setTestResult(`✅ Connection Success! Session: ${data.session ? 'Active' : 'None'}`)
      }
    } catch (err) {
      setTestResult(`❌ Unexpected Error: ${err}`)
    }
    setLoading(false)
  }

  const testSignUp = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123'
      })
      
      if (error) {
        setTestResult(`❌ SignUp Error: ${error.message}`)
      } else {
        setTestResult(`✅ SignUp API works! (Check your email)`)
      }
    } catch (err) {
      setTestResult(`❌ SignUp Failed: ${err}`)
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Supabase URL:</strong> {supabaseUrl || 'NOT SET'}</p>
          <p><strong>Supabase Key:</strong> {supabaseKey ? 'SET (hidden)' : 'NOT SET'}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        </div>
        
        <div className="space-x-4">
          <button 
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
          
          <button 
            onClick={testSignUp}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test SignUp API'}
          </button>
        </div>
        
        {testResult && (
          <div className="bg-gray-50 p-4 rounded border">
            <strong>Test Result:</strong>
            <pre className="mt-2 whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  )
}