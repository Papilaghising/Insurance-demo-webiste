import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session:", error)
      return NextResponse.json({ error: "Failed to get session" }, { status: 500 })
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error("Error in session route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { session } = await request.json()

    if (session) {
      // Set session cookie
      const response = new NextResponse(JSON.stringify({ message: 'Session updated' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })

      // Set cookie with session
      await supabase.auth.setSession(session)

      return response
    }

    return NextResponse.json({ error: 'No session provided' }, { status: 400 })
  } catch (error) {
    console.error('Session update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Sign out and clear session
    await supabase.auth.signOut()

    return NextResponse.json({ message: 'Signed out successfully' })
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
