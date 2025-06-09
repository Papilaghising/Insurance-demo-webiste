import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSupabase } from '../../../../lib/supabase'

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

    // Get user directly from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user?.email) {
      console.error('User validation error:', userError)
      return NextResponse.json({ 
        error: 'Invalid session',
        details: userError?.message || 'User validation failed'
      }, { status: 401 })
    }

    console.log('Fetching claim status for user:', user.email)

    // Query only selected fields for the logged-in user
    const { data, error } = await supabase
      .from('claims')
      .select('claim_id, claim_type, claim_amount, status, created_at')
      .eq('email', user.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`Found ${data?.length || 0} claim statuses for user:`, user.email)
    return NextResponse.json(data || [], { status: 200 })
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 