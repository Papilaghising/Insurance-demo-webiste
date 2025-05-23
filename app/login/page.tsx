"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import { getSupabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error, data } = await signIn(email, password)

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      // Get the user from Supabase
      const supabase = getSupabase();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setError("Could not fetch user info.")
        setIsLoading(false)
        return
      }

      // Get the role from user metadata
      const role = userData.user.user_metadata?.role || userData.user.user_metadata?.userType;
      if (!role) {
        setError("Could not fetch user role from metadata.")
        setIsLoading(false)
        return
      }
      // Optionally, you can use the role here for routing or logic
      // console.log(role); // 'agent', 'policyholder', etc.

      // Redirect to dashboard or home page
      router.push("/dashboard")
    } catch (err) {
      setError("An unexpected error occurred. Please check if Supabase is properly configured.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Check for environment variables
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Supabase environment variables are missing. Please check your configuration.")
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-400 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <div className="bg-white p-3 rounded-lg inline-block mb-4 shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A__2_-removebg-preview-ZabQoiu2niiPHLJlKWKnvBDhqIBgyh.png"
                alt="TrueClaim Logo"
                className="h-16 w-auto"
              />
            </div>
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.4)] p-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-800">Welcome Back</h1>
            <p className="text-blue-600 mt-2">Sign in to your TrueClaim account</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
              disabled={isLoading || authLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-blue-700">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
