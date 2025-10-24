"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { AuthUser } from "@/lib/types"
import { signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BottomNav } from "@/components/bottom-nav"
import { LogoutIcon, SettingsIcon } from "@/components/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfilePageProps {
  user: AuthUser
  profile: any
  goals: any
}

export function ProfilePage({ user, profile, goals }: ProfilePageProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    age: profile?.age || "",
    gender: profile?.gender || "",
    height_cm: profile?.height_cm || "",
    weight_kg: profile?.weight_kg || "",
    activity_level: profile?.activity_level || "moderate",
  })
  const [goalData, setGoalData] = useState({
    daily_calories: goals?.daily_calories || 2000,
    daily_protein_g: goals?.daily_protein_g || 150,
    daily_carbs_g: goals?.daily_carbs_g || 200,
    daily_fat_g: goals?.daily_fat_g || 65,
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGoalData((prev) => ({
      ...prev,
      [name]: Number.parseInt(value),
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const token = localStorage.getItem("supabase_access_token")
      if (!token) throw new Error("Not authenticated")

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          age: formData.age ? Number.parseInt(formData.age) : null,
          gender: formData.gender,
          height_cm: formData.height_cm ? Number.parseInt(formData.height_cm) : null,
          weight_kg: formData.weight_kg ? Number.parseFloat(formData.weight_kg) : null,
          activity_level: formData.activity_level,
        }),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      const goalsResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/goals?user_id=eq.${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({
          daily_calories: goalData.daily_calories,
          daily_protein_g: goalData.daily_protein_g,
          daily_carbs_g: goalData.daily_carbs_g,
          daily_fat_g: goalData.daily_fat_g,
        }),
      })

      if (!goalsResponse.ok) throw new Error("Failed to update goals")

      setIsEditing(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
      console.error("[v0] Save error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-4 md:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Profile</h1>
            <p className="text-sm text-text-muted mt-1">Manage your account</p>
          </div>
          <SettingsIcon className="w-6 h-6 text-text-muted" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 md:px-6 space-y-6">
        {/* Account Info */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-text">Email</Label>
              <p className="text-text mt-2 p-2 bg-surface rounded-lg">{user.email}</p>
            </div>
            <div>
              <Label className="text-text">Member Since</Label>
              <p className="text-text mt-2 p-2 bg-surface rounded-lg">
                {new Date(user.created_at || "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="border-border">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="text-primary">
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name" className="text-text">
                      First Name
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleProfileChange}
                      className="mt-2 border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name" className="text-text">
                      Last Name
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleProfileChange}
                      className="mt-2 border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age" className="text-text">
                      Age
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleProfileChange}
                      className="mt-2 border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender" className="text-text">
                      Gender
                    </Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleProfileChange}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-card text-text"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height_cm" className="text-text">
                      Height (cm)
                    </Label>
                    <Input
                      id="height_cm"
                      name="height_cm"
                      type="number"
                      value={formData.height_cm}
                      onChange={handleProfileChange}
                      className="mt-2 border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight_kg" className="text-text">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight_kg"
                      name="weight_kg"
                      type="number"
                      step="0.1"
                      value={formData.weight_kg}
                      onChange={handleProfileChange}
                      className="mt-2 border-border"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="activity_level" className="text-text">
                    Activity Level
                  </Label>
                  <select
                    id="activity_level"
                    name="activity_level"
                    value={formData.activity_level}
                    onChange={handleProfileChange}
                    className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-card text-text"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very_active">Very Active</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-muted">First Name</p>
                    <p className="text-text font-medium">{formData.first_name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Last Name</p>
                    <p className="text-text font-medium">{formData.last_name || "—"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-muted">Age</p>
                    <p className="text-text font-medium">{formData.age || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Gender</p>
                    <p className="text-text font-medium capitalize">{formData.gender || "—"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-muted">Height</p>
                    <p className="text-text font-medium">{formData.height_cm ? `${formData.height_cm} cm` : "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Weight</p>
                    <p className="text-text font-medium">{formData.weight_kg ? `${formData.weight_kg} kg` : "—"}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Daily Goals */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Daily Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="daily_calories" className="text-text">
                    Daily Calories
                  </Label>
                  <Input
                    id="daily_calories"
                    name="daily_calories"
                    type="number"
                    value={goalData.daily_calories}
                    onChange={handleGoalChange}
                    className="mt-2 border-border"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="daily_protein_g" className="text-text">
                      Protein (g)
                    </Label>
                    <Input
                      id="daily_protein_g"
                      name="daily_protein_g"
                      type="number"
                      value={goalData.daily_protein_g}
                      onChange={handleGoalChange}
                      className="mt-2 border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="daily_carbs_g" className="text-text">
                      Carbs (g)
                    </Label>
                    <Input
                      id="daily_carbs_g"
                      name="daily_carbs_g"
                      type="number"
                      value={goalData.daily_carbs_g}
                      onChange={handleGoalChange}
                      className="mt-2 border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="daily_fat_g" className="text-text">
                      Fat (g)
                    </Label>
                    <Input
                      id="daily_fat_g"
                      name="daily_fat_g"
                      type="number"
                      value={goalData.daily_fat_g}
                      onChange={handleGoalChange}
                      className="mt-2 border-border"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface rounded-lg p-3 border border-border">
                  <p className="text-xs text-text-muted">Calories</p>
                  <p className="text-xl font-bold text-primary">{goalData.daily_calories}</p>
                </div>
                <div className="bg-surface rounded-lg p-3 border border-border">
                  <p className="text-xs text-text-muted">Protein</p>
                  <p className="text-xl font-bold text-text">{goalData.daily_protein_g}g</p>
                </div>
                <div className="bg-surface rounded-lg p-3 border border-border">
                  <p className="text-xs text-text-muted">Carbs</p>
                  <p className="text-xl font-bold text-accent">{goalData.daily_carbs_g}g</p>
                </div>
                <div className="bg-surface rounded-lg p-3 border border-border">
                  <p className="text-xs text-text-muted">Fat</p>
                  <p className="text-xl font-bold text-secondary">{goalData.daily_fat_g}g</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-error/10 border border-error rounded-lg">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3">
            <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1" disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-error border-error hover:bg-error/10 gap-2 bg-transparent"
        >
          <LogoutIcon className="w-4 h-4" />
          Sign Out
        </Button>
      </main>

      <BottomNav />
    </div>
  )
}
