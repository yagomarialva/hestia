import { buildApiUrl, API_CONFIG } from './api-config'

export interface ShoppingList {
  id: number
  name: string
  description?: string
  user_id: number
  created_at: string
  updated_at?: string
  items?: ShoppingListItem[]
}

export interface ShoppingListItem {
  id: number
  name: string
  category: string
  quantity?: string
  completed: boolean
  shopping_list_id: number
  created_at: string
  updated_at?: string
}

export interface CreateShoppingListData {
  name: string
  description?: string
}

export interface CreateItemData {
  name: string
  category: string
  quantity?: string
}

export interface UpdateItemData {
  name?: string
  category?: string
  quantity?: string
  completed?: boolean
}

class ShoppingListsService {
  private baseUrl = API_CONFIG.BASE_URL

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('access_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  // Shopping Lists CRUD
  async getShoppingLists(): Promise<ShoppingList[]> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SHOPPING_LISTS), {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to fetch shopping lists')
      }

      return await response.json()
    } catch (error) {
      console.error('Get shopping lists error:', error)
      throw error
    }
  }

  async getShoppingList(id: number): Promise<ShoppingList> {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SHOPPING_LISTS}/${id}`), {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to fetch shopping list')
      }

      return await response.json()
    } catch (error) {
      console.error('Get shopping list error:', error)
      throw error
    }
  }

  async createShoppingList(data: CreateShoppingListData): Promise<ShoppingList> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SHOPPING_LISTS), {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create shopping list')
      }

      return await response.json()
    } catch (error) {
      console.error('Create shopping list error:', error)
      throw error
    }
  }

  async updateShoppingList(id: number, data: Partial<CreateShoppingListData>): Promise<ShoppingList> {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SHOPPING_LISTS}/${id}`), {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to update shopping list')
      }

      return await response.json()
    } catch (error) {
      console.error('Update shopping list error:', error)
      throw error
    }
  }

  async deleteShoppingList(id: number): Promise<void> {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SHOPPING_LISTS}/${id}`), {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to delete shopping list')
      }
    } catch (error) {
      console.error('Delete shopping list error:', error)
      throw error
    }
  }

  // Items CRUD
  async getItems(listId: number): Promise<ShoppingListItem[]> {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SHOPPING_LISTS}/${listId}/items`), {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to fetch items')
      }

      return await response.json()
    } catch (error) {
      console.error('Get items error:', error)
      throw error
    }
  }

  async createItem(listId: number, data: CreateItemData): Promise<ShoppingListItem> {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SHOPPING_LISTS}/${listId}/items`), {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create item')
      }

      return await response.json()
    } catch (error) {
      console.error('Create item error:', error)
      throw error
    }
  }

  async updateItem(listId: number, itemId: number, data: UpdateItemData): Promise<ShoppingListItem> {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SHOPPING_LISTS}/${listId}/items/${itemId}`), {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to update item')
      }

      return await response.json()
    } catch (error) {
      console.error('Update item error:', error)
      throw error
    }
  }

  async deleteItem(listId: number, itemId: number): Promise<void> {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SHOPPING_LISTS}/${listId}/items/${itemId}`), {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to delete item')
      }
    } catch (error) {
      console.error('Delete item error:', error)
      throw error
    }
  }

  // Utility methods
  async toggleItemCompletion(listId: number, itemId: number, completed: boolean): Promise<ShoppingListItem> {
    return this.updateItem(listId, itemId, { completed })
  }
}

export const shoppingListsService = new ShoppingListsService()
