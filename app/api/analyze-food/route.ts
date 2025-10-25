import { type NextRequest, NextResponse } from "next/server"

/**
 * API Route: POST /api/analyze-food
 *
 * This route acts as a proxy to the FastAPI backend (configurable via FOOD_ANALYSIS_API_URL)
 * It solves CORS issues by making server-to-server requests instead of browser-to-external-server
 *
 * Request: multipart/form-data with 'file' field containing the image
 * Response: { foods: Array<{name, confidence, estimated_calories}>, total_calories: number }
 */

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API Route: Received POST request to /api/analyze-food")

    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("[v0] No file provided in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] File received:", file.name, "Size:", file.size, "bytes")

    // Create a new FormData to send to the FastAPI backend
    const backendFormData = new FormData()
    backendFormData.append("file", file)

    // Set 30-second timeout for the backend request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const backendUrl = process.env.FOOD_ANALYSIS_API_URL || "http://82.153.70.111:8000/analyze-food"
    console.log("[v0] Forwarding request to FastAPI backend:", backendUrl)

    // Make the request to the FastAPI backend
    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      body: backendFormData,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("[v0] Backend response status:", backendResponse.status)

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error("[v0] Backend error response:", errorText)
      return NextResponse.json(
        { error: `Backend returned status ${backendResponse.status}` },
        { status: backendResponse.status },
      )
    }

    const data = await backendResponse.json()
    console.log("[v0] Backend response data:", data)

    // Validate response structure
    if (!data.foods || !Array.isArray(data.foods) || typeof data.total_calories !== "number") {
      console.error("[v0] Invalid response format from backend:", data)
      return NextResponse.json({ error: "Invalid response format from backend" }, { status: 500 })
    }

    console.log("[v0] Successfully analyzed meal. Total calories:", data.total_calories)

    // Return the response to the frontend
    return NextResponse.json(data)
  } catch (error) {
    let errorMessage = "Failed to analyze image"

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Request timed out. The backend took too long to respond."
        console.error("[v0] Request timeout:", error.message)
      } else {
        errorMessage = error.message
        console.error("[v0] Error:", error.message)
      }
    }

    console.error("[v0] API route error:", error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
