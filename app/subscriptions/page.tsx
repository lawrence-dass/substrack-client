"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useRouter } from "next/navigation"
import { Subscription, getAuthToken } from "@/lib/api"
import { dataService, isGuest } from "@/lib/dataService"
import EditSubscriptionModal from "@/components/EditSubscriptionModal"
import ConfirmationPopover from "@/components/ConfirmationPopover"
import NotificationToast, { useNotification } from "@/components/NotificationToast"
import GuestBanner from "@/components/GuestBanner"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
}

const GUEST_USER: User = { id: 'guest', name: 'Guest', email: '' }

export default function SubscriptionsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { notification, showNotification, hideNotification } = useNotification()
  const router = useRouter()

  const fetchSubscriptions = async (currentUser: User) => {
    try {
      setIsLoading(true)
      setError('')
      const data = await dataService.subscriptions.getAll(currentUser.id)
      setSubscriptions(data)
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      setError('Failed to load subscriptions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const currentToken = getAuthToken()
    if (userData && currentToken) {
      setUser(JSON.parse(userData))
    } else {
      setUser(GUEST_USER)
    }
  }, [router])

  useEffect(() => {
    if (user) {
      fetchSubscriptions(user)
    }
  }, [user])

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setEditModalOpen(true)
  }

  const handleCancelSubscription = async (subscription: Subscription) => {
    if (!subscription._id) return

    setActionLoading(subscription._id)

    try {
      await dataService.subscriptions.cancel(subscription._id)
      showNotification(
        "Subscription Cancelled",
        `${subscription.name} has been successfully cancelled.`,
        "success"
      )
      if (user) fetchSubscriptions(user)
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      showNotification(
        "Cancellation Failed",
        error instanceof Error ? error.message : 'Failed to cancel subscription',
        "error"
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteSubscription = async (subscription: Subscription) => {
    if (!subscription._id) return

    setActionLoading(subscription._id)

    try {
      await dataService.subscriptions.delete(subscription._id)
      showNotification(
        "Subscription Deleted",
        `${subscription.name} has been permanently deleted.`,
        "success"
      )
      if (user) fetchSubscriptions(user)
    } catch (error) {
      console.error('Error deleting subscription:', error)
      showNotification(
        "Deletion Failed",
        error instanceof Error ? error.message : 'Failed to delete subscription',
        "error"
      )
    } finally {
      setActionLoading(null)
    }
  }

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

  const formatWebsiteUrl = (url: string) => {
    // Remove protocol for display
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
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
      {isGuest() && <GuestBanner />}
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
                onClick={() => user && fetchSubscriptions(user)}
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
                            {subscription.websiteUrl && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Website:</span>
                                <a 
                                  href={subscription.websiteUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                                >
                                  {formatWebsiteUrl(subscription.websiteUrl)}
                                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              </div>
                            )}
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
                      <div className="flex flex-wrap gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditSubscription(subscription)}
                          disabled={actionLoading === subscription._id}
                        >
                          Edit Subscription
                        </Button>
                        
                        {subscription.status !== 'cancelled' && (
                          <ConfirmationPopover
                            title="Cancel Subscription"
                            description={`Are you sure you want to cancel "${subscription.name}"? This will change its status to cancelled.`}
                            confirmText="Cancel Subscription"
                            cancelText="Keep Active"
                            onConfirm={() => handleCancelSubscription(subscription)}
                            variant="default"
                            disabled={actionLoading === subscription._id}
                          >
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={actionLoading === subscription._id}
                              className="text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300"
                            >
                              {actionLoading === subscription._id ? "Cancelling..." : "Cancel Subscription"}
                            </Button>
                          </ConfirmationPopover>
                        )}
                        
                        <ConfirmationPopover
                          title="Delete Subscription"
                          description={`Are you sure you want to permanently delete "${subscription.name}"? This action cannot be undone.`}
                          confirmText="Delete Forever"
                          cancelText="Keep Subscription"
                          onConfirm={() => handleDeleteSubscription(subscription)}
                          variant="destructive"
                          disabled={actionLoading === subscription._id}
                        >
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={actionLoading === subscription._id}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                          >
                            {actionLoading === subscription._id ? "Deleting..." : "Delete Subscription"}
                          </Button>
                        </ConfirmationPopover>
                        
                        {subscription.websiteUrl && (
                          <a 
                            href={subscription.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              Visit Website
                            </Button>
                          </a>
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

      {/* Edit Subscription Modal */}
      <EditSubscriptionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        subscription={selectedSubscription}
        onSubscriptionUpdated={() => user && fetchSubscriptions(user)}
      />

      {/* Notification Toast */}
      <NotificationToast
        open={notification.open}
        onOpenChange={hideNotification}
        title={notification.title}
        description={notification.description}
        type={notification.type}
      />
    </div>
  )
} 