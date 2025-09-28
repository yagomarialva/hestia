"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, CheckCircle2, Loader2 } from "lucide-react"
import { useShoppingLists } from "@/hooks/use-shopping-lists"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function ShoppingListsOverview() {
  const { lists, loading, error } = useShoppingLists()

  const formatLastUpdated = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: ptBR 
      })
    } catch {
      return "Data inválida"
    }
  }

  const getListStatus = (list: any) => {
    if (!list.items || list.items.length === 0) return "empty"
    const completedCount = list.items.filter((item: any) => item.completed).length
    return completedCount === list.items.length ? "completed" : "active"
  }

  const getCompletedCount = (list: any) => {
    if (!list.items) return 0
    return list.items.filter((item: any) => item.completed).length
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Suas Listas de Compras</CardTitle>
          <CardDescription>Gerenciar e acompanhar suas listas de compras</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Suas Listas de Compras</CardTitle>
          <CardDescription>Gerenciar e acompanhar suas listas de compras</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-destructive mb-4">Erro ao carregar listas: {error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  const recentLists = lists.slice(0, 3) // Mostrar apenas as 3 listas mais recentes

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Suas Listas de Compras</CardTitle>
        <CardDescription>Gerenciar e acompanhar suas listas de compras</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentLists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Nenhuma lista de compras encontrada</p>
            <Button asChild>
              <Link href="/dashboard/lists">Criar Primeira Lista</Link>
            </Button>
          </div>
        ) : (
          recentLists.map((list) => {
            const status = getListStatus(list)
            const completedCount = getCompletedCount(list)
            const totalItems = list.items?.length || 0

            return (
              <div
                key={list.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-heading font-semibold">{list.name}</h3>
                    <Badge variant={status === "completed" ? "default" : "secondary"}>
                      {status === "completed" ? "concluída" : status === "empty" ? "vazia" : "ativa"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {completedCount}/{totalItems} itens
                    </span>
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatLastUpdated(list.updated_at || list.created_at)}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/lists/${list.id}`}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )
          })
        )}
        <Button variant="outline" className="w-full font-heading bg-transparent" asChild>
          <Link href="/dashboard/lists">Ver Todas as Listas</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
