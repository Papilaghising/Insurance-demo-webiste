import React from "react"
import Link from "next/link"

export default function PolicyholderDashboard({ user }: { user: any }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Policyholder Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Your Profile</h2>
        {/* TODO: Show user profile info */}
        <div className="bg-blue-50 p-4 rounded mb-4">[User profile placeholder]</div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Policies Bought</h2>
        {/* TODO: List policies bought by this user */}
        <div className="bg-blue-50 p-4 rounded mb-4">[Policies bought placeholder]</div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Submit a Claim</h2>
        {/* TODO: Claim submission form */}
        <div className="bg-blue-50 p-4 rounded mb-4">[Claim submission form placeholder]</div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Track Your Claims</h2>
        {/* TODO: Claim tracking section */}
        <div className="bg-blue-50 p-4 rounded mb-4">[Claim tracking placeholder]</div>
      </div>
    </div>
  )
}
