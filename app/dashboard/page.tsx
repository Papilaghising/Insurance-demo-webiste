"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AgentDashboard from "@/components/AgentDashboard"
import PolicyholderDashboard from "@/components/PolicyholderDashboard"

export default function DashboardPage() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  // Extract role and approval from user metadata
  const userRole = user?.user_metadata?.role || user?.role || "unknown"
  const isApproved = user?.user_metadata?.is_approved
  const userEmail = user?.email || ""

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Supabase environment variables are missing. Please check your configuration.")
    }
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (err) {
      setError("Failed to sign out. Please try again.")
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Pending approval for agent/admin
  if ((userRole === "agent" || userRole === "admin") && isApproved !== true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-blue-800 mb-4">Account Pending Approval</h1>
          <p className="text-blue-600 mb-6">
            Your {userRole} account is awaiting admin approval. You will be notified by email once your account is approved.
          </p>
          <Button onClick={handleSignOut} className="bg-blue-600 hover:bg-blue-700 text-white w-full">Sign Out</Button>
        </div>
      </div>
    )
  }

  // Privilege checks
  const isAgent = userRole === "agent" || userRole === "admin"
  const isPolicyHolder = userRole === "policyholder" || userRole === "policy_holder"

  // Main dashboard
  if (isAgent) {
    return <AgentDashboard user={user} />
  }
  if (isPolicyHolder) {
    return <PolicyholderDashboard user={user} />
  }
  // Fallback for unknown roles
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Unknown Role</h1>
        <p className="text-blue-600 mb-6">
          Your account does not have a recognized role. Please contact support.
        </p>
        <Button onClick={handleSignOut} className="bg-blue-600 hover:bg-blue-700 text-white w-full">Sign Out</Button>
      </div>
    </div>
  )
}