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
          <Badge variant={list.status === "completed" ? "default" : "secondary"}>{list.status}</Badge>
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
                {completedItems.length}/{list.items.length} items completed
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