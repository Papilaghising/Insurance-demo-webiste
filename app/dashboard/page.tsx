"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

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

  if (!user) {
    return null
  }

  // Check for agent or admin approval
  const userRole = user.user_metadata?.role || user.role;
  const isApproved = user.user_metadata?.is_approved;
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
    );
  }

  // Define privileges
  const isAgent = userRole === "agent" || userRole === "admin";
  const isPolicyHolder = userRole === "policy_holder" || userRole === "policyholder";

  // If policy holder, show only front page
  if (isPolicyHolder) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Welcome, Policy Holder!</h1>
          <p className="text-blue-600 mb-6">
            You can view your profile, policies, and claims from the navigation above.
          </p>
          <div className="flex flex-col gap-4 mt-6">
            <Link href="/dashboard/profile" className="text-blue-700 hover:underline font-medium">Go to Profile</Link>
            <Link href="/dashboard/policies" className="text-blue-700 hover:underline font-medium">View Policies</Link>
            <Link href="/dashboard/claims" className="text-blue-700 hover:underline font-medium">View Claims</Link>
          </div>
          <Button onClick={handleSignOut} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white w-full">Sign Out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="sticky top-0 z-50 w-full border-b border-blue-400/30 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 backdrop-blur-md shadow-[0_0_20px_rgba(37,99,235,0.5)]">
        <div className="container flex h-24 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-[0_0_30px_rgba(255,255,255,0.5)] glow-blue-animate">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A__2_-removebg-preview-ZabQoiu2niiPHLJlKWKnvBDhqIBgyh.png"
                alt="TrueClaim Logo"
                className="h-20 w-auto drop-shadow-[0_0_15px_rgba(37,99,235,0.6)]"
              />
            </div>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link
              href="/dashboard"
              className="text-lg font-medium text-white hover:text-blue-200 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 after:glow-white"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/claims"
              className="text-lg font-medium text-white hover:text-blue-200 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 after:glow-white"
            >
              My Claims
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-lg font-medium text-white hover:text-blue-200 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 after:glow-white"
            >
              Profile
            </Link>
            <Link
              href="/dashboard/policies"
              className="text-lg font-medium text-white hover:text-blue-200 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 after:glow-white"
            >
              Policies
            </Link>
            {isAgent && (
              <>
                <Link
                  href="/dashboard/notifications"
                  className="text-lg font-medium text-white hover:text-blue-200 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 after:glow-white"
                >
                  Notifications
                </Link>
                <Link
                  href="/dashboard/documents"
                  className="text-lg font-medium text-white hover:text-blue-200 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300 after:glow-white"
                >
                  Documents
                </Link>
              </>
            )}
          </nav>
          <div className="flex gap-4">
            <Button
              onClick={handleSignOut}
              className="border-white/70 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 text-base px-6 py-6 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-300"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {error && (
          <div className="mb-6 rounded-md border border-red-400 bg-red-100 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-6">Welcome to Your Dashboard</h1>

          <div className="mb-8">
            <p className="text-blue-600 mb-2">
              Signed in as: <span className="font-semibold">{user.email}</span>
            </p>
            <p className="text-blue-600">User ID: {user.id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Active Claims</h2>
              <p className="text-3xl font-bold text-blue-800">0</p>
              <Link href="/dashboard/claims/new" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                Submit a new claim →
              </Link>
            </div>

            {(isAgent || isPolicyHolder) && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">Policies</h2>
                <p className="text-3xl font-bold text-blue-800">0</p>
                <Link href="/dashboard/policies" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                  View policies →
                </Link>
              </div>
            )}

            {isAgent && (
              <>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-blue-700 mb-4">Notifications</h2>
                  <p className="text-3xl font-bold text-blue-800">0</p>
                  <Link href="/dashboard/notifications" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                    View all notifications →
                  </Link>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-blue-700 mb-4">Documents</h2>
                  <p className="text-3xl font-bold text-blue-800">0</p>
                  <Link href="/dashboard/documents" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                    Upload documents →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}