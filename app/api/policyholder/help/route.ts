import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
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

    // Get the user from the session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || !user || !user.email) {
      console.error('User error or no email:', userError)
      return NextResponse.json({ error: 'Invalid token or missing email' }, { status: 401 })
    }

    console.log('Fetching claims for user:', user.email)

    // Get claims for the user
    const { data, error } = await supabase
      .from('help')
      .select('*')
      .eq('email', user.email)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      console.warn(`No claims found or error occurred for user: ${user.email}`)
      return NextResponse.json(
        {
          message: 'Coming Soon',
          details: 'This section is under development and will be available soon.',
        },
        { status: 200 }
      )
    }

    console.log(`Found ${data.length} claims for user:`, user.email)
    return NextResponse.json(data)
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
