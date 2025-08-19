'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

export function GTMRouteListener() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: pathname,
      })
    }
  }, [pathname])

  return null
}