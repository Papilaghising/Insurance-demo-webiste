import React, { useState } from "react"
import Link from "next/link"

export default function PolicyholderDashboard({ user }: { user: any }) {
  const [showPolicies, setShowPolicies] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [policies, setPolicies] = useState<any[]>([])
  const [profile, setProfile] = useState({ name: "", email: user?.email || "", address: "" })

  // Simulate fetching policies (replace with real API call)
  const fetchPolicies = async () => {
    // Example: fetch policies for this user
    const res = await fetch("/api/soldpolicies")
    const data = await res.json()
    // Filter policies by user if needed
    setPolicies(data.filter((p: any) => p.policyholder_email === user?.email))
  }

  const handleShowPolicies = async () => {
    if (!showPolicies) await fetchPolicies()
    setShowPolicies(!showPolicies)
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save profile info to backend
    setShowProfileForm(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Policyholder Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Your Profile</h2>
        <button className="bg-blue-500 text-white px-3 py-1 rounded mb-2" onClick={() => setShowProfileForm(!showProfileForm)}>
          {showProfileForm ? "Close" : "Edit Profile"}
        </button>
        {showProfileForm ? (
          <form onSubmit={handleProfileSubmit} className="bg-blue-50 p-4 rounded mb-4 flex flex-col gap-2">
            <input name="name" value={profile.name} onChange={handleProfileChange} placeholder="Name" className="p-2 rounded border" />
            <input name="email" value={profile.email} onChange={handleProfileChange} placeholder="Email" className="p-2 rounded border" />
            <input name="address" value={profile.address} onChange={handleProfileChange} placeholder="Address" className="p-2 rounded border" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Save</button>
          </form>
        ) : (
          <div className="bg-blue-50 p-4 rounded mb-4">Name: {profile.name || "-"} <br />Email: {profile.email || "-"} <br />Address: {profile.address || "-"}</div>
        )}
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Policies Bought</h2>
        <button className="bg-green-500 text-white px-3 py-1 rounded mb-2" onClick={handleShowPolicies}>
          {showPolicies ? "Hide Policies" : "View Policies Bought"}
        </button>
        {showPolicies && (
          <div className="bg-blue-50 p-4 rounded mb-4">
            {policies.length === 0 ? "No policies found." : (
              <ul>
                {policies.map((policy, idx) => (
                  <li key={idx} className="mb-2">{policy.policy_name || policy.id} - {policy.status}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Track Your Claims</h2>
        {/* TODO: Claim tracking section */}
        <div className="bg-blue-50 p-4 rounded mb-4">[Claim tracking placeholder]</div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Submit a Claim</h2>
        <Link href="/dashboard/claims/submit">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-2">
            Submit a Claim
          </button>
        </Link>
        <div className="flex gap-4 mb-4">
          {/* The form is now on a separate page */}
        </div>
      </div>
    </div>
  )
}
