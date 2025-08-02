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
        // Check admin status with dedicated endpoint
        const response = await fetch('/api/admin/status')
        const data = await response.json()
        setIsAdmin(data.isAdmin || false)
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