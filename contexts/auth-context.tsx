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
  signUp: (
    email: string,
    password: string,
    options?: SignUpOptions
  ) => Promise<{
    error: any | null
    data: any | null
  }>
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: any | null
    data: any | null
  }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [supabaseInitialized, setSupabaseInitialized] = useState(false)

  useEffect(() => {
    // Check if Supabase is available
    try {
      const supabase = getSupabase()
      setSupabaseInitialized(true)

      // Get session from Supabase
      const getSession = async () => {
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession()

          if (error) {
            console.error("Error getting session:", error)
          } else {
            setSession(session)
            setUser(session?.user ?? null)
          }
        } catch (err) {
          console.error("Unexpected error getting session:", err)
        } finally {
          setIsLoading(false)
        }
      }

      getSession()

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error("Supabase initialization error:", error)
      setIsLoading(false)
    }
  }, [])

  // signUp now supports userType (agent or policyholder) via options
  const signUp = async (
    email: string,
    password: string,
    options?: SignUpOptions
  ) => {
    try {
      const supabase = getSupabase();
      // Always set 'role' in user_metadata
      const role = options?.role || options?.userType;
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...options,
            role, // ensure 'role' is set
          }
        }
      });
    } catch (error) {
      console.error("Sign up error:", error);
      return { error, data: null };
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getSupabase()
      return await supabase.auth.signInWithPassword({
        email,
        password,
      })
    } catch (error) {
      console.error("Sign in error:", error)
      return { error, data: null }
    }
  }

  const signOut = async () => {
    try {
      const supabase = getSupabase()
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  // Extract role from user metadata for easy access
  const role = user?.user_metadata?.role || user?.user_metadata?.userType || null;

  // If Supabase is not initialized, render a fallback UI
  if (!supabaseInitialized && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">Loading...</p>
        </div>
      </div>
    )
  }

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    role, // Add role to context
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
