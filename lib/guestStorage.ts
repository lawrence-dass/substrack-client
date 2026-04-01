import { Subscription } from './api'

const STORAGE_KEY = 'guestSubscriptions'

const generateId = () =>
  Math.random().toString(36).substring(2, 9) + Date.now().toString(36)

export const guestStorage = {
  getAll: (): Subscription[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  save: (subscriptions: Subscription[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions))
  },

  create: (data: Omit<Subscription, '_id' | 'createdAt' | 'updatedAt'>): Subscription => {
    const subscription: Subscription = {
      ...data,
      _id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const all = guestStorage.getAll()
    guestStorage.save([...all, subscription])
    return subscription
  },

  update: (id: string, data: Partial<Subscription>): Subscription => {
    const all = guestStorage.getAll()
    const index = all.findIndex(s => s._id === id)
    if (index === -1) throw new Error('Subscription not found')
    const updated = { ...all[index], ...data, updatedAt: new Date().toISOString() }
    all[index] = updated
    guestStorage.save(all)
    return updated
  },

  delete: (id: string): void => {
    const all = guestStorage.getAll()
    guestStorage.save(all.filter(s => s._id !== id))
  },

  cancel: (id: string): Subscription => {
    return guestStorage.update(id, { status: 'cancelled' })
  },
}
