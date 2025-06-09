import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSupabase } from '../../../../../lib/supabase'

export async function GET(req: NextRequest) {
  try {
    console.log('API: Starting profile display handler')

    // Create a Supabase client using the request context
    const supabase = getSupabase()

    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      console.error('No authorization header found')
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      console.error('No token found in authorization header')
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Get user from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    console.log('API: Session check result:', { 
      hasUser: !!user, 
      authError: userError?.message,
      userId: user?.id 
    })
    
    if (userError || !user) {
      console.log('API: Unauthorized - No valid session')
      return NextResponse.json({ 
        error: 'Unauthorized', 
        details: userError?.message || 'No session found'
      }, { status: 401 })
    }

    const userId = user.id
    console.log('API: Fetching profile for user:', userId)

    // Get the profile for the current user
    const { data, error } = await supabase
      .from('cprofile')
      .select('*')
      .eq('user_id', userId)
      .single()

    console.log('API: Profile query result:', { 
      hasData: !!data, 
      error: error?.message,
      userId 
    })

    if (error) {
      console.log('API: Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      console.log('API: Profile not found for user:', userId)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    console.log('API: Successfully retrieved profile for user:', userId)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('API: Error in profile display handler:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 