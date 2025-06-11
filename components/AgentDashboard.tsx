'use client'

import React, { useState, useEffect } from "react"
import { UserCircle, LogOut, Users, FileText, ShieldCheck, AlertTriangle, CheckCircle, Clock, Info } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/lib/supabase"

interface User {
  name: string
}

interface Claim {
  claim_id: string;
  claim_type: string;
  claim_amount: number;
  date_of_incident: string;
  created_at: string;
  public_status: string;
  fraud_risk_score?: number;
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
  key_findings?: string | string[];
  full_name: string;
  email: string;
  recommendation?: 'APPROVE' | 'REJECT' | 'REVIEW';
}

// Add this helper function after the interface declarations
const parseKeyFindings = (findings: string | string[] | undefined): string[] => {
  if (!findings) return [];
  if (Array.isArray(findings)) return findings;
  try {
    // Try parsing if it's a JSON string
    const parsed = JSON.parse(findings);
    return Array.isArray(parsed) ? parsed : [findings];
  } catch {
    // If it's a plain string, split by newlines or commas
    return findings.split(/[,\n]/).map(f => f.trim()).filter(f => f.length > 0);
  }
};

// Helper function for consistent date formatting
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function AgentDashboard({ user }: { user: User }) {
  const [mounted, setMounted] = useState(false);
  const [policyholders, setPolicyholders] = useState<any[]>([])
  const [policies, setPolicies] = useState<any[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [selectedType, setSelectedType] = useState<string>("All Types")
  const [selectedClaimant, setSelectedClaimant] = useState<string>("All Claimants")
  const [activeTab, setActiveTab] = useState<"policyholders" | "policies" | "claims">("claims")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signOut } = useAuth()
  const router = useRouter()

  // Add useEffect for client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const getStatusBadgeClasses = (status?: string): string => {
    if (!status) return "bg-gray-100 text-gray-800"
    
    const styles: Record<string, string> = {
      SUBMITTED: "bg-blue-100 text-blue-800",
      IN_REVIEW: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    }
    return styles[status.toUpperCase()] || "bg-gray-100 text-gray-800"
  }

  const getRiskLevelBadgeClasses = (level?: string): string => {
    const styles: Record<string, string> = {
      LOW: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HIGH: "bg-red-100 text-red-800",
    }
    return level ? styles[level] || "bg-gray-100 text-gray-800" : "bg-gray-100 text-gray-800"
  }

  const getRecommendationBadgeClasses = (recommendation?: string): string => {
    const styles: Record<string, string> = {
      APPROVE: "bg-green-100 text-green-800",
      REJECT: "bg-red-100 text-red-800",
      REVIEW: "bg-yellow-100 text-yellow-800"
    }
    return recommendation ? styles[recommendation] || "bg-gray-100 text-gray-800" : "bg-gray-100 text-gray-800"
  }

  const renderClaimsTable = (claims: Claim[]) => {
    if (!claims.length) return <p className="text-gray-500 italic">No claims found.</p>

    // Get unique claim types and claimant names for filters
    const claimTypes = ["All Types", ...Array.from(new Set(claims.map(claim => claim.claim_type)))]
    const claimants = ["All Claimants", ...Array.from(new Set(claims.map(claim => claim.full_name)))]

    // Filter claims based on selected type and claimant
    const filteredClaims = claims.filter(claim => {
      const matchesType = selectedType === "All Types" || claim.claim_type === selectedType
      const matchesClaimant = selectedClaimant === "All Claimants" || claim.full_name === selectedClaimant
      return matchesType && matchesClaimant
    })

    return (
      <>
        <div className="mb-4 flex gap-4">
          {/* Type Filter */}
          <div className="flex-1">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {claimTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          {/* Claimant Filter */}
          <div className="flex-1">
            <select
              value={selectedClaimant}
              onChange={(e) => setSelectedClaimant(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {claimants.map((claimant) => (
                <option key={claimant} value={claimant}>
                  {claimant}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-auto rounded-lg shadow-lg border border-gray-200">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Claim ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Claimant</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Risk Level</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Recommendation</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Key Findings</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Submitted</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClaims.map((claim) => (
                <tr key={claim.claim_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm text-blue-600">{claim.claim_id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{claim.full_name}</div>
                      <div className="text-gray-500 text-xs">{claim.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {claim.claim_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ${claim.claim_amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(claim.public_status)}`}>
                      {claim.public_status?.replace("_", " ") || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelBadgeClasses(claim.risk_level)}`}>
                      {claim.risk_level || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationBadgeClasses(claim.recommendation)}`}>
                      {claim.recommendation || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {(() => {
                      const findings = parseKeyFindings(claim.key_findings);
                      return findings.length > 0 ? (
                        <div className="relative group">
                          <button className="p-1 hover:bg-gray-100 rounded-full">
                            <Info className="w-5 h-5 text-gray-500" />
                          </button>
                          <div className="hidden group-hover:block absolute z-10 w-72 p-4 bg-white rounded-lg shadow-lg border border-gray-200 left-0 top-full mt-1">
                            <h4 className="font-medium text-gray-900 mb-2">Key Findings</h4>
                            <ul className="space-y-1">
                              {findings.map((finding, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-1.5"></span>
                                  <span>{finding}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No findings</span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {mounted ? formatDate(claim.created_at) : ''}
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => {}} 
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )
  }

  const renderPolicyholdersTable = (data: any[]) => {
    if (!data.length) return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No policyholders found</p>
        <p className="text-gray-400 text-sm">Policyholders will appear here once they are added to the system.</p>
      </div>
    )

    return (
      <div className="overflow-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Phone</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Policy Count</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Join Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((policyholder, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="font-medium text-blue-800">
                        {policyholder.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{policyholder.name}</div>
                      <div className="text-gray-500 text-xs">ID: {policyholder.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{policyholder.email}</td>
                <td className="px-4 py-3 text-gray-600">{policyholder.phone || 'N/A'}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {policyholder.policy_count || 0} policies
                  </span>
                </td>y
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    policyholder.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    policyholder.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {policyholder.status || 'Unknown'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-sm">
                  {mounted && policyholder.join_date ? formatDate(policyholder.join_date) : ''}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {}} 
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => {}} 
                      className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                    >
                      View Policies
                    </button>
                  </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const tabButtons = [
    { key: "claims", label: "Claims", icon: <ShieldCheck className="w-4 h-4" /> },
    { key: "policyholders", label: "Policyholders", icon: <Users className="w-4 h-4" /> },
    { key: "policies", label: "Policies", icon: <FileText className="w-4 h-4" /> },
  ] as const

  const getClaimStats = () => {
    const highRiskClaims = claims.filter(c => c.risk_level === 'HIGH').length
    const pendingClaims = claims.filter(c => c.public_status === 'SUBMITTED').length
    const totalAmount = claims.reduce((sum, c) => sum + c.claim_amount, 0)
    
    return { highRiskClaims, pendingClaims, totalAmount }
  }

  const { highRiskClaims, pendingClaims, totalAmount } = getClaimStats()

  // If not mounted yet, show a loading state or nothing
  if (!mounted) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col px-6 py-8 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-800 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Agent Portal</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {tabButtons.map(({ key, label, icon }) => (
          <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === key 
                  ? "bg-white text-blue-900 font-medium shadow-sm" 
                  : "text-blue-100 hover:bg-blue-800"
              }`}
            >
              <span className="mr-3">{icon}</span>
              {label}
          </button>
          ))}
        </nav>

        <div className="border-t border-blue-800 pt-6">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="p-2 bg-blue-800 rounded-full">
              <UserCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium">{user?.name || "Agent"}</div>
              <div className="text-sm text-blue-300">Insurance Agent</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-300 hover:text-white transition w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* High Risk Claims Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">High Risk Claims</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">{highRiskClaims}</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Claims requiring immediate attention
                </p>
              </div>

              {/* Pending Claims Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending Claims</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingClaims}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Claims awaiting review
                </p>
        </div>

              {/* Total Claims Amount Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Claims Value</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      ${totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Total value of all claims
                </p>
          </div>
          </div>
        </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeTab === "claims" ? "Recent Claims" :
                 activeTab === "policyholders" ? "Active Policyholders" :
                 "Active Policies"}
              </h3>
            <button
              onClick={() => fetchData(activeTab)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Refresh
            </button>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {activeTab === "claims" && renderClaimsTable(claims)}
                {activeTab === "policyholders" && renderPolicyholdersTable(policyholders)}
                {activeTab === "policies" && renderPolicyholdersTable(policies)}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
