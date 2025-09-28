"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ShoppingListsManager } from "@/components/shopping-lists/shopping-lists-manager"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ShoppingListsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <div className="lg:pl-64">
          <DashboardHeader />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Listas de Compras</h1>
              <p className="text-muted-foreground">Crie e gerencie suas listas de compras com facilidade.</p>
            </div>
            <ShoppingListsManager />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
