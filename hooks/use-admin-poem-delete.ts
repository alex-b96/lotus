"use client"

import { useState, useCallback } from "react"

/**
 * Hook for admin poem deletion functionality
 * Provides delete function with loading and error states
 */
export function useAdminPoemDelete() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Delete a published poem
   * @param poemId - The ID of the poem to delete
   * @returns Promise<boolean> - true if deletion was successful, false otherwise
   */
  const deletePoem = useCallback(async (poemId: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/poems/${poemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Admin access required')
        }
        if (response.status === 401) {
          throw new Error('Please sign in')
        }
        if (response.status === 404) {
          throw new Error('Poem not found')
        }
        if (response.status === 400) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Cannot delete this poem')
        }
        throw new Error('Failed to delete poem')
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting the poem'
      setError(errorMessage)
      console.error('Error deleting poem:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    deletePoem,
    loading,
    error,
    clearError: () => setError(null)
  }
}
