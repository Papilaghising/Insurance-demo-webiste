"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getSupabase } from "@/lib/supabase"

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  policyNumber: string;
  claimType: string;
  dateOfIncident: string;
  incidentLocation: string;
  incidentDescription: string;
  supportingDocs: File | null;
  identityDocs: File | null;
  invoices: File | null;
  claimAmount: string;
  consent: boolean;
}

export default function SubmitClaimPage() {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    policyNumber: '',
    claimType: '',
    dateOfIncident: '',
    incidentLocation: '',
    incidentDescription: '',
    supportingDocs: null,
    identityDocs: null,
    invoices: null,
    claimAmount: '',
    consent: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [responseData, setResponseData] = useState<any>(null)
  const router = useRouter()
  const { user } = useAuth()
  
  useEffect(() => {
    if (success) {
      // Remove the auto-dismiss timer
      return () => {}
    }
  }, [success, router])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement
  
    if (type === 'checkbox') {
      setForm((f: FormState) => ({ ...f, [name]: checked }))
    } else if (type === 'file' && files && files.length > 0) {
      const normalizedName = name.charAt(0).toLowerCase() + name.slice(1)
      setForm((f: FormState) => ({ ...f, [normalizedName]: files[0] }))
    } else {
      setForm((f: FormState) => ({ ...f, [name]: value }))
    }
  }

  const uploadFiles = async (claimId: string) => {
    const formData = new FormData()
    formData.append('claimId', claimId)

    let hasFiles = false
    if (form.identityDocs) {
      formData.append('identityDocs', form.identityDocs)
      hasFiles = true
    }
    if (form.supportingDocs) {
      formData.append('supportingDocs', form.supportingDocs)
      hasFiles = true
    }
    if (form.invoices) {
      formData.append('invoices', form.invoices)
      hasFiles = true
    }

    if (!hasFiles) {
      return null
    }

    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('No valid session found')
      }

      const uploadRes = await fetch('/api/claims/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        credentials: 'same-origin'
      })

      const responseData = await uploadRes.json()
      
      if (!uploadRes.ok) {
        console.error('Upload failed:', responseData)
        throw new Error(responseData.details || responseData.error || 'Failed to upload files')
      }

      return responseData
    } catch (error: any) {
      console.error('Upload error:', error)
      throw new Error(error.message || 'Failed to upload files')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      // Submit claim data first
      const res = await fetch('/api/claims/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          policyNumber: form.policyNumber,
          claimType: form.claimType,
          dateOfIncident: form.dateOfIncident,
          incidentLocation: form.incidentLocation,
          incidentDescription: form.incidentDescription,
          claimAmount: form.claimAmount.toString(),
          consent: form.consent.toString()
        })
      })

      const jsonResponse = await res.json()
      console.log('Claim submission response:', jsonResponse)

      if (!res.ok) {
        throw new Error(jsonResponse.error || 'Failed to submit form')
      }

      setResponseData(jsonResponse)
      setSuccess(true)

      // Upload files if any
      if (form.supportingDocs || form.identityDocs || form.invoices) {
        try {
          const uploadResult = await uploadFiles(jsonResponse.data.id)
          console.log('Upload result:', uploadResult)
        } catch (uploadError: any) {
          console.error('File upload error:', uploadError)
          throw new Error(uploadError.message || 'Failed to upload files')
        }
      }
    } catch (err: any) {
      console.error('Form submission error:', err)
      setError(err.message || 'Error submitting form')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
      {success ? (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1">Claim Submitted Successfully</h2>
            <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
              <p className="text-green-800">
                Your claim has been submitted successfully and is now being processed. You can track its status from your dashboard.
              </p>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600">
                  {form.claimType} Claim
                </p>
                <p className="text-gray-500 text-sm">
                  Submitted on {new Date().toLocaleDateString()}
                </p>
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded ${
                user?.role === 'agent' ? (
                  responseData?.data?.status === 'APPROVED' ? 'bg-green-50 text-green-800' :
                  responseData?.data?.status === 'REJECTED' ? 'bg-red-50 text-red-800' :
                  'bg-yellow-50 text-yellow-800'
                ) : (
                  responseData?.data?.public_status === 'SUBMITTED' ? 'bg-blue-50 text-blue-800' :
                  responseData?.data?.public_status === 'IN_REVIEW' ? 'bg-yellow-50 text-yellow-800' :
                  'bg-green-50 text-green-800'
                )
              }`}>
                {user?.role === 'agent' ? 
                  responseData?.data?.status?.replace('_', ' ') :
                  responseData?.data?.public_status?.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Claim ID</p>
                <p className="font-mono text-sm break-all">{responseData?.data?.id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Claim Amount</p>
                <p className="text-lg font-semibold">${form.claimAmount ? parseFloat(form.claimAmount).toLocaleString() : '0'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-1">Claimant Name</p>
                <p>{form.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Email</p>
                <p className="break-all">{form.email || 'N/A'}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-600 mb-1">Date of Incident</p>
              <p>{form.dateOfIncident || 'N/A'}</p>
            </div>

            {/* Fraud Analysis Section - Only visible to agents */}
            {user?.role === 'agent' && responseData?.fraudAnalysis && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Fraud Analysis Results</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-gray-600 mb-1">Risk Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            responseData.fraudAnalysis.fraudRiskScore <= 30 ? 'bg-green-500' :
                            responseData.fraudAnalysis.fraudRiskScore <= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${responseData.fraudAnalysis.fraudRiskScore}%` }}
                        ></div>
                      </div>
                      <p className="text-sm mt-1">{responseData.fraudAnalysis.fraudRiskScore}/100</p>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        responseData.fraudAnalysis.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                        responseData.fraudAnalysis.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {responseData.fraudAnalysis.riskLevel} RISK
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-2">Key Findings</p>
                    <ul className="space-y-2">
                      {responseData.fraudAnalysis.keyFindings.map((finding: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-4 h-4 mt-1 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-gray-400">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="text-gray-700">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-2">System Recommendation</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      responseData.fraudAnalysis.recommendation === 'APPROVE' ? 'bg-green-100 text-green-800' :
                      responseData.fraudAnalysis.recommendation === 'REJECT' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {responseData.fraudAnalysis.recommendation}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  setResponseData(null);
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
                    identityDocs: null,
                    invoices: null,
                    claimAmount: '',
                    consent: false,
                  });
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
              >
                Submit Another Claim
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Claim Submission Form</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* 1. Claimant Information (moved to top) */}
            <div>
              <h2 className="font-semibold mb-2">1. Claimant Information</h2>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
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
                  name="phone"
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
                  name="identityDocs"
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
                  name="invoices"
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
            {error && <div className="text-red-700 mt-2">{error}</div>}
            <button
              className="mt-6 text-blue-600 underline"
              type="button"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </form>
        </>
      )}
    </div>
  )
}