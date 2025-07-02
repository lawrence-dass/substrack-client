"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api, setAuthToken } from "@/lib/api"

export default function SignUp() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      // Make API call to sign up endpoint
      console.log('Making signup request...')
      const response = await api.auth.signUp(`${firstName} ${lastName}`, email, password)
      console.log('Signup response status:', response.status)
      
      const data: Record<string, unknown> = await response.json()
      console.log('=== COMPLETE SIGNUP RESPONSE ===')
      console.log('Full response data:', JSON.stringify(data, null, 2))
      console.log('================================')
      
      if (response.ok && data.success) {
        // Extract token from the actual response structure: data.data.token
        let token = null
        
        if (data.data && typeof data.data === 'object') {
          const responseData = data.data as Record<string, unknown>
          
          // The backend returns token at data.data.token
          if (responseData.token) {
            token = responseData.token as string
            console.log('✅ Found token at data.data.token:', token)
          }
          
          // Also check user data structure
          if (responseData.user && typeof responseData.user === 'object') {
            const userData = responseData.user as { _id: string; name: string; email: string }
            console.log('✅ Found user data at data.data.user:', userData)
            
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify({
              id: userData._id,
              name: userData.name,
              email: userData.email
            }))
            console.log('✅ User data stored successfully')
          }
        }
        
        if (token) {
          console.log('✅ Storing JWT token:', token)
          setAuthToken(token)
          console.log('✅ JWT token stored successfully')
        } else {
          console.log('❌ No token found in response')
          console.log('Available fields in response:', Object.keys(data))
          if (data.data && typeof data.data === 'object') {
            console.log('Available fields in data object:', Object.keys(data.data as Record<string, unknown>))
          }
        }
        
        console.log('✅ Signup successful, redirecting to dashboard')
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        setError((data.message as string) || "Failed to create account. Please try again.")
      }
      
    } catch (err) {
      setError("Sign up failed. Please check your connection and try again.")
      console.error("Sign up error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Start tracking your subscriptions and free trials today
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                required
              />
              <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 