import React, { useEffect, useState } from "react";
import { UserCircle, LogOut, FileText, CreditCard, BarChart2, HelpCircle, User, Plus, Calendar, MapPin, DollarSign, AlertTriangle, Clock, Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown, Eye, Sparkles, TrendingUp, Shield, Activity } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import ProfileDisplay from "@/components/ProfileDisplay"

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
  const [searchTerm, setSearchTerm] = useState<string>("");
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
      APPROVED: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200",
      IN_REVIEW: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200",
      SUBMITTED: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200",
      REJECTED: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200",
    };
    return styles[status.toUpperCase()] || "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200";
  };

  const getRiskLevelClasses = (level: string): string => {
    const styles: Record<string, string> = {
      HIGH: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25",
      MEDIUM: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25",
      LOW: "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25",
    };
    return styles[level] || "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
  };

  const getTabIcon = (tab: string) => {
    const icons: Record<string, React.ReactNode> = {
      policies: <Shield className="w-5 h-5" />,
      claims: <FileText className="w-5 h-5" />,
      payments: <CreditCard className="w-5 h-5" />,
      status: <Activity className="w-5 h-5" />,
      about: <User className="w-5 h-5" />,
      help: <HelpCircle className="w-5 h-5" />,
    };
    return icons[tab] || <FileText className="w-5 h-5" />;
  };

  const renderStatsCards = (claims: Claim[]) => {
    const statusCounts = claims.reduce((acc, claim) => {
      acc[claim.public_status] = (acc[claim.public_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalAmount = claims.reduce((sum, claim) => sum + claim.claim_amount, 0);

    const stats = [
      {
        title: "Total Claims",
        value: claims.length,
        icon: <FileText className="w-6 h-6" />,
        color: "from-blue-500 to-indigo-600",
        textColor: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        title: "Total Amount",
        value: `$${totalAmount.toLocaleString()}`,
        icon: <DollarSign className="w-6 h-6" />,
        color: "from-emerald-500 to-green-600",
        textColor: "text-emerald-600",
        bgColor: "bg-emerald-50"
      },
      {
        title: "In Review",
        value: statusCounts['IN_REVIEW'] || 0,
        icon: <Clock className="w-6 h-6" />,
        color: "from-amber-500 to-orange-600",
        textColor: "text-amber-600",
        bgColor: "bg-amber-50"
      },
      {
        title: "Approved",
        value: statusCounts['APPROVED'] || 0,
        icon: <TrendingUp className="w-6 h-6" />,
        color: "from-green-500 to-emerald-600",
        textColor: "text-green-600",
        bgColor: "bg-green-50"
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <div className={stat.textColor}>
                  {stat.icon}
                </div>
              </div>
            </div>
            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
          </div>
        ))}
      </div>
    );
  };

  const renderClaimsTable = (claims: Claim[]) => {
    if (!claims.length) {
      return (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Claims Found</h3>
            <p className="text-gray-500 mb-6">You haven't submitted any claims yet. Start by submitting your first claim.</p>
            <button
              onClick={() => router.push('/dashboard/claims/submit')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit New Claim
            </button>
          </div>
        </div>
      );
    }

    const uniqueTypes = Array.from(new Set(claims.map(claim => claim.claim_type)));
    const filteredClaims = claims.filter(claim => {
      const matchesType = selectedType ? claim.claim_type === selectedType : true;
      const matchesSearch = searchTerm ? 
        claim.claim_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.claim_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.incident_description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesType && matchesSearch;
    });

    return (
      <div className="space-y-6">
        {renderStatsCards(claims)}
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your Claims</h3>
                <p className="text-sm text-gray-500">Manage and track all your insurance claims</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search claims..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full sm:w-64 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Types</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => router.push('/dashboard/claims/submit')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 text-sm font-medium whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Claim
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Claim ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredClaims.map((claim, idx) => (
                  <tr key={idx} className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-mono text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                          {claim.claim_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-100">
                        {claim.claim_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(claim.date_of_incident).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-lg font-semibold text-emerald-600">
                          {claim.claim_amount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClasses(claim.public_status)}`}>
                        {claim.public_status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2" title={claim.incident_description}>
                          {claim.incident_description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate max-w-32" title={claim.incident_location}>
                          {claim.incident_location}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="group inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200">
                        <Eye className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
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
      return (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Status Updates</h3>
            <p className="text-gray-500">Once you submit claims, their status updates will appear here.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {renderStatsCards(claims)}
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Claims Status</h3>
                <p className="text-sm text-gray-500">Track the progress of your submitted claims</p>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium text-indigo-600">Live Updates</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-gray-50">
                  {["Claim ID", "Type", "Submitted Date", "Amount", "Status", "Risk Level", "Action"].map((col) => (
                    <th key={col} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
            </tr>
          </thead>
              <tbody className="divide-y divide-gray-50">
            {claims.map((claim, idx) => (
                  <tr key={idx} className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                        {claim.claim_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-100">
                        {claim.claim_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(claim.created_at).toLocaleDateString()}
                      </div>
                </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-lg font-semibold text-emerald-600">
                          {claim.claim_amount.toLocaleString()}
                        </span>
                      </div>
                </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClasses(claim.public_status)}`}>
                        {claim.public_status.replace("_", " ")}
                  </span>
                </td>
                    <td className="px-6 py-4">
                      {claim.risk_level && (
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${getRiskLevelClasses(claim.risk_level)}`}>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {claim.risk_level}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button className="group inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200">
                        <Eye className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
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

  const dataToRender =
    activeTab === "status"
      ? ((dataMap[activeTab] as StatusSummary)?.claims || [])
      : (dataMap[activeTab] as any[]) || [];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white flex flex-col relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
        
        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 mb-8 hover:bg-white/15 transition-all duration-300">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-blue-200 text-sm">Insurance Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {["policies", "claims", "payments", "status", "about", "help"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
                className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white text-blue-900 shadow-xl shadow-blue-900/20 font-semibold transform translate-x-1"
                    : "text-blue-100 hover:bg-white/15 hover:text-white hover:translate-x-1"
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-white/10 text-blue-200 group-hover:bg-white/20 group-hover:text-white"
                }`}>
                  {getTabIcon(tab)}
                </div>
                <span className="capitalize font-medium">
                  {tab.replace("_", " ")}
                </span>
            </button>
          ))}
        </nav>
          </div>

        {/* Sign out button */}
        <div className="relative z-10 mt-auto p-6 border-t border-white/10">
          <button 
            onClick={handleSignOut}
            className="w-full group flex items-center gap-3 px-4 py-3 text-sm text-blue-200 hover:text-white hover:bg-white/15 rounded-xl transition-all duration-300"
          >
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  {getTabIcon(activeTab)}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 capitalize">
                  {activeTab.replace("_", " ")}
                </h2>
        </div>
              <p className="text-gray-600 text-lg">
                {activeTab === "claims" && "Manage and track your insurance claims with real-time updates"}
                {activeTab === "policies" && "View and manage your active insurance policies"}
                {activeTab === "payments" && "Track your payments and billing history"}
                {activeTab === "status" && "Monitor the status of your submitted claims"}
                {activeTab === "about" && "View and update your profile information"}
                {activeTab === "help" && "Get help and support with your insurance"}
              </p>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin animate-reverse"></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading your data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === "claims" && renderClaimsTable(dataToRender)}
              {activeTab === "status" && renderStatusTable(dataToRender)}
              {activeTab === "about" && <ProfileDisplay />}
              {activeTab !== "claims" && activeTab !== "status" && activeTab !== "about" && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      {getTabIcon(activeTab)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
                    <p className="text-gray-500">This section is under development and will be available soon.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
