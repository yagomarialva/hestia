"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileInfo } from "./profile-info"
import { AccountSettings } from "./account-settings"
import { ShoppingPreferences } from "./shopping-preferences"
import { SecuritySettings } from "./security-settings"

export function ProfileManager() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="max-w-4xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="font-heading">
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="font-heading">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="account" className="font-heading">
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="font-heading">
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileInfo />
        </TabsContent>

        <TabsContent value="preferences">
          <ShoppingPreferences />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
