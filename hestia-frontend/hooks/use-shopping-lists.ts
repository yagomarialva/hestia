"use client"

import { useState, useEffect, useCallback } from 'react'
import { shoppingListsService, ShoppingList, CreateShoppingListData, ShoppingListItem, CreateItemData, UpdateItemData } from '@/lib/shopping-lists-service'

export function useShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLists = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await shoppingListsService.getShoppingLists()
      setLists(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shopping lists')
      console.error('Error fetching shopping lists:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createList = useCallback(async (data: CreateShoppingListData) => {
    try {
      setError(null)
      const newList = await shoppingListsService.createShoppingList(data)
      setLists(prev => [newList, ...prev])
      return newList
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shopping list')
      throw err
    }
  }, [])

  const updateList = useCallback(async (id: number, data: Partial<CreateShoppingListData>) => {
    try {
      setError(null)
      const updatedList = await shoppingListsService.updateShoppingList(id, data)
      setLists(prev => prev.map(list => list.id === id ? updatedList : list))
      return updatedList
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update shopping list')
      throw err
    }
  }, [])

  const deleteList = useCallback(async (id: number) => {
    try {
      setError(null)
      await shoppingListsService.deleteShoppingList(id)
      setLists(prev => prev.filter(list => list.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete shopping list')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchLists()
  }, [fetchLists])

  return {
    lists,
    loading,
    error,
    fetchLists,
    createList,
    updateList,
    deleteList,
  }
}

export function useShoppingList(listId: number) {
  const [list, setList] = useState<ShoppingList | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchList = useCallback(async () => {
    if (!listId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await shoppingListsService.getShoppingList(listId)
      setList(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shopping list')
      console.error('Error fetching shopping list:', err)
    } finally {
      setLoading(false)
    }
  }, [listId])

  const addItem = useCallback(async (data: CreateItemData) => {
    if (!listId) return

    try {
      setError(null)
      const newItem = await shoppingListsService.createItem(listId, data)
      setList(prev => prev ? {
        ...prev,
        items: [...(prev.items || []), newItem]
      } : null)
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
      throw err
    }
  }, [listId])

  const updateItem = useCallback(async (itemId: number, data: UpdateItemData) => {
    if (!listId) return

    try {
      setError(null)
      const updatedItem = await shoppingListsService.updateItem(listId, itemId, data)
      setList(prev => prev ? {
        ...prev,
        items: prev.items?.map(item => item.id === itemId ? updatedItem : item) || []
      } : null)
      return updatedItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item')
      throw err
    }
  }, [listId])

  const deleteItem = useCallback(async (itemId: number) => {
    if (!listId) return

    try {
      setError(null)
      await shoppingListsService.deleteItem(listId, itemId)
      setList(prev => prev ? {
        ...prev,
        items: prev.items?.filter(item => item.id !== itemId) || []
      } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
      throw err
    }
  }, [listId])

  const toggleItemCompletion = useCallback(async (itemId: number, completed: boolean) => {
    return updateItem(itemId, { completed })
  }, [updateItem])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  return {
    list,
    loading,
    error,
    fetchList,
    addItem,
    updateItem,
    deleteItem,
    toggleItemCompletion,
  }
}
