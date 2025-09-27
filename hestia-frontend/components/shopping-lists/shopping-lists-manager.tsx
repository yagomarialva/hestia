"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"
import { CreateListDialog } from "./create-list-dialog"
import { ShoppingListCard } from "./shopping-list-card"

// Mock data - replace with real data management
const mockLists = [
  {
    id: 1,
    name: "Weekly test ",
    description: "Regular weekly shopping items",
    itemCount: 12,
    completedCount: 9,
    lastUpdated: "2 hours ago",
    status: "active" as const,
    items: [
      { id: 1, name: "Organic Bananas", category: "Produce", completed: true },
      { id: 2, name: "Greek Yogurt", category: "Dairy", completed: true },
      { id: 3, name: "Whole Wheat Bread", category: "Bakery", completed: false },
      { id: 4, name: "Chicken Breast", category: "Meat", completed: false },
    ],
  },
  {
    id: 2,
    name: "Dinner Party",
    description: "Items for Saturday's dinner party",
    itemCount: 15,
    completedCount: 15,
    lastUpdated: "1 day ago",
    status: "completed" as const,
    items: [],
  },
  {
    id: 3,
    name: "Breakfast Essentials",
    description: "Morning routine items",
    itemCount: 6,
    completedCount: 3,
    lastUpdated: "3 days ago",
    status: "active" as const,
    items: [
      { id: 5, name: "Oatmeal", category: "Pantry", completed: true },
      { id: 6, name: "Fresh Berries", category: "Produce", completed: false },
    ],
  },
]

export function ShoppingListsManager() {
  const [lists, setLists] = useState(mockLists)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all")

  const filteredLists = lists.filter((list) => {
    const matchesSearch = list.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || list.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreateList = (name: string, description: string) => {
    const newList = {
      id: Date.now(),
      name,
      description,
      itemCount: 0,
      completedCount: 0,
      lastUpdated: "Just now",
      status: "active" as const,
      items: [],
    }
    setLists([newList, ...lists])
    setIsCreateDialogOpen(false)
  }

  const handleDeleteList = (listId: number) => {
    setLists(lists.filter((list) => list.id !== listId))
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("active")}
            >
              Active
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("completed")}
            >
              Completed
            </Button>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="font-heading">
          <Plus className="mr-2 h-4 w-4" />
          New List
        </Button>
      </div>

      {/* Lists Grid */}
      {filteredLists.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-heading font-semibold mb-2">No lists found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search terms." : "Create your first shopping list to get started."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="font-heading">
                <Plus className="mr-2 h-4 w-4" />
                Create List
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLists.map((list) => (
            <ShoppingListCard key={list.id} list={list} onDelete={handleDeleteList} />
          ))}
        </div>
      )}

      <CreateListDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateList={handleCreateList}
      />
    </div>
  )
}
