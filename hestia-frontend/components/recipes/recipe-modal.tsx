"use client"

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
import { Badge } from "@/components/ui/badge"
import { Clock, ChefHat, Save, Loader2, Image as ImageIcon } from "lucide-react"

interface RecipeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipeData: any
  isLoading: boolean
  onSaveRecipe: (recipeData: any) => void
  onGenerateList: (recipeData: any) => void
}

export function RecipeModal({
  open,
  onOpenChange,
  recipeData,
  isLoading,
  onSaveRecipe,
  onGenerateList,
}: RecipeModalProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveRecipe = async () => {
    setIsSaving(true)
    await onSaveRecipe(recipeData)
    setIsSaving(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-heading text-2xl">Visualizar Receita</DialogTitle>
          <DialogDescription>
            Revise os ingredientes e as instruções extraídas antes de salvar.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 min-h-[300px]">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground animate-pulse">Extraindo receita da página web...</p>
          </div>
        ) : recipeData ? (
          <div className="px-6 overflow-y-auto max-h-[65vh]">
            <div className="space-y-6 pb-6 pt-2">
              <div className="flex flex-col sm:flex-row gap-4">
                {recipeData.image_url ? (
                  <img
                    src={recipeData.image_url}
                    alt={recipeData.title}
                    className="w-full sm:w-40 h-40 object-cover rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="w-full sm:w-40 h-40 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <h2 className="text-2xl font-bold font-heading mb-2">{recipeData.title}</h2>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1.5 h-4 w-4" />
                      {recipeData.cooking_time}
                    </div>
                  </div>
                  {recipeData.source_url && (
                    <a
                      href={recipeData.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-2 line-clamp-1"
                    >
                      {recipeData.source_url}
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-heading font-semibold text-lg flex items-center">
                  <ChefHat className="mr-2 h-5 w-5 text-primary" />
                  Ingredientes ({recipeData.ingredients?.length || 0})
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recipeData.ingredients?.map((ing: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between p-2 rounded-md bg-muted/40">
                      <span className="text-sm font-medium">{ing.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {ing.quantity} {ing.unit}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {ing.sector}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {recipeData.instructions && (
                <div className="space-y-3">
                  <h3 className="font-heading font-semibold text-lg">Modo de Preparo</h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/20 p-4 rounded-lg border border-border">
                    {recipeData.instructions}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground min-h-[300px] flex items-center justify-center">Erro ao carregar os dados.</div>
        )}

        <DialogFooter className="p-6 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading || isSaving}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={handleSaveRecipe}
              disabled={isLoading || isSaving || !recipeData}
              className="font-heading"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Adicionar Receita
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
