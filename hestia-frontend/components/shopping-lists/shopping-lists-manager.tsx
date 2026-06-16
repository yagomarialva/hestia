"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Loader2 } from "lucide-react"
import { CreateListDialog } from "./create-list-dialog"
import { ShoppingListCard } from "./shopping-list-card"
import { useI18n } from "@/lib/i18n/context"
import { buildApiUrl, API_CONFIG } from "@/lib/api-config"

interface BackendItem {
  id: number;
  name: string;
  completed: boolean;
}

interface BackendShoppingList {
  id: number;
  name: string;
  description: string;
  created_at: string;
  items: BackendItem[];
}

export function ShoppingListsManager() {
  const { t } = useI18n()
  const [lists, setLists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all")

  const fetchLists = async () => {
    setLoading(true)
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SHOPPING_LISTS))
      if (res.ok) {
        const data: BackendShoppingList[] = await res.json()
        const mappedLists = data.map(list => {
          const itemCount = list.items?.length || 0;
          const completedCount = list.items?.filter(i => i.completed).length || 0;
          return {
            id: list.id,
            name: list.name,
            description: list.description || "",
            itemCount,
            completedCount,
            lastUpdated: new Date(list.created_at).toLocaleDateString(),
            status: (itemCount > 0 && itemCount === completedCount) ? "completed" : "active",
            items: list.items || []
          }
        })
        setLists(mappedLists)
      }
    } catch (error) {
      console.error("Failed to fetch lists", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLists()
  }, [])

  const filteredLists = lists.filter((list) => {
    const matchesSearch = list.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || list.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreateList = async (name: string, description: string) => {
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SHOPPING_LISTS), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, description })
      })
      if (res.ok) {
        fetchLists()
        setIsCreateDialogOpen(false)
      }
    } catch (error) {
      console.error("Failed to create list", error)
    }
  }

  const handleDeleteList = async (listId: number) => {
    try {
      const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SHOPPING_LISTS}/${listId}`), {
        method: "DELETE"
      })
      if (res.ok) {
        fetchLists()
      }
    } catch (error) {
      console.error("Failed to delete list", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("lists.search_placeholder")}
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
              {t("lists.all")}
            </Button>
            <Button
              variant={filterStatus === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("active")}
            >
              {t("lists.active")}
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("completed")}
            >
              {t("lists.completed")}
            </Button>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="font-heading">
          <Plus className="mr-2 h-4 w-4" />
          {t("lists.new_list")}
        </Button>
      </div>

      {/* Lists Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredLists.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-heading font-semibold mb-2">{t("lists.no_lists_found")}</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? t("lists.try_adjusting") : t("lists.create_first")}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="font-heading">
                <Plus className="mr-2 h-4 w-4" />
                {t("quick_actions.create_list")}
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

