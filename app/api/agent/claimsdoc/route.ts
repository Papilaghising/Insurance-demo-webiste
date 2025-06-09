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

    // Get user and verify they are an agent
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user?.email) {
      console.error('User validation error:', userError)
      return NextResponse.json({ 
        error: 'Invalid session',
        details: userError?.message || 'User validation failed'
      }, { status: 401 })
    }

    // Get user's role from cprofile
    const { data: profile, error: profileError } = await supabase
      .from('cprofile')
      .select('role')
      .eq('email', user.email)
      .single()

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ error: 'Could not verify agent role' }, { status: 401 })
    }

    if (profile.role !== 'agent' && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Agent role required.' }, { status: 403 })
    }

    // Get all claims
    const { data: claims, error: claimsError } = await supabase
      .from('claims')
      .select('*')
      .order('created_at', { ascending: false })

    if (claimsError) {
      console.error('Claims fetch error:', claimsError)
      return NextResponse.json({ error: claimsError.message }, { status: 500 })
    }

    console.log(`Found ${claims?.length || 0} total claims`)
    return NextResponse.json(claims || [], { status: 200 })
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 