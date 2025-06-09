import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSupabase } from '../../../../lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('soldpolicies').select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
} 