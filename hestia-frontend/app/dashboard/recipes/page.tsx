import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RecipeGenerator } from "@/components/recipes/recipe-generator"

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">AI Recipe Generator</h1>
            <p className="text-muted-foreground">
              Extract ingredients from recipes and add them directly to your shopping lists.
            </p>
          </div>
          <RecipeGenerator />
        </main>
      </div>
    </div>
  )
}
