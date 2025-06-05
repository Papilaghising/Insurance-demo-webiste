import React, { useState, useEffect } from "react"
import { UserCircle, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface User {
  name: string
}

export default function AgentDashboard({ user }: { user: User }) {
  const [policyholders, setPolicyholders] = useState<any[]>([])
  const [policies, setPolicies] = useState<any[]>([])
  const [claims, setClaims] = useState<any[]>([])

  const [activeTab, setActiveTab] = useState<"policyholders" | "policies" | "claims">("policyholders")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (err) {
      console.error("Failed to sign out:", err)
    }
  }

  const fetchData = async (type: string) => {
    setLoading(true)
    setError(null)

    const endpoints: Record<string, string> = {
      policyholders: "/api/agent/policyholders",
      policies: "/api/agent/soldpolicies",
      claims: "/api/agent/claimsdoc",
    }

    if (!(type in endpoints)) {
      setError("Invalid data type requested.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(endpoints[type])
      if (!res.ok) {
        setError(`Failed to fetch data: ${res.status} ${res.statusText}`)
        setLoading(false)
        return
      }
      const data = await res.json()

      if (type === "policyholders") setPolicyholders(data)
      else if (type === "policies") setPolicies(data)
      else if (type === "claims") setClaims(data)
    } catch (err) {
      setError("Network error occurred.")
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch data when active tab changes
  useEffect(() => {
    fetchData(activeTab)
  }, [activeTab])

  const renderTable = (data: any[]) => {
    if (loading) return <p>Loading {activeTab}...</p>
    if (error) return <p className="text-red-600">{error}</p>
    if (!data.length) return <p>No {activeTab} found.</p>

    return (
      <div className="overflow-auto border rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th
                  key={key}
                  className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-left"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {Object.values(row).map((val, i) => (
                  <td key={i} className="px-4 py-2 text-sm text-gray-700">
                    {String(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Agent Panel</h1>
        <nav className="space-y-4" aria-label="Sidebar navigation">
          <button
            type="button"
            aria-current={activeTab === "policyholders" ? "page" : undefined}
            className={`block w-full text-left px-2 py-1 rounded ${
              activeTab === "policyholders" ? "font-bold bg-blue-700" : "hover:bg-blue-800"
            }`}
            onClick={() => setActiveTab("policyholders")}
          >
            Policyholders
          </button>
          <button
            type="button"
            aria-current={activeTab === "policies" ? "page" : undefined}
            className={`block w-full text-left px-2 py-1 rounded ${
              activeTab === "policies" ? "font-bold bg-blue-700" : "hover:bg-blue-800"
            }`}
            onClick={() => setActiveTab("policies")}
          >
            Policies Sold
          </button>
          <button
            type="button"
            aria-current={activeTab === "claims" ? "page" : undefined}
            className={`block w-full text-left px-2 py-1 rounded ${
              activeTab === "claims" ? "font-bold bg-blue-700" : "hover:bg-blue-800"
            }`}
            onClick={() => setActiveTab("claims")}
          >
            Claims
          </button>
        </nav>
        <div className="mt-auto pt-6 border-t border-blue-700">
          <div className="flex items-center gap-2 mb-4">
            <UserCircle className="w-6 h-6" />
            <span>{user?.name ?? "Agent"}</span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-300 hover:text-red-100 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Dashboard</h2>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm text-gray-500">Policyholders</h3>
            <p className="text-2xl font-bold">{policyholders.length}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm text-gray-500">Policies</h3>
            <p className="text-2xl font-bold">{policies.length}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm text-gray-500">Claims</h3>
            <p className="text-2xl font-bold">{claims.length}</p>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700 capitalize">{activeTab}</h3>
            <button
              type="button"
              onClick={() => fetchData(activeTab)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? `Loading ${activeTab}...` : `Reload ${activeTab}`}
            </button>
          </div>
          {activeTab === "policyholders" && renderTable(policyholders)}
          {activeTab === "policies" && renderTable(policies)}
          {activeTab === "claims" && renderTable(claims)}
        </div>
      </main>
    </div>
  )
}
