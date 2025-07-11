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

const categories = ["Toate", "Liric", "Haiku", "Modern", "Clasic", "Experimental"]

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
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl lg:text-6xl font-light mb-6" style={{ color: '#e2e2e2' }}>Colecția de Poezii</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-light">
            Descoperă poezii frumoase de la scriitori talentați din întreaga lume. Fiecare piesă spune o poveste unică.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-300 w-5 h-5" />
              <Input
                placeholder="Caută poezii, autori sau conținut..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 h-12 font-light"
                disabled={isLoading}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-3">
                <Filter className="text-pink-300 w-5 h-5" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoading}>
                  <SelectTrigger className="w-48 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Alege categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-md border-white/10">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-gray-300 focus:text-white focus:bg-white/5">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-300 font-light">Sortează după:</span>
                <Select value={sortBy} onValueChange={setSortBy} disabled={isLoading}>
                  <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-md border-white/10">
                    <SelectItem value="createdAt" className="text-gray-300 focus:text-white focus:bg-white/5">Cele mai recente</SelectItem>
                    <SelectItem value="title" className="text-gray-300 focus:text-white focus:bg-white/5">Titlu</SelectItem>
                    <SelectItem value="likes" className="text-gray-300 focus:text-white focus:bg-white/5">Cele mai apreciate</SelectItem>
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
              {(searchTerm || selectedCategory !== "Toate" || sortBy !== "createdAt" || order !== "desc") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  disabled={isLoading}
                  className="bg-transparent border-white/30 text-white hover:bg-white hover:text-black font-light"
                >
                  Șterge filtrele
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Pagination Info */}
        {pagination && !isLoading && (
          <div className="text-center">
            <p className="text-gray-400 font-light">
              Afișând {((pagination.page - 1) * pagination.limit) + 1} la {Math.min(pagination.page * pagination.limit, pagination.totalCount)} din {pagination.totalCount} poezii
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-200">Eroare la încărcarea poeziilor: {error}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={retry}
                className="bg-transparent border-red-400 text-red-400 hover:bg-red-400 hover:text-black font-light"
              >
                <RefreshCcw className="w-4 h-4 mr-1" />
                Încearcă din nou
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-pink-300" />
            <span className="ml-3 text-gray-300 font-light">Se încarcă poeziile...</span>
          </div>
        )}

        {/* Poems Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {poems.map((poem) => (
              <div
                key={poem.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:border-pink-300/30 transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-pink-300/20 text-pink-300 text-xs font-light rounded-full border border-pink-300/30">
                      {poem.category}
                    </span>
                    {poem.readingTime && (
                      <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs font-light rounded">
                        {poem.readingTime} min citire
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-light text-white mb-3 group-hover:text-pink-300 transition-colors">
                    <Link href={`/poems/${poem.id}`}>{poem.title}</Link>
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <Link
                        href={`/authors/${poem.authorData.id}`}
                        className="hover:text-pink-300 transition-colors font-light"
                      >
                        {poem.author}
                      </Link>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-light">{new Date(poem.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 italic line-clamp-3 font-light leading-relaxed">
                    "{poem.preview}"
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {poem.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-white/5 text-gray-400 text-xs font-light rounded border border-white/10">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Heart className="w-4 h-4 mr-1" />
                        <span className="font-light">{poem.likes}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="font-light">{poem.comments}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-transparent border-white/30 text-white hover:bg-pink-300 hover:text-black hover:border-pink-300 font-light"
                    >
                      <Link href={`/poems/${poem.id}`}>Citește mai mult</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && poems.length === 0 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center">
            <div className="text-pink-300 mb-6">
              <Search className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-light text-white mb-4">Nu s-au găsit poezii</h3>
            <p className="text-gray-300 mb-6 font-light">
              {searchTerm || selectedCategory !== "Toate"
                ? "Încearcă să modifici termenii de căutare sau filtrul categoriei."
                : "Nu sunt poezii publicate disponibile în acest moment."
              }
            </p>
            {(searchTerm || selectedCategory !== "Toate") && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="bg-transparent border-white/30 text-white hover:bg-white hover:text-black font-light"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && !isLoading && !error && (
          <div className="space-y-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              onPageChange={goToPage}
              className="mt-8"
            />

            <div className="text-center">
              <p className="text-gray-400 font-light">
                Afișând {((pagination.page - 1) * pagination.limit) + 1} la {Math.min(pagination.page * pagination.limit, pagination.totalCount)} din {pagination.totalCount} poezii
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Loading fallback component
function PoemsPageLoading() {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center">
          <h1 className="text-5xl lg:text-6xl font-light mb-6" style={{ color: '#e2e2e2' }}>Colecția de Poezii</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-light">
            Descoperă poezii frumoase de la scriitori talentați din întreaga lume. Fiecare piesă spune o poveste unică.
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-pink-300" />
          <span className="ml-3 text-gray-300 font-light">Se încarcă poeziile...</span>
        </div>
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
