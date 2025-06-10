"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, User, Mail, Phone, MapPin, Building, Briefcase } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface ProfileData {
  full_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  occupation: string
  employer: string
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    occupation: "",
    employer: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (error) throw error

        if (data) {
          setProfileData({
            full_name: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            zip_code: data.zip_code || "",
            occupation: data.occupation || "",
            employer: data.employer || ""
          })
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error.message)
      }
    }

    fetchProfileData()
  }, [user, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user?.id,
          ...profileData,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setSuccessMessage("Profile updated successfully!")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800">Personal Information</CardTitle>
          <CardDescription>View and update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-6 bg-emerald-50 border-emerald-200 text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-slate-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="full_name"
                    name="full_name"
                    value={profileData.full_name}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="(555) 555-5555"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-700">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="123 Main St"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-slate-700">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                  placeholder="New York"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-slate-700">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={profileData.state}
                  onChange={handleChange}
                  placeholder="NY"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip_code" className="text-slate-700">ZIP Code</Label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  value={profileData.zip_code}
                  onChange={handleChange}
                  placeholder="10001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-slate-700">Occupation</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="occupation"
                    name="occupation"
                    value={profileData.occupation}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Software Engineer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employer" className="text-slate-700">Employer</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="employer"
                    name="employer"
                    value={profileData.employer}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Company Name"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating Profile...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
