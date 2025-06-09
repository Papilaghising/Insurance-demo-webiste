import React, { useEffect, useState } from "react"
import { UserCircle, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"

interface Claim {
  claim_id: string;
  claim_type: string;
  claim_amount: number;
  date_of_incident: string;
  incident_description: string;
  public_status: string;
  created_at: string;
}

interface StatusSummary {
  total: number;
  submitted: number;
  in_review: number;
  approved: number;
  rejected: number;
  total_amount: number;
  claims: Claim[];
}

type DataMap = {
  [key: string]: any[] | StatusSummary;
}

export default function PolicyholderDashboard({ user }: { user: any }) {
  const [dataMap, setDataMap] = useState<DataMap>({})
  const [activeTab, setActiveTab] = useState("policies")
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
    try {
      setLoading(true)
      setError(null)

      const endpoints: Record<string, string> = {
        policies: "/api/policyholder/mypolicies",
        claims: "/api/policyholder/myclaims",
        payments: "/api/policyholder/mypayments",
        status: "/api/policyholder/mystatus",
        about: "/api/policyholder/profile/display",
        help: "/api/support"
      }

      if (!(type in endpoints)) {
        setError("Invalid data type requested.")
        return
      }

      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      const res = await fetch(endpoints[type], {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        credentials: 'include'
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        setError("Failed to fetch data.")
        return
      }

      const data = await res.json()
      setDataMap((prev) => ({ ...prev, [type]: data }))
    } catch (error) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(activeTab)
  }, [activeTab])

  const renderTable = (data: any[]) => {
    if (!data.length) return <p className="text-gray-500">No data found.</p>
    return (
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="px-6 py-3 font-semibold uppercase tracking-wider">
                  {key.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 border-t">
                {Object.entries(row).map(([key, val], i) => (
                  <td key={i} className="px-6 py-3 text-gray-700">
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

  const renderClaimsTable = (claims: any[]) => {
    if (!claims.length) return <p className="text-gray-500">No claims found. Click "Submit a New Claim" to file a claim.</p>
    return (
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider">Claim ID</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim, idx) => (
              <tr key={idx} className="hover:bg-gray-50 border-t">
                <td className="px-6 py-3 font-mono text-blue-700">{claim.claim_id}</td>
                <td className="px-6 py-3">{claim.claim_type}</td>
                <td className="px-6 py-3">{new Date(claim.date_of_incident).toLocaleDateString()}</td>
                <td className="px-6 py-3">{new Intl.NumberFormat().format(claim.claim_amount)}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    claim.public_status === 'SUBMITTED' ? 'bg-blue-200 text-blue-800' :
                    claim.public_status === 'IN_REVIEW' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {claim.public_status?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className="block truncate max-w-xs" title={claim.incident_description}>
                    {claim.incident_description}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const dataToRender = activeTab === "status" && (dataMap[activeTab] as StatusSummary)?.claims 
    ? (dataMap[activeTab] as StatusSummary).claims 
    : (dataMap[activeTab] as any[]) || []

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-blue-900 text-white flex flex-col px-6 py-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-8">My Dashboard</h1>
        <nav className="space-y-3">
          {['policies', 'claims', 'payments', 'status', 'about', 'help'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left capitalize px-3 py-2 rounded-md transition ${
                activeTab === tab ? 'bg-white text-blue-900 font-semibold' : 'hover:bg-blue-800'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-blue-800">
          <div className="flex items-center gap-3 mb-4">
            <UserCircle className="w-6 h-6" />
            <span>{user?.name ?? "Policyholder"}</span>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-300 hover:text-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome, {user?.name ?? "User"}</h2>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-700 capitalize">{activeTab}</h3>
          <div className="space-x-3">
            <button
              onClick={() => fetchData(activeTab)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Refresh {activeTab}
            </button>
            {activeTab === "claims" && (
              <Link href="/dashboard/claims/submit">
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Submit a New Claim
                </button>
              </Link>
            )}
            {activeTab === "about" && (
              <Link href="/dashboard/profile/edit">
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
                  Edit Profile
                </button>
              </Link>
            )}
          </div>
        </div>

        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div>
            {activeTab === "claims" ? renderClaimsTable(dataToRender) : renderTable(dataToRender)}
          </div>
        )}
      </main>
    </div>
  )
}