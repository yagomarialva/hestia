"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, Plus, Trash2, Loader2, RefreshCw } from "lucide-react"
import { useActivity } from "@/hooks/use-activity"
import { Button } from "@/components/ui/button"

const getActivityIcon = (iconName: string) => {
  switch (iconName) {
    case 'CheckCircle2':
      return CheckCircle2
    case 'Plus':
      return Plus
    case 'Trash2':
      return Trash2
    default:
      return Plus
  }
}

const getActivityText = (activity: any) => {
  switch (activity.action) {
    case 'completed':
      return (
        <>
          <span className="font-medium text-green-600">concluiu</span>{" "}
          <span className="font-semibold">{activity.item}</span>{" "}
          <span className="text-muted-foreground">de {activity.list}</span>
        </>
      )
    case 'added':
      return (
        <>
          <span className="font-medium text-blue-600">adicionou</span>{" "}
          <span className="font-semibold">{activity.item}</span>{" "}
          <span className="text-muted-foreground">em {activity.list}</span>
        </>
      )
    case 'removed':
      return (
        <>
          <span className="font-medium text-red-600">removeu</span>{" "}
          <span className="font-semibold">{activity.item}</span>{" "}
          <span className="text-muted-foreground">de {activity.list}</span>
        </>
      )
    case 'created':
      return (
        <>
          <span className="font-medium text-purple-600">criou</span>{" "}
          <span className="font-semibold">{activity.list}</span>
        </>
      )
    case 'updated':
      return (
        <>
          <span className="font-medium text-orange-600">atualizou</span>{" "}
          <span className="font-semibold">{activity.list}</span>
        </>
      )
    default:
      return (
        <>
          <span className="font-medium">{activity.action}</span>{" "}
          <span className="font-semibold">{activity.item}</span>{" "}
          <span className="text-muted-foreground">em {activity.list}</span>
        </>
      )
  }
}

export function RecentActivity() {
  const { activities, loading, error, refetch } = useActivity()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Atividade Recente</CardTitle>
          <CardDescription>Suas últimas atualizações nas listas de compras</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-heading">Atividade Recente</CardTitle>
              <CardDescription>Suas últimas atualizações nas listas de compras</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">Erro ao carregar atividades</p>
            <Button variant="outline" size="sm" onClick={refetch}>
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading">Atividade Recente</CardTitle>
            <CardDescription>Suas últimas atualizações nas listas de compras</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refetch}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
            <p className="text-xs text-muted-foreground mt-1">
              Comece criando listas e adicionando itens para ver suas atividades aqui
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const IconComponent = getActivityIcon(activity.icon)
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted">
                    <IconComponent className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    {getActivityText(activity)}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}