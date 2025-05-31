"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"

// Types for comments
export interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
    avatarUrl?: string | null
  }
}

interface CommentsResponse {
  comments: Comment[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

interface UseCommentsReturn {
  comments: Comment[]
  loading: boolean
  error: string | null
  totalCount: number
  hasMore: boolean
  currentPage: number
  addComment: (content: string) => Promise<boolean>
  updateComment: (commentId: string, content: string) => Promise<boolean>
  deleteComment: (commentId: string) => Promise<boolean>
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

/**
 * Custom hook for managing comments for a specific poem
 */
export function useComments(poemId: string): UseCommentsReturn {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  // Fetch comments from API
  const fetchComments = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true)
      setError(null)

      const url = new URL("/api/comments", window.location.origin)
      url.searchParams.set("poemId", poemId)
      url.searchParams.set("page", page.toString())
      url.searchParams.set("limit", "10") // Load 10 comments per page

      const response = await fetch(url.toString())

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch comments")
      }

      const data: CommentsResponse = await response.json()

      if (append) {
        setComments(prev => [...prev, ...data.comments])
      } else {
        setComments(data.comments)
      }

      setTotalCount(data.pagination.totalCount)
      setHasMore(data.pagination.hasNext)
      setCurrentPage(page)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch comments")
      console.error("Error fetching comments:", err)
    } finally {
      setLoading(false)
    }
  }, [poemId])

  // Load initial comments
  useEffect(() => {
    if (poemId) {
      fetchComments(1, false)
    }
  }, [poemId, fetchComments])

  // Add a new comment
  const addComment = useCallback(async (content: string): Promise<boolean> => {
    if (!session?.user) {
      setError("You must be logged in to comment")
      return false
    }

    try {
      setError(null)

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          poemId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add comment")
      }

      const newComment: Comment = await response.json()

      // Add the new comment to the beginning of the list
      setComments(prev => [newComment, ...prev])
      setTotalCount(prev => prev + 1)

      return true

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment")
      console.error("Error adding comment:", err)
      return false
    }
  }, [poemId, session])

  // Update an existing comment
  const updateComment = useCallback(async (commentId: string, content: string): Promise<boolean> => {
    if (!session?.user) {
      setError("You must be logged in to edit comments")
      return false
    }

    try {
      setError(null)

      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update comment")
      }

      const updatedComment: Comment = await response.json()

      // Update the comment in the list
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId ? updatedComment : comment
        )
      )

      return true

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update comment")
      console.error("Error updating comment:", err)
      return false
    }
  }, [session])

  // Delete a comment
  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    if (!session?.user) {
      setError("You must be logged in to delete comments")
      return false
    }

    try {
      setError(null)

      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete comment")
      }

      // Remove the comment from the list
      setComments(prev => prev.filter(comment => comment.id !== commentId))
      setTotalCount(prev => prev - 1)

      return true

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comment")
      console.error("Error deleting comment:", err)
      return false
    }
  }, [session])

  // Load more comments (pagination)
  const loadMore = useCallback(async () => {
    if (hasMore && !loading) {
      await fetchComments(currentPage + 1, true)
    }
  }, [hasMore, loading, currentPage, fetchComments])

  // Refresh comments
  const refresh = useCallback(async () => {
    await fetchComments(1, false)
  }, [fetchComments])

  return {
    comments,
    loading,
    error,
    totalCount,
    hasMore,
    currentPage,
    addComment,
    updateComment,
    deleteComment,
    loadMore,
    refresh,
  }
}