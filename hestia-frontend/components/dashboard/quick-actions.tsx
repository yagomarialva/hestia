import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ChefHat, ShoppingCart } from "lucide-react"

export function QuickActions() {
  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center">
            <Plus className="mr-2 h-5 w-5 text-primary" />
            New List
          </CardTitle>
          <CardDescription>Create a new shopping list</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full font-heading">Create List</Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center">
            <ChefHat className="mr-2 h-5 w-5 text-secondary" />
            AI Recipe
          </CardTitle>
          <CardDescription>Generate ingredients from recipes</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" className="w-full font-heading">
            Generate
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5 text-accent" />
            Quick Shop
          </CardTitle>
          <CardDescription>Add items to your active list</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full font-heading bg-transparent">
            Add Items
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
