"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function SubmitClaimPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    policyNumber: '',
    claimType: '',
    dateOfIncident: '',
    incidentLocation: '',
    incidentDescription: '',
    supportingDocs: null as File | null,
    claimAmount: '',
    consent: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }))
    } else if (type === 'file' && files && files.length > 0) {
      setForm(f => ({ ...f, [name]: files[0] }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)
    try {
      const formData = new FormData()
      formData.append('fullName', form.fullName)
      formData.append('email', form.email)
      formData.append('phone', form.phone)
      formData.append('policyNumber', form.policyNumber)
      formData.append('claimType', form.claimType)
      formData.append('dateOfIncident', form.dateOfIncident)
      formData.append('incidentLocation', form.incidentLocation)
      formData.append('incidentDescription', form.incidentDescription)
      if (form.supportingDocs) formData.append('supportingDocs', form.supportingDocs)
      formData.append('claimAmount', form.claimAmount)
      formData.append('consent', form.consent ? 'true' : 'false')
      // TODO: Replace with your API endpoint
      const res = await fetch('/api/claimsdoc', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Failed to submit form')
      setSuccess(true)
      setForm({
        fullName: '',
        email: '',
        phone: '',
        policyNumber: '',
        claimType: '',
        dateOfIncident: '',
        incidentLocation: '',
        incidentDescription: '',
        supportingDocs: null,
        claimAmount: '',
        consent: false,
      })
    } catch (err: any) {
      setError(err.message || 'Error submitting form')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Claim Submission Form</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 1. Claimant Information (moved to top) */}
        <div>
          <h2 className="font-semibold mb-2">1. Claimant Information</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="FullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="block p-2 rounded border w-full"
              placeholder="Enter your full name"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="block p-2 rounded border w-full"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="block p-2 rounded border w-full"
              placeholder="Enter your contact number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upload Identity Documents</label>
            <input
              type="file"
              name="IdentityDocs"
              onChange={handleChange}
              className="block p-2 rounded border w-full"
              accept="image/*,application/pdf"
            />
            <span className="text-xs text-gray-500">Accepted: citizenship, passport, NID, VoterID.</span>
          </div>
        </div>
        {/* 2. Policy Information */}
        <div>
          <h2 className="font-semibold mb-2">2. Policy Information</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Policy Number</label>
            <input
              type="text"
              name="policyNumber"
              value={form.policyNumber}
              onChange={handleChange}
              required
              className="block p-2 rounded border w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Claim Type</label>
            <select
              name="claimType"
              value={form.claimType}
              onChange={handleChange}
              required
              className="block p-2 rounded border w-full"
            >
              <option value="">Select claim type</option>
              <option value="Accident">Accident</option>
              <option value="Theft">Theft</option>
              <option value="Fire">Fire</option>
              <option value="Health">Health</option>
              <option value="Travel">Travel</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Incident</label>
            <input
              type="date"
              name="dateOfIncident"
              value={form.dateOfIncident}
              onChange={handleChange}
              required
              className="block p-2 rounded border w-full"
            />
          </div>
        </div>
        {/* 3. Incident Details */}
        <div>
          <h2 className="font-semibold mb-2">3. Incident Details</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Location of Incident</label>
            <input
              type="text"
              name="incidentLocation"
              value={form.incidentLocation}
              onChange={handleChange}
              required
              className="block p-2 rounded border w-full"
              placeholder="Enter the location where the incident occurred"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Description of Incident</label>
            <textarea
              name="incidentDescription"
              value={form.incidentDescription}
              onChange={handleChange}
              required
              className="block p-2 rounded border w-full"
              placeholder="Briefly describe what happened"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upload Supporting Documents</label>
            <input
              type="file"
              name="supportingDocs"
              onChange={handleChange}
              className="block p-2 rounded border w-full"
              accept="image/*,application/pdf"
            />
            <span className="text-xs text-gray-500">Accepted: photos, police reports etc.</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upload Claim Invoices</label>
            <input
              type="file"
              name="Invoices"
              onChange={handleChange}
              className="block p-2 rounded border w-full"
              accept="image/*,application/pdf"
            />
            <span className="text-xs text-gray-500">Accepted: showroom bills, hospital bills, etc.</span>
          </div>
        </div>
        {/* 4. Claim Amount */}
        <div>
          <h2 className="font-semibold mb-2">4. Claim Amount</h2>
          <label className="block text-sm font-medium mb-1">Estimated Claim Amount</label>
          <input
            type="number"
            name="claimAmount"
            value={form.claimAmount}
            onChange={handleChange}
            required
            className="block p-2 rounded border w-full"
            placeholder="Enter the estimated amount you're claiming"
            min="0"
            step="0.01"
          />
        </div>
        {/* 5. Consent and Submission */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={handleChange}
              required
              className="accent-blue"
            />
            <span>I certify that the information provided is true and accurate.</span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4 disabled:opacity-50 font-semibold shadow"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Claim'}
        </button>
        {success && <div className="text-green-700 mt-2">Form submitted successfully!</div>}
        {error && <div className="text-red-700 mt-2">{error}</div>}
        <button
          className="mt-6 text-blue-600 underline"
          type="button"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </form>
    </div>
  )
}
