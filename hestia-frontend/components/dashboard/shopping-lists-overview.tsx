import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, CheckCircle2 } from "lucide-react"

const mockLists = [
  {
    id: 1,
    name: "Weekly Groceries",
    itemCount: 12,
    completedCount: 8,
    lastUpdated: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    name: "Dinner Party",
    itemCount: 15,
    completedCount: 15,
    lastUpdated: "1 day ago",
    status: "completed",
  },
  {
    id: 3,
    name: "Breakfast Essentials",
    itemCount: 6,
    completedCount: 3,
    lastUpdated: "3 days ago",
    status: "active",
  },
]

export function ShoppingListsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Your Shopping Lists</CardTitle>
        <CardDescription>Manage and track your shopping lists</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockLists.map((list) => (
          <div
            key={list.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-heading font-semibold">{list.name}</h3>
                <Badge variant={list.status === "completed" ? "default" : "secondary"}>{list.status}</Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  {list.completedCount}/{list.itemCount} items
                </span>
                <span className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {list.lastUpdated}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" className="w-full font-heading bg-transparent">
          View All Lists
        </Button>
      </CardContent>
    </Card>
  )
}
