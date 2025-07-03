"use client"

import { useState, useEffect } from "react"

export interface FeedbackComment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
  }
  poem: {
    id: string
    title: string
  }
}

export interface FeedbackPagination {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface FeedbackResponse {
  comments: FeedbackComment[]
  pagination: FeedbackPagination
}

export function useFeedback(initialPage = 1, initialLimit = 20) {
  const [comments, setComments] = useState<FeedbackComment[]>([])
  const [pagination, setPagination] = useState<FeedbackPagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [limit] = useState(initialLimit)

  const fetchFeedback = async (pageNum: number) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
      })

      const response = await fetch(`/api/feedback?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: FeedbackResponse = await response.json()
      setComments(data.comments)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch feedback")
      setComments([])
      setPagination(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback(page)
  }, [page, limit])

  const goToPage = (newPage: number) => {
    setPage(newPage)
  }

  const retry = () => {
    fetchFeedback(page)
  }

  return {
    comments,
    pagination,
    isLoading,
    error,
    page,
    goToPage,
    retry,
  }
}