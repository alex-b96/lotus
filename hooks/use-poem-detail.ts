"use client"

import { useState, useEffect } from "react"

export interface PoemDetail {
  id: string
  title: string
  content: string
  category: string
  status: string
  author: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
    bio: string | null
    website: string | null
    _count: {
      poems: number
    }
  }
  tags: string[]
  readingTime: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  likes: number
  comments: number
}

interface UsePoemDetailResult {
  poem: PoemDetail | null
  loading: boolean
  error: string | null
  retry: () => void
}

export function usePoemDetail(poemId: string): UsePoemDetailResult {
  const [poem, setPoem] = useState<PoemDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPoem = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/poems/${poemId}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Poem not found")
        }
        throw new Error("Failed to fetch poem")
      }

      const data = await response.json()
      setPoem(data.poem)

    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      console.error("Error fetching poem:", err)
    } finally {
      setLoading(false)
    }
  }

  const retry = () => {
    fetchPoem()
  }

  useEffect(() => {
    if (poemId) {
      fetchPoem()
    }
  }, [poemId])

  return { poem, loading, error, retry }
}