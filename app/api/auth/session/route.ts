import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return cookieStore.get(name)?.value
        },
        set: (name: string, value: string, options: CookieOptions) => {
          cookieStore.set(name, value, options)
        },
        remove: (name: string, options: CookieOptions) => {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  try {
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
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return cookieStore.get(name)?.value
        },
        set: (name: string, value: string, options: CookieOptions) => {
          cookieStore.set(name, value, options)
        },
        remove: (name: string, options: CookieOptions) => {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  try {
    const { session } = await request.json()

    if (session) {
      await supabase.auth.setSession(session)
      
      return NextResponse.json(
        { message: 'Session updated' },
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return NextResponse.json({ error: 'No session provided' }, { status: 400 })
  } catch (error) {
    console.error('Session update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return cookieStore.get(name)?.value
        },
        set: (name: string, value: string, options: CookieOptions) => {
          cookieStore.set(name, value, options)
        },
        remove: (name: string, options: CookieOptions) => {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  try {
    await supabase.auth.signOut()
    
    const response = NextResponse.json(
      { message: 'Signed out successfully' },
      { status: 200 }
    )

    // Clear all Supabase-related cookies
    const cookieOptions = {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
    }

    response.cookies.set('sb-access-token', '', cookieOptions)
    response.cookies.set('sb-refresh-token', '', cookieOptions)
    response.cookies.set('supabase-auth-token', '', cookieOptions)
    response.cookies.set('sb-auth-token', '', cookieOptions)
    response.cookies.set('sb-token', '', cookieOptions)
    
    return response
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
