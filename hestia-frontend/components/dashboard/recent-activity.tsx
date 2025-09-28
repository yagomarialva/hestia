import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, Plus, Trash2 } from "lucide-react"

const mockActivity = [
  {
    id: 1,
    action: "completed",
    item: "Organic Bananas",
    list: "Weekly Groceries",
    time: "5 minutes ago",
    icon: CheckCircle2,
  },
  {
    id: 2,
    action: "added",
    item: "Greek Yogurt",
    list: "Breakfast Essentials",
    time: "1 hour ago",
    icon: Plus,
  },
  {
    id: 3,
    action: "removed",
    item: "Ice Cream",
    list: "Weekly Groceries",
    time: "2 hours ago",
    icon: Trash2,
  },
  {
    id: 4,
    action: "completed",
    item: "Whole Wheat Bread",
    list: "Weekly Groceries",
    time: "3 hours ago",
    icon: CheckCircle2,
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Recent Activity</CardTitle>
        <CardDescription>Your latest shopping list updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivity.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted">
                <activity.icon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.action}</span>{" "}
                <span className="font-semibold">{activity.item}</span>{" "}
                <span className="text-muted-foreground">from {activity.list}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}