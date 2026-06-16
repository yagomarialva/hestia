import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PantryManager } from "@/components/pantry/pantry-manager"

export const metadata = {
  title: "Controle de Despensa | Hestia",
  description: "Gerencie o estoque atual e ideal da sua casa",
}

export default function PantryPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      <DashboardHeader />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
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
  )
}
