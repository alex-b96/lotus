"use client"

import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, MessageCircle, Search, Filter, User, Clock, Loader2, AlertCircle, RefreshCcw, BookOpen } from "lucide-react"
import Link from "next/link"
import { usePoemListing } from "@/hooks/use-poem-listing"
import { Pagination, PaginationInfo } from "@/components/pagination"

const categories = ["All", "Lyric", "Haiku", "Modern", "Classic", "Experimental"]

function PoemsPageContent() {
  const {
    // Data
    poems,
    pagination,

    // State
    isLoading,
    error,

    // Search and filters
    searchTerm,
    selectedCategory,
    sortBy,
    order,

    // Actions
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    setOrder,
    goToPage,
    clearFilters,
    retry,
  } = usePoemListing()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Poetry Collection</h1>
        <p className="text-green-600 text-lg max-w-2xl mx-auto">
          Discover beautiful poems from talented writers around the world. Each piece tells a unique story.
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
              <Input
                placeholder="Search poems, authors, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-green-300 focus:border-green-500"
                disabled={isLoading}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="text-green-600 w-4 h-4" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoading}>
                <SelectTrigger className="w-48 border-green-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-green-600">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy} disabled={isLoading}>
                  <SelectTrigger className="w-32 border-green-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Newest</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="likes">Most Liked</SelectItem>
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
              {(searchTerm || selectedCategory !== "All" || sortBy !== "createdAt" || order !== "desc") && (
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
            <span>Failed to load poems: {error}</span>
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
          <span className="ml-2 text-green-600">Loading poems...</span>
        </div>
      )}

      {/* Poems Grid */}
      {!isLoading && !error && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.map((poem) => (
          <Card
            key={poem.id}
            className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="border-green-300 text-green-600 mb-2">
                  {poem.category}
                </Badge>
                  {poem.readingTime && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      {poem.readingTime} min read
                    </Badge>
                  )}
              </div>
              <CardTitle className="text-xl text-green-800 hover:text-green-900 transition-colors">
                <Link href={`/poems/${poem.id}`}>{poem.title}</Link>
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-green-600">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <Link
                      href={`/authors/${poem.authorData.id}`}
                    className="hover:text-green-800 transition-colors"
                  >
                    {poem.author}
                  </Link>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                    <span>{new Date(poem.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-green-700 mb-4 italic line-clamp-3">"{poem.preview}"</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {poem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-green-100 text-green-700">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-green-100">
                {/* Like and comment counts: static, not buttons */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-green-700 text-sm">
                    <Heart className="w-4 h-4 mr-1" />
                    {poem.likes}
                  </div>
                  <div className="flex items-center text-green-700 text-sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {poem.comments}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Link href={`/poems/${poem.id}`}>Read More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {/* No Results */}
      {!isLoading && !error && poems.length === 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-green-200">
          <CardContent className="p-12 text-center">
            <div className="text-green-600 mb-4">
              <Search className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">No poems found</h3>
            <p className="text-green-600 mb-4">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search terms or category filter."
                : "There are no published poems available at the moment."
              }
            </p>
            {(searchTerm || selectedCategory !== "All") && (
            <Button
              variant="outline"
                onClick={clearFilters}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Clear Filters
            </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && !isLoading && !error && (
        <div className="space-y-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={goToPage}
            className="mt-8"
          />

          <PaginationInfo
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            limit={pagination.limit}
            className="text-center"
          />
        </div>
      )}
    </div>
  )
}

// Loading fallback component
function PoemsPageLoading() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Poetry Collection</h1>
        <p className="text-green-600 text-lg max-w-2xl mx-auto">
          Discover beautiful poems from talented writers around the world. Each piece tells a unique story.
        </p>
      </div>
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2 text-green-600">Loading poems...</span>
      </div>
    </div>
  )
}

export default function PoemsPage() {
  return (
    <Suspense fallback={<PoemsPageLoading />}>
      <PoemsPageContent />
    </Suspense>
  )
}
