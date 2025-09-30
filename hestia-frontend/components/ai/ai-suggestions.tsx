"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertTriangle, Info, TrendingUp, ShoppingCart } from "lucide-react"

interface AISuggestionsProps {
  suggestions?: string[]
  compatibility?: {
    alreadyInLists: string[]
    suggestedAdditions: string[]
    potentialDuplicates: string[]
  }
  smartSuggestions?: string[]
}

export function AISuggestions({ suggestions = [], compatibility, smartSuggestions = [] }: AISuggestionsProps) {
  if (!suggestions.length && !compatibility && !smartSuggestions.length) {
    return null
  }

  const getSuggestionIcon = (suggestion: string) => {
    if (suggestion.includes('⚠️') || suggestion.includes('já estão')) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
    if (suggestion.includes('✅') || suggestion.includes('Novos')) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
    if (suggestion.includes('🔍') || suggestion.includes('duplicatas')) {
      return <Info className="h-4 w-4 text-blue-500" />
    }
    if (suggestion.includes('📊') || suggestion.includes('concluídos')) {
      return <TrendingUp className="h-4 w-4 text-purple-500" />
    }
    if (suggestion.includes('🏷️') || suggestion.includes('categorias')) {
      return <ShoppingCart className="h-4 w-4 text-orange-500" />
    }
    return <Info className="h-4 w-4 text-gray-500" />
  }

  return (
    <div className="space-y-4">
      {/* Sugestões Contextuais */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Sugestões Inteligentes
            </CardTitle>
            <CardDescription>
              A IA analisou suas listas existentes e fez estas recomendações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <Alert key={index} className="border-l-4 border-l-blue-200">
                <div className="flex items-start gap-2">
                  {getSuggestionIcon(suggestion)}
                  <AlertDescription className="text-sm">
                    {suggestion}
                  </AlertDescription>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Análise de Compatibilidade */}
      {compatibility && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Análise de Compatibilidade
            </CardTitle>
            <CardDescription>
              Verificação automática com suas listas existentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Itens já nas listas */}
            {compatibility.alreadyInLists.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-yellow-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Já nas suas listas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {compatibility.alreadyInLists.map((item, index) => (
                    <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Possíveis duplicatas */}
            {compatibility.potentialDuplicates.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Possíveis duplicatas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {compatibility.potentialDuplicates.map((item, index) => (
                    <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Novos itens sugeridos */}
            {compatibility.suggestedAdditions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Novos itens para adicionar
                </h4>
                <div className="flex flex-wrap gap-2">
                  {compatibility.suggestedAdditions.map((item, index) => (
                    <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sugestões Inteligentes */}
      {smartSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Insights Personalizados
            </CardTitle>
            <CardDescription>
              Baseado no seu histórico de compras
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {smartSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                {getSuggestionIcon(suggestion)}
                <p className="text-sm text-purple-800">{suggestion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

