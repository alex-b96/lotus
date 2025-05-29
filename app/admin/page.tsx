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
import { Heart, MessageCircle, CheckCircle, XCircle, Loader2, AlertCircle, RefreshCcw, Shield, Calendar, User } from "lucide-react"
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

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

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