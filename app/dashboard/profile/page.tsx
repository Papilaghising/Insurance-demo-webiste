export default function ProfilePage() {
    const agents = [
      {
        name: "Alice Johnson",
        email: "alice.johnson@insureco.com",
        phone: "+1 (555) 123-4567",
        role: "Senior Agent",
        location: "New York, NY",
      },
      {
        name: "David Lee",
        email: "david.lee@insureco.com",
        phone: "+1 (555) 987-6543",
        role: "Field Agent",
        location: "San Francisco, CA",
      },
    ];
  
    const policyholders = [
      {
        name: "Michael Smith",
        email: "michael.smith@example.com",
        phone: "+1 (555) 456-7890",
        policyCount: 2,
        location: "Austin, TX",
      },
      {
        name: "Sarah Patel",
        email: "sarah.patel@example.com",
        phone: "+1 (555) 654-3210",
        policyCount: 1,
        location: "Chicago, IL",
      },
    ];
  
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">User Profiles</h1>
  
        {/* Agents Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Insurance Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-lg p-6 shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold text-blue-700 mb-1">{agent.name}</h3>
                <p className="text-gray-600 mb-1">{agent.role} – {agent.location}</p>
                <p className="text-sm text-gray-500">📧 {agent.email}</p>
                <p className="text-sm text-gray-500">📞 {agent.phone}</p>
              </div>
            ))}
          </div>
        </section>
  
        {/* Policyholders Section */}
        <section>
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Policyholders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policyholders.map((user, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-lg p-6 shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold text-blue-700 mb-1">{user.name}</h3>
                <p className="text-gray-600 mb-1">{user.location}</p>
                <p className="text-sm text-gray-500">📧 {user.email}</p>
                <p className="text-sm text-gray-500">📞 {user.phone}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Policies Purchased: <span className="font-medium">{user.policyCount}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }  