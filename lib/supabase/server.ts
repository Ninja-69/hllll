import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function queryDatabase(query: string, params: any[] = []): Promise<any> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("supabaseUrl and supabaseAnonKey are required.");
  }
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ query, params }),
    });

    if (!response.ok) {
      throw new Error("Database query failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // During build time, return a mock client to prevent build failures
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      throw new Error("supabaseUrl and supabaseAnonKey are required.");
    }
    // Return a mock client for build time
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
            order: () => Promise.resolve({ data: [], error: null })
          })
        })
      })
    } as any;
  }
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

