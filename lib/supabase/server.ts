import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies()
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          const cookieStore = await cookies()
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error('Error setting cookie:', error)
          }
        },
        async remove(name: string, options: CookieOptions) {
          const cookieStore = await cookies()
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            console.error('Error removing cookie:', error)
          }
        },
      },
    }
  )
}
