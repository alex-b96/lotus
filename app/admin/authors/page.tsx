"use client"

import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pagination, PaginationInfo } from "@/components/pagination"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  BookOpen,
  ExternalLink,
  Search,
  Loader2,
  AlertCircle,
  RefreshCcw,
  User,
  Star,
  Crown,
  Mail,
  Calendar,
  Users,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { useAdminAuthors } from "@/hooks/use-admin-authors"
import { useState } from "react"

// Helper to get user initials for avatar fallback
const getInitials = (name?: string | null) => {
  if (!name || typeof name !== 'string' || name.trim() === '') return '??'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function AdminAuthorsPageContent() {
  const {
    authors,
    pagination,
    isLoading,
    error,
    isTogglingFeatured,
    isDeleting,
    searchTerm,
    setSearchTerm,
    goToPage,
    clearFilters,
    retry,
    toggleFeatured,
    deleteAuthor,
  } = useAdminAuthors()

  const [localError, setLocalError] = useState<string | null>(null)
  const [authorToDelete, setAuthorToDelete] = useState<string | null>(null)

  const handleToggleFeatured = async (authorId: string, featured: boolean) => {
    try {
      setLocalError(null)
      await toggleFeatured(authorId, featured)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Failed to update featured status")
    }
  }

  const handleDeleteAuthor = async (authorId: string) => {
    try {
      setLocalError(null)
      await deleteAuthor(authorId)
      setAuthorToDelete(null) // Close dialog on success
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Failed to delete author")
      // Keep dialog open on error so user can retry
    }
  }

  return (
    <div className="min-h-screen bg-theme-dark">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-pink-300" />
            <h1 className="text-4xl font-light text-theme-primary">Manage Authors</h1>
          </div>
          <p className="text-lg max-w-2xl mx-auto font-light text-theme-secondary">
            Manage featured authors and control who appears in the featured section of the authors page.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300 w-4 h-4" />
              <Input
                placeholder="Search authors by name, email, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                disabled={isLoading}
              />
            </div>

            {/* Clear Filters */}
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                disabled={isLoading}
                className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
              >
                Clear Search
              </Button>
            )}
          </div>
        </div>

        {/* Pagination Info */}
        {pagination && !isLoading && (
          <PaginationInfo
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            limit={pagination.limit}
            className="text-center"
          />
        )}

        {/* Error States */}
        {(error || localError) && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="text-red-200 flex items-center justify-between w-full">
              <span>Error: {error || localError}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={retry}
                className="ml-4 bg-transparent border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
              >
                <RefreshCcw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-pink-300" />
            <span className="ml-2 font-light text-theme-secondary">Loading authors...</span>
          </div>
        )}

        {/* Authors Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {authors.map((author) => (
            <div
              key={author.id}
              className={`bg-white/5 backdrop-blur-sm rounded-xl border-2 transition-all duration-300 hover:bg-white/10 ${
                author.featured
                  ? 'border-pink-300 bg-pink-300/10'
                  : 'border-white/10 hover:border-pink-300/30'
              }`}
            >
              <div className="relative p-6 border-b border-white/10">
                {/* Featured Badge */}
                {author.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-pink-300/20 text-pink-300 border border-pink-300/40 hover:bg-pink-300/30">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback className="text-lg bg-white/10 text-pink-200">
                      {getInitials(author.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="text-xl font-light mb-2 text-theme-primary">{author.name}</h3>

                    {/* Author Info */}
                    <div className="space-y-2 text-sm text-theme-secondary">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{author.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{author.poemsCount} published poem{author.poemsCount !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(author.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Bio */}
                {author.bio && (
                  <p className="mb-4 text-sm line-clamp-3 font-light text-theme-secondary">
                    {author.bio}
                  </p>
                )}

                {/* Featured Toggle */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-pink-300" />
                      <Label htmlFor={`featured-${author.id}`} className="text-sm font-medium text-theme-primary">
                        Featured Author
                      </Label>
                    </div>
                    <Switch
                      id={`featured-${author.id}`}
                      checked={author.featured}
                      onCheckedChange={(checked) => handleToggleFeatured(author.id, checked)}
                      disabled={isTogglingFeatured === author.id}
                      className="data-[state=checked]:bg-pink-300"
                    />
                  </div>
                  <p className="text-xs mt-1 text-theme-secondary">
                    {author.featured
                      ? "This author appears in the featured authors section"
                      : "Enable to feature this author on the authors page"
                    }
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
                    <Link href={`/authors/${author.id}`}>
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Link>
                  </Button>
                  <AlertDialog open={authorToDelete === author.id} onOpenChange={(open) => {
                    if (!open) {
                      setAuthorToDelete(null)
                    } else {
                      setAuthorToDelete(author.id)
                    }
                  }}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting === author.id || isTogglingFeatured === author.id}
                        className="bg-red-600/20 border-red-500/40 text-red-400 hover:bg-red-600/30 hover:border-red-500/60 font-light"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black/90 backdrop-blur-md border border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-light text-theme-primary">
                          Delete Author Account
                        </AlertDialogTitle>
                        <AlertDialogDescription className="font-light text-theme-secondary">
                          Are you sure you want to delete <strong>{author.name}</strong> ({author.email})?
                          <br /><br />
                          This action will permanently delete:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>The author account</li>
                            <li>All {author.poemsCount} published poem{author.poemsCount !== 1 ? 's' : ''} by this author</li>
                            <li>All comments made by this author</li>
                            <li>All associated data (ratings, etc.)</li>
                          </ul>
                          <br />
                          <strong className="text-red-400">This action cannot be undone.</strong>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          disabled={isDeleting === author.id}
                          className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteAuthor(author.id)}
                          disabled={isDeleting === author.id}
                          className="bg-red-600 hover:bg-red-700 text-white font-light"
                        >
                          {isDeleting === author.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Author
                            </>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {/* {author.website && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
                    >
                      <a href={author.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )} */}
                </div>

                {/* Loading indicator for this specific author */}
                {isTogglingFeatured === author.id && (
                  <div className="flex items-center justify-center mt-3 text-sm text-theme-secondary">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Updating featured status...
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && authors.length === 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-center py-12 px-6">
            <Users className="w-12 h-12 text-pink-300 mx-auto mb-4" />
            <h3 className="text-lg font-light mb-2 text-theme-primary">No Authors Found</h3>
            <p className="mb-4 font-light text-theme-secondary">
              {searchTerm
                ? "No authors match your search criteria. Try adjusting your search terms."
                : "No authors with published poems found in the system."
              }
            </p>
            {searchTerm && (
              <Button onClick={clearFilters} variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={goToPage}
            showPreviousNext
          />
        )}
      </div>
    </div>
  )
}

function AdminAuthorsPageLoading() {
  return (
    <div className="min-h-screen bg-theme-dark">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-pink-300" />
            <h1 className="text-4xl font-light text-theme-primary">Manage Authors</h1>
          </div>
          <p className="text-lg font-light text-theme-secondary">Loading author management interface...</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-300" />
        </div>
      </div>
    </div>
  )
}

export default function AdminAuthorsPage() {
  return (
    <Suspense fallback={<AdminAuthorsPageLoading />}>
      <AdminAuthorsPageContent />
    </Suspense>
  )
}