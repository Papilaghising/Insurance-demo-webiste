export default function ClaimsPage() {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2 text-blue-800">My Claims</h1>
        <p className="text-gray-600 mb-8">
          View the status of your active insurance claims and review past claim history.
        </p>
  
        {/* Claim Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Active Claims</h2>
            <p className="text-4xl font-bold text-blue-800">2</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h2 className="text-lg font-semibold text-green-700 mb-2">Approved Claims</h2>
            <p className="text-4xl font-bold text-green-800">5</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow border border-red-100">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Rejected Claims</h2>
            <p className="text-4xl font-bold text-red-800">1</p>
          </div>
        </div>
  
        {/* Claims Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-6 py-4">Claim ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date Filed</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "CLM-1023",
                  type: "Auto Insurance",
                  date: "2024-09-01",
                  status: "Pending",
                  amount: "$2,500",
                },
                {
                  id: "CLM-1011",
                  type: "Health Insurance",
                  date: "2024-08-20",
                  status: "Approved",
                  amount: "$800",
                },
                {
                  id: "CLM-1009",
                  type: "Travel Insurance",
                  date: "2024-08-10",
                  status: "Rejected",
                  amount: "$600",
                },
              ].map((claim) => (
                <tr key={claim.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-blue-900">{claim.id}</td>
                  <td className="px-6 py-4">{claim.type}</td>
                  <td className="px-6 py-4">{claim.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        claim.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : claim.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{claim.amount}</td>
                  <td className="px-6 py-4">
                    <a
                      href={`/dashboard/claims/${claim.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }  