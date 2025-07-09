import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface StarRatingData {
  averageRating: number
  totalRatings: number
  userRating: number | null
}

interface UseStarRatingReturn {
  averageRating: number
  totalRatings: number
  userRating: number | null
  loading: boolean
  error: string | null
  rate: (rating: number) => Promise<void>
  removeRating: () => Promise<void>
  session: any
}

export function useStarRating(poemId: string | undefined): UseStarRatingReturn {
  const { data: session } = useSession()
  const [data, setData] = useState<StarRatingData>({
    averageRating: 0,
    totalRatings: 0,
    userRating: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch rating data
  const fetchRatingData = async () => {
    if (!poemId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/poems/${poemId}/ratings`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ratings: ${response.status}`)
      }

      const ratingData = await response.json()
      setData(ratingData)
    } catch (err) {
      console.error("Error fetching rating data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch rating data")
    } finally {
      setLoading(false)
    }
  }

  // Submit or update rating
  const rate = async (rating: number) => {
    if (!poemId || !session?.user) {
      throw new Error("Authentication required")
    }

    if (rating < 1 || rating > 10) {
      throw new Error("Rating must be between 1 and 10")
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/poems/${poemId}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      })

      if (!response.ok) {
        throw new Error(`Failed to submit rating: ${response.status}`)
      }

      const result = await response.json()
      setData({
        averageRating: result.averageRating,
        totalRatings: result.totalRatings,
        userRating: result.userRating
      })
    } catch (err) {
      console.error("Error submitting rating:", err)
      setError(err instanceof Error ? err.message : "Failed to submit rating")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Remove rating
  const removeRating = async () => {
    if (!poemId || !session?.user) {
      throw new Error("Authentication required")
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/poems/${poemId}/ratings`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to remove rating: ${response.status}`)
      }

      const result = await response.json()
      setData({
        averageRating: result.averageRating,
        totalRatings: result.totalRatings,
        userRating: null
      })
    } catch (err) {
      console.error("Error removing rating:", err)
      setError(err instanceof Error ? err.message : "Failed to remove rating")
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRatingData()
  }, [poemId])

  return {
    averageRating: data.averageRating,
    totalRatings: data.totalRatings,
    userRating: data.userRating,
    loading,
    error,
    rate,
    removeRating,
    session
  }
}