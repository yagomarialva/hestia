import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { PantryManager } from "@/components/pantry/pantry-manager"

export const metadata = {
  title: "Controle de Despensa | Hestia",
  description: "Gerencie o estoque atual e ideal da sua casa",
}

export default function PantryPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold text-foreground">Controle de Despensa</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie a quantidade ideal de produtos na sua casa e gere listas de reposição automaticamente.
              </p>
            </div>
            <PantryManager />
          </div>
        </main>
      </div>
    </div>
  )
}
