import { api, getAuthToken, Subscription } from './api'
import { guestStorage } from './guestStorage'

export const isGuest = (): boolean => {
  if (typeof window === 'undefined') return true
  return !getAuthToken()
}

export const dataService = {
  subscriptions: {
    getAll: async (userId?: string): Promise<Subscription[]> => {
      if (isGuest()) {
        return guestStorage.getAll()
      }
      if (!userId) return []
      const response = await api.subscriptions.getSubscriptions(userId)
      if (!response.ok) throw new Error('Failed to fetch subscriptions')
      const result = await response.json()
      return result.data || []
    },

    create: async (data: Subscription): Promise<Subscription> => {
      if (isGuest()) {
        return guestStorage.create(data)
      }
      const response = await api.subscriptions.create(data)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create subscription')
      }
      const result = await response.json()
      return result.data.subscription
    },

    update: async (id: string, data: Partial<Subscription>): Promise<Subscription> => {
      if (isGuest()) {
        return guestStorage.update(id, data)
      }
      const response = await api.subscriptions.update(id, data)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update subscription')
      }
      const result = await response.json()
      return result.data
    },

    delete: async (id: string): Promise<void> => {
      if (isGuest()) {
        guestStorage.delete(id)
        return
      }
      const response = await api.subscriptions.delete(id)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete subscription')
      }
    },

    cancel: async (id: string): Promise<Subscription> => {
      if (isGuest()) {
        return guestStorage.cancel(id)
      }
      const response = await api.subscriptions.cancel(id)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to cancel subscription')
      }
      const result = await response.json()
      return result.data
    },
  },
}
