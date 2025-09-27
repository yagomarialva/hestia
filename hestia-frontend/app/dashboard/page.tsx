"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ShoppingListsOverview } from "@/components/dashboard/shopping-lists-overview"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { useI18n } from "@/lib/i18n/context"

export default function DashboardPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{t("dashboard.welcome")}</h1>
            <p className="text-muted-foreground">{t("dashboard.overview")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <QuickActions />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ShoppingListsOverview />
            </div>
            <div>
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
