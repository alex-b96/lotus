'use client'

import { signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut({
          redirect: false,
          callbackUrl: '/login'
        })
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        router.push('/login')
      }
    }

    performLogout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Logging out...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we clear your session.
          </p>
        </div>
      </div>
    </div>
  )
}