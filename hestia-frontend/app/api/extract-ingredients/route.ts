import { type NextRequest, NextResponse } from "next/server"

// Mock AI extraction function - replace with real AI service
async function extractIngredientsWithAI(recipeText: string) {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simple regex-based extraction for demo purposes
  // In production, use a proper AI service like OpenAI, Anthropic, etc.
  const lines = recipeText.split("\n")
  const ingredients: Array<{ name: string; quantity: string; category: string }> = []

  // Look for ingredient patterns
  const ingredientPatterns = [
    /(\d+(?:\.\d+)?\s*(?:cups?|tbsp|tsp|lbs?|oz|cloves?|slices?))\s+(.+)/i,
    /(\d+(?:\.\d+)?)\s+(.+)/i,
    /(to taste)\s+(.+)/i,
  ]

  // Category mapping for common ingredients
  const categoryMap: Record<string, string> = {
    chicken: "Meat",
    beef: "Meat",
    pork: "Meat",
    fish: "Meat",
    milk: "Dairy",
    cheese: "Dairy",
    butter: "Dairy",
    cream: "Dairy",
    yogurt: "Dairy",
    onion: "Produce",
    garlic: "Produce",
    tomato: "Produce",
    carrot: "Produce",
    potato: "Produce",
    lettuce: "Produce",
    spinach: "Produce",
    banana: "Produce",
    apple: "Produce",
    bread: "Bakery",
    pasta: "Pantry",
    rice: "Pantry",
    flour: "Pantry",
    sugar: "Pantry",
    salt: "Pantry",
    pepper: "Pantry",
    oil: "Pantry",
  }

  const getCategory = (ingredient: string): string => {
    const lowerIngredient = ingredient.toLowerCase()
    for (const [key, category] of Object.entries(categoryMap)) {
      if (lowerIngredient.includes(key)) {
        return category
      }
    }
    return "Other"
  }

  lines.forEach((line) => {
    const trimmedLine = line.trim()
    if (trimmedLine.length === 0) return

    for (const pattern of ingredientPatterns) {
      const match = trimmedLine.match(pattern)
      if (match) {
        const quantity = match[1]
        const name = match[2].trim()
        const category = getCategory(name)

        ingredients.push({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          quantity,
          category,
        })
        break
      }
    }
  })

  // Extract recipe title (usually the first non-empty line)
  const title = lines.find((line) => line.trim().length > 0)?.trim() || "Untitled Recipe"

  return {
    title,
    servings: 4, // Default
    cookTime: "30 minutes", // Default
    ingredients,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { recipeText } = await request.json()

    if (!recipeText || typeof recipeText !== "string") {
      return NextResponse.json({ error: "Recipe text is required" }, { status: 400 })
    }

    const extractedData = await extractIngredientsWithAI(recipeText)

    return NextResponse.json(extractedData)
  } catch (error) {
    console.error("Error extracting ingredients:", error)
    return NextResponse.json({ error: "Failed to extract ingredients" }, { status: 500 })
  }
}
