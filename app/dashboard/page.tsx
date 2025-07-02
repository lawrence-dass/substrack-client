"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import AddSubscriptionModal from "@/components/AddSubscriptionModal"
import { api, Subscription, removeAuthToken, getAuthToken } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const router = useRouter()

  const fetchSubscriptions = async () => {
    try {
      console.log('Fetching subscriptions...')
      const token = getAuthToken()
      console.log('Current token before request:', token)
      
      const response = await api.subscriptions.getAll()
      console.log('Subscription fetch response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Subscription fetch result:', result)
        setSubscriptions(result.data || [])
        setDebugInfo(`Success: Fetched ${result.data?.length || 0} subscriptions`)
      } else {
        const errorText = await response.text()
        console.log('Subscription fetch error response:', errorText)
        setDebugInfo(`Error: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
      setDebugInfo(`Exception: ${error}`)
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    const currentToken = getAuthToken()
    console.log('Dashboard loaded - User data:', userData)
    console.log('Dashboard loaded - Current token:', currentToken)
    
    if (userData) {
      setUser(JSON.parse(userData))
      // Fetch subscriptions for the user
      fetchSubscriptions()
    } else {
      // Redirect to signin if not logged in
      router.push('/signin')
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    removeAuthToken() // Remove JWT token
    router.push('/')
  }

  const handleSubscriptionAdded = () => {
    // Refresh subscriptions when a new one is added
    fetchSubscriptions()
  }

  // Calculate stats from subscriptions
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')
  const freeTrials = subscriptions.filter(sub => sub.isTrial && sub.status === 'active')
  const monthlySpending = activeSubscriptions
    .filter(sub => !sub.isTrial)
    .reduce((total, sub) => {
      // Convert all to monthly for calculation
      let monthlyPrice = sub.price
      switch (sub.frequency) {
        case 'weekly':
          monthlyPrice = sub.price * 4.33 // Average weeks per month
          break
        case 'quarterly':
          monthlyPrice = sub.price / 3
          break
        case 'yearly':
          monthlyPrice = sub.price / 12
          break
        default:
          monthlyPrice = sub.price
      }
      return total + monthlyPrice
    }, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your subscriptions and free trials
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-800">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700">{debugInfo}</p>
              <p className="text-sm text-yellow-700 mt-2">
                Current Token: {getAuthToken() ? `${getAuthToken()?.slice(0, 20)}...` : 'No token found'}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{activeSubscriptions.length}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activeSubscriptions.length === 0 ? 'No subscriptions yet' : 'Active subscriptions'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Free Trials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{freeTrials.length}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {freeTrials.length === 0 ? 'No trials active' : 'Active trials'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                ${monthlySpending.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estimated monthly</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recent activity
                </div>
              ) : (
                <div className="space-y-3">
                  {subscriptions.slice(0, 5).map((sub) => (
                    <div key={sub._id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{sub.name}</div>
                        <div className="text-sm text-gray-500">
                          {sub.isTrial ? 'Free Trial' : `$${sub.price}/${sub.frequency}`}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        sub.status === 'active' ? 'bg-green-100 text-green-800' :
                        sub.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {sub.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start"
                onClick={() => setIsAddModalOpen(true)}
              >
                + Add New Subscription
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📊 View All Subscriptions ({subscriptions.length})
              </Button>
              <Button variant="outline" className="w-full justify-start">
                ⏰ Manage Free Trials ({freeTrials.length})
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📈 View Spending Report
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={fetchSubscriptions}
              >
                🔄 Refresh Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Subscription Modal */}
      <AddSubscriptionModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
        onSubscriptionAdded={handleSubscriptionAdded}
      />
    </div>
  )
} 