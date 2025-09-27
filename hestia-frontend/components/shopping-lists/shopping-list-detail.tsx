"use client"

import { useState } from "react"
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
import { ArrowLeft, Plus, Search, MoreHorizontal, Edit, Trash2, Check } from "lucide-react"
import { AddItemDialog } from "./add-item-dialog"

// Mock data - replace with real data fetching
const mockListData = {
  1: {
    id: 1,
    name: "Weekly Groceries",
    description: "Regular weekly shopping items",
    status: "active" as "active" | "completed",
    items: [
      { id: 1, name: "Organicc Bananas", category: "Produce", completed: true, quantity: "2 lbs" },
      { id: 2, name: "Greek Yogurt", category: "Dairy", completed: true, quantity: "1 container" },
      { id: 3, name: "Whole Wheat Bread", category: "Bakery", completed: false, quantity: "1 loaf" },
      { id: 4, name: "Chicken Breast", category: "Meat", completed: false, quantity: "2 lbs" },
      { id: 5, name: "Fresh Spinach", category: "Produce", completed: false, quantity: "1 bag" },
      { id: 6, name: "Olive Oil", category: "Pantry", completed: true, quantity: "1 bottle" },
    ],
  },
}

interface ShoppingListDetailProps {
  listId: number
}

export function ShoppingListDetail({ listId }: ShoppingListDetailProps) {
  const [list, setList] = useState(mockListData[listId as keyof typeof mockListData])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)

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

  const filteredItems = list.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const completedItems = filteredItems.filter((item) => item.completed)
  const pendingItems = filteredItems.filter((item) => !item.completed)

  const handleToggleItem = (itemId: number) => {
    setList({
      ...list,
      items: list.items.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
    })
  }

  const handleDeleteItem = (itemId: number) => {
    setList({
      ...list,
      items: list.items.filter((item) => item.id !== itemId),
    })
  }

  const handleAddItem = (name: string, category: string, quantity: string) => {
    const newItem = {
      id: Date.now(),
      name,
      category,
      quantity,
      completed: false,
    }
    setList({
      ...list,
      items: [...list.items, newItem],
    })
    setIsAddItemDialogOpen(false)
  }

  const progressPercentage = list.items.length > 0 ? (completedItems.length / list.items.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/lists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lists
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
          <Badge variant={list.status === "completed" ? "default" : "secondary"}>{list.status === "completed" ? "Completed" : "Active"}</Badge>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">
                  {completedItems.length}/{list.items.length} items completed
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
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsAddItemDialogOpen(true)} className="font-heading">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Items */}
      <div className="space-y-6">
        {/* Pending Items */}
        {pendingItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">To Buy ({pendingItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox checked={item.completed} onCheckedChange={() => handleToggleItem(item.id)} />
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <span>{item.quantity}</span>
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
                Completed ({completedItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-muted/30"
                >
                  <Checkbox checked={item.completed} onCheckedChange={() => handleToggleItem(item.id)} />
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <span>{item.quantity}</span>
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
            </CardContent>
          </Card>
        )}
      </div>

      <AddItemDialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen} onAddItem={handleAddItem} />
    </div>
  )
}
