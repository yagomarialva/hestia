import { useState } from 'react'
import { aiService, ListGenerationRequest, RecipeIngredientsRequest, ProductClassificationRequest } from '@/lib/ai-service'

export function useAI() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateShoppingList = async (theme: string, peopleCount: number = 1) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data: ListGenerationRequest = {
        theme,
        people_count: peopleCount
      }
      
      // Usar método simples para evitar prompt contextualizado no nome
      const result = await aiService.generateShoppingList(data)
      return result
    } catch (err) {
      let errorMessage = 'Erro ao gerar lista de compras'
      
      if (err instanceof Error) {
        if (err.message.includes('No authentication token')) {
          errorMessage = 'Sessão expirada. Faça login novamente.'
        } else if (err.message.includes('401')) {
          errorMessage = 'Não autorizado. Verifique se você está logado.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const generateRecipeIngredients = async (recipeName: string, peopleCount: number = 1, difficulty: 'fácil' | 'normal' | 'difícil' = 'normal') => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data: RecipeIngredientsRequest = {
        recipe_name: recipeName,
        people_count: peopleCount,
        difficulty
      }
      
      // Usar método simples para evitar prompt contextualizado
      const result = await aiService.generateRecipeIngredients(data)
      return result
    } catch (err) {
      let errorMessage = 'Erro ao gerar ingredientes da receita'
      
      if (err instanceof Error) {
        if (err.message.includes('No authentication token')) {
          errorMessage = 'Sessão expirada. Faça login novamente.'
        } else if (err.message.includes('401')) {
          errorMessage = 'Não autorizado. Verifique se você está logado.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const classifyProduct = async (productName: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data: ProductClassificationRequest = {
        product_name: productName
      }
      
      // Usar método com contexto para melhor classificação
      const result = await aiService.classifyProductWithContext(data)
      return result
    } catch (err) {
      let errorMessage = 'Erro ao classificar produto'
      
      if (err instanceof Error) {
        if (err.message.includes('No authentication token')) {
          errorMessage = 'Sessão expirada. Faça login novamente.'
        } else if (err.message.includes('401')) {
          errorMessage = 'Não autorizado. Verifique se você está logado.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    generateShoppingList,
    generateRecipeIngredients,
    classifyProduct
  }
}
