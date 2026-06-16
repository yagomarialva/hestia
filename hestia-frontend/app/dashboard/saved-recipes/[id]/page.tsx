import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RecipeDetail } from "@/components/recipes/recipe-detail"

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new"

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6">
          <RecipeDetail recipeId={isNew ? null : parseInt(params.id)} />
        </main>
      </div>
    </div>
  )
}
