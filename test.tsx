import React, { useState } from "react"
import { UserCircle } from "lucide-react"
import Link from "next/link"

export default function PolicyholderDashboard({ user }: { user: any }) {
  const [policies, setPolicies] = useState<any[]>([])
  const [claims, setClaims] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [about, setAbout] = useState<any[]>([])
  const [help, setHelp] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("policies")

  const fetchData = async (type: string) => {
    const endpoints: Record<string, string> = {
      policies: "/api/mypolicies",
      claims: "/api/myclaims",
      payments: "/api/mypayments",
      documents: "/api/mydocuments",
      about: "/api/myprofile",
      help: "/api/support"
    }

    if (!(type in endpoints)) {
      console.error("Invalid data type requested:", type)
      return
    }

    const res = await fetch(endpoints[type])
    if (!res.ok) {
      console.error("Failed to fetch:", res.status, res.statusText)
      return
    }

    const data = await res.json()

    switch (type) {
      case "policies":
        setPolicies(data)
        break
      case "claims":
        setClaims(data)
        break
      case "payments":
        setPayments(data)
        break
      case "documents":
        setDocuments(data)
        break
      case "about":
        setAbout(data)
        break
      case "help":
        setHelp(data)
        break
    }
  }

  const renderTable = (data: any[]) => {
    if (!data.length) return <p className="text-gray-500">No data found.</p>
    return (
      <div className="overflow-auto border rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
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
      <aside className="w-64 bg-green-900 text-white flex flex-col px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
        <nav className="space-y-4">
          <button className="block w-full text-left" onClick={() => setActiveTab("policies")}>My Policies</button>
          <button className="block w-full text-left" onClick={() => setActiveTab("claims")}>My Claims</button>
          <button className="block w-full text-left" onClick={() => setActiveTab("payments")}>My Premium Payments</button>
          <button className="block w-full text-left" onClick={() => setActiveTab("documents")}>My Documents</button>
          <button className="block w-full text-left" onClick={() => setActiveTab("about")}>About Me</button>
          <button className="block w-full text-left" onClick={() => setActiveTab("help")}>Help & Support</button>
        </nav>
        <div className="mt-auto pt-6 border-t border-green-700">
          <div className="flex items-center gap-2">
            <UserCircle className="w-6 h-6" />
            <span>{user?.name ?? "Policyholder"}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Welcome, {user?.name ?? "User"}</h2>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700 capitalize">{activeTab}</h3>
            <button
              onClick={() => fetchData(activeTab)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Load {activeTab}
            </button>
          </div>

          {/* Render based on active tab */}
          {activeTab === "policies" && renderTable(policies)}
          {activeTab === "claims" && renderTable(claims)}
          {activeTab === "payments" && renderTable(payments)}
          {activeTab === "documents" && renderTable(documents)}
          {activeTab === "about" && renderTable(about)}
          {activeTab === "help" && renderTable(help)}
        </div>
      </main>
    </div>
  )
}
