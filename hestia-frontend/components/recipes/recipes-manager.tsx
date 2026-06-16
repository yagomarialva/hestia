"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChefHat, Trash2, Edit, Plus, BookOpen, Clock, Image as ImageIcon } from "lucide-react"
import { buildApiUrl, API_CONFIG } from "@/lib/api-config"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function RecipesManager() {
  const [recipes, setRecipes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [recipeToDelete, setRecipeToDelete] = useState<number | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(buildApiUrl('/recipes'), {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      if (!res.ok) throw new Error("Failed to load recipes")
      const data = await res.json()
      setRecipes(data)
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas receitas.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  const handleDeleteClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setRecipeToDelete(id)
  }

  const confirmDelete = async () => {
    if (recipeToDelete === null) return
    const id = recipeToDelete

    try {
      const res = await fetch(buildApiUrl(`/recipes/${id}`), {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to delete")
      
      setRecipes(recipes.filter(r => r.id !== id))
      toast({
        title: "Receita excluída",
        description: "A receita foi removida com sucesso."
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a receita.",
        variant: "destructive"
      })
    } finally {
      setRecipeToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading font-semibold text-foreground flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-primary" />
          Seu Livro de Receitas
        </h2>
        <Button onClick={() => router.push("/dashboard/saved-recipes/new")} className="font-heading">
          <Plus className="mr-2 h-4 w-4" /> Nova Receita Manual
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => router.push(`/dashboard/saved-recipes/${recipe.id}`)}
            >
              <div className="h-40 w-full bg-muted relative overflow-hidden">
                {recipe.image_url ? (
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary/20">
                    <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                    <span className="text-xs font-medium uppercase tracking-wider">Sem Imagem</span>
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {recipe.title}
                </CardTitle>
                <CardDescription className="flex items-center text-xs">
                  <Clock className="mr-1 h-3 w-3" />
                  {recipe.cooking_time || "Tempo não informado"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground flex items-center">
                  <ChefHat className="mr-2 h-4 w-4" />
                  {recipe.ingredients?.length || 0} ingredientes
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-end gap-2 border-t border-border/50 bg-muted/10 mt-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/dashboard/saved-recipes/${recipe.id}`)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => handleDeleteClick(recipe.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16 px-4 text-center border-dashed border-2">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-heading text-2xl mb-2">Nenhuma receita salva</CardTitle>
          <CardDescription className="max-w-md mx-auto mb-6">
            Você ainda não tem nenhuma receita salva. Você pode buscar novas receitas ou adicionar manualmente.
          </CardDescription>
          <div className="flex gap-4">
            <Button onClick={() => router.push("/dashboard/recipes")}>
              Buscar Receitas
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard/saved-recipes/new")}>
              Adicionar Manualmente
            </Button>
          </div>
        </Card>
      )}

      <AlertDialog open={recipeToDelete !== null} onOpenChange={(open) => !open && setRecipeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A receita será removida permanentemente do seu livro de receitas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir Receita
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
