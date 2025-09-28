"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, X, Loader2 } from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function ProfileInfo() {
  const { profile, loading, error, updateProfile, uploadAvatar } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: ""
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setEditedUser({
        name: profile.name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        avatar: profile.avatar || ""
      })
    }
  }, [profile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsSaving(true)
    try {
      await updateProfile({
        name: editedUser.name,
        email: editedUser.email,
        bio: editedUser.bio,
        avatar: editedUser.avatar
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setEditedUser({
        name: profile.name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        avatar: profile.avatar || ""
      })
    }
    setIsEditing(false)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const result = await uploadAvatar(file)
        setEditedUser({ ...editedUser, avatar: result.avatar_url })
      } catch (error) {
        console.error('Error uploading avatar:', error)
      }
    }
  }

  const formatJoinedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM yyyy", { locale: ptBR })
    } catch {
      return "Data inválida"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados pessoais e foto de perfil.</CardDescription>
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
            <CardTitle className="font-heading">Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados pessoais e foto de perfil.</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-destructive mb-4">Erro ao carregar perfil: {error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados pessoais e foto de perfil.</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhum perfil encontrado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Informações Pessoais</CardTitle>
          <CardDescription>Atualize seus dados pessoais e foto de perfil.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={isEditing ? editedUser.avatar : profile.avatar} alt="Foto de perfil" />
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                )}
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold">{profile.name}</h3>
                <p className="text-muted-foreground">Membro desde {formatJoinedDate(profile.created_at)}</p>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-transparent"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={isEditing ? editedUser.name : profile.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Endereço de Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? editedUser.email : profile.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                placeholder="Conte-nos um pouco sobre você..."
                value={isEditing ? editedUser.bio : profile.bio || ""}
                onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center space-x-2">
                <Button type="submit" disabled={isSaving} className="font-heading">
                  {isSaving ? (
                    "Salvando..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
