import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '../../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('API: Starting profile display handler')

    // Create a Supabase client using the request context
    const supabase = getSupabase()

    // Check for all possible Supabase cookie names
    const accessToken = req.cookies['sb-access-token']
    const refreshToken = req.cookies['sb-refresh-token']
    const authCookie = req.cookies['sb']
    
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
      return res.status(401).json({ 
        error: 'Unauthorized', 
        details: authError?.message || 'No session found',
        cookies: {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasAuthCookie: !!authCookie
        }
      })
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
      return res.status(500).json({ error: error.message })
    }

    if (!data) {
      console.log('API: Profile not found for user:', userId)
      return res.status(404).json({ error: 'Profile not found' })
    }

    console.log('API: Successfully retrieved profile for user:', userId)
    return res.status(200).json(data)
  } catch (error) {
    console.error('API: Error in profile display handler:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
