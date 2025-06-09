import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSupabase } from '../../../../lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('cprofile')
    .select('email,user_id')
    .eq('role', 'policyholder')

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
} 