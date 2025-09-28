"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Check } from "lucide-react"

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
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(new Set())

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
        ingredients: ingredients.filter((_, index) => selectedIngredients.has(index)),
      })
      setIsLoading(false)
      onOpenChange(false)
      // Reset form
      setSelectedListId("")
      setNewListName("")
      setIsCreatingNew(false)
      setSelectedIngredients(new Set())
    }, 1000)
  }

  const handleIngredientToggle = (index: number) => {
    const newSelected = new Set(selectedIngredients)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedIngredients(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedIngredients.size === ingredients.length) {
      setSelectedIngredients(new Set())
    } else {
      setSelectedIngredients(new Set(ingredients.map((_, index) => index)))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-heading">Add Ingredients to Shopping List</DialogTitle>
            <DialogDescription>
              Choose which ingredients to add to your shopping list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* List Selection */}
            <div className="space-y-2">
              <Label>Add to existing list or create new</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={!isCreatingNew ? "default" : "outline"}
                  onClick={() => setIsCreatingNew(false)}
                  className="flex-1"
                >
                  Existing List
                </Button>
                <Button
                  type="button"
                  variant={isCreatingNew ? "default" : "outline"}
                  onClick={() => setIsCreatingNew(true)}
                  className="flex-1"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New List
                </Button>
              </div>
            </div>

            {!isCreatingNew ? (
              <div className="space-y-2">
                <Label htmlFor="list">Select List</Label>
                <Select value={selectedListId} onValueChange={setSelectedListId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a shopping list" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockShoppingLists.map((list) => (
                      <SelectItem key={list.id} value={list.id.toString()}>
                        {list.name} ({list.itemCount} items)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="newList">New List Name</Label>
                <Input
                  id="newList"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g., Recipe Ingredients"
                  required
                />
              </div>
            )}

            {/* Ingredients Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Select Ingredients</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  {selectedIngredients.size === ingredients.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ingredient-${index}`}
                      checked={selectedIngredients.has(index)}
                      onCheckedChange={() => handleIngredientToggle(index)}
                    />
                    <label
                      htmlFor={`ingredient-${index}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-muted-foreground ml-2">
                        ({ingredient.quantity}) - {ingredient.category}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                (!isCreatingNew && !selectedListId) ||
                (isCreatingNew && !newListName.trim()) ||
                selectedIngredients.size === 0
              }
              className="font-heading"
            >
              {isLoading ? (
                "Adding..."
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Add {selectedIngredients.size} Ingredients
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}