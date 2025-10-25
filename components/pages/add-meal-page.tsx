"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BottomNav } from "@/components/bottom-nav"
import { CameraIcon, UploadIcon, TrashIcon } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FoodItem {
  name: string
  confidence: number
  estimated_calories: number
}

interface MealAnalysisResult {
  foods: FoodItem[]
  total_calories: number
}

interface AddMealPageProps {
  userId: string
}

async function compressImage(file: File, maxSizeKB = 500): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // Calculate new dimensions if image is too large
        const maxDimension = 1200
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        // Compress to target size
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, { type: "image/jpeg" })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          "image/jpeg",
          0.8,
        )
      }
    }
  })
}

export function AddMealPage({ userId }: AddMealPageProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<MealAnalysisResult | null>(null)
  const [mealType, setMealType] = useState("lunch")
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, WebP, or GIF)")
      return
    }

    // Validate file size (max 10MB before compression)
    const maxSizeMB = 10
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMB}MB`)
      return
    }

    try {
      // Compress image for faster upload
      const compressedFile = await compressImage(file, 500)
      setSelectedImage(compressedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(compressedFile)
      setError(null)
      setAnalysis(null)
    } catch (err) {
      setError("Failed to process image. Please try another file.")
      console.error("[v0] Image compression error:", err)
    }
  }

  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      setError("Please select an image first")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedImage)

      console.log("[v0] Sending POST request to /api/analyze-food")
      console.log("[v0] File size:", selectedImage.size, "bytes")

      const response = await fetch("/api/analyze-food", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API error response:", errorData)
        throw new Error(errorData.error || `API returned status ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] API response data:", data)

      if (!data.foods || !Array.isArray(data.foods) || typeof data.total_calories !== "number") {
        throw new Error("Invalid response format from API")
      }

      setAnalysis(data)
    } catch (err) {
      let errorMessage = "Failed to analyze image. Please try again."

      if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
      console.error("[v0] Analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveMeal = async () => {
    if (!analysis) {
      setError("Please analyze an image first")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      const today = new Date().toISOString().split("T")[0]

      // Upload image to Supabase Storage
      let imageUrl = null
      if (selectedImage) {
        const fileName = `${userId}/${Date.now()}-${selectedImage.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("meal-images")
          .upload(fileName, selectedImage)

        if (uploadError) {
          console.error("[v0] Upload error:", uploadError)
        } else {
          const { data: publicUrl } = supabase.storage.from("meal-images").getPublicUrl(fileName)
          imageUrl = publicUrl.publicUrl
        }
      }

      const mealName = analysis.foods.map((f) => f.name).join(", ")

      const { error: dbError } = await supabase.from("meals").insert({
        user_id: userId,
        name: mealName,
        calories: analysis.total_calories,
        protein_g: 0, // API doesn't provide macros, set to 0
        carbs_g: 0,
        fat_g: 0,
        fiber_g: 0,
        meal_type: mealType,
        image_url: imageUrl,
        date: today,
      })

      if (dbError) throw dbError

      console.log("[v0] Meal saved successfully")
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save meal")
      console.error("[v0] Save error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setPreview(null)
    setAnalysis(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-text">Add Meal</h1>
          <p className="text-sm text-text-muted mt-1">Upload a photo for AI analysis</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 md:px-6 space-y-6">
        {/* Image Upload Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="w-5 h-5" />
              Upload Meal Photo
            </CardTitle>
            <CardDescription>Take a photo or upload an image of your meal for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {preview ? (
              <div className="relative w-full h-64 bg-surface rounded-lg overflow-hidden border-2 border-primary">
                <img src={preview || "/placeholder.svg"} alt="Meal preview" className="w-full h-full object-cover" />
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 bg-error text-white px-3 py-1 rounded-lg text-sm hover:bg-error/90 transition-colors flex items-center gap-1"
                >
                  <TrashIcon className="w-4 h-4" />
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 bg-surface border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-highlight/50 transition-colors"
              >
                <CameraIcon className="w-12 h-12 text-text-muted mb-2" />
                <p className="text-text font-medium">Click to upload</p>
                <p className="text-sm text-text-muted">or drag and drop</p>
                <p className="text-xs text-text-muted mt-2">Max 10MB • JPEG, PNG, WebP, GIF</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageSelect}
              className="hidden"
            />

            {preview && !analysis && (
              <Button
                onClick={handleAnalyzeImage}
                disabled={isAnalyzing}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Meal"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-error/10 border border-error rounded-lg animate-slide-up">
            <p className="text-sm text-error font-medium">Failed to Analyse</p>
            <p className="text-sm text-error/80 mt-1">{error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <Card className="border-border bg-highlight/30 animate-slide-up">
            <CardHeader>
              <CardTitle className="text-primary">Analysis Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Total Calories */}
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90">Total Calories</p>
                <p className="text-4xl font-bold">{analysis.total_calories}</p>
                <p className="text-xs opacity-75 mt-1">kcal</p>
              </div>

              {/* Detected Foods */}
              <div>
                <Label className="text-text font-semibold">Detected Foods</Label>
                <div className="mt-3 space-y-2">
                  {analysis.foods.map((food, index) => (
                    <div
                      key={index}
                      className="bg-card rounded-lg p-3 border border-border flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-text capitalize">{food.name}</p>
                        <p className="text-xs text-text-muted">{Math.round(food.confidence * 100)}% confidence</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{food.estimated_calories}</p>
                        <p className="text-xs text-text-muted">kcal</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meal Type Selection */}
              <div>
                <Label htmlFor="meal-type" className="text-text">
                  Meal Type
                </Label>
                <select
                  id="meal-type"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-card text-text"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveMeal}
                  disabled={isSaving}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  {isSaving ? "Saving..." : "Save Meal"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Entry Option */}
        {!analysis && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Or Enter Manually</CardTitle>
              <CardDescription>Don't have a photo? Enter meal details manually</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => router.push("/add-meal-manual")}
              >
                Enter Meal Details
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
