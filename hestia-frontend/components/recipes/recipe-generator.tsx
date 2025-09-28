"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ChefHat, Sparkles, Clock, Users } from "lucide-react"
import { ExtractedIngredients } from "./extracted-ingredients"
import { AddToListDialog } from "./add-to-list-dialog"

// Mock AI function - replace with real AI integration
const extractIngredientsFromRecipe = async (recipeText: string) => {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock extracted data - replace with real AI extraction
  return {
    title: "Creamy Chicken Alfredo Pasta",
    servings: 4,
    cookTime: "30 minutes",
    ingredients: [
      { name: "Chicken Breast", quantity: "1 lb", category: "Meat" },
      { name: "Fettuccine Pasta", quantity: "12 oz", category: "Pantry" },
      { name: "Heavy Cream", quantity: "1 cup", category: "Dairy" },
      { name: "Parmesan Cheese", quantity: "1 cup grated", category: "Dairy" },
      { name: "Garlic", quantity: "3 cloves", category: "Produce" },
      { name: "Butter", quantity: "2 tbsp", category: "Dairy" },
      { name: "Olive Oil", quantity: "2 tbsp", category: "Pantry" },
      { name: "Salt", quantity: "to taste", category: "Pantry" },
      { name: "Black Pepper", quantity: "to taste", category: "Pantry" },
      { name: "Fresh Parsley", quantity: "2 tbsp chopped", category: "Produce" },
    ],
  }
}

export function RecipeGenerator() {
  const [recipeText, setRecipeText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [isAddToListOpen, setIsAddToListOpen] = useState(false)

  const handleExtract = async () => {
    if (!recipeText.trim()) return

    setIsProcessing(true)
    try {
      const result = await extractIngredientsFromRecipe(recipeText)
      setExtractedData(result)
    } catch (error) {
      console.error("Error extracting ingredients:", error)
    } finally {
      setIsProcessing(false)
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
            Recipe to Shopping List
          </CardTitle>
          <CardDescription>
            Paste your recipe text and let AI extract the ingredients for your shopping list.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="recipe" className="text-sm font-medium">
              Recipe Text
            </label>
            <Textarea
              id="recipe"
              placeholder="Paste your recipe here... (e.g., 'Creamy Chicken Alfredo Pasta: 1 lb chicken breast, 12 oz fettuccine pasta, 1 cup heavy cream...')"
              value={recipeText}
              onChange={(e) => setRecipeText(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
          <Button
            onClick={handleExtract}
            disabled={!recipeText.trim() || isProcessing}
            className="w-full font-heading"
          >
            {isProcessing ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Extract Ingredients
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
                Add to Shopping List
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                {extractedData.servings} servings
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {extractedData.cookTime}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ExtractedIngredients ingredients={extractedData.ingredients} />
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