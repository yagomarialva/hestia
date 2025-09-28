"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, ChefHat, ShoppingCart, Loader2, Sparkles } from "lucide-react"
import { useAI } from "@/hooks/use-ai"
import { useShoppingListsContext } from "@/lib/shopping-lists-context"
import { useToast } from "@/hooks/use-toast"

export function QuickActions() {
  const [isCreateListOpen, setIsCreateListOpen] = useState(false)
  const [isRecipeOpen, setIsRecipeOpen] = useState(false)
  const [isQuickShopOpen, setIsQuickShopOpen] = useState(false)
  
  // Form states
  const [listName, setListName] = useState("")
  const [listDescription, setListDescription] = useState("")
  const [recipeName, setRecipeName] = useState("")
  const [peopleCount, setPeopleCount] = useState(1)
  const [difficulty, setDifficulty] = useState<'fácil' | 'normal' | 'difícil'>('normal')
  const [quickItem, setQuickItem] = useState("")
  
  const { generateShoppingList, generateRecipeIngredients, classifyProduct, isLoading, error } = useAI()
  const { createList } = useShoppingListsContext()
  const { toast } = useToast()

  const handleCreateList = async () => {
    if (!listName.trim()) return

    try {
      await createList({
        name: listName.trim(),
        description: listDescription.trim() || undefined
      })
      
      toast({
        title: "Lista criada!",
        description: `A lista "${listName}" foi criada com sucesso.`,
      })
      
      setIsCreateListOpen(false)
      setListName("")
      setListDescription("")
    } catch (err) {
      toast({
        title: "Erro ao criar lista",
        description: "Não foi possível criar a lista. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateRecipe = async () => {
    if (!recipeName.trim()) return

    try {
      const result = await generateRecipeIngredients(recipeName, peopleCount, difficulty)
      
      toast({
        title: "Ingredientes gerados!",
        description: `Foram gerados ${result.total_ingredients} ingredientes para "${recipeName}".`,
      })
      
      setIsRecipeOpen(false)
      setRecipeName("")
      setPeopleCount(1)
      setDifficulty('normal')
    } catch (err) {
      toast({
        title: "Erro ao gerar ingredientes",
        description: "Não foi possível gerar os ingredientes. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleQuickShop = async () => {
    if (!quickItem.trim()) return

    try {
      const result = await classifyProduct(quickItem)
      
      toast({
        title: "Produto classificado!",
        description: `"${quickItem}" foi classificado como ${result.sector}.`,
      })
      
      setQuickItem("")
    } catch (err) {
      toast({
        title: "Erro ao classificar produto",
        description: "Não foi possível classificar o produto. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {/* Create List Card */}
      <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer" onClick={() => setIsCreateListOpen(true)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center">
            <Plus className="mr-2 h-5 w-5 text-primary" />
            Nova Lista
          </CardTitle>
          <CardDescription>Criar uma nova lista de compras</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full font-heading">Criar Lista</Button>
        </CardContent>
      </Card>

      {/* AI Recipe Card */}
      <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer" onClick={() => setIsRecipeOpen(true)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center">
            <ChefHat className="mr-2 h-5 w-5 text-secondary" />
            IA Receita
          </CardTitle>
          <CardDescription>Gerar ingredientes de receitas com IA</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" className="w-full font-heading">
            <Sparkles className="mr-2 h-4 w-4" />
            Gerar
          </Button>
        </CardContent>
      </Card>

      {/* Quick Shop Card */}
      <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer" onClick={() => setIsQuickShopOpen(true)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5 text-accent" />
            Compra Rápida
          </CardTitle>
          <CardDescription>Classificar produtos com IA</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full font-heading bg-transparent">
            <Sparkles className="mr-2 h-4 w-4" />
            Classificar
          </Button>
        </CardContent>
      </Card>

      {/* Create List Dialog */}
      <Dialog open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-heading">Criar Nova Lista</DialogTitle>
            <DialogDescription>
              Crie uma nova lista de compras para organizar seus itens.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="listName">Nome da Lista</Label>
              <Input
                id="listName"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="ex: Compras da Semana"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="listDescription">Descrição (Opcional)</Label>
              <Textarea
                id="listDescription"
                value={listDescription}
                onChange={(e) => setListDescription(e.target.value)}
                placeholder="ex: Lista para compras da semana, incluindo frutas e verduras"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateListOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateList} 
              disabled={!listName.trim() || isLoading}
              className="font-heading"
            >
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
        </DialogContent>
      </Dialog>

      {/* Recipe Dialog */}
      <Dialog open={isRecipeOpen} onOpenChange={setIsRecipeOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center">
              <ChefHat className="mr-2 h-5 w-5" />
              Gerar Ingredientes com IA
            </DialogTitle>
            <DialogDescription>
              Digite o nome de uma receita e a IA gerará os ingredientes necessários.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipeName">Nome da Receita</Label>
              <Input
                id="recipeName"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="ex: Bolo de Chocolate"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="peopleCount">Pessoas</Label>
                <Input
                  id="peopleCount"
                  type="number"
                  min="1"
                  max="20"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificuldade</Label>
                <Select value={difficulty} onValueChange={(value: 'fácil' | 'normal' | 'difícil') => setDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fácil">Fácil</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="difícil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecipeOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGenerateRecipe} 
              disabled={!recipeName.trim() || isLoading}
              className="font-heading"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Ingredientes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Shop Dialog */}
      <Dialog open={isQuickShopOpen} onOpenChange={setIsQuickShopOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Classificar Produto com IA
            </DialogTitle>
            <DialogDescription>
              Digite o nome de um produto e a IA classificará em qual setor do supermercado ele pertence.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quickItem">Nome do Produto</Label>
              <Input
                id="quickItem"
                value={quickItem}
                onChange={(e) => setQuickItem(e.target.value)}
                placeholder="ex: Banana, Leite, Detergente"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuickShopOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleQuickShop} 
              disabled={!quickItem.trim() || isLoading}
              className="font-heading"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Classificando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Classificar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}