"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AddMealManualPageProps {
  userId: string
}

export function AddMealManualPage({ userId }: AddMealManualPageProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein_g: "",
    carbs_g: "",
    fat_g: "",
    fiber_g: "",
    meal_type: "lunch",
  })
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    try {
      if (!formData.name || !formData.calories) {
        throw new Error("Please fill in meal name and calories")
      }

      const supabase = createClient()
      const today = new Date().toISOString().split("T")[0]

      const { error: dbError } = await supabase.from("meals").insert({
        user_id: userId,
        name: formData.name,
        calories: Number.parseInt(formData.calories),
        protein_g: formData.protein_g ? Number.parseFloat(formData.protein_g) : null,
        carbs_g: formData.carbs_g ? Number.parseFloat(formData.carbs_g) : null,
        fat_g: formData.fat_g ? Number.parseFloat(formData.fat_g) : null,
        fiber_g: formData.fiber_g ? Number.parseFloat(formData.fiber_g) : null,
        meal_type: formData.meal_type,
        date: today,
      })

      if (dbError) throw dbError

      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save meal")
      console.error("[v0] Save error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-text">Add Meal</h1>
          <p className="text-sm text-text-muted mt-1">Enter meal details manually</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 md:px-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Meal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-text">
                  Meal Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Grilled Chicken Salad"
                  className="mt-2 border-border"
                  required
                />
              </div>

              <div>
                <Label htmlFor="meal_type" className="text-text">
                  Meal Type
                </Label>
                <select
                  id="meal_type"
                  name="meal_type"
                  value={formData.meal_type}
                  onChange={handleChange}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-card text-text"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <Label htmlFor="calories" className="text-text">
                  Calories *
                </Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="0"
                  className="mt-2 border-border"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="protein_g" className="text-text">
                    Protein (g)
                  </Label>
                  <Input
                    id="protein_g"
                    name="protein_g"
                    type="number"
                    step="0.1"
                    value={formData.protein_g}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-2 border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs_g" className="text-text">
                    Carbs (g)
                  </Label>
                  <Input
                    id="carbs_g"
                    name="carbs_g"
                    type="number"
                    step="0.1"
                    value={formData.carbs_g}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-2 border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fat_g" className="text-text">
                    Fat (g)
                  </Label>
                  <Input
                    id="fat_g"
                    name="fat_g"
                    type="number"
                    step="0.1"
                    value={formData.fat_g}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-2 border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="fiber_g" className="text-text">
                    Fiber (g)
                  </Label>
                  <Input
                    id="fiber_g"
                    name="fiber_g"
                    type="number"
                    step="0.1"
                    value={formData.fiber_g}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-2 border-border"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-error/10 border border-error rounded-lg">
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" onClick={() => router.back()} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="flex-1 bg-primary hover:bg-primary/90 text-white">
                  {isSaving ? "Saving..." : "Save Meal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}
