"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import AddSubscriptionModal from "@/components/AddSubscriptionModal"
import GuestBanner from "@/components/GuestBanner"
import { Subscription, removeAuthToken } from "@/lib/api"
import { dataService, isGuest } from "@/lib/dataService"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
}

const GUEST_USER: User = { id: 'guest', name: 'Guest', email: '' }

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const router = useRouter()

  const fetchSubscriptions = async (currentUser: User) => {
    try {
      const data = await dataService.subscriptions.getAll(currentUser.id)
      setSubscriptions(data)
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } else {
      setUser(GUEST_USER)
    }
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (user) {
      fetchSubscriptions(user)
    }
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem('user')
    removeAuthToken()
    router.push('/')
  }

  const handleSubscriptionAdded = () => {
    if (user) fetchSubscriptions(user)
  }

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')
  const freeTrials = subscriptions.filter(sub => sub.isTrial && sub.status === 'active')
  const monthlySpending = activeSubscriptions
    .filter(sub => !sub.isTrial)
    .reduce((total, sub) => {
      let monthlyPrice = sub.price
      switch (sub.frequency) {
        case 'weekly':
          monthlyPrice = sub.price * 4.33
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

  const guest = isGuest()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {guest && <GuestBanner />}

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome{!guest && ' back'}, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your subscriptions and free trials
            </p>
          </div>
          {!guest ? (
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          ) : (
            <Link href="/signup">
              <Button>Create Account</Button>
            </Link>
          )}
        </div>

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
              <Link href="/subscriptions" passHref>
                <Button variant="outline" className="w-full justify-start mb-3">
                  📊 View All Subscriptions ({subscriptions.length})
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                ⏰ Manage Free Trials ({freeTrials.length})
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📈 View Spending Report
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => user && fetchSubscriptions(user)}
              >
                🔄 Refresh Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddSubscriptionModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubscriptionAdded={handleSubscriptionAdded}
      />
    </div>
  )
}
