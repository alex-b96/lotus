"use client"

import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pagination, PaginationInfo } from "@/components/pagination"
import {
  BookOpen,
  ExternalLink,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCcw,
  User
} from "lucide-react"
import Link from "next/link"
import { useAuthors } from "@/hooks/use-authors"
import { FeaturedAuthors } from "@/components/featured-authors"

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

function AuthorsPageContent() {
  const {
    authors,
    pagination,
    isLoading,
    error,
    searchTerm,
    sortBy,
    order,
    setSearchTerm,
    setSortBy,
    setOrder,
    goToPage,
    clearFilters,
    retry,
  } = useAuthors()

  return (
    <div className="space-y-12">
      {/* Featured Authors Section */}
      <FeaturedAuthors />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-green-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-gradient-to-r from-green-50 to-white px-6 py-2 text-green-600 font-medium rounded-full border border-green-200">
            Browse All Authors
          </span>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
              <Input
                placeholder="Search authors by name or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-green-300 focus:border-green-500"
                disabled={isLoading}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <Filter className="text-green-600 w-4 h-4" />
                <span className="text-sm text-green-600">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy} disabled={isLoading}>
                  <SelectTrigger className="w-36 border-green-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poems">Most Poems</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="createdAt">Newest</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={order} onValueChange={setOrder} disabled={isLoading}>
                  <SelectTrigger className="w-24 border-green-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">↓</SelectItem>
                    <SelectItem value="asc">↑</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(searchTerm || sortBy !== "poems" || order !== "desc") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  disabled={isLoading}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Clear Filters
                </Button>
              )}
            </div>
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

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load authors: {error}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <Card
              key={author.id}
              className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback className="text-lg">
                    {getInitials(author.name)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl text-green-800">{author.name}</CardTitle>
                <div className="flex items-center justify-center space-x-4 text-sm text-green-600">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{author.poemsCount} poem{author.poemsCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Author</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-green-700 mb-4 text-center line-clamp-3">
                  {author.bio || "A talented poet sharing their creativity through verse."}
                </p>

                <div className="flex flex-col space-y-2">
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href={`/authors/${author.id}`}>View Profile</Link>
                  </Button>
                  {author.website && (
                    <Button variant="outline" asChild className="border-green-300 text-green-700 hover:bg-green-50">
                      <a href={author.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && authors.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-green-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">No Authors Found</h3>
          <p className="text-green-600 mb-4">
            {searchTerm
              ? `No authors match your search for "${searchTerm}"`
              : "No authors available at the moment"}
          </p>
          {searchTerm && (
            <Button onClick={clearFilters} variant="outline" className="border-green-300 text-green-700">
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && !isLoading && !error && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
          className="justify-center"
          hasNext={pagination.page < pagination.totalPages}
          hasPrev={pagination.page > 1}
        />
      )}
    </div>
  )
}

// Loading fallback component
function AuthorsPageLoading() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Our Authors</h1>
        <p className="text-green-600 text-lg max-w-2xl mx-auto">
          Meet the talented poets who share their hearts and souls through beautiful verse.
        </p>
      </div>
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2 text-green-600">Loading authors...</span>
      </div>
    </div>
  )
}

export default function AuthorsPage() {
  return (
    <Suspense fallback={<AuthorsPageLoading />}>
      <AuthorsPageContent />
    </Suspense>
  )
}
