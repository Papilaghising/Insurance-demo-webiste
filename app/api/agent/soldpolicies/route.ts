// import { NextResponse } from 'next/server'
// import { getSupabase } from '@/lib/supabase'

// export async function GET() {
//   const supabase = getSupabase()
//   const { data, error } = await supabase
//     .from('soldpolicies')
//     .select('*')

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }

//   return NextResponse.json(data)
// }
import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET() {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('soldpolicies')
    .select('*')

  if (error || !data || data.length === 0) {
    return NextResponse.json(
      {
        message: 'Coming Soon',
        details: 'This section is under development and will be available soon.',
      },
      { status: 200 }
    )
  }

  return NextResponse.json(data)
}
