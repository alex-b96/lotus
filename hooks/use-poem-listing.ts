"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// Types for the API response
interface Author {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}

interface ApiPoem {
  id: string
  title: string
  content: string
  author: Author
  tags: string[]
  readingTime: number | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  likes: number
  comments: number
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
  poems: ApiPoem[]
  pagination: PaginationInfo
}

// Transformed poem type for components (backwards compatible)
interface Poem {
  id: string
  title: string
  author: string
  preview: string
  tags: string[]
  likes: number
  comments: number
  publishedAt: string
  // Additional fields from API
  authorData: Author
  content: string
  readingTime: number | null
  createdAt: string
  updatedAt: string
}

interface UsePoemListingOptions {
  initialPage?: number
  initialLimit?: number
  initialSearch?: string
  initialCategory?: string
  initialTag?: string
  initialSortBy?: "publishedAt" | "createdAt" | "title" | "likes"
  initialOrder?: "asc" | "desc"
}

interface UsePoemListingReturn {
  // Data
  poems: Poem[]
  pagination: PaginationInfo | null

  // State
  isLoading: boolean
  error: string | null

  // Search and filters
  searchTerm: string
  selectedCategory: string
  selectedTag: string
  sortBy: "publishedAt" | "createdAt" | "title" | "likes"
  order: "asc" | "desc"

  // Actions
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  setSelectedTag: (tag: string) => void
  setSortBy: (sortBy: "publishedAt" | "createdAt" | "title" | "likes") => void
  setOrder: (order: "asc" | "desc") => void
  goToPage: (page: number) => void
  clearFilters: () => void
  retry: () => void
}

// Transform API poem data to component-compatible format
const transformApiPoem = (apiPoem: ApiPoem): Poem => {
  // Create preview from content (first 150 characters)
  const preview = apiPoem.content.length > 150
    ? apiPoem.content.substring(0, 150).trim() + "..."
    : apiPoem.content

  return {
    id: apiPoem.id,
    title: apiPoem.title,
    author: apiPoem.author.name,
    preview,
    tags: apiPoem.tags,
    likes: apiPoem.likes,
    comments: apiPoem.comments,
    publishedAt: apiPoem.publishedAt || apiPoem.createdAt,
    // Additional data
    authorData: apiPoem.author,
    content: apiPoem.content,
    readingTime: apiPoem.readingTime,
    createdAt: apiPoem.createdAt,
    updatedAt: apiPoem.updatedAt,
  }
}

export function usePoemListing(options: UsePoemListingOptions = {}): UsePoemListingReturn {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL params or options
  const [searchTerm, setSearchTermState] = useState(() =>
    searchParams.get("search") || options.initialSearch || ""
  )
  const [selectedCategory, setSelectedCategoryState] = useState(() =>
    searchParams.get("category") || options.initialCategory || "Toate"
  )
  const [selectedTag, setSelectedTagState] = useState(() =>
    searchParams.get("tag") || options.initialTag || ""
  )
  const [sortBy, setSortByState] = useState<"publishedAt" | "createdAt" | "title" | "likes">(() =>
    (searchParams.get("sortBy") as "publishedAt" | "createdAt" | "title" | "likes") || options.initialSortBy || "publishedAt"
  )
  const [order, setOrderState] = useState<"asc" | "desc">(() =>
    (searchParams.get("order") as "asc" | "desc") || options.initialOrder || "desc"
  )
  const [currentPage, setCurrentPage] = useState(() =>
    parseInt(searchParams.get("page") || "1") || options.initialPage || 1
  )

  // API state
  const [poems, setPoems] = useState<Poem[]>([])
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
    const url = new URL("/api/poems", window.location.origin)

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== "Toate" && value !== null && value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })

    return url.toString()
  }, [])

  // Update URL parameters
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams()

    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm)
    if (selectedCategory !== "Toate") params.set("category", selectedCategory)
    if (selectedTag) params.set("tag", selectedTag)
    if (sortBy !== "createdAt") params.set("sortBy", sortBy)
    if (order !== "desc") params.set("order", order)
    if (currentPage !== 1) params.set("page", String(currentPage))

    const newUrl = `/poems${params.toString() ? `?${params.toString()}` : ""}`
    router.replace(newUrl, { scroll: false })
  }, [debouncedSearchTerm, selectedCategory, selectedTag, sortBy, order, currentPage, router])

  // Fetch poems from API
  const fetchPoems = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = buildUrl({
        page: currentPage,
        limit: options.initialLimit || 20,
        search: debouncedSearchTerm,
        category: selectedCategory !== "Toate" ? selectedCategory : "",
        tag: selectedTag,
        sortBy,
        order,
      })

      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`Eroare la încărcarea poeziilor: ${response.status} ${response.statusText}`)
      }

      const data: ApiResponse = await response.json()

      // Transform API poems to component format
      const transformedPoems = data.poems.map(transformApiPoem)

      setPoems(transformedPoems)
      setPagination(data.pagination)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Eroare la încărcarea poeziilor"
      setError(errorMessage)
      console.error("Error fetching poems:", err)
    } finally {
      setIsLoading(false)
    }
  }, [
    currentPage,
    debouncedSearchTerm,
    selectedCategory,
    selectedTag,
    sortBy,
    order,
    options.initialLimit,
    buildUrl,
  ])

  // Fetch poems when dependencies change
  useEffect(() => {
    fetchPoems()
  }, [fetchPoems])

  // Update URL when parameters change
  useEffect(() => {
    updateUrlParams()
  }, [updateUrlParams])

  // Action functions
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term)
    setCurrentPage(1) // Reset to first page on search
  }, [])

  const setSelectedCategory = useCallback((category: string) => {
    setSelectedCategoryState(category)
    setCurrentPage(1) // Reset to first page on filter change
  }, [])

  const setSelectedTag = useCallback((tag: string) => {
    setSelectedTagState(tag)
    setCurrentPage(1) // Reset to first page on filter change
  }, [])

  const setSortBy = useCallback((newSortBy: "publishedAt" | "createdAt" | "title" | "likes") => {
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
    setSelectedCategoryState("Toate")
    setSelectedTagState("")
    setSortByState("createdAt")
    setOrderState("desc")
    setCurrentPage(1)
  }, [])

  const retry = useCallback(() => {
    fetchPoems()
  }, [fetchPoems])

  return {
    // Data
    poems,
    pagination,

    // State
    isLoading,
    error,

    // Search and filters
    searchTerm,
    selectedCategory,
    selectedTag,
    sortBy,
    order,

    // Actions
    setSearchTerm,
    setSelectedCategory,
    setSelectedTag,
    setSortBy,
    setOrder,
    goToPage,
    clearFilters,
    retry,
  }
}