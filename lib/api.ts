// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5500/api/v1'

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
  }
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
  message?: string
}

export { API_BASE_URL } 