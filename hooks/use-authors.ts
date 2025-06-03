"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// Types for the API response
interface ApiAuthor {
  id: string
  name: string
  bio: string | null
  avatarUrl: string | null
  website: string | null
  createdAt: string
  _count: {
    poems: number
  }
}

interface PaginationInfo {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface ApiResponse {
  authors: ApiAuthor[]
  pagination: PaginationInfo
}

// Transformed author type for components
interface Author {
  id: string
  name: string
  bio: string | null
  avatar: string | null
  poemsCount: number
  website: string | null
  createdAt: string
}

interface UseAuthorsOptions {
  initialPage?: number
  initialLimit?: number
  initialSearch?: string
  initialSortBy?: "createdAt" | "name" | "poems"
  initialOrder?: "asc" | "desc"
}

interface UseAuthorsReturn {
  // Data
  authors: Author[]
  pagination: PaginationInfo | null

  // State
  isLoading: boolean
  error: string | null

  // Search and filters
  searchTerm: string
  sortBy: "createdAt" | "name" | "poems"
  order: "asc" | "desc"

  // Actions
  setSearchTerm: (term: string) => void
  setSortBy: (sortBy: "createdAt" | "name" | "poems") => void
  setOrder: (order: "asc" | "desc") => void
  goToPage: (page: number) => void
  clearFilters: () => void
  retry: () => void
}

// Transform API author data to component-compatible format
const transformApiAuthor = (apiAuthor: ApiAuthor): Author => {
  return {
    id: apiAuthor.id,
    name: apiAuthor.name,
    bio: apiAuthor.bio,
    avatar: apiAuthor.avatarUrl,
    poemsCount: apiAuthor._count.poems,
    website: apiAuthor.website,
    createdAt: apiAuthor.createdAt,
  }
}

export function useAuthors(options: UseAuthorsOptions = {}): UseAuthorsReturn {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL params or options
  const [searchTerm, setSearchTermState] = useState(() =>
    searchParams.get("search") || options.initialSearch || ""
  )
  const [sortBy, setSortByState] = useState<"createdAt" | "name" | "poems">(() =>
    (searchParams.get("sortBy") as "createdAt" | "name" | "poems") || options.initialSortBy || "poems"
  )
  const [order, setOrderState] = useState<"asc" | "desc">(() =>
    (searchParams.get("order") as "asc" | "desc") || options.initialOrder || "desc"
  )
  const [currentPage, setCurrentPage] = useState(() =>
    parseInt(searchParams.get("page") || "1") || options.initialPage || 1
  )

  // API state
  const [authors, setAuthors] = useState<Author[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    const url = new URL("/api/authors", window.location.origin)

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
    if (sortBy !== "poems") params.set("sortBy", sortBy)
    if (order !== "desc") params.set("order", order)
    if (currentPage !== 1) params.set("page", String(currentPage))

    const newUrl = `/authors${params.toString() ? `?${params.toString()}` : ""}`
    router.replace(newUrl, { scroll: false })
  }, [debouncedSearchTerm, sortBy, order, currentPage, router])

  // Fetch authors from API
  const fetchAuthors = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const url = buildUrl({
        page: currentPage,
        limit: options.initialLimit || 20,
        search: debouncedSearchTerm,
        sortBy,
        order,
      })

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      setAuthors(data.authors.map(transformApiAuthor))
      setPagination(data.pagination)
    } catch (err) {
      console.error("Error fetching authors:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch authors")
    } finally {
      setIsLoading(false)
    }
  }, [buildUrl, currentPage, debouncedSearchTerm, sortBy, order, options.initialLimit])

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

  const setSortBy = useCallback((newSortBy: "createdAt" | "name" | "poems") => {
    setSortByState(newSortBy)
    setCurrentPage(1) // Reset to first page on sort change
  }, [])

  const setOrder = useCallback((newOrder: "asc" | "desc") => {
    setOrderState(newOrder)
    setCurrentPage(1) // Reset to first page on order change
  }, [])

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTermState("")
    setSortByState("poems")
    setOrderState("desc")
    setCurrentPage(1)
  }, [])

  const retry = useCallback(() => {
    fetchAuthors()
  }, [fetchAuthors])

  return {
    // Data
    authors,
    pagination,

    // State
    isLoading,
    error,

    // Search and filters
    searchTerm,
    sortBy,
    order,

    // Actions
    setSearchTerm,
    setSortBy,
    setOrder,
    goToPage,
    clearFilters,
    retry,
  }
}