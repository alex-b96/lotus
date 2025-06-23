"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, MessageCircle, CheckCircle, XCircle, Loader2, AlertCircle, RefreshCcw, Shield, Calendar, User, Star, StarOff } from "lucide-react"
import { useAdminPoems } from "@/hooks/use-admin-poems"
import { Pagination } from "@/components/pagination"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const {
    poems,
    pagination,
    loading,
    error,
    currentPage,
    actionLoading,
    fetchPoems,
    approvePoem,
    rejectPoem,
    retry
  } = useAdminPoems()

  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedPoemForRejection, setSelectedPoemForRejection] = useState<string | null>(null)

  // Featured Poem state
  const [featuredPoem, setFeaturedPoem] = useState<any>(null)
  const [publishedPoems, setPublishedPoems] = useState<any[]>([])
  const [featuredLoading, setFeaturedLoading] = useState(false)
  const [featuredError, setFeaturedError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Fetch featured poem data on component mount
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === 'ADMIN') {
      fetchFeaturedPoem()
      fetchPublishedPoems()
    }
  }, [status, session])

  // Handle approve action
  const handleApprove = async (poemId: string) => {
    const success = await approvePoem(poemId)
    if (success) {
      // Could add toast notification here
    }
  }

  // Handle reject action with reason
  const handleReject = async (poemId: string, reason: string) => {
    const success = await rejectPoem(poemId, reason)
    if (success) {
      setSelectedPoemForRejection(null)
      setRejectionReason("")
    }
  }

  // Featured Poem functions
  const fetchFeaturedPoem = async () => {
    try {
      const response = await fetch('/api/admin/featured-poem')
      if (response.ok) {
        const data = await response.json()
        setFeaturedPoem(data.featuredPoem)
      }
    } catch (error) {
      console.error('Error fetching featured poem:', error)
    }
  }

  const fetchPublishedPoems = async () => {
    try {
      const response = await fetch('/api/poems?status=PUBLISHED&limit=50')
      if (response.ok) {
        const data = await response.json()
        setPublishedPoems(data.poems || [])
      }
    } catch (error) {
      console.error('Error fetching published poems:', error)
    }
  }

  const setFeaturedPoemHandler = async (poemId: string) => {
    setFeaturedLoading(true)
    setFeaturedError(null)
    try {
      const response = await fetch('/api/admin/featured-poem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ poemId }),
      })

      if (response.ok) {
        await fetchFeaturedPoem()
        // Could add toast notification here
      } else {
        const error = await response.json()
        setFeaturedError(error.error || 'Failed to set featured poem')
      }
    } catch (error) {
      setFeaturedError('An error occurred')
    } finally {
      setFeaturedLoading(false)
    }
  }

  const removeFeaturedPoem = async () => {
    setFeaturedLoading(true)
    setFeaturedError(null)
    try {
      const response = await fetch('/api/admin/featured-poem', {
        method: 'DELETE',
      })

      if (response.ok) {
        setFeaturedPoem(null)
        // Could add toast notification here
      } else {
        const error = await response.json()
        setFeaturedError(error.error || 'Failed to remove featured poem')
      }
    } catch (error) {
      setFeaturedError('An error occurred')
    } finally {
      setFeaturedLoading(false)
    }
  }

  // Show loading spinner during authentication check
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Show sign-in message if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h1 className="text-xl font-semibold mb-2">Authentication Required</h1>
          <p className="text-gray-600">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Review and approve submitted poems. Welcome back, {session?.user?.name || 'Admin'}!
          </p>

          {/* Quick Actions */}
          <div className="flex gap-4 mt-4">
            <Button variant="outline" asChild>
              <a href="/admin/authors">
                <User className="h-4 w-4 mr-2" />
                Manage Authors
              </a>
            </Button>
          </div>
        </div>

        {/* Featured Poem of the Week Section */}
        <Card className="mb-8 border-l-4 border-l-blue-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Poem of the Week
            </CardTitle>
            <p className="text-sm text-gray-600">
              Select which published poem should be featured on the homepage
            </p>
          </CardHeader>
          <CardContent>
            {featuredError && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {featuredError}
                </AlertDescription>
              </Alert>
            )}

            {featuredPoem ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800">{featuredPoem.title}</h4>
                    <p className="text-sm text-green-600 mb-2">by {featuredPoem.author.name}</p>
                    <div className="flex gap-2 mb-3">
                      {featuredPoem.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-green-500">
                      Featured since: {new Date(featuredPoem.featuredAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeFeaturedPoem}
                    disabled={featuredLoading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {featuredLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                    <span className="ml-2">Remove</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600">No poem is currently featured</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="poem-select">Select a poem to feature:</Label>
                <Select onValueChange={setFeaturedPoemHandler} disabled={featuredLoading}>
                  <SelectTrigger id="poem-select" className="w-full mt-2">
                    <SelectValue placeholder={
                      publishedPoems.length === 0
                        ? "No published poems available"
                        : "Choose a published poem..."
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {publishedPoems.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-gray-500">
                        No published poems found
                      </div>
                    ) : (
                      publishedPoems.map((poem) => (
                        <SelectItem key={poem.id} value={poem.id}>
                          {poem.title} - by {poem.author.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">

          {pagination && (
            <div className="mt-4">
              <Badge variant="outline" className="text-sm">
                {pagination.totalCount} submitted poems pending review
              </Badge>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={retry}
                className="ml-4"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-3 text-gray-600">Loading submitted poems...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && poems.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
            <p className="text-gray-600">No poems pending approval at the moment.</p>
          </div>
        )}

        {/* Poems List */}
        {!loading && poems.length > 0 && (
          <div className="space-y-6">
            {poems.map((poem) => (
              <Card key={poem.id} className="border-l-4 border-l-yellow-400">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{poem.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {poem.author.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(poem.createdAt).toLocaleDateString()}
                        </div>
                        <Badge variant="secondary">{poem.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {poem.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {poem.comments}
                        </div>
                        {poem.readingTime && <span>{poem.readingTime} min read</span>}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleApprove(poem.id)}
                        disabled={actionLoading === poem.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {actionLoading === poem.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span className="ml-2">Approve</span>
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            disabled={actionLoading === poem.id}
                            onClick={() => setSelectedPoemForRejection(poem.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="ml-2">Reject</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Poem</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to reject "{poem.title}"? You can optionally provide a reason for the author.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="reason">Rejection Reason (Optional)</Label>
                              <Textarea
                                id="reason"
                                placeholder="Provide feedback for the author..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="mt-2"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {
                              setSelectedPoemForRejection(null)
                              setRejectionReason("")
                            }}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(poem.id, rejectionReason)}
                              disabled={actionLoading === poem.id}
                            >
                              {actionLoading === poem.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              Reject Poem
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Poem Content */}
                  <div className="prose max-w-none mb-4">
                    <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg border">
                      {poem.content}
                    </div>
                  </div>

                  {/* Tags */}
                  {poem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {poem.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              onPageChange={(page) => fetchPoems(page)}
            />
          </div>
        )}
      </div>
    </div>
  )
}