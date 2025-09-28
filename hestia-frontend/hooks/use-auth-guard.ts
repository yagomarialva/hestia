"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiInterceptor } from '@/lib/api-interceptor'

export function useAuthGuard() {
  const router = useRouter()

  useEffect(() => {
    // Configurar o router no interceptor
    apiInterceptor.setRouter(router)

    // Verificar se o token é válido
    if (!apiInterceptor.isTokenValid()) {
      router.push('/auth/login')
    }
  }, [router])

  return {
    isAuthenticated: apiInterceptor.isTokenValid(),
    logout: () => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      router.push('/auth/login')
    }
  }
}
