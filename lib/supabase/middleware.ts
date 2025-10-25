// Middleware for authentication - simplified version
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // For now, just pass through - authentication is handled client-side
  // In production, you'd validate the JWT token here
  return NextResponse.next({
    request,
  })
}
