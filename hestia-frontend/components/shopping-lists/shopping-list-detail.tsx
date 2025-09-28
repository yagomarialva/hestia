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
import { useShoppingListsContext } from "@/lib/shopping-lists-context"

interface ShoppingListDetailProps {
  listId: number
}

export function ShoppingListDetail({ listId }: ShoppingListDetailProps) {
  const { lists, addItem, updateItem, deleteItem, toggleItemCompletion, loading, error } = useShoppingListsContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  
  const list = lists.find(l => l.id === listId)

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
        <p className="text-destructive mb-4">Erro ao carregar lista: {error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-heading font-bold mb-2">Lista não encontrada</h2>
        <p className="text-muted-foreground mb-4">A lista de compras que você está procurando não existe.</p>
        <Button asChild>
          <Link href="/dashboard/lists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar às Listas
          </Link>
        </Button>
      </div>
    )
  }

  const filteredItems = (list.items || []).filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const completedItems = filteredItems.filter((item) => item.completed)
  const pendingItems = filteredItems.filter((item) => !item.completed)

  const handleToggleItem = async (itemId: number) => {
    try {
      const item = list.items?.find(i => i.id === itemId)
      if (item) {
        await toggleItemCompletion(listId, itemId, !item.completed)
      }
    } catch (error) {
      console.error('Error toggling item:', error)
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    try {
      await deleteItem(listId, itemId)
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const handleAddItem = async (name: string, category: string, quantity: string) => {
    try {
      await addItem(listId, {
        name,
        category,
        quantity: quantity || undefined
      })
      setIsAddItemDialogOpen(false)
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const progressPercentage = (list.items?.length || 0) > 0 ? (completedItems.length / (list.items?.length || 1)) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/lists">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lists
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold">{list.name}</h1>
            <p className="text-muted-foreground">{list.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={completedItems.length === (list.items?.length || 0) && (list.items?.length || 0) > 0 ? "default" : "secondary"}>
            {completedItems.length === (list.items?.length || 0) && (list.items?.length || 0) > 0 ? "concluída" : "ativa"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit List
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-muted-foreground">
                <Check className="mr-1 h-3 w-3" />
                Progress
              </span>
            <span className="font-medium">
              {completedItems.length}/{list.items?.length || 0} itens concluídos
            </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={() => setIsAddItemDialogOpen(true)} className="font-heading">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {/* Pending Items */}
        {pendingItems.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-heading font-semibold">Pending Items</h3>
            <div className="space-y-2">
              {pendingItems.map((item) => (
                <Card key={item.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => handleToggleItem(item.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{item.quantity}</span>
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {item.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-heading font-semibold text-muted-foreground">Completed Items</h3>
            <div className="space-y-2">
              {completedItems.map((item) => (
                <Card key={item.id} className="opacity-60 hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => handleToggleItem(item.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium line-through">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{item.quantity}</span>
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {item.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-heading font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search terms." : "Add your first item to get started."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsAddItemDialogOpen(true)} className="font-heading">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Item Dialog */}
      <AddItemDialog
        open={isAddItemDialogOpen}
        onOpenChange={setIsAddItemDialogOpen}
        onAddItem={handleAddItem}
      />
    </div>
  )
}