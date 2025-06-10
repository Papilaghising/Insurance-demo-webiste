"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Lock, User, Shield, Users, CheckCircle2, AlertCircle } from "lucide-react"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"policyholder" | "agent">("policyholder")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formStep, setFormStep] = useState(0)
  const { signUp, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Supabase environment variables are missing. Please check your configuration.")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const isAgent = role === "agent"
      const userMetadata = {
        role,
        full_name: fullName,
        is_approved: !isAgent,
      }

      const { error, data } = await signUp(email, password, {
        userType: role,
        metadata: userMetadata,
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (data?.user && !data?.session) {
        setSuccessMessage(
          isAgent
            ? "Account created! Await admin approval to access the agent dashboard. Please check your email."
            : "Please check your email for a confirmation link"
        )
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please check if Supabase is properly configured.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Refined Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200">
        <div className="absolute inset-0 bg-gradient-to-tl from-white/30 via-transparent to-blue-200/40"></div>
        
        {/* Elegant Floating Elements */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-300/20 to-lavender-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-teal-200/25 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-200/15 to-blue-100/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_70%)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-1000">
          {/* Premium Glass Card */}
          <div className="backdrop-blur-xl bg-white/80 border border-blue-200/50 rounded-3xl shadow-2xl shadow-blue-500/10 p-8 transition-all duration-300 hover:bg-white/85 hover:shadow-blue-500/15">
            
            {/* Back Button */}
            <div className="mb-6">
              <Link 
                href="/" 
                className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25">
                <User className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-700 bg-clip-text text-transparent mb-2">Create Account</h1>
              <p className="text-slate-600">Join TrueClaim and transform your claims process</p>
            </div>

            {/* Alerts */}
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-800 animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="mb-6 bg-emerald-50 border-emerald-200 text-emerald-800 animate-in slide-in-from-top-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selector */}
              <div className="space-y-4">
                <Label className="text-slate-700 font-semibold">Choose your role</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label 
                    className={`relative cursor-pointer transition-all duration-300 ${
                      role === "policyholder" 
                        ? "transform scale-105" 
                        : "hover:scale-102"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="policyholder"
                      checked={role === "policyholder"}
                      onChange={() => setRole("policyholder")}
                      className="sr-only"
                    />
                    <div 
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                        role === "policyholder"
                          ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-md shadow-blue-500/20"
                          : "bg-white/70 border-slate-200 hover:bg-blue-50/50 hover:border-blue-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg transition-colors ${
                          role === "policyholder" 
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm" 
                            : "bg-slate-100"
                        }`}>
                          <Shield className={`h-5 w-5 ${
                            role === "policyholder" ? "text-white" : "text-slate-600"
                          }`} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">Policy Holder</div>
                          <div className="text-sm text-slate-600">File and track claims</div>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label 
                    className={`relative cursor-pointer transition-all duration-300 ${
                      role === "agent" 
                        ? "transform scale-105" 
                        : "hover:scale-102"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="agent"
                      checked={role === "agent"}
                      onChange={() => setRole("agent")}
                      className="sr-only"
                    />
                    <div 
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                        role === "agent"
                          ? "bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-300 shadow-md shadow-teal-500/20"
                          : "bg-white/70 border-slate-200 hover:bg-teal-50/50 hover:border-teal-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg transition-colors ${
                          role === "agent" 
                            ? "bg-gradient-to-br from-teal-500 to-cyan-600 shadow-sm" 
                            : "bg-slate-100"
                        }`}>
                          <Users className={`h-5 w-5 ${
                            role === "agent" ? "text-white" : "text-slate-600"
                          }`} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">Insurance Agent</div>
                          <div className="text-sm text-slate-600">Manage client claims</div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="relative group">
                  <Label htmlFor="fullName" className="text-slate-700 font-medium">Full Name</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="pl-10 bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10 bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <Label htmlFor="confirm-password" className="text-slate-700 font-medium">Confirm Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10 bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white border-0 py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                disabled={isLoading || authLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
