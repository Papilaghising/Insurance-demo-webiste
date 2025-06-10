"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  FileText, 
  ClipboardCheck, 
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Upload,
  Shield,
  Calendar,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  Camera,
  Clock,
  Eye,
  ArrowLeft
} from 'lucide-react';

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
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ${
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
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            file 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-100 text-gray-400'
          }`}>
            {file ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          
          {file ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-700">{file.name}</p>
              <p className="text-xs text-green-600">File uploaded successfully</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                Drop your file here, or <span className="text-blue-600 underline">browse files</span>
              </p>
              <p className="text-xs text-gray-500">{description}</p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 mt-3">
                <span className="flex items-center space-x-1">
                  <Camera className="w-3 h-3" />
                  <span>Images</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FileText className="w-3 h-3" />
                  <span>PDFs</span>
                </span>
              </div>
            </div>
          )}
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
  isActive = false,
  isCompleted = false
}: {
  icon: React.ComponentType<any>;
  title: string;
  children: React.ReactNode;
  step: number;
  isActive?: boolean;
  isCompleted?: boolean;
}) => (
  <div className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${
    isActive ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'
  }`}>
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 ${
          isCompleted
            ? 'bg-green-100 text-green-600'
            : isActive 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-gray-100 text-gray-500'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Step {step}
            </span>
            {isCompleted && (
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Completed
              </span>
            )}
          </div>
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
  <div className="space-y-2">
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
        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 ${
          Icon ? 'pl-10' : 'pl-3'
        } pr-3 py-3 text-gray-900`}
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
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      rows={rows}
      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 py-3 px-3 text-gray-900 resize-none"
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
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 py-3 px-3 text-gray-900"
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

function App() {
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
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Auto-advance step based on form completion
    if (form.fullName && form.email && form.phone && form.identityDocs) {
      setCurrentStep(Math.max(currentStep, 2));
    }
    if (form.policyNumber && form.claimType && form.dateOfIncident) {
      setCurrentStep(Math.max(currentStep, 3));
    }
    if (form.incidentLocation && form.incidentDescription) {
      setCurrentStep(Math.max(currentStep, 4));
    }
    if (form.claimAmount) {
      setCurrentStep(Math.max(currentStep, 5));
    }
  }, [form, currentStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
  
    if (type === 'checkbox') {
      setForm((f: FormState) => ({ ...f, [name]: checked }));
    } else if (type === 'file' && files && files.length > 0) {
      const normalizedName = name.charAt(0).toLowerCase() + name.slice(1);
      setForm((f: FormState) => ({ ...f, [normalizedName]: files[0] }));
    } else {
      setForm((f: FormState) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    // Simulate API call with fraud analysis data (stored in database, not shown to client)
    setTimeout(() => {
      setResponseData({
        data: {
          id: 'CLM-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          status: 'SUBMITTED',
          public_status: 'SUBMITTED'
        },
        // This fraud analysis data would be stored in database for agents only
        fraudAnalysis: {
          fraudRiskScore: Math.floor(Math.random() * 30) + 10,
          riskLevel: 'LOW',
          recommendation: 'APPROVE',
          keyFindings: [
            'Policy holder has good claim history',
            'Incident details are consistent',
            'Supporting documentation is complete'
          ]
        }
      });
      setSuccess(true);
      setSubmitting(false);
    }, 2000);
  };

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
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-500 px-8 py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Claim Submitted Successfully!</h2>
              <p className="text-green-100 text-lg">Your claim has been received and is now being processed.</p>
            </div>

            {/* Claim Details */}
            <div className="p-8 space-y-8">
              {/* Status Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Claim Received</h3>
                      <p className="text-blue-700">We've received your {form.claimType} claim and will begin processing immediately.</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Clock className="w-4 h-4 mr-2" />
                    {responseData?.data?.public_status?.replace('_', ' ') || 'SUBMITTED'}
                  </span>
                </div>
              </div>

              {/* Claim Summary Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Claim Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Claim ID</p>
                      <p className="font-mono text-sm bg-white px-3 py-2 rounded border">
                        {responseData?.data?.id || 'N/A'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Claim Type</p>
                        <p className="font-medium text-gray-900">{form.claimType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Submitted</p>
                        <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <DollarSign className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Financial Details</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Claim Amount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${form.claimAmount ? parseFloat(form.claimAmount).toLocaleString() : '0'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date of Incident</p>
                      <p className="font-medium text-gray-900 flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{form.dateOfIncident || 'N/A'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <User className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Contact Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-medium text-gray-900">{form.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email Address</p>
                    <p className="font-medium text-gray-900 break-all">{form.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">What happens next?</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <p className="text-sm text-gray-700">Our team will review your claim within 2-3 business days</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <p className="text-sm text-gray-700">You'll receive email updates on your claim status</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <p className="text-sm text-gray-700">If approved, payment will be processed within 5-7 business days</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>View Dashboard</span>
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
                    setCurrentStep(1);
                  }}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 border border-gray-300 flex items-center justify-center space-x-2"
                >
                  <ClipboardCheck className="w-5 h-5" />
                  <span>Submit Another Claim</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(form.fullName && form.email && form.phone && form.identityDocs);
      case 2:
        return Boolean(form.policyNumber && form.claimType && form.dateOfIncident);
      case 3:
        return Boolean(form.incidentLocation && form.incidentDescription);
      case 4:
        return Boolean(form.claimAmount);
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <ClipboardCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Your Insurance Claim</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete the form below to submit your insurance claim. We'll process your request and keep you updated on the progress.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Personal Information */}
          <FormSection 
            icon={User} 
            title="Personal & Identity Information" 
            step={1}
            isActive={currentStep === 1}
            isCompleted={isStepCompleted(1)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InputField
                label="Full Legal Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your complete full name"
                icon={User}
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                icon={Mail}
              />
            </div>
            <InputField
              label="Contact Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Enter your primary contact number"
              icon={Phone}
            />
            <FileUpload
              name="identityDocs"
              onChange={handleChange}
              accept="image/*,application/pdf"
              label="Identity Verification Documents"
              description="Upload citizenship certificate, passport, national ID, voter ID, or driver's license"
              file={form.identityDocs}
            />
          </FormSection>

          {/* Step 2: Policy Information */}
          <FormSection 
            icon={FileText} 
            title="Insurance Policy Details" 
            step={2}
            isActive={currentStep === 2}
            isCompleted={isStepCompleted(2)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InputField
                label="Insurance Policy Number"
                name="policyNumber"
                value={form.policyNumber}
                onChange={handleChange}
                required
                placeholder="Enter your policy number"
                icon={CreditCard}
              />
              <SelectField
                label="Type of Claim"
                name="claimType"
                value={form.claimType}
                onChange={handleChange}
                required
                options={claimTypeOptions}
                placeholder="Select the type of claim"
              />
            </div>
            <InputField
              label="Date of Incident"
              name="dateOfIncident"
              type="date"
              value={form.dateOfIncident}
              onChange={handleChange}
              required
              icon={Calendar}
            />
          </FormSection>

          {/* Step 3: Incident Details */}
          <FormSection 
            icon={AlertTriangle} 
            title="Incident Details & Documentation" 
            step={3}
            isActive={currentStep === 3}
            isCompleted={isStepCompleted(3)}
          >
            <InputField
              label="Location Where Incident Occurred"
              name="incidentLocation"
              value={form.incidentLocation}
              onChange={handleChange}
              required
              placeholder="Provide the specific location of the incident"
              icon={MapPin}
            />
            <TextAreaField
              label="Detailed Description of Incident"
              name="incidentDescription"
              value={form.incidentDescription}
              onChange={handleChange}
              required
              placeholder="Provide a comprehensive description of what happened, including timeline and circumstances"
              rows={4}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FileUpload
                name="supportingDocs"
                onChange={handleChange}
                accept="image/*,application/pdf"
                label="Supporting Evidence"
                description="Photos of damage, police reports, witness statements, medical reports"
                file={form.supportingDocs}
              />
              <FileUpload
                name="invoices"
                onChange={handleChange}
                accept="image/*,application/pdf"
                label="Financial Documentation"
                description="Bills, receipts, repair estimates, medical invoices"
                file={form.invoices}
              />
            </div>
          </FormSection>

          {/* Step 4: Claim Amount */}
          <FormSection 
            icon={DollarSign} 
            title="Financial Claim Details" 
            step={4}
            isActive={currentStep === 4}
            isCompleted={isStepCompleted(4)}
          >
            <InputField
              label="Total Estimated Claim Amount"
              name="claimAmount"
              type="number"
              value={form.claimAmount}
              onChange={handleChange}
              required
              placeholder="Enter the total amount you're claiming"
              min="0"
              step="0.01"
              icon={DollarSign}
            />
          </FormSection>

          {/* Consent and Submission */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
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
                  I certify that all information provided is true, accurate, and complete.
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  By checking this box, you confirm that all information provided is truthful and accurate to the best of your knowledge. 
                  Providing false information may result in claim denial and potential legal consequences.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <h4 className="text-sm font-medium text-red-900">Submission Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={submitting || !form.consent}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Your Claim...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Insurance Claim</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-lg transition-colors duration-200 border border-gray-300 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
