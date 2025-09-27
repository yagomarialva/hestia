"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LanguageSelector } from "@/components/ui/language-selector"
import { useI18n } from "@/lib/i18n/context"

export function DashboardHeader() {
  const { t } = useI18n()

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md flex-1 lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("dashboard.search_placeholder") || "Search lists, items, recipes..."}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSelector />

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-secondary rounded-full"></span>
          </Button>

          <Avatar className="h-8 w-8">
            <AvatarImage src="/generic-user-avatar.png" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
