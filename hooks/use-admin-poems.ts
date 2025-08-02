"use client"

import { useState, useEffect, useCallback } from "react"

// Types for the admin API response
interface AdminPoem {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
  }
  tags: string[]
  readingTime: number | null
  createdAt: string
  updatedAt: string
  likes: number
  comments: number
}

interface AdminPaginationInfo {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface AdminApiResponse {
  poems: AdminPoem[]
  pagination: AdminPaginationInfo
}

export function useAdminPoems() {
  const [poems, setPoems] = useState<AdminPoem[]>([])
  const [pagination, setPagination] = useState<AdminPaginationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null) // Track which poem is being processed

  // Fetch submitted poems
  const fetchPoems = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })

      const response = await fetch(`/api/admin/poems?${params}`)

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Acces de administrator necesar')
        }
        if (response.status === 401) {
          throw new Error('Te rog să te autentifici')
        }
        throw new Error('Eroare la încărcarea poeziilor trimise')
      }

      const data: AdminApiResponse = await response.json()
      setPoems(data.poems)
      setPagination(data.pagination)
      setCurrentPage(page)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare')
      console.error('Error fetching admin poems:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Approve a poem
  const approvePoem = useCallback(async (poemId: string) => {
    try {
      setActionLoading(poemId)
      setError(null)

      const response = await fetch(`/api/admin/poems/${poemId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la aprobarea poeziei')
      }

      // Remove the approved poem from the list
      setPoems(prev => prev.filter(poem => poem.id !== poemId))

      // Update pagination count
      if (pagination) {
        setPagination(prev => prev ? {
          ...prev,
          totalCount: prev.totalCount - 1
        } : null)
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la aprobarea poeziei')
      return false
    } finally {
      setActionLoading(null)
    }
  }, [pagination])

  // Reject a poem
  const rejectPoem = useCallback(async (poemId: string, reason?: string) => {
    try {
      setActionLoading(poemId)
      setError(null)

      const response = await fetch(`/api/admin/poems/${poemId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: reason || '' }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la respingerea poeziei')
      }

      // Remove the rejected poem from the list
      setPoems(prev => prev.filter(poem => poem.id !== poemId))

      // Update pagination count
      if (pagination) {
        setPagination(prev => prev ? {
          ...prev,
          totalCount: prev.totalCount - 1
        } : null)
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la respingerea poeziei')
      return false
    } finally {
      setActionLoading(null)
    }
  }, [pagination])

  // Retry loading
  const retry = useCallback(() => {
    fetchPoems(currentPage)
  }, [fetchPoems, currentPage])

  // Load poems on mount
  useEffect(() => {
    fetchPoems(1)
  }, [fetchPoems])

  return {
    poems,
    pagination,
    loading,
    error,
    currentPage,
    actionLoading,
    fetchPoems,
    approvePoem,
    rejectPoem,
    retry
  }
}