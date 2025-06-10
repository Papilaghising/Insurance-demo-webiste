import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    // Initialize Supabase client with cookies for server-side auth
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    console.log("Fetching profile for user:", userId)

    // Get the user's profile data from profiles table using id
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
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || "",
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
