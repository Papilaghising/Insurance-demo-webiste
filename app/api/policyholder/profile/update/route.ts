import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSupabase } from '../../../../../lib/supabase'

export async function PUT(req: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await req.json()
    const { fullName, email } = body

    // Get the user from the session
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    console.log('Session debug:', session) // Debug log
    console.log('Auth error debug:', authError) // Debug log

    if (authError || !session) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        details: authError?.message || 'No session found'
      }, { status: 401 })
    }

    // Update the profile in cprofile table
    const { error: updateError } = await supabase
      .from('cprofile')
      .upsert({
        email: email,
        fullName: fullName,
        updated_at: new Date().toISOString()
      })
      .match({ email: email })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error in profile update handler:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 