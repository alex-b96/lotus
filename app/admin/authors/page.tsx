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
  Users
} from "lucide-react"
import Link from "next/link"
import { useAdminAuthors } from "@/hooks/use-admin-authors"
import { useState } from "react"

function AdminAuthorsPageContent() {
  const {
    authors,
    pagination,
    isLoading,
    error,
    isTogglingFeatured,
    searchTerm,
    setSearchTerm,
    goToPage,
    clearFilters,
    retry,
    toggleFeatured,
  } = useAdminAuthors()

  const [localError, setLocalError] = useState<string | null>(null)

  const handleToggleFeatured = async (authorId: string, featured: boolean) => {
    try {
      setLocalError(null)
      await toggleFeatured(authorId, featured)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Failed to update featured status")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Users className="w-8 h-8 text-orange-600" />
          <h1 className="text-4xl font-bold text-green-800">Manage Authors</h1>
        </div>
        <p className="text-green-600 text-lg max-w-2xl mx-auto">
          Manage featured authors and control who appears in the featured section of the authors page.
        </p>
      </div>

      {/* Search */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
              <Input
                placeholder="Search authors by name, email, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-green-300 focus:border-green-500"
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
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                Clear Search
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

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
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Error: {error || localError}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={retry}
              className="ml-4"
            >
              <RefreshCcw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-green-600">Loading authors...</span>
        </div>
      )}

      {/* Authors Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {authors.map((author) => (
            <Card
              key={author.id}
              className={`bg-white/70 backdrop-blur-sm border-2 transition-all duration-300 hover:shadow-lg ${
                author.featured
                  ? 'border-yellow-300 bg-gradient-to-br from-yellow-50/90 to-white/90'
                  : 'border-green-200 hover:border-green-300'
              }`}
            >
              <CardHeader className="relative">
                {/* Featured Badge */}
                {author.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                    <AvatarFallback className="text-lg bg-green-100 text-green-700">
                      {author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <CardTitle className="text-xl text-green-800 mb-2">{author.name}</CardTitle>

                    {/* Author Info */}
                    <div className="space-y-2 text-sm text-green-600">
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
              </CardHeader>

              <CardContent>
                {/* Bio */}
                {author.bio && (
                  <p className="text-green-700 mb-4 text-sm line-clamp-3">
                    {author.bio}
                  </p>
                )}

                {/* Featured Toggle */}
                <div className="border-t border-green-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-yellow-600" />
                      <Label htmlFor={`featured-${author.id}`} className="text-sm font-medium text-green-800">
                        Featured Author
                      </Label>
                    </div>
                    <Switch
                      id={`featured-${author.id}`}
                      checked={author.featured}
                      onCheckedChange={(checked) => handleToggleFeatured(author.id, checked)}
                      disabled={isTogglingFeatured === author.id}
                      className="data-[state=checked]:bg-yellow-500"
                    />
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {author.featured
                      ? "This author appears in the featured authors section"
                      : "Enable to feature this author on the authors page"
                    }
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <Button asChild variant="outline" size="sm" className="flex-1 border-green-300 text-green-700 hover:bg-green-50">
                    <Link href={`/authors/${author.id}`}>
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Link>
                  </Button>
                  {author.website && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <a href={author.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>

                {/* Loading indicator for this specific author */}
                {isTogglingFeatured === author.id && (
                  <div className="flex items-center justify-center mt-3 text-sm text-green-600">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Updating featured status...
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && authors.length === 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-green-200">
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-800 mb-2">No Authors Found</h3>
            <p className="text-green-600 mb-4">
              {searchTerm
                ? "No authors match your search criteria. Try adjusting your search terms."
                : "No authors with published poems found in the system."
              }
            </p>
            {searchTerm && (
              <Button onClick={clearFilters} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
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
  )
}

function AdminAuthorsPageLoading() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Users className="w-8 h-8 text-orange-600" />
          <h1 className="text-4xl font-bold text-green-800">Manage Authors</h1>
        </div>
        <p className="text-green-600 text-lg">Loading author management interface...</p>
      </div>
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    </div>
  )
}

export default function AdminAuthorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<AdminAuthorsPageLoading />}>
        <AdminAuthorsPageContent />
      </Suspense>
    </div>
  )
}