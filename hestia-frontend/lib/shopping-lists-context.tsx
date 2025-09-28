"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { shoppingListsService, ShoppingList, CreateShoppingListData, ShoppingListItem, CreateItemData, UpdateItemData } from './shopping-lists-service'

interface ShoppingListsContextType {
  lists: ShoppingList[]
  loading: boolean
  error: string | null
  fetchLists: () => Promise<void>
  createList: (data: CreateShoppingListData) => Promise<ShoppingList>
  updateList: (id: number, data: Partial<CreateShoppingListData>) => Promise<ShoppingList>
  deleteList: (id: number) => Promise<void>
  addItem: (listId: number, data: CreateItemData) => Promise<ShoppingListItem>
  updateItem: (listId: number, itemId: number, data: UpdateItemData) => Promise<ShoppingListItem>
  deleteItem: (listId: number, itemId: number) => Promise<void>
  toggleItemCompletion: (listId: number, itemId: number, completed: boolean) => Promise<void>
}

const ShoppingListsContext = createContext<ShoppingListsContextType | undefined>(undefined)

export const useShoppingListsContext = () => {
  const context = useContext(ShoppingListsContext)
  if (context === undefined) {
    throw new Error('useShoppingListsContext must be used within a ShoppingListsProvider')
  }
  return context
}

interface ShoppingListsProviderProps {
  children: ReactNode
}

export const ShoppingListsProvider: React.FC<ShoppingListsProviderProps> = ({ children }) => {
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

  const addItem = useCallback(async (listId: number, data: CreateItemData) => {
    try {
      setError(null)
      const newItem = await shoppingListsService.createItem(listId, data)
      setLists(prev => prev.map(list => 
        list.id === listId 
          ? { ...list, items: [...(list.items || []), newItem] }
          : list
      ))
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
      throw err
    }
  }, [])

  const updateItem = useCallback(async (listId: number, itemId: number, data: UpdateItemData) => {
    try {
      setError(null)
      const updatedItem = await shoppingListsService.updateItem(listId, itemId, data)
      setLists(prev => prev.map(list => 
        list.id === listId 
          ? { 
              ...list, 
              items: list.items?.map(item => item.id === itemId ? updatedItem : item) || []
            }
          : list
      ))
      return updatedItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item')
      throw err
    }
  }, [])

  const deleteItem = useCallback(async (listId: number, itemId: number) => {
    try {
      setError(null)
      await shoppingListsService.deleteItem(listId, itemId)
      setLists(prev => prev.map(list => 
        list.id === listId 
          ? { 
              ...list, 
              items: list.items?.filter(item => item.id !== itemId) || []
            }
          : list
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
      throw err
    }
  }, [])

  const toggleItemCompletion = useCallback(async (listId: number, itemId: number, completed: boolean) => {
    return updateItem(listId, itemId, { completed })
  }, [updateItem])

  useEffect(() => {
    fetchLists()
  }, [fetchLists])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLists()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchLists])

  const value = {
    lists,
    loading,
    error,
    fetchLists,
    createList,
    updateList,
    deleteList,
    addItem,
    updateItem,
    deleteItem,
    toggleItemCompletion,
  }

  return (
    <ShoppingListsContext.Provider value={value}>
      {children}
    </ShoppingListsContext.Provider>
  )
}
