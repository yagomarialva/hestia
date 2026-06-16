"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Sparkles, Clock, Users, Link as LinkIcon, Image as ImageIcon, Search } from "lucide-react"
import { RecipeModal } from "./recipe-modal"
import { buildApiUrl, API_CONFIG } from "@/lib/api-config"
import { useToast } from "@/components/ui/use-toast"

export function RecipeGenerator() {
  const [query, setQuery] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const { toast } = useToast()

  const handleAction = async () => {
    if (!query.trim()) return

    setIsProcessing(true)
    setErrorMsg("")
    setSearchResults([])
    setExtractedData(null)

    // If it's a URL, extract directly
    if (query.startsWith("http://") || query.startsWith("https://")) {
      await extractRecipe(query)
    } else {
      // Otherwise, search for it
      try {
        const res = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.AI.SEARCH_RECIPES)}?q=${encodeURIComponent(query)}`, {
          method: "GET"
        })
        
        if (!res.ok) {
          throw new Error("Falha ao pesquisar receitas.")
        }
        
        const data = await res.json()
        if (data.results && data.results.length > 0) {
          setSearchResults(data.results)
        } else {
          setErrorMsg("Nenhuma receita encontrada para essa busca.")
        }
      } catch (error: any) {
        console.error("Error searching recipes:", error)
        setErrorMsg(error.message || "Erro ao buscar receitas.")
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const extractRecipe = async (url: string) => {
    setIsModalOpen(true)
    setIsExtracting(true)
    setExtractedData(null)
    setErrorMsg("")
    
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AI.EXTRACT_URL), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url })
      })
      
      if (!res.ok) {
        throw new Error("Falha ao extrair receita. Verifique se o link é válido.")
      }
      
      const data = await res.json()
      setExtractedData(data)
    } catch (error: any) {
      console.error("Error extracting ingredients:", error)
      setIsModalOpen(false)
      setErrorMsg(error.message || "Erro desconhecido ao extrair receita.")
    } finally {
      setIsExtracting(false)
    }
  }

  const handleSaveRecipe = async (data: any) => {
    try {
      const res = await fetch(buildApiUrl('/recipes'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          image_url: data.image_url,
          cooking_time: data.cooking_time,
          ingredients: data.ingredients,
          instructions: data.instructions,
          source_url: data.source_url
        })
      })
      if (!res.ok) throw new Error("Erro ao salvar receita")
      toast({ title: "Receita salva!", description: "A receita foi salva em Minhas Receitas." })
    } catch (err) {
      console.error(err)
      toast({ title: "Erro", description: "Não foi possível salvar a receita.", variant: "destructive" })
    }
  }

  const handleGenerateList = async (data: any) => {
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SHOPPING_LISTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Ingredientes: ${data.title.substring(0,30)}`,
          description: `Gerado a partir da receita: ${data.title}`
        })
      })
      if (!res.ok) throw new Error("Erro ao criar lista")
      const listData = await res.json()
      
      for (const ing of data.ingredients) {
        await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SHOPPING_LISTS}/${listData.id}/items`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ing)
        })
      }
      toast({ title: "Lista criada!", description: "Os ingredientes foram salvos na lista de compras." })
    } catch (err) {
      console.error(err)
      toast({ title: "Erro", description: "Não foi possível gerar a lista.", variant: "destructive" })
    }
  }

  const handleClearAll = () => {
    setQuery("")
    setExtractedData(null)
    setSearchResults([])
    setErrorMsg("")
  }

  const sampleRecipes = [
    {
      title: "Panelinha: Arroz e Feijão",
      url: "https://www.panelinha.com.br/receita/Arroz-com-feijao",
    },
    {
      title: "TudoGostoso: Bolo de Cenoura",
      url: "https://www.tudogostoso.com.br/receita/23-bolo-de-cenoura.html",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Recipe Input */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center">
            <ChefHat className="mr-2 h-5 w-5 text-primary" />
            Buscar ou Extrair Receita
          </CardTitle>
          <CardDescription>
            Digite o nome de um prato para buscar nos melhores sites (TudoGostoso, Panelinha) ou cole o link diretamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Ex: Lasanha de Berinjela ou https://..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleAction() }}
              className="pl-10"
            />
          </div>
          {errorMsg && (
            <div className="text-sm text-destructive font-medium">{errorMsg}</div>
          )}
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleClearAll} disabled={!query && !extractedData && searchResults.length === 0}>
                Limpar
              </Button>
              <Button
                onClick={handleAction}
                disabled={!query.trim() || isProcessing}
                className="font-heading"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Pesquisar / Extrair
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Resultados da Busca</CardTitle>
            <CardDescription>Escolha qual receita você deseja extrair e salvar.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-1">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => extractRecipe(result.url)}
                >
                  <h4 className="font-heading font-semibold mb-1 text-primary">{result.title}</h4>
                  <p className="text-sm text-muted-foreground mb-1">{result.snippet}</p>
                  <p className="text-xs text-muted-foreground/70 truncate">{result.url}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sample Recipes */}
      {searchResults.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Sugestões Rápidas</CardTitle>
            <CardDescription>Clique para testar a extração instantânea por link.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {sampleRecipes.map((recipe, index) => (
                <div
                  key={index}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => extractRecipe(recipe.url)}
                >
                  <h4 className="font-heading font-semibold mb-1 line-clamp-1">{recipe.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{recipe.url}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <RecipeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        recipeData={extractedData}
        isLoading={isExtracting}
        onSaveRecipe={handleSaveRecipe}
        onGenerateList={handleGenerateList}
      />
    </div>
  )
}
