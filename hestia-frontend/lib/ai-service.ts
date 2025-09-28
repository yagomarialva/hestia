import { buildApiUrl, API_CONFIG } from './api-config'
import { apiInterceptor } from './api-interceptor'

// Interfaces para AI
export interface ProductClassificationRequest {
  product_name: string
}

export interface ProductClassificationResponse {
  product_name: string
  sector: string
  confidence?: number
}

export interface ListGenerationRequest {
  theme: string
  people_count?: number
}

export interface ListGenerationResponse {
  theme: string
  items: Array<{
    name: string
    quantity: string
    category: string
  }>
  total_items: number
  shopping_list_id?: number
  message?: string
}

export interface RecipeIngredientsRequest {
  recipe_name: string
  people_count?: number
  difficulty?: 'fácil' | 'normal' | 'difícil'
}

export interface RecipeIngredientsResponse {
  recipe_name: string
  ingredients: Array<{
    name: string
    quantity: string
    category: string
  }>
  total_ingredients: number
  estimated_cost?: string
  cooking_time?: string
  difficulty: string
  shopping_list_id?: number
  message?: string
}

export class AIService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('No authentication token found. Please log in again.')
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  // Classificar produto
  async classifyProduct(data: ProductClassificationRequest): Promise<ProductClassificationResponse> {
    try {
      const response = await apiInterceptor.fetchWithAuth(buildApiUrl(`${API_CONFIG.ENDPOINTS.AI}/classify-product`), {
        method: 'POST',
        body: JSON.stringify(data),
      })

      return await response.json()
    } catch (error) {
      console.error('Classify product error:', error)
      throw error
    }
  }

  // Gerar lista por tema
  async generateShoppingList(data: ListGenerationRequest): Promise<ListGenerationResponse> {
    try {
      const response = await apiInterceptor.fetchWithAuth(buildApiUrl(`${API_CONFIG.ENDPOINTS.AI}/generate-list`), {
        method: 'POST',
        body: JSON.stringify(data),
      })

      return await response.json()
    } catch (error) {
      console.error('Generate shopping list error:', error)
      throw error
    }
  }

  // Gerar ingredientes de receita
  async generateRecipeIngredients(data: RecipeIngredientsRequest): Promise<RecipeIngredientsResponse> {
    try {
      const response = await apiInterceptor.fetchWithAuth(buildApiUrl(`${API_CONFIG.ENDPOINTS.AI}/recipe-ingredients`), {
        method: 'POST',
        body: JSON.stringify(data),
      })

      return await response.json()
    } catch (error) {
      console.error('Generate recipe ingredients error:', error)
      throw error
    }
  }
}

export const aiService = new AIService()
