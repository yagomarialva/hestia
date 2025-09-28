"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileInfo } from "./profile-info"

export function ProfileManager() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="max-w-4xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="profile" className="font-heading">
            Perfil
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileInfo />
        </TabsContent>
      </Tabs>
    </div>
  )
}
