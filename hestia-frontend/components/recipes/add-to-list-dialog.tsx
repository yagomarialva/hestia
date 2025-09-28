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
import { Plus, Check, Loader2 } from "lucide-react"
import { useShoppingListsContext } from "@/lib/shopping-lists-context"
import { useToast } from "@/hooks/use-toast"

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

export function AddToListDialog({ open, onOpenChange, ingredients }: AddToListDialogProps) {
  const { lists, createList, addItem } = useShoppingListsContext()
  const { toast } = useToast()
  const [selectedListId, setSelectedListId] = useState<string>("")
  const [newListName, setNewListName] = useState("")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(new Set())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedListId && !newListName.trim()) return

    setIsLoading(true)
    try {
      let targetListId = selectedListId

      // Create new list if needed
      if (isCreatingNew && newListName.trim()) {
        const newList = await createList({
          name: newListName.trim(),
          description: `Lista criada a partir de receita`
        })
        targetListId = newList.id.toString()
      }

      // Add selected ingredients to the list
      const selectedIngredientData = Array.from(selectedIngredients).map((index) => ingredients[index])
      
      // Add each ingredient to the list
      for (const ingredient of selectedIngredientData) {
        await addItem(parseInt(targetListId), {
          name: ingredient.name,
          category: ingredient.category,
          quantity: ingredient.quantity || undefined
        })
      }

      toast({
        title: "Ingredientes adicionados!",
        description: `${selectedIngredientData.length} ingredientes foram adicionados à lista.`,
      })

      // Reset form
      setSelectedListId("")
      setNewListName("")
      setIsCreatingNew(false)
      setSelectedIngredients(new Set())
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding ingredients to list:", error)
      toast({
        title: "Erro ao adicionar ingredientes",
        description: "Não foi possível adicionar os ingredientes à lista. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
            <DialogTitle className="font-heading">Adicionar Ingredientes à Lista de Compras</DialogTitle>
            <DialogDescription>
              Escolha quais ingredientes adicionar à sua lista de compras.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* List Selection */}
            <div className="space-y-2">
              <Label>Adicionar à lista existente ou criar nova</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={!isCreatingNew ? "default" : "outline"}
                  onClick={() => setIsCreatingNew(false)}
                  className="flex-1"
                >
                  Lista Existente
                </Button>
                <Button
                  type="button"
                  variant={isCreatingNew ? "default" : "outline"}
                  onClick={() => setIsCreatingNew(true)}
                  className="flex-1"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Lista
                </Button>
              </div>
            </div>

            {!isCreatingNew ? (
              <div className="space-y-2">
                <Label htmlFor="list">Selecionar Lista</Label>
                <Select value={selectedListId} onValueChange={setSelectedListId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolher uma lista de compras" />
                  </SelectTrigger>
                  <SelectContent>
                    {lists.map((list) => (
                      <SelectItem key={list.id} value={list.id.toString()}>
                        {list.name} ({list.items?.length || 0} itens)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="newList">Nome da Nova Lista</Label>
                <Input
                  id="newList"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="ex: Ingredientes da Receita"
                  required
                />
              </div>
            )}

            {/* Ingredients Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Selecionar Ingredientes</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  {selectedIngredients.size === ingredients.length ? "Desmarcar Todos" : "Marcar Todos"}
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
              Cancelar
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
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Adicionar {selectedIngredients.size} Ingredientes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}