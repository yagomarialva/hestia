import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RecipesManager } from "@/components/recipes/recipes-manager"

export default function SavedRecipesPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Minhas Receitas</h1>
            <p className="text-muted-foreground">
              Gerencie suas receitas salvas, visualize os detalhes e crie listas de compras a partir delas.
            </p>
          </div>
          <RecipesManager />
        </main>
      </div>
    </div>
  )
}
