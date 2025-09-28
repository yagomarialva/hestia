"use client"

import { useState, useEffect, useCallback } from 'react'
import { activityService, RecentActivity } from '@/lib/activity-service'

export function useActivity() {
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = useCallback(async (limit: number = 10) => {
    try {
      setLoading(true)
      setError(null)
      const data = await activityService.getRecentActivity(limit)
      setActivities(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities')
      console.error('Error fetching activities:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  return {
    activities,
    loading,
    error,
    fetchActivities,
    refetch: () => fetchActivities()
  }
}
