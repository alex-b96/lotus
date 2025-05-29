"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export function useAdminStatus() {
  const { data: session, status } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (status === "loading") {
        return // Still loading session
      }

      if (!session?.user?.email) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        // Make a simple request to an admin endpoint to check status
        const response = await fetch('/api/admin/poems?page=1&limit=1')

        if (response.ok) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      } catch {
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [session, status])

  return { isAdmin, loading: loading && status !== "unauthenticated" }
}