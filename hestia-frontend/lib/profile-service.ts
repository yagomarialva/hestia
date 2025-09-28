import { buildApiUrl, API_CONFIG } from './api-config'
import { apiInterceptor } from './api-interceptor'

export interface UserProfile {
  id: number
  name: string
  email: string
  bio?: string
  avatar?: string
  created_at: string
  updated_at?: string
}

export interface UserSettings {
  language: string
  timezone: string
  email_notifications: boolean
  push_notifications: boolean
  marketing_emails: boolean
  weekly_digest: boolean
}

export interface ShoppingPreferences {
  default_store: string
  auto_sort: boolean
  group_by_category: boolean
  show_nutrition_info: boolean
  enable_notifications: boolean
  dietary_restrictions: string[]
  preferred_brands: string[]
}

export interface SecuritySession {
  id: number
  device: string
  location: string
  last_active: string
  current: boolean
  user_agent?: string
  ip_address?: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
  bio?: string
  avatar?: string
}

export interface ChangePasswordData {
  current_password: string
  new_password: string
}

class ProfileService {
  private baseUrl = API_CONFIG.BASE_URL

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('access_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  // Profile Management
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiInterceptor.fetchWithAuth(buildApiUrl(`${API_CONFIG.ENDPOINTS.USERS}/profile`), {
        method: 'GET',
      })


      return await response.json()
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    try {
      const response = await apiInterceptor.fetchWithAuth(buildApiUrl(`${API_CONFIG.ENDPOINTS.USERS}/profile`), {
        method: 'PUT',
        body: JSON.stringify(data),
      })


      return await response.json()
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    // Mock implementation - create a data URL from the file
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        resolve({ avatar_url: result })
      }
      reader.readAsDataURL(file)
    })
  }

  // Settings Management - Mock implementation until backend endpoints are available
  async getSettings(): Promise<UserSettings> {
    // Mock implementation - return default settings
    return {
      language: "pt",
      timezone: "America/Sao_Paulo",
      email_notifications: true,
      push_notifications: false,
      marketing_emails: false,
      weekly_digest: true,
    }
  }

  async updateSettings(data: Partial<UserSettings>): Promise<UserSettings> {
    // Mock implementation - simulate API call
    console.log('Settings update requested:', data)
    return {
      language: data.language || "pt",
      timezone: data.timezone || "America/Sao_Paulo",
      email_notifications: data.email_notifications ?? true,
      push_notifications: data.push_notifications ?? false,
      marketing_emails: data.marketing_emails ?? false,
      weekly_digest: data.weekly_digest ?? true,
    }
  }

  // Shopping Preferences - Mock implementation until backend endpoints are available
  async getShoppingPreferences(): Promise<ShoppingPreferences> {
    // Mock implementation - return default preferences
    return {
      default_store: "carrefour",
      auto_sort: true,
      group_by_category: true,
      show_nutrition_info: false,
      enable_notifications: true,
      dietary_restrictions: [],
      preferred_brands: [],
    }
  }

  async updateShoppingPreferences(data: Partial<ShoppingPreferences>): Promise<ShoppingPreferences> {
    // Mock implementation - simulate API call
    console.log('Shopping preferences update requested:', data)
    return {
      default_store: data.default_store || "carrefour",
      auto_sort: data.auto_sort ?? true,
      group_by_category: data.group_by_category ?? true,
      show_nutrition_info: data.show_nutrition_info ?? false,
      enable_notifications: data.enable_notifications ?? true,
      dietary_restrictions: data.dietary_restrictions || [],
      preferred_brands: data.preferred_brands || [],
    }
  }

  // Security Management - Mock implementation until backend endpoints are available
  async changePassword(data: ChangePasswordData): Promise<void> {
    // Mock implementation - simulate API call
    console.log('Password change requested')
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  async getActiveSessions(): Promise<SecuritySession[]> {
    // Mock implementation - return mock sessions
    return [
      {
        id: 1,
        device: "MacBook Pro",
        location: "São Paulo, SP",
        last_active: new Date().toISOString(),
        current: true,
        user_agent: "Mozilla/5.0...",
        ip_address: "192.168.1.1"
      }
    ]
  }

  async revokeSession(sessionId: number): Promise<void> {
    // Mock implementation - simulate API call
    console.log('Session revoke requested:', sessionId)
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Data Management - Mock implementation until backend endpoints are available
  async exportUserData(): Promise<Blob> {
    // Mock implementation - create a mock JSON file
    const mockData = {
      user: "Mock user data",
      lists: "Mock shopping lists",
      preferences: "Mock preferences",
      export_date: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' })
    return blob
  }

  async deleteAccount(): Promise<void> {
    // Mock implementation - simulate API call
    console.log('Account deletion requested')
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

export const profileService = new ProfileService()
