"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Check } from "lucide-react"

interface Ingredient {
  name: string
  quantity: string
  category: string
}

interface ExtractedIngredientsProps {
  ingredients: Ingredient[]
  onAddToList: () => void
}

export function ExtractedIngredients({ ingredients, onAddToList }: ExtractedIngredientsProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(
    new Set(ingredients.map((_, index) => index)),
  )

  const handleToggleIngredient = (index: number) => {
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

  const selectedCount = selectedIngredients.size

  // Group ingredients by category
  const groupedIngredients = ingredients.reduce(
    (acc, ingredient, index) => {
      if (!acc[ingredient.category]) {
        acc[ingredient.category] = []
      }
      acc[ingredient.category].push({ ...ingredient, index })
      return acc
    },
    {} as Record<string, Array<Ingredient & { index: number }>>,
  )

  // Gerar resumo dos ingredientes
  const generateSummary = () => {
    const totalIngredients = ingredients.length
    const categories = Object.keys(groupedIngredients)
    const mainCategories = categories.slice(0, 3).join(', ')
    const remainingCategories = categories.length - 3
    
    return {
      total: totalIngredients,
      mainCategories,
      remainingCategories,
      hasMore: remainingCategories > 0
    }
  }

  const summary = generateSummary()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading flex items-center">
              <Check className="mr-2 h-5 w-5 text-primary" />
              Ingredientes Extraídos
            </CardTitle>
            <CardDescription>
              A IA identificou {ingredients.length} ingredientes. Selecione quais adicionar à sua lista de compras.
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedIngredients.size === ingredients.length ? "Desmarcar Todos" : "Marcar Todos"}
            </Button>
            <Button onClick={onAddToList} disabled={selectedCount === 0} className="font-heading">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Adicionar à Lista ({selectedCount})
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {/* Resumo Geral */}
      <div className="px-6 pb-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="font-bold text-primary text-sm leading-relaxed">
            📋 <strong>Resumo da Receita:</strong> {summary.total} ingredientes organizados em {Object.keys(groupedIngredients).length} categorias principais. 
            {summary.mainCategories && (
              <>
                {' '}Principais categorias: <strong>{summary.mainCategories}</strong>
                {summary.hasMore && ` e mais ${summary.remainingCategories} categorias`}.
              </>
            )}
            {' '}Todos os ingredientes foram extraídos automaticamente pela IA e estão prontos para serem adicionados à sua lista de compras.
          </p>
        </div>
      </div>
      
      <CardContent className="space-y-6">
        {Object.entries(groupedIngredients).map(([category, categoryIngredients]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              {category}
            </h4>
            <div className="space-y-2">
              {categoryIngredients.map((ingredient) => (
                <div
                  key={ingredient.index}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedIngredients.has(ingredient.index)}
                    onCheckedChange={() => handleToggleIngredient(ingredient.index)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{ingredient.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {ingredient.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{ingredient.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
