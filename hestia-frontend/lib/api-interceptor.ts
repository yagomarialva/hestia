import { useRouter } from 'next/navigation'

// Interceptor para capturar erros de autenticação
export class ApiInterceptor {
  private static instance: ApiInterceptor
  private router: any = null

  private constructor() {}

  static getInstance(): ApiInterceptor {
    if (!ApiInterceptor.instance) {
      ApiInterceptor.instance = new ApiInterceptor()
    }
    return ApiInterceptor.instance
  }

  setRouter(router: any) {
    this.router = router
  }

  async handleResponse(response: Response): Promise<Response> {
    if (response.status === 401) {
      // Token expirado ou inválido
      this.handleAuthError()
      throw new Error('Unauthorized: Token expired or invalid')
    }
    
    if (response.status === 403) {
      // Sem permissão
      this.handleAuthError()
      throw new Error('Forbidden: Insufficient permissions')
    }

    return response
  }

  private handleAuthError() {
    // Limpar dados de autenticação
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    
    // Só redirecionar se não estiver já na página de login
    const currentPath = window.location.pathname
    if (currentPath !== '/auth/login' && currentPath !== '/auth/register') {
      if (this.router) {
        this.router.push('/auth/login')
      } else {
        // Fallback: recarregar a página para o redirecionamento do middleware
        window.location.href = '/auth/login'
      }
    }
  }

  // Método para verificar se o token está válido
  isTokenValid(): boolean {
    const token = localStorage.getItem('access_token')
    if (!token) return false

    try {
      // Verificar se o token não está expirado (JWT básico)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp > currentTime
    } catch {
      return false
    }
  }

  // Método para fazer requisições com interceptação automática
  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('access_token')
    
    if (!token || !this.isTokenValid()) {
      // Só fazer redirecionamento se não estiver nas páginas de auth
      const currentPath = window.location.pathname
      if (currentPath !== '/auth/login' && currentPath !== '/auth/register') {
        this.handleAuthError()
      }
      throw new Error('No valid token found')
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    return this.handleResponse(response)
  }
}

export const apiInterceptor = ApiInterceptor.getInstance()
