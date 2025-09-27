import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ShoppingListDetail } from "@/components/shopping-lists/shopping-list-detail"

interface ShoppingListDetailPageProps {
  params: {
    id: string
  }
}

export default function ShoppingListDetailPage({ params }: ShoppingListDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6">
          <ShoppingListDetail listId={Number.parseInt(params.id)} />
        </main>
      </div>
    </div>
  )
}
