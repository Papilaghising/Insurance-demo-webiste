export default function PoliciesPage() {
    const offeredPolicies = [
      {
        type: "Health Insurance",
        description: "Covers medical expenses including hospitalization and doctor visits.",
      },
      {
        type: "Auto Insurance",
        description: "Protects your vehicle against accidents, theft, and damage.",
      },
      {
        type: "Home Insurance",
        description: "Covers your home and belongings against natural disasters and theft.",
      },
      {
        type: "Travel Insurance",
        description: "Protects you against trip cancellations, medical emergencies, and lost baggage.",
      },
    ];
  
    const purchasedPolicies = [
      {
        id: "POL-1023",
        type: "Health Insurance",
        status: "Active",
        startDate: "2024-03-01",
        endDate: "2025-03-01",
        premium: "$200/mo",
      },
      {
        id: "POL-2045",
        type: "Auto Insurance",
        status: "Expired",
        startDate: "2023-01-01",
        endDate: "2024-01-01",
        premium: "$150/mo",
      },
    ];
  
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Policies</h1>
  
        {/* Section: Policies We Offer */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Policies We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offeredPolicies.map((policy) => (
              <div
                key={policy.type}
                className="bg-white border border-gray-100 p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold text-blue-700 mb-2">{policy.type}</h3>
                <p className="text-gray-600">{policy.description}</p>
                <button className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
  
        {/* Section: Policies You've Purchased */}
        <div>
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Policies You've Purchased</h2>
          {purchasedPolicies.length === 0 ? (
            <p className="text-gray-600">You haven’t purchased any policies yet.</p>
          ) : (
            <div className="space-y-6">
              {purchasedPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="bg-white border border-gray-100 p-6 rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800">{policy.type}</h3>
                      <p className="text-sm text-gray-500">Policy ID: {policy.id}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm rounded-full font-medium ${
                        policy.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {policy.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div>
                      <p className="font-medium">Start Date</p>
                      <p>{policy.startDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">End Date</p>
                      <p>{policy.endDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Premium</p>
                      <p>{policy.premium}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }  