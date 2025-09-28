"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RecipeGenerator } from "@/components/recipes/recipe-generator"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function RecipesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <div className="lg:pl-64">
          <DashboardHeader />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Gerador de Receitas com IA</h1>
              <p className="text-muted-foreground">
                Extraia ingredientes de receitas e adicione-os diretamente às suas listas de compras.
              </p>
            </div>
            <RecipeGenerator />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
