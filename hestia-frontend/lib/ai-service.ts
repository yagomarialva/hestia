import { buildApiUrl, API_CONFIG } from './api-config'
import { apiInterceptor } from './api-interceptor'
import { aiContextService, UserContext } from './ai-context-service'

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

  // Gerar ingredientes de receita com contexto do usuário
  async generateRecipeIngredientsWithContext(data: RecipeIngredientsRequest): Promise<RecipeIngredientsResponse> {
    try {
      // Obter contexto do usuário
      const userContext = await aiContextService.getUserContext()
      
      // Gerar prompt contextualizado
      const contextualPrompt = aiContextService.generateContextualPrompt(
        `Extraia os ingredientes da seguinte receita: ${data.recipe_name}`,
        userContext
      )

      // Enviar requisição com contexto
      const response = await apiInterceptor.fetchWithAuth(buildApiUrl(`${API_CONFIG.ENDPOINTS.AI}/recipe-ingredients`), {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          recipe_name: contextualPrompt,
          user_context: userContext
        }),
      })

      const result = await response.json()

      // Analisar compatibilidade com listas existentes
      if (result.ingredients && Array.isArray(result.ingredients)) {
        const compatibility = aiContextService.analyzeIngredientCompatibility(
          result.ingredients.map((ing: any) => ing.name || ing),
          userContext
        )

        // Adicionar informações de compatibilidade à resposta
        result.compatibility = compatibility
        result.contextual_suggestions = this.generateContextualSuggestions(compatibility, userContext)
      }

      return result
    } catch (error) {
      console.error('Generate recipe ingredients with context error:', error)
      throw error
    }
  }

  // Gerar lista de compras inteligente com contexto
  async generateSmartShoppingList(data: ListGenerationRequest): Promise<ListGenerationResponse> {
    try {
      // Obter contexto do usuário
      const userContext = await aiContextService.getUserContext()
      
      // Gerar prompt contextualizado
      const contextualPrompt = aiContextService.generateContextualPrompt(
        `Gere uma lista de compras para: ${data.theme}`,
        userContext
      )

      const response = await apiInterceptor.fetchWithAuth(buildApiUrl(`${API_CONFIG.ENDPOINTS.AI}/generate-list`), {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          theme: contextualPrompt,
          user_context: userContext
        }),
      })

      const result = await response.json()

      // Analisar compatibilidade
      if (result.items && Array.isArray(result.items)) {
        const compatibility = aiContextService.analyzeIngredientCompatibility(
          result.items.map((item: any) => item.name || item),
          userContext
        )

        result.compatibility = compatibility
        result.smart_suggestions = this.generateSmartSuggestions(compatibility, userContext)
      }

      return result
    } catch (error) {
      console.error('Generate smart shopping list error:', error)
      throw error
    }
  }

  // Classificar produto com contexto
  async classifyProductWithContext(data: ProductClassificationRequest): Promise<ProductClassificationResponse> {
    try {
      const userContext = await aiContextService.getUserContext()
      
      const contextualPrompt = aiContextService.generateContextualPrompt(
        `Classifique o produto: ${data.product_name}`,
        userContext
      )

      const response = await apiInterceptor.fetchWithAuth(buildApiUrl(`${API_CONFIG.ENDPOINTS.AI}/classify-product`), {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          product_name: contextualPrompt,
          user_context: userContext
        }),
      })

      return await response.json()
    } catch (error) {
      console.error('Classify product with context error:', error)
      throw error
    }
  }

  // Gerar sugestões contextuais
  private generateContextualSuggestions(compatibility: any, context: UserContext): string[] {
    const suggestions = []

    if (compatibility.alreadyInLists.length > 0) {
      suggestions.push(`⚠️ Estes ingredientes já estão nas suas listas: ${compatibility.alreadyInLists.join(', ')}`)
    }

    if (compatibility.potentialDuplicates.length > 0) {
      suggestions.push(`🔍 Possíveis duplicatas encontradas: ${compatibility.potentialDuplicates.join(', ')}`)
    }

    if (compatibility.suggestedAdditions.length > 0) {
      suggestions.push(`✅ Novos ingredientes para adicionar: ${compatibility.suggestedAdditions.join(', ')}`)
    }

    // Sugestões baseadas no histórico
    if (Array.isArray(context.recentActivity) && context.recentActivity.length > 0) {
      const recentItems = context.recentActivity
        .filter(activity => activity.action === 'added')
        .slice(0, 3)
        .map(activity => activity.item)
      
      if (recentItems.length > 0) {
        suggestions.push(`📝 Você adicionou recentemente: ${recentItems.join(', ')}`)
      }
    }

    return suggestions
  }

  // Gerar sugestões inteligentes
  private generateSmartSuggestions(compatibility: any, context: UserContext): string[] {
    const suggestions = []

    // Sugestões baseadas nas listas existentes
    if (context.shoppingLists.length > 0) {
      const totalItems = context.shoppingLists.reduce((sum, list) => sum + list.items.length, 0)
      const completedItems = context.shoppingLists.reduce((sum, list) => 
        sum + list.items.filter(item => item.completed).length, 0
      )

      if (completedItems > 0) {
        suggestions.push(`📊 Você tem ${completedItems}/${totalItems} itens concluídos nas suas listas`)
      }
    }

    // Sugestões de categorias baseadas no histórico
    const categories = context.shoppingLists
      .flatMap(list => list.items)
      .map(item => item.category)
      .filter((category): category is string => Boolean(category))
      .reduce((acc, category) => {
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    const topCategories = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)

    if (topCategories.length > 0) {
      suggestions.push(`🏷️ Suas categorias mais comuns: ${topCategories.join(', ')}`)
    }

    return suggestions
  }
}

export const aiService = new AIService()
