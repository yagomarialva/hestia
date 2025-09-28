// API Configuration
export const API_CONFIG = {
  // Para desenvolvimento local
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      ME: '/auth/me'
    },
    USERS: '/users',
    SHOPPING_LISTS: '/shopping-lists',
    ITEMS: '/items',
    RECIPES: '/recipes',
    AI: '/ai'
  }
}

// Função para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
} 