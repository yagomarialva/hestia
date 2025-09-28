"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Loader2 } from "lucide-react"

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (name: string, category: string, quantity: string) => Promise<void>
}

const categories = [
  "Produce",
  "Dairy",
  "Meat",
  "Pantry",
  "Bakery",
  "Frozen",
  "Beverages",
  "Snacks",
  "Health & Beauty",
  "Household",
  "Other",
]

export function AddItemDialog({ open, onOpenChange, onAddItem }: AddItemDialogProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !category) return

    setIsLoading(true)
    try {
      await onAddItem(name.trim(), category, quantity.trim())
      setName("")
      setCategory("")
      setQuantity("")
      onOpenChange(false)
    } catch (error) {
      console.error('Error adding item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-heading">Adicionar Novo Item</DialogTitle>
            <DialogDescription>
              Adicione um novo item à sua lista de compras.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Item</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Banana Orgânica"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade (Opcional)</Label>
              <Input
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="ex: 2 kg, 1 unidade"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim() || !category} className="font-heading">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adicionando...
                </>
              ) : (
                "Adicionar Item"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}