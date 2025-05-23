import { createClient } from "@supabase/supabase-js"

// Check if the required environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create the client if both URL and anon key are available
let supabase: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn(
    "Supabase URL or anon key is missing. Make sure you have set the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
  )
}

// Export a function that returns the client or throws an error if it's not initialized
export function getSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase client is not initialized. Make sure you have set the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    )
  }
  return supabase
}

// For backward compatibility
export { supabase }
