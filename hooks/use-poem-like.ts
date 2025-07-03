import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

/**
 * Custom hook to manage like state for a poem
 * @param poemId - The ID of the poem
 */
export function usePoemLike(poemId?: string) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Only run effect if poemId is defined
  useEffect(() => {
    if (!poemId) return
    setLoading(true)
    fetch(`/api/poems/${poemId}/like`)
      .then(res => res.json())
      .then(data => {
        setLiked(data.liked)
        setCount(data.count)
      })
      .catch(() => setError("Eroare la încărcarea stării de apreciere"))
      .finally(() => setLoading(false))
  }, [poemId, session])

  // Like the poem
  const like = async () => {
    if (!session?.user || !poemId) return false
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/poems/${poemId}/like`, { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setLiked(true)
        setCount(data.count)
        return true
      } else {
        setError(data.error || "Eroare la aprecierea poeziei")
        return false
      }
    } catch {
      setError("Eroare la aprecierea poeziei")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Unlike the poem
  const unlike = async () => {
    if (!session?.user || !poemId) return false
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/poems/${poemId}/like`, { method: "DELETE" })
      const data = await res.json()
      if (res.ok) {
        setLiked(false)
        setCount(data.count)
        return true
      } else {
        setError(data.error || "Eroare la anularea aprecierii")
        return false
      }
    } catch {
      setError("Eroare la anularea aprecierii")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { liked, count, loading, error, like, unlike, session }
}