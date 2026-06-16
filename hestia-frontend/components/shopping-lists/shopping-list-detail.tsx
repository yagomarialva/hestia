"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, Plus, Search, MoreHorizontal, Edit, Trash2, Check, Loader2 } from "lucide-react"
import { AddItemDialog } from "./add-item-dialog"
import { buildApiUrl, API_CONFIG } from "@/lib/api-config"
import { useI18n } from "@/lib/i18n/context"

interface BackendItem {
  id: number
  name: string
  quantity: number
  unit: string
  sector: string
  is_purchased: boolean
}

interface BackendShoppingList {
  id: number
  name: string
  description: string
  status: "active" | "completed"
  items: BackendItem[]
}

interface ShoppingListDetailProps {
  listId: number
}

export function ShoppingListDetail({ listId }: ShoppingListDetailProps) {
  const { t } = useI18n()
  const [list, setList] = useState<BackendShoppingList | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)

  const fetchList = async () => {
    try {
      const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SHOPPING_LISTS}/${listId}`))
      if (res.ok) {
        const data = await res.json()
        setList({
          ...data,
          status: data.items?.length > 0 && data.items.every((i: any) => i.is_purchased) ? "completed" : "active"
        })
      } else {
        setList(null)
      }
    } catch (e) {
      console.error(e)
      setList(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [listId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!list) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-heading font-bold mb-2">List not found</h2>
        <p className="text-muted-foreground mb-4">The shopping list you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/dashboard/lists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lists
          </Link>
        </Button>
      </div>
    )
  }

  const filteredItems = (list.items || []).filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const completedItems = filteredItems.filter((item) => item.is_purchased)
  const pendingItems = filteredItems.filter((item) => !item.is_purchased)

  const handleToggleItem = async (item: BackendItem) => {
    try {
      await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.ITEMS}/${item.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_purchased: !item.is_purchased
        })
      })
      fetchList()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    try {
      await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.ITEMS}/${itemId}`), { method: "DELETE" })
      fetchList()
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddItem = async (name: string, category: string, quantityStr: string) => {
    let quantity = 1.0
    let unit = "un"
    
    // Parse quantity string roughly
    if (quantityStr) {
      const parts = quantityStr.split(" ")
      if (!isNaN(parseFloat(parts[0]))) {
        quantity = parseFloat(parts[0])
        if (parts.length > 1) {
          unit = parts.slice(1).join(" ").substring(0, 10)
        }
      }
    }

    try {
      await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SHOPPING_LISTS}/${listId}/items`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          quantity,
          unit,
          sector: "mercearia" // category can be mapped to sector if needed
        })
      })
      fetchList()
      setIsAddItemDialogOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  const totalItems = list.items?.length || 0
  const progressPercentage = totalItems > 0 ? (completedItems.length / totalItems) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/lists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("navigation.back")}
          </Link>
        </Button>
      </div>

      {/* List Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{list.name}</h1>
            <p className="text-muted-foreground">{list.description}</p>
          </div>
          <Badge variant={list.status === "completed" ? "default" : "secondary"}>
            {list.status === "completed" ? t("lists.completed") : t("lists.active")}
          </Badge>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progresso</span>
                <span className="text-muted-foreground">
                  {completedItems.length}/{totalItems} itens
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary rounded-full h-3 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("lists.search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsAddItemDialogOpen(true)} className="font-heading">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Item
        </Button>
      </div>

      {/* Items */}
      <div className="space-y-6">
        {/* Pending Items */}
        {pendingItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Para Comprar ({pendingItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox checked={item.is_purchased} onCheckedChange={() => handleToggleItem(item)} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deletar Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {item.sector}
                      </Badge>
                      <span>{item.quantity} {item.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center">
                <Check className="mr-2 h-5 w-5 text-primary" />
                Comprados ({completedItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-muted/30"
                >
                  <Checkbox checked={item.is_purchased} onCheckedChange={() => handleToggleItem(item)} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium line-through text-muted-foreground">{item.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deletar Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {item.sector}
                      </Badge>
                      <span>{item.quantity} {item.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2">Nenhum item encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Tente ajustar a sua busca." : "Adicione seu primeiro item para começar."}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsAddItemDialogOpen(true)} className="font-heading">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Item
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <AddItemDialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen} onAddItem={handleAddItem} />
    </div>
  )
}
