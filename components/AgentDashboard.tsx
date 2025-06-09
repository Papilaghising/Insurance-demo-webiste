import React, { useState, useEffect } from "react"
import { UserCircle, LogOut, Users, FileText, ShieldCheck } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"

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
      claims: "/api/agent/allclaims",
    }

    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }

      const res = await fetch(endpoints[type], {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        credentials: "include",
      })

      if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`)

      const data = await res.json()
      if (type === "policyholders") setPolicyholders(data)
      else if (type === "policies") setPolicies(data)
      else if (type === "claims") setClaims(data)
    } catch (err) {
      setError("Failed to load data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(activeTab)
  }, [activeTab])

  const renderTable = (data: any[]) => {
    if (!data.length) return <p className="text-gray-500 italic">No records found.</p>

    return (
      <div className="overflow-auto border rounded-lg shadow-md bg-white">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="sticky top-0 bg-gray-100 text-xs uppercase font-semibold text-gray-600 border-b">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="px-4 py-3 text-left whitespace-nowrap">
                  {key.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="even:bg-gray-50 hover:bg-blue-50 transition">
                {Object.entries(row).map(([_, val], i) => (
                  <td key={i} className="px-4 py-3 whitespace-nowrap">
                    {Array.isArray(val) ? val.join(", ") : String(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const tabButtons = [
    { key: "policyholders", label: "Policyholders", icon: <Users className="w-4 h-4 mr-2" /> },
    { key: "policies", label: "Policies Sold", icon: <FileText className="w-4 h-4 mr-2" /> },
    { key: "claims", label: "Claims", icon: <ShieldCheck className="w-4 h-4 mr-2" /> },
  ] as const

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col px-6 py-8 space-y-6 shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight">Agent Dashboard</h1>
        <nav className="flex-1 space-y-2">
          {tabButtons.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${
                activeTab === key ? "bg-blue-700 font-semibold" : "hover:bg-blue-800"
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-blue-700 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCircle className="w-6 h-6" />
            <span>{user?.name || "Agent"}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-red-300 hover:text-red-100 transition w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-sm text-gray-500">Policyholders</h3>
            <p className="text-2xl font-bold text-blue-800">{policyholders.length}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-sm text-gray-500">Policies</h3>
            <p className="text-2xl font-bold text-blue-800">{policies.length}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-sm text-gray-500">Claims</h3>
            <p className="text-2xl font-bold text-blue-800">{claims.length}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold capitalize text-gray-700">{activeTab}</h3>
          <button
            onClick={() => fetchData(activeTab)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow disabled:opacity-50"
            disabled={loading}
          >
            {loading ? `Loading ${activeTab}...` : `Reload ${activeTab}`}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === "policyholders" && renderTable(policyholders)}
            {activeTab === "policies" && renderTable(policies)}
            {activeTab === "claims" && renderTable(claims)}
          </>
        )}
      </main>
    </div>
  )
}
