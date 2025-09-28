"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileManager } from "@/components/profile/profile-manager"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <div className="lg:pl-64">
          <DashboardHeader />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Perfil</h1>
              <p className="text-muted-foreground">Gerencie suas configurações de conta e preferências.</p>
            </div>
            <ProfileManager />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
