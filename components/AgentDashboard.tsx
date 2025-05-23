import React from "react"
import Link from "next/link"

export default function AgentDashboard({ user }: { user: any }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Agent Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">All Policyholders</h2>
        {/* TODO: List all policyholders (fetch from backend) */}
        <div className="bg-blue-50 p-4 rounded mb-4">[Policyholder list placeholder]</div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Policies Sold</h2>
        {/* TODO: List policies sold by this agent */}
        <div className="bg-blue-50 p-4 rounded mb-4">[Policies sold placeholder]</div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Claim Documents</h2>
        {/* TODO: List claim documents of policyholders */}
        <div className="bg-blue-50 p-4 rounded mb-4">[Claim documents placeholder]</div>
      </div>
    </div>
  )
}
