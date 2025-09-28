"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface CreateListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateList: (name: string, description: string) => Promise<void>
}

export function CreateListDialog({ open, onOpenChange, onCreateList }: CreateListDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      await onCreateList(name.trim(), description.trim())
      setName("")
      setDescription("")
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating list:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-heading">Criar Nova Lista</DialogTitle>
            <DialogDescription>
              Crie uma nova lista de compras para organizar seus itens.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Lista</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Compras da Semana"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ex: Lista para compras da semana, incluindo frutas e verduras"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()} className="font-heading">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Lista"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}