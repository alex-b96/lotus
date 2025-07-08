"use client"

import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pagination, PaginationInfo } from "@/components/pagination"
import {
  MessageSquare,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCcw,
  User,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { useFeedback } from "@/hooks/use-feedback"

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

// Helper to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function FeedbackPageContent() {
  const {
    comments,
    pagination,
    isLoading,
    error,
    goToPage,
    retry,
  } = useFeedback()

  return (
    <div className="min-h-screen bg-theme-dark">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl lg:text-6xl font-light mb-6 text-theme-primary">Parerea cititorilor</h1>
          <p className="text-lg max-w-2xl mx-auto font-light text-theme-secondary">
            Vezi ce au spus cititorii despre poeziile noastre. Toate comentariile de la comunitate într-un singur loc.
          </p>
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
                <span>Eroare la încărcarea feedback-ului: {error}</span>
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
            <Loader2 className="w-8 h-8 animate-spin text-theme-accent" />
            <span className="ml-2 font-light text-theme-secondary">Se încarcă feedback-ul...</span>
          </div>
        )}

        {/* Comments List */}
        {!isLoading && !error && (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-theme-accent-30 hover:bg-white/10 transition-all duration-300 p-6"
              >
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src={comment.author.avatarUrl || undefined} alt={comment.author.name} />
                    <AvatarFallback className="text-sm">
                      {getInitials(comment.author.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-light text-theme-primary">{comment.author.name}</h3>
                        <div className="flex items-center space-x-1 text-sm text-theme-secondary">
                          <User className="w-4 h-4" />
                          <span>a comentat</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-theme-secondary">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Link
                        href={`/poems/${comment.poem.id}`}
                        className="text-theme-accent hover:text-[rgb(var(--theme-accent-light))] transition-colors flex items-center space-x-2 text-lg font-light"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>{comment.poem.title}</span>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="font-light leading-relaxed text-theme-primary">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && comments.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-theme-accent mx-auto mb-4" />
            <h3 className="text-xl font-light mb-2 text-theme-primary">Nu există feedback</h3>
            <p className="mb-4 font-light text-theme-secondary">
              Nu există comentarii. Fii primul care împărtășește-ne opinia despre poeziile noastre!
            </p>
            <Button asChild className="bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light">
              <Link href="/poems">Vezi poeziile</Link>
            </Button>
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
function FeedbackPageLoading() {
  return (
    <div className="min-h-screen bg-theme-dark">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center">
          <h1 className="text-5xl lg:text-6xl font-light mb-6 text-theme-primary">Parerea cititorilor</h1>
          <p className="text-lg max-w-2xl mx-auto font-light text-theme-secondary">
            Vezi ce au spus cititorii despre poeziile noastre. Toate comentariile de la comunitate într-un singur loc.
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-theme-accent" />
          <span className="ml-2 font-light text-theme-secondary">Se încarcă feedback-ul...</span>
        </div>
      </div>
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<FeedbackPageLoading />}>
      <FeedbackPageContent />
    </Suspense>
  )
}
