"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ChefHat, Sparkles, Clock, Users, Loader2 } from "lucide-react"
import { ExtractedIngredients } from "./extracted-ingredients"
import { AddToListDialog } from "./add-to-list-dialog"
import { useAI } from "@/hooks/use-ai"
import { useToast } from "@/hooks/use-toast"

export function RecipeGenerator() {
  const [recipeText, setRecipeText] = useState("")
  const [extractedData, setExtractedData] = useState<any>(null)
  const [isAddToListOpen, setIsAddToListOpen] = useState(false)
  const [peopleCount, setPeopleCount] = useState(1)
  const [difficulty, setDifficulty] = useState<'fácil' | 'normal' | 'difícil'>('normal')

  const { generateRecipeIngredients, isLoading, error } = useAI()
  const { toast } = useToast()

  const handleExtract = async () => {
    if (!recipeText.trim()) return

    try {
      const result = await generateRecipeIngredients(recipeText, peopleCount, difficulty)
      
      // Transform the result to match the expected format
      const transformedData = {
        title: result.recipe_name,
        servings: peopleCount,
        cookTime: result.cooking_time || "Tempo não especificado",
        ingredients: result.ingredients.map((ingredient: any) => ({
          name: ingredient.name,
          quantity: ingredient.quantity,
          category: ingredient.category
        }))
      }
      
      setExtractedData(transformedData)
      
      toast({
        title: "Ingredientes extraídos!",
        description: `Foram extraídos ${result.total_ingredients} ingredientes da receita.`,
      })
    } catch (err) {
      console.error("Error extracting ingredients:", err)
      toast({
        title: "Erro ao extrair ingredientes",
        description: "Não foi possível extrair os ingredientes. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleAddToList = () => {
    if (extractedData?.ingredients) {
      setIsAddToListOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center">
            <ChefHat className="mr-2 h-5 w-5 text-primary" />
            Receita para Lista de Compras
          </CardTitle>
          <CardDescription>
            Cole o texto da sua receita e deixe a IA extrair os ingredientes para sua lista de compras.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="recipe" className="text-sm font-medium">
              Texto da Receita
            </label>
            <Textarea
              id="recipe"
              placeholder="Cole sua receita aqui... (ex: 'Bolo de Chocolate: 2 xícaras de farinha, 1 xícara de açúcar, 3 ovos...')"
              value={recipeText}
              onChange={(e) => setRecipeText(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="people" className="text-sm font-medium">
                Pessoas
              </label>
              <input
                id="people"
                type="number"
                min="1"
                max="20"
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="difficulty" className="text-sm font-medium">
                Dificuldade
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'fácil' | 'normal' | 'difícil')}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
              >
                <option value="fácil">Fácil</option>
                <option value="normal">Normal</option>
                <option value="difícil">Difícil</option>
              </select>
            </div>
          </div>
          
          <Button
            onClick={handleExtract}
            disabled={!recipeText.trim() || isLoading}
            className="w-full font-heading"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Extrair Ingredientes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {extractedData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading">{extractedData.title}</CardTitle>
              <Button onClick={handleAddToList} className="font-heading">
                Adicionar à Lista
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                {extractedData.servings} porções
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {extractedData.cookTime}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ExtractedIngredients ingredients={extractedData.ingredients} onAddToList={handleAddToList} />
          </CardContent>
        </Card>
      )}

      {/* Add to List Dialog */}
      <AddToListDialog
        open={isAddToListOpen}
        onOpenChange={setIsAddToListOpen}
        ingredients={extractedData?.ingredients || []}
      />
    </div>
  )
}