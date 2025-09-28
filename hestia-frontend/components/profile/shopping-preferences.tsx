"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Save, X, Loader2 } from "lucide-react"
import { useShoppingPreferences } from "@/hooks/use-profile"

const stores = [
  { value: "carrefour", label: "Carrefour" },
  { value: "walmart", label: "Walmart" },
  { value: "extra", label: "Extra" },
  { value: "pao-de-acucar", label: "Pão de Açúcar" },
  { value: "sams-club", label: "Sam's Club" },
  { value: "atacadao", label: "Atacadão" },
  { value: "assai", label: "Assaí" },
  { value: "big", label: "Big" },
]

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetariano" },
  { id: "vegan", label: "Vegano" },
  { id: "gluten-free", label: "Sem Glúten" },
  { id: "dairy-free", label: "Sem Lactose" },
  { id: "nut-free", label: "Sem Amendoim" },
  { id: "keto", label: "Cetogênico" },
  { id: "paleo", label: "Paleo" },
  { id: "low-sodium", label: "Baixo Sódio" },
]

export function ShoppingPreferences() {
  const { preferences, loading, error, updatePreferences } = useShoppingPreferences()
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [localPreferences, setLocalPreferences] = useState({
    default_store: "carrefour",
    auto_sort: true,
    group_by_category: true,
    show_nutrition_info: false,
    enable_notifications: true,
    dietary_restrictions: [] as string[],
    preferred_brands: [] as string[],
  })

  useEffect(() => {
    if (preferences) {
      setLocalPreferences({
        default_store: preferences.default_store || "carrefour",
        auto_sort: preferences.auto_sort ?? true,
        group_by_category: preferences.group_by_category ?? true,
        show_nutrition_info: preferences.show_nutrition_info ?? false,
        enable_notifications: preferences.enable_notifications ?? true,
        dietary_restrictions: preferences.dietary_restrictions || [],
        preferred_brands: preferences.preferred_brands || [],
      })
    }
  }, [preferences])

  const handleSave = async () => {
    if (!preferences) return

    setIsSaving(true)
    try {
      await updatePreferences(localPreferences)
      setHasChanges(false)
    } catch (error) {
      console.error('Error updating preferences:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (preferences) {
      setLocalPreferences({
        default_store: preferences.default_store || "carrefour",
        auto_sort: preferences.auto_sort ?? true,
        group_by_category: preferences.group_by_category ?? true,
        show_nutrition_info: preferences.show_nutrition_info ?? false,
        enable_notifications: preferences.enable_notifications ?? true,
        dietary_restrictions: preferences.dietary_restrictions || [],
        preferred_brands: preferences.preferred_brands || [],
      })
    }
    setHasChanges(false)
  }

  const updatePreference = (key: string, value: any) => {
    setLocalPreferences({ ...localPreferences, [key]: value })
    setHasChanges(true)
  }

  const toggleDietaryRestriction = (restriction: string) => {
    const current = localPreferences.dietary_restrictions
    const updated = current.includes(restriction) ? current.filter((r) => r !== restriction) : [...current, restriction]
    updatePreference("dietary_restrictions", updated)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Preferências de Compras</CardTitle>
            <CardDescription>Personalize sua experiência de compras e organização de listas.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Preferências de Compras</CardTitle>
            <CardDescription>Personalize sua experiência de compras e organização de listas.</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-destructive mb-4">Erro ao carregar preferências: {error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Shopping Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Configurações de Compras</CardTitle>
          <CardDescription>Personalize sua experiência de compras e organização de listas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="default-store">Loja Padrão</Label>
            <Select value={localPreferences.default_store} onValueChange={(value) => updatePreference("default_store", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione sua loja preferida" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.value} value={store.value}>
                    {store.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-organizar itens</Label>
                <p className="text-sm text-muted-foreground">Organize automaticamente os itens pelo layout da loja</p>
              </div>
              <Switch
                checked={localPreferences.auto_sort}
                onCheckedChange={(checked) => updatePreference("auto_sort", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Agrupar por categoria</Label>
                <p className="text-sm text-muted-foreground">Agrupe itens similares nas listas</p>
              </div>
              <Switch
                checked={localPreferences.group_by_category}
                onCheckedChange={(checked) => updatePreference("group_by_category", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mostrar informações nutricionais</Label>
                <p className="text-sm text-muted-foreground">Exiba informações nutricionais quando disponíveis</p>
              </div>
              <Switch
                checked={localPreferences.show_nutrition_info}
                onCheckedChange={(checked) => updatePreference("show_nutrition_info", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar notificações</Label>
                <p className="text-sm text-muted-foreground">Receba lembretes e atualizações sobre suas listas</p>
              </div>
              <Switch
                checked={localPreferences.enable_notifications}
                onCheckedChange={(checked) => updatePreference("enable_notifications", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dietary Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Restrições Alimentares</CardTitle>
          <CardDescription>Ajude-nos a sugerir receitas e ingredientes apropriados.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={localPreferences.dietary_restrictions.includes(option.id)}
                    onCheckedChange={() => toggleDietaryRestriction(option.id)}
                  />
                  <Label htmlFor={option.id} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>

            {localPreferences.dietary_restrictions.length > 0 && (
              <div className="space-y-2">
                <Label>Restrições selecionadas:</Label>
                <div className="flex flex-wrap gap-2">
                  {localPreferences.dietary_restrictions.map((restriction) => (
                    <Badge key={restriction} variant="secondary">
                      {dietaryOptions.find((opt) => opt.id === restriction)?.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferred Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Marcas Preferidas</CardTitle>
          <CardDescription>Suas marcas favoritas para melhores sugestões de receitas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {localPreferences.preferred_brands.map((brand, index) => (
              <Badge key={index} variant="outline">
                {brand}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            As preferências de marca nos ajudam a sugerir melhores alternativas e ofertas.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center space-x-2">
          <Button onClick={handleSave} disabled={isSaving} className="font-heading">
            {isSaving ? (
              "Salvando..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Preferências
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <X className="mr-2 h-4 w-4" />
            Desfazer Alterações
          </Button>
        </div>
      )}
    </div>
  )
}
