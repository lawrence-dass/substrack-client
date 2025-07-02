// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5500/api/v1'

// JWT token management
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem('authToken')
  console.log('Retrieved token from localStorage:', token)
  return token
}

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token)
    console.log('Stored token in localStorage:', token)
  }
}

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
    console.log('Removed token from localStorage')
  }
}

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    console.log('✅ Added Authorization header with Bearer token')
  } else {
    console.log('❌ No token found, Authorization header not added')
  }
  
  console.log('Final headers:', headers)
  return headers
}

// Types for API responses
export interface User {
  _id: string
  name: string
  email: string
}

export interface AuthResponse {
  success: boolean
  data: User
  token?: string
  message?: string
}

export interface Subscription {
  _id?: string
  name: string
  price: number
  currency: string
  frequency: string
  category: string
  startDate: string
  paymentMethod: string
  websiteUrl?: string
  isTrial: boolean
  trialInfo?: {
    trialDuration: number
    trialDurationUnit: string
    trialEndDate: string
    postTrialPrice: number
    autoConvertToRegular: boolean
    reminderSent: boolean
    cancellationDate: string | null
  }
  status: string
  createdAt?: string
  updatedAt?: string
}

export interface SubscriptionResponse {
  success: boolean
  data: Subscription | Subscription[]
  message?: string
}

// API utility functions
export const api = {
  auth: {
    signIn: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })
      return response
    },
    
    signUp: async (name: string, email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      })
      return response
    }
  },

  subscriptions: {
    create: async (subscriptionData: Subscription) => {
      console.log('🚀 Making subscription create request...')
      const headers = getAuthHeaders()
      const response = await fetch(`${API_BASE_URL}/subscriptions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(subscriptionData)
      })
      console.log('📬 Subscription create response status:', response.status)
      return response
    },

    getSubscriptions: async (userId: string) => {
      console.log('🚀 Making subscription getAll request... userId', userId)
      console.log(userId)
      const headers = getAuthHeaders()
      const response = await fetch(`${API_BASE_URL}/subscriptions/user/${userId}`, {
        method: 'GET',
        headers
      })
      console.log('📬 Subscription getAll response status:', response.status)
      return response
    },

    update: async (subscriptionId: string, subscriptionData: Partial<Subscription>) => {
      console.log('🚀 Making subscription update request... subscriptionId', subscriptionId)
      const headers = getAuthHeaders()
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(subscriptionData)
      })
      console.log('📬 Subscription update response status:', response.status)
      return response
    },

    delete: async (subscriptionId: string) => {
      console.log('🚀 Making subscription delete request... subscriptionId', subscriptionId)
      const headers = getAuthHeaders()
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers
      })
      console.log('📬 Subscription delete response status:', response.status)
      return response
    },

    cancel: async (subscriptionId: string) => {
      console.log('🚀 Making subscription cancel request... subscriptionId', subscriptionId)
      const headers = getAuthHeaders()
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: 'cancelled' })
      })
      console.log('📬 Subscription cancel response status:', response.status)
      return response
    }
  }
}

export { API_BASE_URL } 