import React, { useState } from "react"

export default function AgentDashboard({ user }: { user: any }) {
  const [policyholders, setPolicyholders] = useState<any[]>([])
  const [policies, setPolicies] = useState<any[]>([])
  const [claims, setClaims] = useState<any[]>([])

  const fetchPolicyholders = async () => {
    const res = await fetch("/api/policyholders") // Update this with your backend endpoint
    const data = await res.json()
    setPolicyholders(data)
  }

  const fetchPolicies = async () => {
    const res = await fetch("/api/policies?soldBy=" + user?.id) // Adjust query as needed
    const data = await res.json()
    setPolicies(data)
  }

  const fetchClaims = async () => {
    const res = await fetch("/api/claims?agentId=" + user?.id) // Adjust query as needed
    const data = await res.json()
    setClaims(data)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Agent Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">All Policyholders</h2>
        <button onClick={fetchPolicyholders} className="bg-blue-600 text-white px-4 py-2 rounded mb-2">
          Load Policyholders
        </button>
        <div className="bg-blue-50 p-4 rounded">
          {policyholders.length === 0 ? (
            <div>[Policyholder list placeholder]</div>
          ) : (
            <ul>
              {policyholders.map((p, i) => (
                <li key={i}>{p.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Policies Sold</h2>
        <button onClick={fetchPolicies} className="bg-blue-600 text-white px-4 py-2 rounded mb-2">
          Load Policies
        </button>
        <div className="bg-blue-50 p-4 rounded">
          {policies.length === 0 ? (
            <div>[Policies sold placeholder]</div>
          ) : (
            <ul>
              {policies.map((p, i) => (
                <li key={i}>{p.policyName}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Claim Documents</h2>
        <button onClick={fetchClaims} className="bg-blue-600 text-white px-4 py-2 rounded mb-2">
          Load Claims
        </button>
        <div className="bg-blue-50 p-4 rounded">
          {claims.length === 0 ? (
            <div>[Claim documents placeholder]</div>
          ) : (
            <ul>
              {claims.map((c, i) => (
                <li key={i}>{c.documentTitle}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}