import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, Building, Briefcase, Save, X, Edit2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getSupabase } from "@/lib/supabase"

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

export default function ProfileDisplay() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) {
          setError("Please sign in to view your profile")
          setLoading(false)
          return
        }

        // Get the session token
        const supabase = getSupabase()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setError("Please sign in to view your profile")
          setLoading(false)
          return
        }

        const res = await fetch("/api/policyholder/profile/display", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`
          }
        })

        if (!res.ok) {
          if (res.status === 401) {
            setError("Please sign in to view your profile")
          } else {
            throw new Error("Failed to fetch profile")
          }
          return
        }

        const data = await res.json()
        setProfile(data)
        setEditedProfile(data)
      } catch (err) {
        setError("Failed to load profile data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value })
    }
  }

  const handleSave = async () => {
    if (!editedProfile) return

    try {
      setSaving(true)
      
      // Get the session token
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error("No active session")
      }

      const res = await fetch("/api/policyholder/profile/update", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify(editedProfile)
      })

      if (!res.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedProfile = await res.json()
      setProfile(updatedProfile)
      setEditedProfile(updatedProfile)
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (err) {
      console.error(err)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-800">{error}</p>
      </div>
    )
  }

  if (!profile || !editedProfile) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <p className="text-yellow-800">No profile data found</p>
      </div>
    )
  }

  const profileSections = [
    { icon: User, label: "Full Name", field: "full_name" as keyof ProfileData },
    { icon: Mail, label: "Email", field: "email" as keyof ProfileData, readOnly: true },
    { icon: Phone, label: "Phone", field: "phone" as keyof ProfileData },
    { icon: MapPin, label: "Address", field: "address" as keyof ProfileData },
    { icon: Building, label: "City", field: "city" as keyof ProfileData },
    { icon: MapPin, label: "State", field: "state" as keyof ProfileData },
    { icon: MapPin, label: "ZIP Code", field: "zip_code" as keyof ProfileData },
    { icon: Briefcase, label: "Occupation", field: "occupation" as keyof ProfileData },
    { icon: Building, label: "Employer", field: "employer" as keyof ProfileData }
  ]

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold text-slate-800">Profile Information</CardTitle>
          <CardDescription>View and update your personal information</CardDescription>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCancel}
              className="flex items-center gap-2"
              disabled={saving}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profileSections.map(({ icon: Icon, label, field, readOnly }) => (
            <div key={field} className="space-y-2">
              <div className="flex items-center gap-2 text-slate-600">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </div>
              {isEditing && !readOnly ? (
                <Input
                  value={editedProfile[field] || ""}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="pl-6"
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
              ) : (
                <p className="text-lg text-slate-900 pl-6">
                  {profile[field] || "Not provided"}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
