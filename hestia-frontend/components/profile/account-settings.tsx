"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Download, Bell, Loader2, Save } from "lucide-react"
import { useUserSettings, useSecurity } from "@/hooks/use-profile"

const languages = [
  { value: "pt", label: "Português" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
]

const timezones = [
  { value: "America/Sao_Paulo", label: "Brasília (BRT)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
]

export function AccountSettings() {
  const { settings, loading, error, updateSettings } = useUserSettings()
  const { exportData, deleteAccount } = useSecurity()
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [localSettings, setLocalSettings] = useState({
    language: "pt",
    timezone: "America/Sao_Paulo",
    email_notifications: true,
    push_notifications: false,
    marketing_emails: false,
    weekly_digest: true,
  })

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        language: settings.language || "pt",
        timezone: settings.timezone || "America/Sao_Paulo",
        email_notifications: settings.email_notifications ?? true,
        push_notifications: settings.push_notifications ?? false,
        marketing_emails: settings.marketing_emails ?? false,
        weekly_digest: settings.weekly_digest ?? true,
      })
    }
  }, [settings])

  const updateSetting = (key: string, value: any) => {
    setLocalSettings({ ...localSettings, [key]: value })
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      await updateSettings(localSettings)
      setHasChanges(false)
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      await exportData()
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
      // Redirect to login or home page after deletion
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Configurações Gerais</CardTitle>
            <CardDescription>Configure suas preferências de conta e configurações regionais.</CardDescription>
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
            <CardTitle className="font-heading">Configurações Gerais</CardTitle>
            <CardDescription>Configure suas preferências de conta e configurações regionais.</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-destructive mb-4">Erro ao carregar configurações: {error}</p>
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
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Configurações Gerais</CardTitle>
          <CardDescription>Configure suas preferências de conta e configurações regionais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={localSettings.language} onValueChange={(value) => updateSetting("language", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select value={localSettings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fuso horário" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Preferências de Notificação
          </CardTitle>
          <CardDescription>Escolha como você quer ser notificado sobre atualizações e atividades.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações por email</Label>
              <p className="text-sm text-muted-foreground">Receba atualizações importantes por email</p>
            </div>
            <Switch
              checked={localSettings.email_notifications}
              onCheckedChange={(checked) => updateSetting("email_notifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações push</Label>
              <p className="text-sm text-muted-foreground">Receba notificações em tempo real no seu dispositivo</p>
            </div>
            <Switch
              checked={localSettings.push_notifications}
              onCheckedChange={(checked) => updateSetting("push_notifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Emails de marketing</Label>
              <p className="text-sm text-muted-foreground">Receba conteúdo promocional e atualizações de recursos</p>
            </div>
            <Switch
              checked={localSettings.marketing_emails}
              onCheckedChange={(checked) => updateSetting("marketing_emails", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Resumo semanal</Label>
              <p className="text-sm text-muted-foreground">Receba um resumo da sua atividade de compras</p>
            </div>
            <Switch
              checked={localSettings.weekly_digest}
              onCheckedChange={(checked) => updateSetting("weekly_digest", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Gerenciamento de Dados</CardTitle>
          <CardDescription>Exporte seus dados ou gerencie sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-heading font-medium">Exportar seus dados</h4>
              <p className="text-sm text-muted-foreground">
                Baixe uma cópia de todas as suas listas de compras e preferências
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData} disabled={isSaving}>
              <Download className="mr-2 h-4 w-4" />
              {isSaving ? "Exportando..." : "Exportar"}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div className="space-y-1">
              <h4 className="font-heading font-medium text-destructive">Excluir conta</h4>
              <p className="text-sm text-muted-foreground">Exclua permanentemente sua conta e todos os dados associados</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá todos os seus dados
                    de nossos servidores, incluindo todas as listas de compras, preferências e informações da conta.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir Conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex items-center justify-end space-x-2">
          <Button onClick={handleSave} disabled={isSaving} className="font-heading">
            {isSaving ? (
              "Salvando..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
