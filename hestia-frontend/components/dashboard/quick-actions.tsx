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
import { Plus, ShoppingCart, Loader2, Sparkles } from "lucide-react"
import { useAI } from "@/hooks/use-ai"
import { useShoppingListsContext } from "@/lib/shopping-lists-context"
import { useToast } from "@/hooks/use-toast"

export function QuickActions() {
  const [isCreateListOpen, setIsCreateListOpen] = useState(false)
  const [isGenerateListOpen, setIsGenerateListOpen] = useState(false)
  const [isQuickShopOpen, setIsQuickShopOpen] = useState(false)
  
  // Form states
  const [listName, setListName] = useState("")
  const [listDescription, setListDescription] = useState("")
  const [theme, setTheme] = useState("")
  const [peopleCount, setPeopleCount] = useState(1)
  const [quickItem, setQuickItem] = useState("")
  
  const { generateShoppingList, classifyProduct, isLoading, error } = useAI()
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

  const handleGenerateList = async () => {
    if (!theme.trim()) return

    try {
      const result = await generateShoppingList(theme.trim(), peopleCount)
      
      toast({
        title: "Lista gerada!",
        description: `A lista "${result.theme}" foi criada com ${result.total_items} itens.`,
      })
      
      setIsGenerateListOpen(false)
      setTheme("")
      setPeopleCount(1)
    } catch (err) {
      toast({
        title: "Erro ao gerar lista",
        description: "Não foi possível gerar a lista. Tente novamente.",
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

      {/* Generate List Card */}
      <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer" onClick={() => setIsGenerateListOpen(true)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-secondary" />
            Gerar lista automaticamente
          </CardTitle>
          <CardDescription>Criar listas de compras com IA baseadas em temas</CardDescription>
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

      {/* Generate List Dialog */}
      <Dialog open={isGenerateListOpen} onOpenChange={setIsGenerateListOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              Gerar Lista com IA
            </DialogTitle>
            <DialogDescription>
              Digite um tema e a IA criará uma lista de compras completa para você.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema da Lista</Label>
              <Input
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="ex: Churrasco para 6 pessoas, Festa infantil, Jantar romântico"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peopleCount">Número de Pessoas</Label>
              <Input
                id="peopleCount"
                type="number"
                min="1"
                max="50"
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>Exemplos de temas:</strong>
              <ul className="mt-1 space-y-1">
                <li>• "Churrasco para 10 pessoas"</li>
                <li>• "Festa de aniversário infantil"</li>
                <li>• "Jantar romântico para 2"</li>
                <li>• "Compras da semana para família de 4"</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateListOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGenerateList} 
              disabled={!theme.trim() || isLoading}
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
                  Gerar Lista
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