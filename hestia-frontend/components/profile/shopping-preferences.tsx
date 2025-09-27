"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Save, X } from "lucide-react"

// Mock preferences data
const mockPreferences = {
  defaultStore: "whole-foods",
  autoSort: true,
  groupByCategory: true,
  showNutritionInfo: false,
  enableNotifications: true,
  dietaryRestrictions: ["vegetarian", "gluten-free"],
  preferredBrands: ["Organic Valley", "365 Everyday Value", "Whole Foods"],
}

const stores = [
  { value: "whole-foods", label: "Whole Foods Market" },
  { value: "kroger", label: "Kroger" },
  { value: "safeway", label: "Safeway" },
  { value: "trader-joes", label: "Trader Joe's" },
  { value: "walmart", label: "Walmart" },
  { value: "target", label: "Target" },
]

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "nut-free", label: "Nut-Free" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "low-sodium", label: "Low Sodium" },
]

export function ShoppingPreferences() {
  const [preferences, setPreferences] = useState(mockPreferences)
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setHasChanges(false)
    }, 1000)
  }

  const handleReset = () => {
    setPreferences(mockPreferences)
    setHasChanges(false)
  }

  const updatePreference = (key: string, value: any) => {
    setPreferences({ ...preferences, [key]: value })
    setHasChanges(true)
  }

  const toggleDietaryRestriction = (restriction: string) => {
    const current = preferences.dietaryRestrictions
    const updated = current.includes(restriction) ? current.filter((r) => r !== restriction) : [...current, restriction]
    updatePreference("dietaryRestrictions", updated)
  }

  return (
    <div className="space-y-6">
      {/* Shopping Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Shopping Settings</CardTitle>
          <CardDescription>Customize your shopping experience and list organization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="default-store">Default Store</Label>
            <Select value={preferences.defaultStore} onValueChange={(value) => updatePreference("defaultStore", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your preferred store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.value} value={store.value}>
                    {store.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-sort items</Label>
                <p className="text-sm text-muted-foreground">Automatically organize items by store layout</p>
              </div>
              <Switch
                checked={preferences.autoSort}
                onCheckedChange={(checked) => updatePreference("autoSort", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Group by category</Label>
                <p className="text-sm text-muted-foreground">Group similar items together in lists</p>
              </div>
              <Switch
                checked={preferences.groupByCategory}
                onCheckedChange={(checked) => updatePreference("groupByCategory", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show nutrition info</Label>
                <p className="text-sm text-muted-foreground">Display nutritional information when available</p>
              </div>
              <Switch
                checked={preferences.showNutritionInfo}
                onCheckedChange={(checked) => updatePreference("showNutritionInfo", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable notifications</Label>
                <p className="text-sm text-muted-foreground">Get reminders and updates about your lists</p>
              </div>
              <Switch
                checked={preferences.enableNotifications}
                onCheckedChange={(checked) => updatePreference("enableNotifications", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dietary Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Dietary Restrictions</CardTitle>
          <CardDescription>Help us suggest appropriate recipes and ingredients.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={preferences.dietaryRestrictions.includes(option.id)}
                    onCheckedChange={() => toggleDietaryRestriction(option.id)}
                  />
                  <Label htmlFor={option.id} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>

            {preferences.dietaryRestrictions.length > 0 && (
              <div className="space-y-2">
                <Label>Selected restrictions:</Label>
                <div className="flex flex-wrap gap-2">
                  {preferences.dietaryRestrictions.map((restriction) => (
                    <Badge key={restriction} variant="secondary">
                      {dietaryOptions.find((opt) => opt.id === restriction)?.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferred Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Preferred Brands</CardTitle>
          <CardDescription>Your favorite brands for better recipe suggestions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {preferences.preferredBrands.map((brand, index) => (
              <Badge key={index} variant="outline">
                {brand}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Brand preferences help us suggest better alternatives and deals.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center space-x-2">
          <Button onClick={handleSave} disabled={isLoading} className="font-heading">
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <X className="mr-2 h-4 w-4" />
            Reset Changes
          </Button>
        </div>
      )}
    </div>
  )
}
