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
  const [isAddToListDialogOpen, setIsAddToListDialogOpen] = useState(false)

  const handleExtractIngredients = async () => {
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

  const handleClearAll = () => {
    setRecipeText("")
    setExtractedData(null)
  }

  const sampleRecipes = [
    {
      title: "Classic Spaghetti Carbonara",
      preview: "A traditional Italian pasta dish with eggs, cheese, and pancetta...",
    },
    {
      title: "Chicken Tikka Masala",
      preview: "Tender chicken in a creamy, spiced tomato sauce...",
    },
    {
      title: "Chocolate Chip Cookies",
      preview: "Soft and chewy homemade cookies with chocolate chips...",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Recipe Input */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center">
            <ChefHat className="mr-2 h-5 w-5 text-primary" />
            Recipe Input
          </CardTitle>
          <CardDescription>Paste your recipe text below and let AI extract the ingredients for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your recipe here... Include the title, ingredients list, and instructions for best results."
            value={recipeText}
            onChange={(e) => setRecipeText(e.target.value)}
            rows={8}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {recipeText.length > 0 && `${recipeText.length} characters`}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleClearAll} disabled={!recipeText && !extractedData}>
                Clear All
              </Button>
              <Button
                onClick={handleExtractIngredients}
                disabled={!recipeText.trim() || isProcessing}
                className="font-heading"
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Recipes */}
      {!extractedData && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Try a Sample Recipe</CardTitle>
            <CardDescription>Click on any sample recipe to see how the AI extraction works.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {sampleRecipes.map((recipe, index) => (
                <div
                  key={index}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setRecipeText(`${recipe.title}\n\n${recipe.preview}`)
                  }}
                >
                  <h4 className="font-heading font-semibold mb-1">{recipe.title}</h4>
                  <p className="text-sm text-muted-foreground">{recipe.preview}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Results */}
      {extractedData && (
        <div className="space-y-6">
          {/* Recipe Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">{extractedData.title}</CardTitle>
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
          </Card>

          {/* Extracted Ingredients */}
          <ExtractedIngredients
            ingredients={extractedData.ingredients}
            onAddToList={() => setIsAddToListDialogOpen(true)}
          />
        </div>
      )}

      <AddToListDialog
        open={isAddToListDialogOpen}
        onOpenChange={setIsAddToListDialogOpen}
        ingredients={extractedData?.ingredients || []}
      />
    </div>
  )
}
