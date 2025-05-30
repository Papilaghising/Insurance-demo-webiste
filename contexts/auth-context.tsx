"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

type SignUpOptions = {
  userType?: 'agent' | 'policyholder';
  [key: string]: any;
};

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, options?: SignUpOptions) => Promise<{ error: any | null; data: any | null }>
  signIn: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>
  signOut: () => Promise<void>
  role?: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    try {
      const supabase = getSupabase()

      // Initial session check
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error("Error getting session:", error)
          setIsLoading(false)
          return
        }

        if (session) {
          setSession(session)
          setUser(session.user)
          setRole(session.user.user_metadata?.role || session.user.user_metadata?.userType)
        }
        
        setIsLoading(false)
      })

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setRole(session?.user?.user_metadata?.role || session?.user?.user_metadata?.userType)
        setIsLoading(false)

        // If we have a session, sync it with the server
        if (session) {
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session }),
          })
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
      setIsLoading(false)
    }
  }, [])

  const signUp = async (email: string, password: string, options?: SignUpOptions) => {
    try {
      const supabase = getSupabase()
      const role = options?.role || options?.userType
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            ...options,
          },
        },
      })

      // If signup was successful and user is a policyholder, create profile
      if (!error && data?.user && (role === 'policyholder')) {
        const { error: profileError } = await supabase
          .from('cprofile')
          .upsert({
            fullName: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
            email: data.user.email
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }

      return { error, data }
    } catch (error) {
      console.error("Sign up error:", error)
      return { error, data: null }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!error && data?.session) {
        // Sync session with the server
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session: data.session }),
        })

        // If user is a policyholder, update their profile in cprofile table
        if (data.session.user.user_metadata?.role === 'policyholder' || 
            data.session.user.user_metadata?.userType === 'policyholder') {
          const { error: profileError } = await supabase
            .from('cprofile')
            .upsert({
              fullName: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || '',
              email: data.session.user.email
            })

          if (profileError) {
            console.error('Error updating profile:', profileError)
          }
        }
      }

      return { data, error }
    } catch (error) {
      console.error("Sign in error:", error)
      return { error, data: null }
    }
  }

  const signOut = async () => {
    try {
      const supabase = getSupabase()
      await supabase.auth.signOut()
      
      // Clear session on the server
      await fetch('/api/auth/session', {
        method: 'DELETE',
      })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    role,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
