// API Configuration
export const API_CONFIG = {
  // Para desenvolvimento local e deploy via nginx
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1',
  
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
    AI: {
      GENERATE_LIST: '/ai/generate-list',
      EXTRACT_RECIPE: '/ai/extract-recipe',
      GET_SUGGESTIONS: '/ai/suggestions',
      EXTRACT_URL: '/ai/recipes/extract-url',
      SEARCH_RECIPES: '/ai/recipes/search'
    }
  }
}

// Função para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}