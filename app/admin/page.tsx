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
import { Heart, MessageCircle, CheckCircle, XCircle, Loader2, AlertCircle, RefreshCcw, Shield, Calendar, User, Star, StarOff, Megaphone } from "lucide-react"
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
      <div className="min-h-screen flex items-center justify-center bg-theme-dark">
        <Loader2 className="h-8 w-8 animate-spin text-pink-300" />
      </div>
    )
  }

  // Show sign-in message if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-dark">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-pink-300" />
          <h1 className="text-xl font-light mb-2 text-theme-primary">Authentication Required</h1>
          <p className="font-light text-theme-secondary">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-theme-dark">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-pink-300" />
            <h1 className="text-3xl font-light text-theme-primary">Admin Dashboard</h1>
          </div>
          <p className="font-light text-theme-secondary">
            Review and approve submitted poems. Welcome back, {session?.user?.name || 'Admin'}!
          </p>

          {/* Quick Actions */}
          <div className="flex gap-4 mt-4">
            <Button variant="outline" asChild className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
              <a href="/admin/authors">
                <User className="h-4 w-4 mr-2" />
                Manage Authors
              </a>
            </Button>
            <Button variant="outline" asChild className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
              <a href="/admin/announcements">
                <Megaphone className="h-4 w-4 mr-2" />
                Manage Announcements
              </a>
            </Button>
          </div>
        </div>

        {/* Featured Poem of the Week Section */}
        <div className="mb-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 border-l-4 border-l-pink-300">
          <div className="p-6 border-b border-white/10">
            <h3 className="flex items-center gap-2 text-xl font-light text-theme-primary">
              <Star className="h-5 w-5 text-pink-300" />
              Poem of the Week
            </h3>
            <p className="text-sm font-light mt-2 text-theme-secondary">
              Select which published poem should be featured on the homepage
            </p>
          </div>
          <div className="p-6">
            {featuredError && (
              <div className="mb-4 bg-red-900/20 border border-red-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-red-200">{featuredError}</span>
                </div>
              </div>
            )}

            {featuredPoem ? (
              <div className="bg-pink-300/10 border border-pink-300/40 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-theme-primary">{featuredPoem.title}</h4>
                    <p className="text-sm mb-2 text-theme-secondary">by {featuredPoem.author.name}</p>
                    <div className="flex gap-2 mb-3">
                      {featuredPoem.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs border-white/30 text-white bg-white/5">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-pink-300">
                      Featured since: {new Date(featuredPoem.featuredAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeFeaturedPoem}
                    disabled={featuredLoading}
                    className="bg-transparent border-red-400 text-red-400 hover:bg-red-400 hover:text-black font-light"
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
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-pink-300" />
                <p className="font-light text-theme-secondary">No poem is currently featured</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="poem-select" className="font-medium text-theme-primary">Select a poem to feature:</Label>
                <Select onValueChange={setFeaturedPoemHandler} disabled={featuredLoading}>
                  <SelectTrigger id="poem-select" className="w-full mt-2 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder={
                      publishedPoems.length === 0
                        ? "No published poems available"
                        : "Choose a published poem..."
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-md border-white/10">
                    {publishedPoems.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-theme-secondary">
                        No published poems found
                      </div>
                    ) : (
                      publishedPoems.map((poem) => (
                        <SelectItem key={poem.id} value={poem.id} className="text-gray-300 focus:text-white focus:bg-white/5">
                          {poem.title} - by {poem.author.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">

          {pagination && (
            <div className="mt-4">
              <Badge variant="outline" className="text-sm border-white/30 text-white bg-white/5">
                {pagination.totalCount} submitted poems pending review
              </Badge>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-800 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <div className="text-red-200 flex items-center justify-between w-full">
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retry}
                  className="ml-4 bg-transparent border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-pink-300" />
            <span className="ml-3 font-light text-theme-secondary">Loading submitted poems...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && poems.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-pink-300" />
            <h3 className="text-xl font-light mb-2 text-theme-primary">All caught up!</h3>
            <p className="font-light text-theme-secondary">No poems pending approval at the moment.</p>
          </div>
        )}

        {/* Poems List */}
        {!loading && poems.length > 0 && (
          <div className="space-y-6">
            {poems.map((poem) => (
              <div key={poem.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 border-l-4 border-l-pink-300 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-light mb-2 text-theme-primary">{poem.title}</h3>
                      <div className="flex items-center gap-4 text-sm mb-3 text-theme-secondary">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {poem.author.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(poem.createdAt).toLocaleDateString()}
                        </div>
                        {/* Category disabled for now */}
                        {/* <Badge variant="secondary" className="bg-pink-300/20 text-pink-300 border border-pink-300/40">{poem.category}</Badge> */}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-theme-secondary">
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

                    {/* Action Buttons - Desktop Only */}
                    <div className="hidden sm:flex gap-2 ml-4">
                      <Button
                        onClick={() => handleApprove(poem.id)}
                        disabled={actionLoading === poem.id}
                        className="bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light"
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
                        <DialogContent className="bg-black/90 backdrop-blur-md border border-white/10">
                          <DialogHeader>
                            <DialogTitle className="font-light text-theme-primary">Reject Poem</DialogTitle>
                            <DialogDescription className="font-light text-theme-secondary">
                              Are you sure you want to reject "{poem.title}"? You can optionally provide a reason for the author.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="reason" className="font-medium text-theme-primary">Rejection Reason (Optional)</Label>
                              <Textarea
                                id="reason"
                                placeholder="Provide feedback for the author..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {
                              setSelectedPoemForRejection(null)
                              setRejectionReason("")
                            }} className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
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
                </div>
                <div className="p-6">
                  {/* Poem Content */}
                  <div className="prose max-w-none mb-4">
                    <div className="whitespace-pre-wrap p-4 rounded-lg border border-white/10 bg-white/5 font-light text-theme-primary">
                      {poem.content}
                    </div>
                  </div>

                  {/* Tags */}
                  {poem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {poem.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-white/30 text-white bg-white/5">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons - Mobile (Below Poem Content) */}
                  <div className="sm:hidden flex flex-col gap-3 mt-4">
                    <Button
                      onClick={() => handleApprove(poem.id)}
                      disabled={actionLoading === poem.id}
                      className="w-full bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light"
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
                          className="w-full"
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="ml-2">Reject</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black/90 backdrop-blur-md border border-white/10">
                        <DialogHeader>
                          <DialogTitle className="font-light text-theme-primary">Reject Poem</DialogTitle>
                          <DialogDescription className="font-light text-theme-secondary">
                            Are you sure you want to reject "{poem.title}"? You can optionally provide a reason for the author.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="reason-mobile" className="font-medium text-theme-primary">Rejection Reason (Optional)</Label>
                            <Textarea
                              id="reason-mobile"
                              placeholder="Provide feedback for the author..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {
                            setSelectedPoemForRejection(null)
                            setRejectionReason("")
                          }} className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
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
              </div>
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