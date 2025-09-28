"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Loader2 } from "lucide-react"
import { CreateListDialog } from "./create-list-dialog"
import { ShoppingListCard } from "./shopping-list-card"
import { useShoppingListsContext } from "@/lib/shopping-lists-context"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function ShoppingListsManager() {
  const { lists, loading, error, createList, deleteList } = useShoppingListsContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all")

  const getListStatus = (list: any) => {
    if (!list.items || list.items.length === 0) return "empty"
    const completedCount = list.items.filter((item: any) => item.completed).length
    return completedCount === list.items.length ? "completed" : "active"
  }

  const getCompletedCount = (list: any) => {
    if (!list.items) return 0
    return list.items.filter((item: any) => item.completed).length
  }

  const getItemCount = (list: any) => {
    return list.items?.length || 0
  }

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

  const filteredLists = lists.filter((list) => {
    const matchesSearch = list.name.toLowerCase().includes(searchQuery.toLowerCase())
    const status = getListStatus(list)
    const matchesFilter = filterStatus === "all" || status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreateList = async (name: string, description: string) => {
    try {
      await createList({
        name,
        description: description || undefined
      })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating list:', error)
    }
  }

  const handleDeleteList = async (listId: number) => {
    try {
      await deleteList(listId)
    } catch (error) {
      console.error('Error deleting list:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Erro ao carregar listas: {error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar listas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "completed")}
            className="px-3 py-2 border border-border rounded-md bg-background text-sm"
          >
            <option value="all">Todas as Listas</option>
            <option value="active">Ativas</option>
            <option value="completed">Concluídas</option>
          </select>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="font-heading">
            <Plus className="mr-2 h-4 w-4" />
            Nova Lista
          </Button>
        </div>
      </div>

      {/* Lists Grid */}
      {filteredLists.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-heading font-semibold mb-2">Nenhuma lista encontrada</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Tente ajustar os termos de busca." : "Crie sua primeira lista de compras para começar."}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreateDialogOpen(true)} className="font-heading">
              <Plus className="mr-2 h-4 w-4" />
              Criar Lista
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLists.map((list) => {
            const status = getListStatus(list)
            const completedCount = getCompletedCount(list)
            const itemCount = getItemCount(list)
            
            return (
              <ShoppingListCard 
                key={list.id} 
                list={{
                  ...list,
                  itemCount,
                  completedCount,
                  lastUpdated: formatLastUpdated(list.updated_at || list.created_at),
                  status: status as "active" | "completed"
                }} 
                onDelete={handleDeleteList} 
              />
            )
          })}
        </div>
      )}

      {/* Create List Dialog */}
      <CreateListDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateList={handleCreateList}
      />
    </div>
  )
}