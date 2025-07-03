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
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        {/* Featured Authors Section */}
        <FeaturedAuthors />

        {/* Divider */}
        <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white/5 backdrop-blur-sm px-6 py-2 text-pink-300 font-medium rounded-full border border-pink-300/40">
            Vezi toți autori
          </span>
        </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-300 w-4 h-4" />
              <Input
                placeholder="Caută autori după nume sau bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                disabled={isLoading}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <Filter className="text-pink-300 w-4 h-4" />
                <span className="text-sm font-light" style={{ color: '#9b9b9b' }}>Sortează după:</span>
                <Select value={sortBy} onValueChange={setSortBy} disabled={isLoading}>
                  <SelectTrigger className="w-36 bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-md border-white/10">
                    <SelectItem value="poems" className="text-gray-300 focus:text-white focus:bg-white/5">Cele mai multe poezii</SelectItem>
                    <SelectItem value="name" className="text-gray-300 focus:text-white focus:bg-white/5">Nume</SelectItem>
                    <SelectItem value="createdAt" className="text-gray-300 focus:text-white focus:bg-white/5">Cele mai noi</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={order} onValueChange={setOrder} disabled={isLoading}>
                  <SelectTrigger className="w-24 bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-md border-white/10">
                    <SelectItem value="desc" className="text-gray-300 focus:text-white focus:bg-white/5">↓</SelectItem>
                    <SelectItem value="asc" className="text-gray-300 focus:text-white focus:bg-white/5">↑</SelectItem>
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
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
                >
                  Șterge filtrele
                </Button>
              )}
            </div>
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

          {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="text-red-200 flex items-center justify-between w-full">
              <span>Eroare la încărcarea autorilor: {error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={retry}
              className="ml-4 bg-transparent border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
            >
              <RefreshCcw className="w-4 h-4 mr-1" />
              Reîncarcă
            </Button>
            </div>
          </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-300" />
          <span className="ml-2 font-light" style={{ color: '#9b9b9b' }}>Se încarcă autorii...</span>
          </div>
        )}

          {/* Authors Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <div
              key={author.id}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <div className="text-center p-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback className="text-lg">
                    {getInitials(author.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-light" style={{ color: '#e2e2e2' }}>{author.name}</h3>
                <div className="flex items-center justify-center space-x-4 text-sm" style={{ color: '#9b9b9b' }}>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{author.poemsCount} poem{author.poemsCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4 text-pink-300" />
                    <span className="text-pink-300">Autor</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                {author.bio ? (
                  <p className="mb-4 text-center line-clamp-3 font-light" style={{ color: '#9b9b9b' }}>
                    {author.bio}
                  </p>
                ) : null}

                <div className="flex flex-col space-y-2">
                  <Button asChild className="bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light">
                    <Link href={`/authors/${author.id}`}>Vezi profilul</Link>
                  </Button>
                  {author.website && (
                    <Button variant="outline" asChild className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
                      <a href={author.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && authors.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-pink-300 mx-auto mb-4" />
          <h3 className="text-xl font-light mb-2" style={{ color: '#e2e2e2' }}>Nu s-au găsit autori</h3>
          <p className="mb-4 font-light" style={{ color: '#9b9b9b' }}>
            {searchTerm
              ? `Nu s-au găsit autori care să se potrivească cu "${searchTerm}"`
              : "Nu sunt disponibile autori momentan"}
          </p>
          {searchTerm && (
            <Button onClick={clearFilters} variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
              Șterge căutarea
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
    </div>
  )
}

// Loading fallback component
function AuthorsPageLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center">
          <h1 className="text-5xl lg:text-6xl font-light mb-6" style={{ color: '#e2e2e2' }}>Autori</h1>
          <p className="text-lg max-w-2xl mx-auto font-light" style={{ color: '#9b9b9b' }}>
            Întâmpină cei mai buni poeți ai comunității noastre
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-300" />
          <span className="ml-2 font-light" style={{ color: '#9b9b9b' }}>Se încarcă autorii...</span>
        </div>
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
