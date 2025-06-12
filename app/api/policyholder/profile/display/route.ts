import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const supabase = getSupabase()
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      console.error('No authorization header found')
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      console.error('No token found in authorization header')
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Get the user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.error('User error:', userError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = user.id
    console.log("Fetching profile for user:", userId)

    // Get the user's profile data from profiles table using user_id
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
      
      // If no profile exists, create one with basic info
      if (error.code === 'PGRST116') {
        console.log("Creating new profile for user:", userId)
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: userId,
              email: user.email,
              full_name: user.user_metadata?.full_name || "",
            }
          ])
          .select()
          .single()

        if (createError) {
          console.error("Error creating profile:", createError)
          return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
        }

        return NextResponse.json(newProfile)
      }
      
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error in profile display route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
