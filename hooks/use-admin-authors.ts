"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// Types for the API response
interface ApiAdminAuthor {
  id: string
  name: string
  email: string
  bio: string | null
  avatarUrl: string | null
  website: string | null
  featured: boolean
  createdAt: string
  _count: {
    poems: number
  }
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
  authors: ApiAdminAuthor[]
  pagination: AdminPaginationInfo
}

// Transformed author type for components
interface AdminAuthor {
  id: string
  name: string
  email: string
  bio: string | null
  avatar: string | null
  poemsCount: number
  website: string | null
  featured: boolean
  createdAt: string
}

interface UseAdminAuthorsOptions {
  initialPage?: number
  initialLimit?: number
  initialSearch?: string
}

interface UseAdminAuthorsReturn {
  // Data
  authors: AdminAuthor[]
  pagination: AdminPaginationInfo | null

  // State
  isLoading: boolean
  error: string | null
  isTogglingFeatured: string | null // ID of author being toggled
  isDeleting: string | null // ID of author being deleted

  // Search and filters
  searchTerm: string

  // Actions
  setSearchTerm: (term: string) => void
  goToPage: (page: number) => void
  clearFilters: () => void
  retry: () => void
  toggleFeatured: (authorId: string, featured: boolean) => Promise<void>
  deleteAuthor: (authorId: string) => Promise<void>
}

// Transform API author data to component-compatible format
const transformApiAdminAuthor = (apiAuthor: ApiAdminAuthor): AdminAuthor => {
  return {
    id: apiAuthor.id,
    name: apiAuthor.name,
    email: apiAuthor.email,
    bio: apiAuthor.bio,
    avatar: apiAuthor.avatarUrl,
    poemsCount: apiAuthor._count.poems,
    website: apiAuthor.website,
    featured: apiAuthor.featured,
    createdAt: apiAuthor.createdAt,
  }
}

export function useAdminAuthors(options: UseAdminAuthorsOptions = {}): UseAdminAuthorsReturn {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL params or options
  const [searchTerm, setSearchTermState] = useState(() =>
    searchParams.get("search") || options.initialSearch || ""
  )
  const [currentPage, setCurrentPage] = useState(() =>
    parseInt(searchParams.get("page") || "1") || options.initialPage || 1
  )

  // API state
  const [authors, setAuthors] = useState<AdminAuthor[]>([])
  const [pagination, setPagination] = useState<AdminPaginationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTogglingFeatured, setIsTogglingFeatured] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Build URL with current parameters
  const buildUrl = useCallback((params: Record<string, string | number>) => {
    const url = new URL("/api/admin/authors", window.location.origin)

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })

    return url.toString()
  }, [])

  // Update URL parameters
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams()

    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm)
    if (currentPage !== 1) params.set("page", String(currentPage))

    const newUrl = `/admin/authors${params.toString() ? `?${params.toString()}` : ""}`
    router.replace(newUrl, { scroll: false })
  }, [debouncedSearchTerm, currentPage, router])

  // Fetch authors from API
  const fetchAuthors = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const url = buildUrl({
        page: currentPage,
        limit: options.initialLimit || 20,
        search: debouncedSearchTerm,
      })

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: AdminApiResponse = await response.json()

      setAuthors(data.authors.map(transformApiAdminAuthor))
      setPagination(data.pagination)
    } catch (err) {
      console.error("Error fetching admin authors:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch authors")
    } finally {
      setIsLoading(false)
    }
  }, [buildUrl, currentPage, debouncedSearchTerm, options.initialLimit])

  // Toggle featured status
  const toggleFeatured = useCallback(async (authorId: string, featured: boolean) => {
    setIsTogglingFeatured(authorId)
    setError(null)

    try {
      const response = await fetch(`/api/admin/authors/${authorId}/featured`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Update the local state
      setAuthors(prevAuthors =>
        prevAuthors.map(author =>
          author.id === authorId
            ? { ...author, featured }
            : author
        )
      )


    } catch (err) {
      console.error("Error toggling featured status:", err)
      setError(err instanceof Error ? err.message : "Failed to update featured status")
      throw err // Re-throw for component error handling
    } finally {
      setIsTogglingFeatured(null)
    }
  }, [])

  // Delete author
  const deleteAuthor = useCallback(async (authorId: string) => {
    setIsDeleting(authorId)
    setError(null)

    try {
      const response = await fetch(`/api/admin/authors/${authorId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      // Refresh the authors list after successful deletion
      await fetchAuthors()

    } catch (err) {
      console.error("Error deleting author:", err)
      setError(err instanceof Error ? err.message : "Failed to delete author")
      throw err // Re-throw for component error handling
    } finally {
      setIsDeleting(null)
    }
  }, [fetchAuthors])

  // Effect to fetch authors when parameters change
  useEffect(() => {
    fetchAuthors()
  }, [fetchAuthors])

  // Effect to update URL when parameters change
  useEffect(() => {
    updateUrlParams()
  }, [updateUrlParams])

  // Action handlers
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term)
    setCurrentPage(1) // Reset to first page on search
  }, [])

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTermState("")
    setCurrentPage(1)
  }, [])

  const retry = useCallback(() => {
    fetchAuthors()
  }, [fetchAuthors])

  return {
    authors,
    pagination,
    isLoading,
    error,
    isTogglingFeatured,
    isDeleting,
    searchTerm,
    setSearchTerm,
    goToPage,
    clearFilters,
    retry,
    toggleFeatured,
    deleteAuthor,
  }
}