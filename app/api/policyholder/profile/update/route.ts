import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function PUT(request: Request) {
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
    console.log("Updating profile for user:", userId)

    // Get the profile data from request body
    const profileData = await request.json()

    // Update profile with all available fields
    const { data: profile, error } = await supabase
      .from("profiles")
      .update({
        full_name: profileData.full_name,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zip_code: profileData.zip_code,
        occupation: profileData.occupation,
        employer: profileData.employer
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating profile:", error)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error in profile update route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
