import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function middleware(request: NextRequest) {
  // Check if the request is for a public path
  const publicPaths = ['/login', '/signup', '/', '/about', '/contact', '/services']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // If it's a public path, allow the request
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('sb-session')
  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Parse the session cookie
    const session = JSON.parse(sessionCookie.value)
    
    // If session exists but has expired, redirect to login
    if (session.expires_at && new Date(session.expires_at * 1000) < new Date()) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('sb-session')
      return response
    }

    // Continue with the valid session
    return NextResponse.next()
  } catch (error) {
    // If there's an error parsing the session, clear it and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('sb-session')
    return response
  }
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|logo.png|images).*)',
  ],
}
