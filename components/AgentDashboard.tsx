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
    const res = await fetch("/api/soldpolicies") // Update this with your backend endpoint for policies
    const data = await res.json()
    setPolicies(data)
  }

  const fetchClaims = async () => {
    const res = await fetch("/api/claimsdoc") // Update this with your backend endpoint for claims
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
        {policyholders.length > 0 && (
          <table className="min-w-full bg-white border mt-4">
            <thead>
              <tr>
                {Object.keys(policyholders[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 text-left text-xs text-gray-700">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {policyholders.map((ph, idx) => (
                <tr key={idx}>
                  {Object.values(ph).map((val, i) => (
                    <td key={i} className="border px-2 py-1 text-xs">{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Policies Sold</h2>
        <button onClick={fetchPolicies} className="bg-blue-600 text-white px-4 py-2 rounded mb-2">
          Load Policies
        </button>
        {policies.length > 0 && (
          <table className="min-w-full bg-white border mt-4">
            <thead>
              <tr>
                {Object.keys(policies[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 text-left text-xs text-gray-700">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {policies.map((policy, idx) => (
                <tr key={idx}>
                  {Object.values(policy).map((val, i) => (
                    <td key={i} className="border px-2 py-1 text-xs">{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Claim Documents</h2>
        <button onClick={fetchClaims} className="bg-blue-600 text-white px-4 py-2 rounded mb-2">
          Load Claims
        </button>
        {claims.length > 0 && (
          <table className="min-w-full bg-white border mt-4">
            <thead>
              <tr>
                {Object.keys(claims[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 text-left text-xs text-gray-700">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {claims.map((claim, idx) => (
                <tr key={idx}>
                  {Object.values(claim).map((val, i) => (
                    <td key={i} className="border px-2 py-1 text-xs">{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}