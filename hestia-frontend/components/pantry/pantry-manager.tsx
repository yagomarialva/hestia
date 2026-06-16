"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Minus, Search, Archive, ShoppingCart, Apple, Car, Droplets, Snowflake, Coffee, Wine, Heart, Package } from "lucide-react"
import { buildApiUrl } from "@/lib/api-config"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
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

// Re-using the supermarket sectors
const SECTORS = [
  { id: "hortifruti", name: "Hortifruti", icon: Apple, color: "text-green-500", bg: "bg-green-500/10" },
  { id: "mercearia", name: "Mercearia", icon: Package, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "limpeza", name: "Limpeza", icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "congelados", name: "Congelados", icon: Snowflake, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { id: "padaria", name: "Padaria", icon: Coffee, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "bebidas", name: "Bebidas", icon: Wine, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "higiene", name: "Higiene Pessoal", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
]

export function PantryManager() {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  // Delete confirm
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    current_quantity: 0,
    ideal_quantity: 1,
    unit: "un",
    sector: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()

  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(buildApiUrl('/pantry'), {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      if (!res.ok) throw new Error("Failed to load pantry items")
      const data = await res.json()
      setItems(data)
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o controle de despensa.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleAdjustQuantity = async (id: number, delta: number) => {
    const itemIndex = items.findIndex(i => i.id === id)
    if (itemIndex === -1) return
    
    const currentItem = items[itemIndex]
    const newQty = Math.max(0, currentItem.current_quantity + delta) // Prevent negative
    
    // Optimistic update
    const newItems = [...items]
    newItems[itemIndex] = { ...currentItem, current_quantity: newQty }
    setItems(newItems)
    
    try {
      const res = await fetch(buildApiUrl(`/pantry/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_quantity: newQty })
      })
      if (!res.ok) throw new Error("Failed to update quantity")
    } catch (error) {
      console.error(error)
      // Revert on error
      setItems(items)
      toast({
        title: "Erro",
        description: "Falha ao atualizar a quantidade.",
        variant: "destructive"
      })
    }
  }

  const handleGenerateList = async () => {
    try {
      const res = await fetch(buildApiUrl('/pantry/generate-list'), {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 400) {
          toast({
            title: "Despensa Abastecida!",
            description: "Não há itens faltantes no momento para gerar uma lista."
          })
          return
        }
        throw new Error("Failed to generate list")
      }
      
      toast({
        title: "Lista Gerada com Sucesso!",
        description: data.message
      })
      
      router.push(`/dashboard/lists/${data.shopping_list_id}`)
      
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Não foi possível gerar a lista de compras.",
        variant: "destructive"
      })
    }
  }

  const openNewItemModal = () => {
    setEditingItem(null)
    setFormData({ name: "", current_quantity: 0, ideal_quantity: 1, unit: "un", sector: "" })
    setIsModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      current_quantity: item.current_quantity,
      ideal_quantity: item.ideal_quantity,
      unit: item.unit,
      sector: item.sector || ""
    })
    setIsModalOpen(true)
  }

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const isEditing = !!editingItem
      const url = isEditing ? buildApiUrl(`/pantry/${editingItem.id}`) : buildApiUrl('/pantry')
      const method = isEditing ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sector: formData.sector === "none" ? null : (formData.sector || null)
        })
      })
      
      if (!res.ok) throw new Error("Failed to save item")
      
      await fetchItems()
      setIsModalOpen(false)
      toast({
        title: "Sucesso",
        description: `Item ${isEditing ? 'atualizado' : 'adicionado'} com sucesso.`
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o item.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (itemToDelete === null) return
    try {
      const res = await fetch(buildApiUrl(`/pantry/${itemToDelete}`), {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to delete")
      
      setItems(items.filter(i => i.id !== itemToDelete))
      toast({ title: "Item excluído", description: "O item foi removido da despensa." })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro", description: "Não foi possível excluir o item.", variant: "destructive" })
    } finally {
      setItemToDelete(null)
    }
  }

  // Filter and Group Items
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const itemsBySector = filteredItems.reduce((acc, item) => {
    const sector = item.sector || "outros"
    if (!acc[sector]) acc[sector] = []
    acc[sector].push(item)
    return acc
  }, {} as Record<string, any[]>)

  const sortedSectors = Object.keys(itemsBySector).sort((a, b) => {
    if (a === "outros") return 1
    if (b === "outros") return -1
    return a.localeCompare(b)
  })

  // Calculate deficit
  const totalMissing = items.reduce((sum, item) => {
    return sum + (item.current_quantity < item.ideal_quantity ? 1 : 0)
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card p-6 rounded-xl border border-border shadow-sm">
        <div>
          <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
            <Archive className="h-5 w-5 text-primary" />
            Resumo do Estoque
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Você tem <strong className="text-foreground">{items.length} itens</strong> controlados e <strong className="text-destructive">{totalMissing} itens em falta</strong>.
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button onClick={openNewItemModal} variant="outline" className="flex-1 md:flex-none">
            <Plus className="mr-2 h-4 w-4" /> Novo Item
          </Button>
          <Button onClick={handleGenerateList} className="flex-1 md:flex-none" disabled={totalMissing === 0}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Gerar Lista Faltantes
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar produtos na despensa..." 
          className="pl-9 bg-card"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
        </div>
      ) : sortedSectors.length > 0 ? (
        <div className="space-y-8">
          {sortedSectors.map(sectorId => {
            const sectorData = SECTORS.find(s => s.id === sectorId)
            const SectorIcon = sectorData?.icon || Package
            
            return (
              <div key={sectorId} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${sectorData?.bg || 'bg-muted'}`}>
                    <SectorIcon className={`h-4 w-4 ${sectorData?.color || 'text-muted-foreground'}`} />
                  </div>
                  <h3 className="font-heading font-medium text-lg capitalize">
                    {sectorData?.name || "Outros / Sem Categoria"}
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-2">
                    {itemsBySector[sectorId].length}
                  </span>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {itemsBySector[sectorId].map((item) => {
                    const isDeficit = item.current_quantity < item.ideal_quantity
                    const percentage = Math.min(100, (item.current_quantity / item.ideal_quantity) * 100)
                    
                    return (
                      <Card key={item.id} className={`overflow-hidden transition-all hover:border-primary/30 ${isDeficit ? 'border-destructive/30 bg-destructive/5' : ''}`}>
                        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                          <div>
                            <CardTitle className="text-base font-medium line-clamp-1 cursor-pointer hover:text-primary" onClick={() => openEditModal(item)}>
                              {item.name}
                            </CardTitle>
                            <CardDescription className="mt-1 flex items-center gap-2">
                              <span>Meta: {item.ideal_quantity} {item.unit}</span>
                              {isDeficit && <span className="text-xs text-destructive font-medium">Faltam {item.ideal_quantity - item.current_quantity}</span>}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-4 pt-2">
                          {/* Status Bar */}
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-4">
                            <div 
                              className={`h-full ${isDeficit ? 'bg-destructive' : 'bg-primary'}`} 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold tracking-tight">
                              {item.current_quantity} <span className="text-sm font-normal text-muted-foreground">{item.unit}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:bg-background hover:text-destructive shrink-0"
                                onClick={() => handleAdjustQuantity(item.id, -1)}
                                disabled={item.current_quantity <= 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:bg-background hover:text-primary shrink-0"
                                onClick={() => handleAdjustQuantity(item.id, 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16 px-4 text-center border-dashed border-2 bg-transparent">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Archive className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-heading text-xl mb-2">Sua despensa está vazia</CardTitle>
          <CardDescription className="max-w-md mx-auto mb-6">
            Adicione os itens que você costuma comprar para monitorar as quantidades ideais e gerar listas automaticamente.
          </CardDescription>
          <Button onClick={openNewItemModal}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Primeiro Item
          </Button>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Item da Despensa' : 'Novo Item na Despensa'}</DialogTitle>
            <DialogDescription>
              Defina a quantidade que você tem agora e a que você deseja ter idealmente.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSaveItem}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Ex: Arroz Branco 5kg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Qtd Atual</Label>
                  <Input 
                    id="current" 
                    type="number" 
                    step="0.1"
                    min="0"
                    value={formData.current_quantity}
                    onChange={(e) => setFormData({...formData, current_quantity: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ideal">Qtd Ideal (Meta)</Label>
                  <Input 
                    id="ideal" 
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.ideal_quantity}
                    onChange={(e) => setFormData({...formData, ideal_quantity: parseFloat(e.target.value) || 1})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade</Label>
                  <Select value={formData.unit} onValueChange={(v) => setFormData({...formData, unit: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="un">Unidade (un)</SelectItem>
                      <SelectItem value="kg">Quilograma (kg)</SelectItem>
                      <SelectItem value="g">Grama (g)</SelectItem>
                      <SelectItem value="L">Litro (L)</SelectItem>
                      <SelectItem value="ml">Mililitro (ml)</SelectItem>
                      <SelectItem value="pct">Pacote (pct)</SelectItem>
                      <SelectItem value="cx">Caixa (cx)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Setor</Label>
                  <Select value={formData.sector} onValueChange={(v) => setFormData({...formData, sector: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {SECTORS.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
              {editingItem && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => setItemToDelete(editingItem.id)}
                  className="sm:mr-auto"
                >
                  Excluir Item
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir item?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este item da sua despensa? Isso não afetará listas de compras antigas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
