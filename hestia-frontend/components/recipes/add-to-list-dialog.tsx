"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ShoppingCart } from "lucide-react"

interface Ingredient {
  name: string
  quantity: string
  category: string
}

interface AddToListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredients: Ingredient[]
}

// Mock shopping lists - replace with real data
const mockShoppingLists = [
  { id: 1, name: "Weekly Groceries", itemCount: 12 },
  { id: 2, name: "Breakfast Essentials", itemCount: 6 },
  { id: 3, name: "Dinner Party", itemCount: 15 },
]

export function AddToListDialog({ open, onOpenChange, ingredients }: AddToListDialogProps) {
  const [selectedListId, setSelectedListId] = useState<string>("")
  const [newListName, setNewListName] = useState("")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedListId && !newListName.trim()) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      // Here you would add ingredients to the selected or new list
      console.log("Adding ingredients to list:", {
        listId: selectedListId,
        newListName: newListName,
        ingredients,
      })
      setIsLoading(false)
      onOpenChange(false)
      // Reset form
      setSelectedListId("")
      setNewListName("")
      setIsCreatingNew(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading">Add Ingredients to Shopping List</DialogTitle>
          <DialogDescription>
            Choose an existing list or create a new one for your recipe ingredients.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Ingredients Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ingredients to add ({ingredients.length})</Label>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {ingredients.slice(0, 6).map((ingredient, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {ingredient.name}
                      </Badge>
                    ))}
                    {ingredients.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{ingredients.length - 6} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* List Selection */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Choose destination</Label>
              <RadioGroup
                value={isCreatingNew ? "new" : selectedListId}
                onValueChange={(value) => {
                  if (value === "new") {
                    setIsCreatingNew(true)
                    setSelectedListId("")
                  } else {
                    setIsCreatingNew(false)
                    setSelectedListId(value)
                  }
                }}
              >
                {/* Existing Lists */}
                {mockShoppingLists.map((list) => (
                  <div key={list.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={list.id.toString()} id={`list-${list.id}`} />
                    <Label htmlFor={`list-${list.id}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{list.name}</span>
                        <span className="text-sm text-muted-foreground">{list.itemCount} items</span>
                      </div>
                    </Label>
                  </div>
                ))}

                {/* Create New List */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new-list" />
                  <Label htmlFor="new-list" className="flex items-center cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Create new list
                  </Label>
                </div>
              </RadioGroup>

              {/* New List Name Input */}
              {isCreatingNew && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="new-list-name">List name</Label>
                  <Input
                    id="new-list-name"
                    placeholder="e.g., Recipe Ingredients"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    required={isCreatingNew}
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={(!selectedListId && !newListName.trim()) || isLoading}
              className="font-heading"
            >
              {isLoading ? (
                "Adding..."
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add Ingredients
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
