import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    console.log('API: Starting profile display handler')

    // Create a Supabase client using the request context
    const supabase = getSupabase()

    // Get cookies using the new cookies() API
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value
    const refreshToken = cookieStore.get('sb-refresh-token')?.value
    const authCookie = cookieStore.get('sb')?.value
    
    console.log('API: Auth cookies present:', { 
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasAuthCookie: !!authCookie
    })

    // Get the session using the Supabase client
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    console.log('API: Session check result:', { 
      hasSession: !!session, 
      authError: authError?.message,
      userId: session?.user?.id 
    })
    
    if (authError || !session) {
      console.log('API: Unauthorized - No valid session')
      return NextResponse.json({ 
        error: 'Unauthorized', 
        details: authError?.message || 'No session found',
        cookies: {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasAuthCookie: !!authCookie
        }
      }, { status: 401 })
    }

    const userId = session.user.id
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
    return NextResponse.json(data)
  } catch (error) {
    console.error('API: Error in profile display handler:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 