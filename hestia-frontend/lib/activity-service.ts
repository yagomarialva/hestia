import { buildApiUrl, API_CONFIG } from './api-config'
import { apiInterceptor } from './api-interceptor'

export interface ActivityItem {
  id: string
  action: 'completed' | 'added' | 'removed' | 'created' | 'updated'
  item?: string
  list: string
  listId: number
  time: string
  icon: string
}

export interface RecentActivity {
  id: string
  action: 'completed' | 'added' | 'removed' | 'created' | 'updated'
  item?: string
  list: string
  listId: number
  time: string
  icon: string
}

class ActivityService {
  private baseUrl = API_CONFIG.BASE_URL

  // Simula atividades recentes baseadas nas listas de compras do usuário
  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    try {
      // Buscar listas recentes para simular atividades
      const listsResponse = await apiInterceptor.fetchWithAuth(buildApiUrl(API_CONFIG.ENDPOINTS.SHOPPING_LISTS), {
        method: 'GET',
      })
      
      const lists = await listsResponse.json()
      
      // Gerar atividades baseadas nas listas e itens
      const activities: RecentActivity[] = []
      
      for (const list of lists.slice(0, 3)) { // Pegar apenas as 3 listas mais recentes
        if (list.items && list.items.length > 0) {
          // Atividades de itens completados
          const completedItems = list.items.filter((item: any) => item.completed)
          completedItems.slice(0, 2).forEach((item: any, index: number) => {
            activities.push({
              id: `completed-${list.id}-${item.id}`,
              action: 'completed',
              item: item.name,
              list: list.name,
              listId: list.id,
              time: this.getRelativeTime(list.updated_at || list.created_at, index),
              icon: 'CheckCircle2'
            })
          })
          
          // Atividades de itens adicionados recentemente
          const recentItems = list.items
            .filter((item: any) => !item.completed)
            .sort((a: any, b: any) => new Date(b.created_at || b.updated_at).getTime() - new Date(a.created_at || a.updated_at).getTime())
            .slice(0, 2)
          
          recentItems.forEach((item: any, index: number) => {
            activities.push({
              id: `added-${list.id}-${item.id}`,
              action: 'added',
              item: item.name,
              list: list.name,
              listId: list.id,
              time: this.getRelativeTime(item.created_at || item.updated_at, index),
              icon: 'Plus'
            })
          })
        }
        
        // Atividade de criação da lista
        activities.push({
          id: `created-${list.id}`,
          action: 'created',
          list: list.name,
          listId: list.id,
          time: this.getRelativeTime(list.created_at, 0),
          icon: 'Plus'
        })
      }
      
      // Ordenar por tempo e limitar
      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, limit)
        
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      // Retornar atividades mock em caso de erro
      return this.getMockActivity()
    }
  }

  private getRelativeTime(dateString: string, offset: number = 0): string {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      
      // Adicionar offset para simular diferentes tempos
      const adjustedMinutes = diffInMinutes + (offset * 30)
      
      if (adjustedMinutes < 1) return 'agora mesmo'
      if (adjustedMinutes < 60) return `${adjustedMinutes} min atrás`
      
      const diffInHours = Math.floor(adjustedMinutes / 60)
      if (diffInHours < 24) return `${diffInHours}h atrás`
      
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `${diffInDays}d atrás`
      
      return 'há mais de uma semana'
    } catch {
      return 'tempo desconhecido'
    }
  }

  private getMockActivity(): RecentActivity[] {
    return [
      {
        id: 'mock-1',
        action: 'completed',
        item: 'Banana Orgânica',
        list: 'Compras da Semana',
        listId: 1,
        time: '5 min atrás',
        icon: 'CheckCircle2'
      },
      {
        id: 'mock-2',
        action: 'added',
        item: 'Iogurte Grego',
        list: 'Café da Manhã',
        listId: 2,
        time: '1h atrás',
        icon: 'Plus'
      },
      {
        id: 'mock-3',
        action: 'created',
        list: 'Lista de Festa',
        listId: 3,
        time: '2h atrás',
        icon: 'Plus'
      }
    ]
  }
}

export const activityService = new ActivityService()
