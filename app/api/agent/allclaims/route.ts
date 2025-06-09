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
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.error('User error:', userError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verify that the user is an agent
    const { data: profile, error: profileError } = await supabase
      .from('cprofile')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'agent') {
      console.error('Not authorized as agent')
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Get all claims with their status information
    const { data: claims, error: claimsError } = await supabase
      .from('claims')
      .select(`
        claim_id,
        email,
        full_name,
        phone,
        policy_number,
        claim_type,
        date_of_incident,
        incident_location,
        incident_description,
        claim_amount,
        public_status,
        fraud_risk_score,
        risk_level,
        key_findings,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })

    if (claimsError) {
      console.error('Database error:', claimsError)
      return NextResponse.json({ error: claimsError.message }, { status: 500 })
    }

    console.log(`Found ${claims?.length || 0} claims`)
    return NextResponse.json(claims || [])
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}