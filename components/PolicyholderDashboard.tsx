import React, { useEffect, useState } from "react";
import { UserCircle, LogOut, FileText, CreditCard, BarChart2, HelpCircle, User, Plus, Calendar, MapPin, DollarSign, AlertTriangle, Clock, Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

interface Claim {
  claim_id: string;
  claim_type: string;
  claim_amount: number;
  date_of_incident: string;
  incident_description: string;
  public_status: string;
  created_at: string;
  incident_location?: string;
  risk_level?: string;
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

type StatusKey = 'total' | 'submitted' | 'in_review' | 'approved' | 'rejected';

type DataMap = {
  [key: string]: any[] | StatusSummary;
};

export default function PolicyholderDashboard({ user }: { user: any }) {
  const [dataMap, setDataMap] = useState<DataMap>({});
  const [activeTab, setActiveTab] = useState<string>("claims");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  const fetchData = async (type: string) => {
    try {
      setLoading(true);
      setError(null);

      const endpoints: Record<string, string> = {
        policies: "/api/policyholder/mypolicies",
        claims: "/api/policyholder/myclaims",
        payments: "/api/policyholder/mypayments",
        status: "/api/policyholder/mystatus",
        about: "/api/policyholder/profile/display",
        help: "/api/support",
      };

      if (!(type in endpoints)) {
        setError("Invalid data type requested.");
        return;
      }

      const supabase = getSupabase();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const res = await fetch(endpoints[type], {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        await res.json().catch(() => ({}));
        setError("Failed to fetch data.");
        return;
      }

      const data = await res.json();
      setDataMap((prev) => ({ ...prev, [type]: data }));
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const getStatusBadgeClasses = (status: string): string => {
    const styles: Record<string, string> = {
      APPROVED: "bg-green-100 text-green-800",
      IN_REVIEW: "bg-yellow-100 text-yellow-800",
      SUBMITTED: "bg-blue-100 text-blue-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return styles[status.toUpperCase()] || "bg-gray-100 text-gray-800";
  };

  const renderClaimsTable = (claims: Claim[]) => {
    if (!claims.length) {
      return <p className="text-gray-500">No claims found.</p>;
    }

    const uniqueTypes = Array.from(new Set(claims.map(claim => claim.claim_type)));
    const filteredClaims = selectedType 
      ? claims.filter(claim => claim.claim_type === selectedType)
      : claims;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-40 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button
            onClick={() => router.push('/dashboard/claims/submit')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + Submit New Claim
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-[#0288d1] text-white text-left text-sm">
                  <th className="px-4 py-3 w-[200px] font-medium">CLAIM ID</th>
                  <th className="px-4 py-3 w-[120px] font-medium">TYPE</th>
                  <th className="px-4 py-3 w-[100px] font-medium">DATE</th>
                  <th className="px-4 py-3 w-[100px] font-medium">AMOUNT</th>
                  <th className="px-4 py-3 w-[100px] font-medium">STATUS</th>
                  <th className="px-4 py-3 font-medium">DESCRIPTION</th>
                  <th className="px-4 py-3 w-[150px] font-medium">LOCATION</th>
                  <th className="px-4 py-3 w-[80px] font-medium">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredClaims.map((claim, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-blue-600">{claim.claim_id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                        {claim.claim_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(claim.date_of_incident).toLocaleDateString(undefined, {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-green-600 font-medium">
                        ${claim.claim_amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs rounded ${getStatusBadgeClasses(claim.public_status)}`}>
                        {claim.public_status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600 line-clamp-1" title={claim.incident_description}>
                        {claim.incident_description}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600 line-clamp-1" title={claim.incident_location}>
                        {claim.incident_location}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderStatusTable = (claims: Claim[]) => {
    if (!claims.length) {
      return <p className="text-gray-500">No claims found.</p>;
    }

    return (
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              {["Claim ID", "Type", "Submitted Date", "Amount", "Status", "Risk Level", "Action"].map((col) => (
                <th key={col} className="px-6 py-3 font-semibold uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {claims.map((claim, idx) => (
              <tr key={idx} className="hover:bg-blue-50 transition">
                <td className="px-6 py-3 font-mono text-blue-700">{claim.claim_id}</td>
                <td className="px-6 py-3">
                  <span className="px-2 py-1 rounded bg-blue-200 text-blue-800 text-xs font-medium">
                    {claim.claim_type}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-700">
                  {new Date(claim.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-3 text-green-700 font-semibold text-lg">
                  ${claim.claim_amount.toLocaleString()}
                </td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClasses(claim.public_status)}`}>
                    {claim.public_status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-3">
                  {claim.risk_level && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      claim.risk_level === 'HIGH' ? 'bg-red-100 text-red-800' :
                      claim.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {claim.risk_level}
                    </span>
                  )}
                </td>
                <td className="px-6 py-3">
                  <button className="text-blue-600 hover:underline text-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const dataToRender =
    activeTab === "status"
      ? ((dataMap[activeTab] as StatusSummary)?.claims || [])
      : (dataMap[activeTab] as any[]) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-[#1a1f36] text-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl backdrop-blur-sm mb-8">
            <div className="p-2 bg-white/20 rounded-xl">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">My Dashboard</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {["policies", "claims", "payments", "status", "about", "help"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-blue-900 shadow-lg shadow-blue-900/20 font-medium"
                    : "text-blue-100 hover:bg-white/10"
                }`}
              >
                <span className="capitalize">{tab.replace("_", " ")}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize mb-1">{activeTab.replace("_", " ")}</h2>
              <p className="text-gray-500">
                {activeTab === "claims" && "Manage and track your insurance claims"}
                {activeTab === "policies" && "View and manage your active insurance policies"}
                {activeTab === "payments" && "Track your payments and billing history"}
                {activeTab === "status" && "Monitor the status of your submitted claims"}
                {activeTab === "about" && "View and update your profile information"}
                {activeTab === "help" && "Get help and support with your insurance"}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === "claims" && renderClaimsTable(dataToRender)}
              {activeTab === "status" && renderStatusTable(dataToRender)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
