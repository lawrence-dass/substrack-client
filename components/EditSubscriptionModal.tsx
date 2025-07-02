"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { api, Subscription } from "@/lib/api"
import NotificationToast, { useNotification } from "@/components/NotificationToast"

interface EditSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription | null
  onSubscriptionUpdated?: () => void
}

interface TrialInfo {
  trialDuration: number
  trialDurationUnit: string
  trialEndDate: string
  postTrialPrice: number
  autoConvertToRegular: boolean
  reminderSent: boolean
  cancellationDate: string | null
}

interface SubscriptionData {
  name: string
  websiteUrl: string
  price: number
  currency: string
  frequency: string
  category: string
  startDate: string
  paymentMethod: string
  isTrial: boolean
  trialInfo: TrialInfo
  status: string
}

export default function EditSubscriptionModal({ open, onOpenChange, subscription, onSubscriptionUpdated }: EditSubscriptionModalProps) {
  const [formData, setFormData] = useState<SubscriptionData>({
    name: "",
    websiteUrl: "",
    price: 0,
    currency: "USD",
    frequency: "monthly",
    category: "",
    startDate: "",
    paymentMethod: "",
    isTrial: false,
    trialInfo: {
      trialDuration: 30,
      trialDurationUnit: "days",
      trialEndDate: "",
      postTrialPrice: 0,
      autoConvertToRegular: true,
      reminderSent: false,
      cancellationDate: null
    },
    status: "active"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { notification, showNotification, hideNotification } = useNotification()

  // Populate form when subscription prop changes
  useEffect(() => {
    if (subscription && open) {
      setFormData({
        name: subscription.name || "",
        websiteUrl: subscription.websiteUrl || "",
        price: subscription.price || 0,
        currency: subscription.currency || "USD",
        frequency: subscription.frequency || "monthly",
        category: subscription.category || "",
        startDate: subscription.startDate ? new Date(subscription.startDate).toISOString().split('T')[0] : "",
        paymentMethod: subscription.paymentMethod || "",
        isTrial: subscription.isTrial || false,
        trialInfo: subscription.trialInfo ? {
          trialDuration: subscription.trialInfo.trialDuration || 30,
          trialDurationUnit: subscription.trialInfo.trialDurationUnit || "days",
          trialEndDate: subscription.trialInfo.trialEndDate || "",
          postTrialPrice: subscription.trialInfo.postTrialPrice || 0,
          autoConvertToRegular: subscription.trialInfo.autoConvertToRegular || true,
          reminderSent: subscription.trialInfo.reminderSent || false,
          cancellationDate: subscription.trialInfo.cancellationDate || null
        } : {
          trialDuration: 30,
          trialDurationUnit: "days",
          trialEndDate: "",
          postTrialPrice: 0,
          autoConvertToRegular: true,
          reminderSent: false,
          cancellationDate: null
        },
        status: subscription.status || "active"
      })
    }
  }, [subscription, open])

  // Calculate trial end date when trial duration or start date changes
  useEffect(() => {
    if (formData.isTrial && formData.startDate && formData.trialInfo.trialDuration > 0) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(startDate)
      
      switch (formData.trialInfo.trialDurationUnit) {
        case 'days':
          endDate.setDate(startDate.getDate() + formData.trialInfo.trialDuration)
          break
        case 'weeks':
          endDate.setDate(startDate.getDate() + (formData.trialInfo.trialDuration * 7))
          break
        case 'months':
          endDate.setMonth(startDate.getMonth() + formData.trialInfo.trialDuration)
          break
        default:
          break
      }
      
      setFormData(prev => ({
        ...prev,
        trialInfo: {
          ...prev.trialInfo,
          trialEndDate: endDate.toISOString()
        }
      }))
    }
  }, [formData.isTrial, formData.startDate, formData.trialInfo.trialDuration, formData.trialInfo.trialDurationUnit])

  const handleInputChange = (field: keyof SubscriptionData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTrialInfoChange = (field: keyof TrialInfo, value: string | number | boolean | null) => {
    setFormData(prev => ({
      ...prev,
      trialInfo: {
        ...prev.trialInfo,
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!subscription?._id) {
      setError("No subscription selected for editing")
      setIsLoading(false)
      return
    }

    // Basic validation
    if (!formData.name || !formData.category || !formData.startDate || !formData.paymentMethod) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (!formData.isTrial && formData.price <= 0) {
      setError("Price must be greater than 0 for regular subscriptions")
      setIsLoading(false)
      return
    }

    if (formData.isTrial && formData.trialInfo.postTrialPrice <= 0) {
      setError("Post-trial price must be greater than 0")
      setIsLoading(false)
      return
    }

    // Validate website URL if provided
    if (formData.websiteUrl && formData.websiteUrl.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
      if (!urlPattern.test(formData.websiteUrl.trim())) {
        setError("Please enter a valid website URL")
        setIsLoading(false)
        return
      }
    }

    try {
      // Format the data for API
      const subscriptionData: Partial<Subscription> = {
        name: formData.name,
        price: formData.isTrial ? 0 : parseFloat(formData.price.toString()),
        currency: formData.currency,
        frequency: formData.frequency,
        category: formData.category,
        startDate: new Date(formData.startDate).toISOString(),
        paymentMethod: formData.paymentMethod,
        isTrial: formData.isTrial,
        status: formData.status
      }

      // Add websiteUrl if provided
      if (formData.websiteUrl && formData.websiteUrl.trim()) {
        let url = formData.websiteUrl.trim()
        // Add https:// if no protocol is specified
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url
        }
        subscriptionData.websiteUrl = url
      }

      // Add trialInfo if it's a trial subscription
      if (formData.isTrial) {
        subscriptionData.trialInfo = {
          ...formData.trialInfo,
          postTrialPrice: parseFloat(formData.trialInfo.postTrialPrice.toString())
        }
      }

      console.log("Subscription data to update:", subscriptionData)
      
      // Make API call to update subscription
      const response = await api.subscriptions.update(subscription._id, subscriptionData)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update subscription')
      }

      const result = await response.json()
      console.log("Subscription updated successfully:", result)
      
      onOpenChange(false)
      
      // Call the callback to refresh the subscription list
      if (onSubscriptionUpdated) {
        onSubscriptionUpdated()
      }
      
      // Show success notification
      showNotification(
        "Subscription Updated",
        `${formData.name} has been successfully updated.`,
        "success"
      )
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update subscription. Please try again."
      setError(errorMessage)
      console.error("Update subscription error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Update the details of your subscription.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {/* Subscription Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Subscription Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Netflix, Spotify, Amazon Prime"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="e.g., https://netflix.com"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
              />
              <p className="text-xs text-gray-500">Optional: Link to the service website</p>
            </div>

            {/* Is Trial Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                id="isTrial"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                checked={formData.isTrial}
                onChange={(e) => handleInputChange("isTrial", e.target.checked)}
              />
              <Label htmlFor="isTrial" className="text-sm">
                This is a free trial
              </Label>
            </div>

            {/* Trial Information - Only show if isTrial is true */}
            {formData.isTrial && (
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Trial Information</h4>
                
                {/* Trial Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trialDuration">Trial Duration</Label>
                    <Input
                      id="trialDuration"
                      type="number"
                      min="1"
                      placeholder="30"
                      value={formData.trialInfo.trialDuration || ""}
                      onChange={(e) => handleTrialInfoChange("trialDuration", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trialDurationUnit">Duration Unit</Label>
                    <Select 
                      value={formData.trialInfo.trialDurationUnit} 
                      onValueChange={(value) => handleTrialInfoChange("trialDurationUnit", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Post Trial Price */}
                <div className="space-y-2">
                  <Label htmlFor="postTrialPrice">Price After Trial *</Label>
                  <Input
                    id="postTrialPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.trialInfo.postTrialPrice || ""}
                    onChange={(e) => handleTrialInfoChange("postTrialPrice", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                {/* Auto Convert */}
                <div className="flex items-center space-x-2">
                  <input
                    id="autoConvert"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                    checked={formData.trialInfo.autoConvertToRegular}
                    onChange={(e) => handleTrialInfoChange("autoConvertToRegular", e.target.checked)}
                  />
                  <Label htmlFor="autoConvert" className="text-sm">
                    Auto-convert to regular subscription after trial
                  </Label>
                </div>

                {/* Trial End Date (Read-only, calculated) */}
                {formData.trialInfo.trialEndDate && (
                  <div className="space-y-2">
                    <Label>Trial End Date (Calculated)</Label>
                    <Input
                      type="text"
                      value={new Date(formData.trialInfo.trialEndDate).toLocaleDateString()}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Regular Price - Only show if NOT a trial */}
            {!formData.isTrial && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price || ""}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                    required={!formData.isTrial}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => handleInputChange("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                        <SelectItem value="AUD">AUD ($)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Currency for trials */}
            {formData.isTrial && (
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => handleInputChange("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Billing Frequency</Label>
              <Select 
                value={formData.frequency} 
                onValueChange={(value) => handleInputChange("frequency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Subscription Categories</SelectLabel>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="news">News & Media</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="cloud">Cloud Services</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Payment Methods</SelectLabel>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Debit Card">Debit Card</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                    <SelectItem value="Google Pay">Google Pay</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Subscription Status</SelectLabel>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Subscription"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Notification Toast */}
      <NotificationToast
        open={notification.open}
        onOpenChange={hideNotification}
        title={notification.title}
        description={notification.description}
        type={notification.type}
      />
    </>
  )
} 