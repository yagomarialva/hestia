"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Save, Plus, Trash2, ListPlus, Loader2, Image as ImageIcon } from "lucide-react"
import { buildApiUrl, API_CONFIG } from "@/lib/api-config"
import { useToast } from "@/components/ui/use-toast"

interface RecipeDetailProps {
  recipeId: number | null
}

export function RecipeDetail({ recipeId }: RecipeDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(recipeId !== null)
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingList, setIsGeneratingList] = useState(false)
  
  const [recipe, setRecipe] = useState<any>({
    title: "",
    description: "",
    image_url: "",
    cooking_time: "",
    instructions: "",
    ingredients: []
  })

  const fetchRecipe = useCallback(async () => {
    if (!recipeId) return
    setIsLoading(true)
    try {
      const res = await fetch(buildApiUrl(`/recipes/${recipeId}`))
      if (!res.ok) throw new Error("Failed to fetch recipe")
      const data = await res.json()
      setRecipe(data)
    } catch (error) {
      console.error(error)
      toast({ title: "Erro", description: "Falha ao carregar receita.", variant: "destructive" })
      router.push("/dashboard/saved-recipes")
    } finally {
      setIsLoading(false)
    }
  }, [recipeId, router, toast])

  useEffect(() => {
    fetchRecipe()
  }, [fetchRecipe])

  const handleSave = async () => {
    if (!recipe.title) {
      toast({ title: "Atenção", description: "O título da receita é obrigatório.", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      const method = recipeId ? "PUT" : "POST"
      const url = buildApiUrl(recipeId ? `/recipes/${recipeId}` : "/recipes")
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe)
      })
      
      if (!res.ok) throw new Error("Falha ao salvar receita")
      const data = await res.json()
      
      toast({ title: "Sucesso!", description: "Sua receita foi salva." })
      
      if (!recipeId) {
        router.push(`/dashboard/saved-recipes/${data.id}`)
      }
    } catch (error) {
      console.error(error)
      toast({ title: "Erro", description: "Não foi possível salvar a receita.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [
        ...recipe.ingredients,
        { name: "", quantity: 1, unit: "un", sector: "mercearia" }
      ]
    })
  }

  const handleIngredientChange = (index: number, field: string, value: any) => {
    const newIngredients = [...recipe.ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setRecipe({ ...recipe, ingredients: newIngredients })
  }

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...recipe.ingredients]
    newIngredients.splice(index, 1)
    setRecipe({ ...recipe, ingredients: newIngredients })
  }

  const handleGenerateList = async () => {
    setIsGeneratingList(true)
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SHOPPING_LISTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Ingredientes: ${recipe.title.substring(0,30)}`,
          description: `Gerado a partir da receita: ${recipe.title}`
        })
      })
      if (!res.ok) throw new Error("Erro ao criar lista")
      const listData = await res.json()
      
      for (const ing of recipe.ingredients) {
        if (!ing.name) continue
        await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SHOPPING_LISTS}/${listData.id}/items`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: ing.name,
            quantity: Number(ing.quantity),
            unit: ing.unit || "un",
            sector: ing.sector || "mercearia"
          })
        })
      }
      toast({ title: "Lista criada!", description: "A lista de compras foi gerada com sucesso." })
      router.push(`/dashboard/shopping-lists/${listData.id}`)
    } catch (err) {
      console.error(err)
      toast({ title: "Erro", description: "Não foi possível gerar a lista.", variant: "destructive" })
    } finally {
      setIsGeneratingList(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/dashboard/saved-recipes")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="flex gap-2">
          {recipeId && (
            <Button variant="secondary" onClick={handleGenerateList} disabled={isGeneratingList || recipe.ingredients.length === 0}>
              {isGeneratingList ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ListPlus className="mr-2 h-4 w-4" />}
              Gerar Lista de Compras
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="font-heading">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Receita
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Imagem da Receita</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square w-full rounded-md bg-muted overflow-hidden relative">
                {recipe.image_url ? (
                  <img src={recipe.image_url} alt="Receita" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                    <span className="text-sm">Sem imagem</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>URL da Imagem (opcional)</Label>
                <Input 
                  placeholder="https://..." 
                  value={recipe.image_url || ""} 
                  onChange={e => setRecipe({...recipe, image_url: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Detalhes da Receita</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input 
                  placeholder="Ex: Bolo de Cenoura" 
                  value={recipe.title || ""} 
                  onChange={e => setRecipe({...recipe, title: e.target.value})}
                  className="font-heading font-semibold text-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tempo de Preparo</Label>
                  <Input 
                    placeholder="Ex: 45 min" 
                    value={recipe.cooking_time || ""} 
                    onChange={e => setRecipe({...recipe, cooking_time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL Original (opcional)</Label>
                  <Input 
                    placeholder="https://..." 
                    value={recipe.source_url || ""} 
                    onChange={e => setRecipe({...recipe, source_url: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição / Notas</Label>
                <Textarea 
                  placeholder="Adicione algumas notas sobre a receita..." 
                  value={recipe.description || ""} 
                  onChange={e => setRecipe({...recipe, description: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-heading">Ingredientes</CardTitle>
              <Button size="sm" variant="outline" onClick={handleAddIngredient}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {recipe.ingredients?.length === 0 ? (
                <p className="text-center text-muted-foreground py-4 text-sm">
                  Nenhum ingrediente adicionado.
                </p>
              ) : (
                <div className="space-y-3">
                  {recipe.ingredients?.map((ing: any, index: number) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input 
                        placeholder="Nome" 
                        value={ing.name || ""} 
                        onChange={e => handleIngredientChange(index, "name", e.target.value)}
                        className="flex-1"
                      />
                      <Input 
                        type="number" 
                        placeholder="Qtd" 
                        value={ing.quantity || ""} 
                        onChange={e => handleIngredientChange(index, "quantity", e.target.value)}
                        className="w-20"
                      />
                      <Input 
                        placeholder="Unidade" 
                        value={ing.unit || ""} 
                        onChange={e => handleIngredientChange(index, "unit", e.target.value)}
                        className="w-20"
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveIngredient(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Modo de Preparo</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Descreva o passo a passo..." 
                value={recipe.instructions || ""} 
                onChange={e => setRecipe({...recipe, instructions: e.target.value})}
                className="min-h-[250px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
