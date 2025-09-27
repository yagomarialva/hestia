import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ShoppingListsManager } from "@/components/shopping-lists/shopping-lists-manager"

export default function ShoppingListsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Shopping Lists</h1>
            <p className="text-muted-foreground">Create and manage your shopping lists with ease.</p>
          </div>
          <ShoppingListsManager />
        </main>
      </div>
    </div>
  )
}
