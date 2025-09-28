import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle2, Calendar } from "lucide-react"

interface ShoppingListCardProps {
  list: {
    id: number
    name: string
    description: string
    itemCount: number
    completedCount: number
    lastUpdated: string
    status: "active" | "completed"
  }
  onDelete: (listId: number) => void
}

export function ShoppingListCard({ list, onDelete }: ShoppingListCardProps) {
  const progressPercentage = list.itemCount > 0 ? (list.completedCount / list.itemCount) * 100 : 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-heading line-clamp-1">{list.name}</CardTitle>
            <CardDescription className="line-clamp-2">{list.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/lists/${list.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit List
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(list.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant={list.status === "completed" ? "default" : "secondary"}>{list.status}</Badge>
          <span className="text-sm text-muted-foreground flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            {list.lastUpdated}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-muted-foreground">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Progress
            </span>
            <span className="font-medium">
              {list.completedCount}/{list.itemCount} items
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <Button asChild variant="outline" className="w-full font-heading bg-transparent">
          <Link href={`/dashboard/lists/${list.id}`}>View List</Link>
        </Button>
      </CardContent>
    </Card>
  )
}