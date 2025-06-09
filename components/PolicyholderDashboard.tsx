import React, { useEffect, useState } from "react";
import { UserCircle, LogOut } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<string>("policies");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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
      SUBMITTED: "bg-blue-100 text-blue-800",
      IN_REVIEW: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return styles[status.toUpperCase()] || "bg-gray-100 text-gray-800";
  };

  const renderClaimsTable = (claims: Claim[]) => {
    if (!claims.length) {
      return <p className="text-gray-500">No claims found.</p>;
    }

    return (
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              {["Claim ID", "Type", "Date", "Amount", "Status", "Description", "Location", "Action"].map((col) => (
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
                  {new Date(claim.date_of_incident).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-3 text-green-700 font-semibold text-lg">
                  ${claim.claim_amount.toLocaleString()}
                </td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClasses(claim.public_status)}`}>
                    {claim.public_status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-3 max-w-xs truncate" title={claim.incident_description}>
                  {claim.incident_description}
                </td>
                <td className="px-6 py-3 max-w-xs truncate" title={claim.incident_location}>
                  {claim.incident_location}
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
                  {new Date(claim.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-blue-900 text-white flex flex-col px-6 py-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-8">My Dashboard</h1>
        <nav className="space-y-3">
          {["policies", "claims", "payments", "status", "about", "help"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left capitalize px-3 py-2 rounded-md transition font-medium ${
                activeTab === tab
                  ? "bg-white text-blue-900 shadow-inner"
                  : "hover:bg-blue-800"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-blue-800">
          <div className="flex items-center gap-3 mb-4">
            <UserCircle className="w-6 h-6" />
            <span className="text-sm font-medium">{user?.name ?? "Policyholder"}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-300 hover:text-red-100 text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-900 capitalize">{activeTab.replace("_", " ")}</h2>
          {activeTab === "claims" && (
            <button
              onClick={() => router.push('/dashboard/claims/submit')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Submit New Claim
            </button>
          )}
        </div>
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && activeTab === "status" && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {(["total", "submitted", "in_review", "approved", "rejected"] as StatusKey[]).map((key) => (
                <div
                  key={key}
                  className="bg-white rounded-lg shadow p-4 text-center space-y-1"
                >
                  <div className="text-xs uppercase text-gray-500 font-medium">
                    {key.replace(/_/g, " ")}
                  </div>
                  <div className="text-2xl text-blue-900 font-bold">
                    {(dataMap[activeTab] as StatusSummary)?.[key] || 0}
                  </div>
                </div>
              ))}
              <div className="bg-white rounded-lg shadow p-4 text-center space-y-1">
                <div className="text-xs uppercase text-gray-500 font-medium">Total Amount</div>
                <div className="text-2xl text-green-700 font-bold">
                  ${((dataMap[activeTab] as StatusSummary)?.total_amount || 0).toLocaleString()}
                </div>
              </div>
            </div>
            {renderStatusTable(dataToRender)}
          </>
        )}
        {!loading && !error && activeTab !== "status" && (
          <>
            {activeTab === "claims" && dataToRender.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven't submitted any claims yet.</p>
                <button
                  onClick={() => router.push('/dashboard/claims/submit')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Submit Your First Claim
                </button>
              </div>
            )}
            {renderClaimsTable(dataToRender)}
          </>
        )}
      </main>
    </div>
  );
}