import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">Authentication Error</CardTitle>
          <CardDescription>
            There was a problem with your authentication. This could be due to an expired or invalid link.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Please try signing in again. If the problem persists, contact support.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/login">
              Back to Sign In
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}