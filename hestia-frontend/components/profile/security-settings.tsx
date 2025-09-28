"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Shield, Smartphone, Monitor, MapPin, Loader2 } from "lucide-react"
import { useSecurity } from "@/hooks/use-profile"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function SecuritySettings() {
  const { sessions, loading, error, changePassword, revokeSession } = useSecurity()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres")
      return
    }

    setIsChangingPassword(true)
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      alert("Senha atualizada com sucesso")
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Erro ao alterar senha")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleRevokeSession = async (sessionId: number) => {
    try {
      await revokeSession(sessionId)
    } catch (error) {
      console.error('Error revoking session:', error)
    }
  }

  const formatLastActive = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: ptBR 
      })
    } catch {
      return "Data inválida"
    }
  }

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
      return Smartphone
    }
    return Monitor
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Configurações de Segurança
            </CardTitle>
            <CardDescription>Gerencie a segurança da sua conta.</CardDescription>
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
            <CardTitle className="font-heading flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Configurações de Segurança
            </CardTitle>
            <CardDescription>Gerencie a segurança da sua conta.</CardDescription>
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
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Alterar Senha
          </CardTitle>
          <CardDescription>Atualize sua senha para manter sua conta segura.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {passwordError}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={isChangingPassword} className="font-heading">
              {isChangingPassword ? "Alterando..." : "Alterar Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Sessões Ativas</CardTitle>
          <CardDescription>Gerencie dispositivos e locais onde você está conectado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhuma sessão encontrada</p>
          ) : (
            sessions.map((session) => {
              const DeviceIcon = getDeviceIcon(session.device)
              return (
                <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <DeviceIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-heading font-medium">{session.device}</h4>
                        {session.current && <Badge variant="secondary">Atual</Badge>}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{session.location}</span>
                        <span>•</span>
                        <span>{formatLastActive(session.last_active)}</span>
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="outline" size="sm" onClick={() => handleRevokeSession(session.id)}>
                      Revogar
                    </Button>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Recomendações de Segurança</CardTitle>
          <CardDescription>Dicas para manter sua conta segura.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Use uma senha forte</h4>
              <p className="text-sm text-muted-foreground">
                Inclua maiúsculas, minúsculas, números e caracteres especiais.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Ative a autenticação de dois fatores</h4>
              <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança à sua conta.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium">Revise as sessões ativas regularmente</h4>
              <p className="text-sm text-muted-foreground">
                Verifique dispositivos desconhecidos e revogue o acesso se necessário.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
