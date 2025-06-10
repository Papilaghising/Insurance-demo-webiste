"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getSupabase } from "@/lib/supabase"
import { 
  UserIcon, 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'

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

const FileUpload = ({ 
  name, 
  onChange, 
  accept, 
  label, 
  description, 
  file 
}: {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  label: string;
  description: string;
  file: File | null;
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Create a synthetic event
      const syntheticEvent = {
        target: {
          name,
          files: e.dataTransfer.files
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : file
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name={name}
          onChange={onChange}
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <CloudArrowUpIcon className={`mx-auto h-12 w-12 transition-colors duration-300 ${
            file ? 'text-green-500' : 'text-gray-400'
          }`} />
          <div className="mt-4">
            {file ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-700">{file.name}</p>
                <p className="text-xs text-green-600">File selected successfully</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  Drop your file here, or <span className="text-blue-600">browse</span>
                </p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FormSection = ({ 
  icon: Icon, 
  title, 
  children, 
  step, 
  isActive = false 
}: {
  icon: React.ComponentType<any>;
  title: string;
  children: React.ReactNode;
  step: number;
  isActive?: boolean;
}) => (
  <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${
    isActive ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
  }`}>
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
          isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Step {step}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
    </div>
    <div className="p-6 space-y-4">
      {children}
    </div>
  </div>
);

const InputField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  required = false, 
  placeholder, 
  icon: Icon,
  ...props 
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  icon?: React.ComponentType<any>;
  [key: string]: any;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 ${
          Icon ? 'pl-10' : ''
        } py-3 px-4`}
        {...props}
      />
    </div>
  </div>
);

const TextAreaField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false, 
  placeholder, 
  rows = 3 
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      rows={rows}
      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 py-3 px-4"
    />
  </div>
);

const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false, 
  options, 
  placeholder = "Select an option" 
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 py-3 px-4"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

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
      return () => {}
    }
  }, [success, router])

  useEffect(() => {
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

  const claimTypeOptions = [
    { value: 'Accident', label: 'Accident' },
    { value: 'Theft', label: 'Theft' },
    { value: 'Fire', label: 'Fire' },
    { value: 'Health', label: 'Health' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Other', label: 'Other' }
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
                <CheckCircleIcon className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Claim Submitted Successfully!</h2>
              <p className="text-green-100 text-lg">Your claim is now being processed and will be reviewed shortly.</p>
            </div>

            {/* Claim Details */}
            <div className="p-8">
              {/* Status Banner */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Claim Received</h3>
                      <p className="text-green-700">We've received your {form.claimType} claim and will begin processing immediately.</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    user?.role === 'agent' ? (
                      responseData?.data?.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      responseData?.data?.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    ) : (
                      responseData?.data?.public_status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                      responseData?.data?.public_status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    )
                  }`}>
                    {user?.role === 'agent' ? 
                      responseData?.data?.status?.replace('_', ' ') :
                      responseData?.data?.public_status?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Claim Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <IdentificationIcon className="w-6 h-6 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Claim Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Claim ID</p>
                      <p className="font-mono text-sm bg-white px-3 py-2 rounded-lg border">
                        {responseData?.data?.id || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Claim Type</p>
                      <p className="font-medium">{form.claimType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Submitted On</p>
                      <p className="font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CurrencyDollarIcon className="w-6 h-6 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Financial Details</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Claim Amount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${form.claimAmount ? parseFloat(form.claimAmount).toLocaleString() : '0'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Incident</p>
                      <p className="font-medium">{form.dateOfIncident || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Contact Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{form.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium break-all">{form.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Fraud Analysis Section - Only visible to agents */}
              {user?.role === 'agent' && responseData?.fraudAnalysis && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <ShieldCheckIcon className="w-6 h-6 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Fraud Analysis Results</h4>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-700">Risk Score</p>
                          <span className="text-sm font-medium text-gray-900">
                            {responseData.fraudAnalysis.fraudRiskScore}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              responseData.fraudAnalysis.fraudRiskScore <= 30 ? 'bg-green-500' :
                              responseData.fraudAnalysis.fraudRiskScore <= 70 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${responseData.fraudAnalysis.fraudRiskScore}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                        responseData.fraudAnalysis.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                        responseData.fraudAnalysis.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {responseData.fraudAnalysis.riskLevel} RISK
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Key Findings</p>
                      <ul className="space-y-2">
                        {responseData.fraudAnalysis.keyFindings.map((finding: string, index: number) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                            <span className="text-gray-700">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">System Recommendation</p>
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
                >
                  Submit Another Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <ClipboardDocumentCheckIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Your Claim</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to submit your insurance claim. We'll review it promptly and keep you updated on the progress.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Claimant Information */}
          <FormSection 
            icon={UserIcon} 
            title="Claimant Information" 
            step={1}
            isActive={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                icon={UserIcon}
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                icon={EnvelopeIcon}
              />
            </div>
            <InputField
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Enter your contact number"
              icon={PhoneIcon}
            />
            <FileUpload
              name="identityDocs"
              onChange={handleChange}
              accept="image/*,application/pdf"
              label="Upload Identity Documents"
              description="Accepted: citizenship, passport, NID, VoterID"
              file={form.identityDocs}
            />
          </FormSection>

          {/* Step 2: Policy Information */}
          <FormSection 
            icon={DocumentTextIcon} 
            title="Policy Information" 
            step={2}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Policy Number"
                name="policyNumber"
                value={form.policyNumber}
                onChange={handleChange}
                required
                placeholder="Enter your policy number"
                icon={IdentificationIcon}
              />
              <SelectField
                label="Claim Type"
                name="claimType"
                value={form.claimType}
                onChange={handleChange}
                required
                options={claimTypeOptions}
                placeholder="Select claim type"
              />
            </div>
            <InputField
              label="Date of Incident"
              name="dateOfIncident"
              type="date"
              value={form.dateOfIncident}
              onChange={handleChange}
              required
              icon={CalendarDaysIcon}
            />
          </FormSection>

          {/* Step 3: Incident Details */}
          <FormSection 
            icon={ExclamationTriangleIcon} 
            title="Incident Details" 
            step={3}
          >
            <InputField
              label="Location of Incident"
              name="incidentLocation"
              value={form.incidentLocation}
              onChange={handleChange}
              required
              placeholder="Enter the location where the incident occurred"
              icon={MapPinIcon}
            />
            <TextAreaField
              label="Description of Incident"
              name="incidentDescription"
              value={form.incidentDescription}
              onChange={handleChange}
              required
              placeholder="Briefly describe what happened"
              rows={4}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                name="supportingDocs"
                onChange={handleChange}
                accept="image/*,application/pdf"
                label="Supporting Documents"
                description="Photos, police reports, etc."
                file={form.supportingDocs}
              />
              <FileUpload
                name="invoices"
                onChange={handleChange}
                accept="image/*,application/pdf"
                label="Claim Invoices"
                description="Bills, receipts, estimates, etc."
                file={form.invoices}
              />
            </div>
          </FormSection>

          {/* Step 4: Claim Amount */}
          <FormSection 
            icon={CurrencyDollarIcon} 
            title="Claim Amount" 
            step={4}
          >
            <InputField
              label="Estimated Claim Amount"
              name="claimAmount"
              type="number"
              value={form.claimAmount}
              onChange={handleChange}
              required
              placeholder="Enter the estimated amount you're claiming"
              min="0"
              step="0.01"
              icon={CurrencyDollarIcon}
            />
          </FormSection>

          {/* Step 5: Consent and Submission */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">
                  I certify that the information provided is true and accurate.
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  By checking this box, you confirm that all information provided is truthful and accurate to the best of your knowledge.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Submit Claim</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
