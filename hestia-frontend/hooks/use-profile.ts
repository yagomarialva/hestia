"use client"

import { useState, useEffect, useCallback } from 'react'
import { profileService, UserProfile, UpdateProfileData, UserSettings, ShoppingPreferences, SecuritySession, ChangePasswordData } from '@/lib/profile-service'

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await profileService.getProfile()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    try {
      setError(null)
      const updatedProfile = await profileService.updateProfile(data)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      throw err
    }
  }, [])

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setError(null)
      const result = await profileService.uploadAvatar(file)
      const updatedProfile = await profileService.updateProfile({ avatar: result.avatar_url })
      setProfile(updatedProfile)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar,
  }
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await profileService.getSettings()
      setSettings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings')
      console.error('Error fetching settings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSettings = useCallback(async (data: Partial<UserSettings>) => {
    try {
      setError(null)
      const updatedSettings = await profileService.updateSettings(data)
      setSettings(updatedSettings)
      return updatedSettings
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
  }
}

export function useShoppingPreferences() {
  const [preferences, setPreferences] = useState<ShoppingPreferences | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPreferences = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await profileService.getShoppingPreferences()
      setPreferences(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch preferences')
      console.error('Error fetching preferences:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePreferences = useCallback(async (data: Partial<ShoppingPreferences>) => {
    try {
      setError(null)
      const updatedPreferences = await profileService.updateShoppingPreferences(data)
      setPreferences(updatedPreferences)
      return updatedPreferences
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchPreferences()
  }, [fetchPreferences])

  return {
    preferences,
    loading,
    error,
    fetchPreferences,
    updatePreferences,
  }
}

export function useSecurity() {
  const [sessions, setSessions] = useState<SecuritySession[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await profileService.getActiveSessions()
      setSessions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions')
      console.error('Error fetching sessions:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const changePassword = useCallback(async (data: ChangePasswordData) => {
    try {
      setError(null)
      await profileService.changePassword(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
      throw err
    }
  }, [])

  const revokeSession = useCallback(async (sessionId: number) => {
    try {
      setError(null)
      await profileService.revokeSession(sessionId)
      setSessions(prev => prev.filter(session => session.id !== sessionId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke session')
      throw err
    }
  }, [])

  const exportData = useCallback(async () => {
    try {
      setError(null)
      const blob = await profileService.exportUserData()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `hestia-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data')
      throw err
    }
  }, [])

  const deleteAccount = useCallback(async () => {
    try {
      setError(null)
      await profileService.deleteAccount()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    changePassword,
    revokeSession,
    exportData,
    deleteAccount,
  }
}
