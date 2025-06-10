"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import PolicyholderDashboard from "@/components/PolicyholderDashboard"
import AgentDashboard from "@/components/AgentDashboard"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) return null

  // Get the user's role from metadata
  const userRole = user.user_metadata?.role || 'policyholder'

  // Render appropriate dashboard based on role
  return userRole === 'agent' ? (
    <AgentDashboard user={{...user, name: user.user_metadata?.name || ''}} />
  ) : (
    <PolicyholderDashboard user={{...user, name: user.user_metadata?.name || ''}} />
  )
}
