import { apiInterceptor } from './api-interceptor'
import { buildApiUrl, API_CONFIG } from './api-config'

export interface UserContext {
  shoppingLists: Array<{
    id: number
    name: string
    description?: string
    items: Array<{
      id: number
      name: string
      quantity: number
      unit: string
      completed: boolean
      category?: string
    }>
    created_at: string
    updated_at: string
  }>
  userPreferences: {
    dietary_restrictions?: string[]
    preferred_brands?: string[]
    default_store?: string
  }
  recentActivity: Array<{
    action: string
    item: string
    list: string
    timestamp: string
  }>
  userProfile?: {
    id: number
    name: string
    email: string
    total_lists: number
    total_items: number
    favorite_sector: string
  } | null
}

export class AIContextService {
  // Obter contexto completo do usuário para a IA
  async getUserContext(): Promise<UserContext> {
    try {
      // Buscar listas de compras do usuário
      const listsResponse = await apiInterceptor.fetchWithAuth(
        buildApiUrl(API_CONFIG.ENDPOINTS.SHOPPING_LISTS)
      )
      const shoppingLists = await listsResponse.json()

      // Buscar perfil do usuário para obter estatísticas
      let userProfile = null
      try {
        const profileResponse = await apiInterceptor.fetchWithAuth(
          buildApiUrl('/users/profile')
        )
        userProfile = await profileResponse.json()
      } catch (error) {
        console.log('Profile endpoint not available, using empty profile')
        userProfile = null
      }

      // Simular atividades recentes baseadas nas listas de compras
      const recentActivity = this.generateMockRecentActivity(shoppingLists)

      // Buscar preferências do usuário (mock por enquanto)
      const userPreferences = {
        dietary_restrictions: [],
        preferred_brands: [],
        default_store: 'Supermercado Padrão'
      }

      return {
        shoppingLists,
        userPreferences,
        recentActivity,
        userProfile
      }
    } catch (error) {
      console.error('Error fetching user context:', error)
      // Retornar contexto vazio em caso de erro
      return {
        shoppingLists: [],
        userPreferences: {
          dietary_restrictions: [],
          preferred_brands: [],
          default_store: 'Supermercado Padrão'
        },
        recentActivity: [],
        userProfile: null
      }
    }
  }

  // Gerar atividades recentes baseadas nas listas de compras
  private generateMockRecentActivity(shoppingLists: any[]): Array<{
    action: string
    item: string
    list: string
    timestamp: string
  }> {
    const activities: Array<{
      action: string
      item: string
      list: string
      timestamp: string
    }> = []
    const now = new Date()
    
    // Gerar atividades baseadas nos itens das listas
    shoppingLists.forEach(list => {
      if (list.items && Array.isArray(list.items)) {
        list.items.forEach((item: any, index: number) => {
          // Adicionar atividade de criação do item
          const createdTime = new Date(now.getTime() - (index * 60000)) // 1 minuto entre cada item
          activities.push({
            action: 'added',
            item: item.name,
            list: list.name,
            timestamp: createdTime.toISOString()
          })
          
          // Se o item estiver completo, adicionar atividade de conclusão
          if (item.completed) {
            const completedTime = new Date(createdTime.getTime() + (Math.random() * 3600000)) // Até 1 hora depois
            activities.push({
              action: 'completed',
              item: item.name,
              list: list.name,
              timestamp: completedTime.toISOString()
            })
          }
        })
      }
    })
    
    // Ordenar por timestamp (mais recente primeiro)
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Gerar prompt contextualizado para a IA
  generateContextualPrompt(basePrompt: string, context: UserContext): string {
    const listsSummary = context.shoppingLists.map(list => 
      `Lista: ${list.name} (${list.items.length} itens) - ${list.items.filter(item => item.completed).length} concluídos`
    ).join('\n')

    const recentItems = (Array.isArray(context.recentActivity) ? context.recentActivity : [])
      .filter(activity => activity.action === 'added')
      .map(activity => activity.item)
      .slice(0, 10)
      .join(', ')

    const dietaryInfo = context.userPreferences.dietary_restrictions && context.userPreferences.dietary_restrictions.length > 0 
      ? `\nRestrições alimentares: ${context.userPreferences.dietary_restrictions.join(', ')}`
      : ''

    const profileInfo = context.userProfile 
      ? `\nPerfil do usuário: ${context.userProfile.name} (${context.userProfile.total_lists} listas, ${context.userProfile.total_items} itens, setor favorito: ${context.userProfile.favorite_sector})`
      : ''

    return `${basePrompt}

CONTEXTO DO USUÁRIO:
- Listas de compras ativas: ${context.shoppingLists.length}
${listsSummary}

- Itens adicionados recentemente: ${recentItems || 'Nenhum'}

- Preferências:${dietaryInfo}
- Loja preferida: ${context.userPreferences.default_store}
${profileInfo}

INSTRUÇÕES:
- Use as informações das listas existentes para evitar duplicatas
- Considere as preferências e restrições alimentares do usuário
- Sugira quantidades baseadas no histórico de compras
- Mantenha consistência com os itens já nas listas
- Seja específico e prático nas sugestões`
  }

  // Analisar compatibilidade de ingredientes com listas existentes
  analyzeIngredientCompatibility(ingredients: string[], context: UserContext): {
    alreadyInLists: string[]
    suggestedAdditions: string[]
    potentialDuplicates: string[]
  } {
    const allExistingItems = context.shoppingLists
      .flatMap(list => list.items)
      .map(item => item.name.toLowerCase())

    const alreadyInLists = ingredients.filter(ingredient => 
      allExistingItems.some(existing => 
        existing.includes(ingredient.toLowerCase()) || 
        ingredient.toLowerCase().includes(existing)
      )
    )

    const suggestedAdditions = ingredients.filter(ingredient => 
      !alreadyInLists.includes(ingredient)
    )

    const potentialDuplicates = ingredients.filter(ingredient => 
      allExistingItems.some(existing => 
        this.calculateSimilarity(ingredient.toLowerCase(), existing) > 0.7
      )
    )

    return {
      alreadyInLists,
      suggestedAdditions,
      potentialDuplicates
    }
  }

  // Calcular similaridade entre strings (algoritmo simples)
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }
    
    return matrix[str2.length][str1.length]
  }
}

export const aiContextService = new AIContextService()
