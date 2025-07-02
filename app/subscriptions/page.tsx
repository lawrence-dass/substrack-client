"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useRouter } from "next/navigation"
import { api, Subscription, getAuthToken } from "@/lib/api"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
}

export default function SubscriptionsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      if (!user?.id) {
        console.log('No user ID available')
        return
      }
      
      console.log('Fetching subscriptions for user:', user.id)
      const response = await api.subscriptions.getSubscriptions(user.id)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Subscriptions fetched:', result)
        setSubscriptions(result.data || [])
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch subscriptions:', errorText)
        setError('Failed to load subscriptions')
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      setError('Failed to load subscriptions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    const currentToken = getAuthToken()
    
    if (userData && currentToken) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } else {
      // Redirect to signin if not logged in
      router.push('/signin')
    }
  }, [router])

  // Fetch subscriptions when user is set
  useEffect(() => {
    if (user?.id) {
      fetchSubscriptions()
    }
  }, [user])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number, currency: string, frequency: string) => {
    if (price === 0) return 'Free'
    return `${currency === 'USD' ? '$' : currency} ${price.toFixed(2)}/${frequency}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      entertainment: '🎬',
      productivity: '💼',
      health: '🏥',
      education: '📚',
      news: '📰',
      shopping: '🛒',
      cloud: '☁️',
      communication: '💬',
      finance: '💰',
      security: '🔒',
      transportation: '🚗',
      utilities: '⚡',
      other: '📦'
    }
    return icons[category] || '📦'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-lg">Loading subscriptions...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              All Subscriptions
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage and view details of all your subscriptions
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700">{error}</p>
              <Button 
                onClick={fetchSubscriptions} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Subscriptions Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{subscriptions.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {subscriptions.filter(sub => sub.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Free Trials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">
                {subscriptions.filter(sub => sub.isTrial && sub.status === 'active').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions List */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No subscriptions yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start tracking your subscriptions and free trials
                </p>
                <Link href="/dashboard">
                  <Button>Add Your First Subscription</Button>
                </Link>
              </div>
            ) : (
              <Accordion type="single" className="w-full">
                {subscriptions.map((subscription) => (
                  <AccordionItem key={subscription._id} value={subscription._id || ''}>
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl">{getCategoryIcon(subscription.category)}</span>
                          <div className="text-left">
                            <div className="font-medium text-lg">{subscription.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {subscription.isTrial ? (
                                <span className="text-orange-600">Free Trial</span>
                              ) : (
                                formatPrice(subscription.price, subscription.currency, subscription.frequency)
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Basic Information</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Service:</span>
                              <span className="font-medium">{subscription.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Category:</span>
                              <span className="font-medium capitalize">{subscription.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Status:</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(subscription.status)}`}>
                                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                              <span className="font-medium">{formatDate(subscription.startDate)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing & Payment */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Pricing & Payment</h4>
                          <div className="space-y-2">
                            {subscription.isTrial ? (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Trial Status:</span>
                                  <span className="font-medium text-orange-600">Free Trial</span>
                                </div>
                                {subscription.trialInfo && (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">Trial Duration:</span>
                                      <span className="font-medium">
                                        {subscription.trialInfo.trialDuration} {subscription.trialInfo.trialDurationUnit}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">Trial End Date:</span>
                                      <span className="font-medium">{formatDate(subscription.trialInfo.trialEndDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">Price After Trial:</span>
                                      <span className="font-medium">
                                        {formatPrice(subscription.trialInfo.postTrialPrice, subscription.currency, subscription.frequency)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">Auto Convert:</span>
                                      <span className="font-medium">
                                        {subscription.trialInfo.autoConvertToRegular ? 'Yes' : 'No'}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                                  <span className="font-medium text-lg">
                                    {formatPrice(subscription.price, subscription.currency, subscription.frequency)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Billing Frequency:</span>
                                  <span className="font-medium capitalize">{subscription.frequency}</span>
                                </div>
                              </>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                              <span className="font-medium">{subscription.paymentMethod}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="outline" size="sm">
                          Edit Subscription
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel Subscription
                        </Button>
                        {subscription.isTrial && (
                          <Button variant="outline" size="sm">
                            Manage Trial
                          </Button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 