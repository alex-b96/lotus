"use client"

import { useState, useEffect, useCallback } from "react"

// Types for the API response
interface ApiFeaturedAuthor {
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

interface FeaturedApiResponse {
  authors: ApiFeaturedAuthor[]
}

// Transformed author type for components
interface FeaturedAuthor {
  id: string
  name: string
  bio: string | null
  avatar: string | null
  poemsCount: number
  website: string | null
  createdAt: string
}

interface UseFeaturedAuthorsReturn {
  // Data
  featuredAuthors: FeaturedAuthor[]

  // State
  isLoading: boolean
  error: string | null

  // Actions
  retry: () => void
}

// Transform API author data to component-compatible format
const transformApiFeaturedAuthor = (apiAuthor: ApiFeaturedAuthor): FeaturedAuthor => {
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

export function useFeaturedAuthors(): UseFeaturedAuthorsReturn {
  // API state
  const [featuredAuthors, setFeaturedAuthors] = useState<FeaturedAuthor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch featured authors from API
  const fetchFeaturedAuthors = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/authors/featured")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: FeaturedApiResponse = await response.json()
      setFeaturedAuthors(data.authors.map(transformApiFeaturedAuthor))
    } catch (err) {
      console.error("Error fetching featured authors:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch featured authors")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Effect to fetch featured authors on mount
  useEffect(() => {
    fetchFeaturedAuthors()
  }, [fetchFeaturedAuthors])

  // Retry function
  const retry = useCallback(() => {
    fetchFeaturedAuthors()
  }, [fetchFeaturedAuthors])

  return {
    featuredAuthors,
    isLoading,
    error,
    retry,
  }
}