"use client"

import { use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MessageCircle, Share2, Clock, BookOpen, AlertCircle, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { CommentSection } from "@/components/comment-section"
import { usePoemDetail } from "@/hooks/use-poem-detail"

interface PoemPageProps {
  params: Promise<{ id: string }>
}

export default function PoemPage({ params }: PoemPageProps) {
  const { id } = use(params)
  const { poem, loading, error, retry } = usePoemDetail(id)

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader className="text-center border-b border-green-100">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <div className="flex items-center justify-center space-x-6">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4 mb-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-16" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error === "Poem not found" ? (
              <div>
                <p className="font-medium mb-2">Poem Not Found</p>
                <p>The poem you're looking for doesn't exist or may have been removed.</p>
                <div className="mt-4 space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/poems">Browse All Poems</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/">Go Home</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-medium mb-2">Error loading poem</p>
                <p>{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retry}
                  className="mt-4"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // No poem data
  if (!poem) {
    return null
  }

  // Format reading time
  const readingTimeText = poem.readingTime === 1 ? "1 min read" : `${poem.readingTime} min read`

  // Format published date
  const publishedDate = poem.publishedAt
    ? new Date(poem.publishedAt).toLocaleDateString()
    : new Date(poem.createdAt).toLocaleDateString()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Poem Content */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
        <CardHeader className="text-center border-b border-green-100">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge variant="outline" className="border-green-300 text-green-600">
              {poem.category}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <BookOpen className="w-4 h-4" />
              <span>{readingTimeText}</span>
            </div>
          </div>
          <CardTitle className="text-4xl text-green-800 mb-4">{poem.title}</CardTitle>
          <div className="flex items-center justify-center space-x-6 text-sm text-green-600">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={poem.author.avatarUrl || "/placeholder.svg"} alt={poem.author.name} />
                <AvatarFallback>
                  {poem.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Link
                href={`/authors/${poem.author.id}`}
                className="hover:text-green-800 transition-colors font-medium"
              >
                {poem.author.name}
              </Link>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{publishedDate}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="prose prose-green max-w-none mb-8">
            <pre className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-green-900 text-center">
              {poem.content}
            </pre>
          </div>

          {poem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {poem.tags.map((tag) => (
                <Link key={tag} href={`/poems?tag=${encodeURIComponent(tag)}`}>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <Separator className="my-6" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-green-700 hover:text-red-500 hover:bg-red-50">
                <Heart className="w-5 h-5 mr-2" />
                {poem.likes} Likes
              </Button>
              <Button variant="ghost" className="text-green-700 hover:text-blue-500 hover:bg-blue-50">
                <MessageCircle className="w-5 h-5 mr-2" />
                {poem.comments} Comments
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Author Info */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="text-xl text-green-800">About the Author</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={poem.author.avatarUrl || "/placeholder.svg"} alt={poem.author.name} />
              <AvatarFallback className="text-lg">
                {poem.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-2">{poem.author.name}</h3>
              {poem.author.bio && (
                <p className="text-green-700 mb-3">{poem.author.bio}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-green-600">
                <span>{poem.author._count.poems} poems published</span>
                {poem.author.website && (
                  <Link
                    href={poem.author.website}
                    className="hover:text-green-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website
                  </Link>
                )}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Link href={`/authors/${poem.author.id}`}>
                    View all poems by {poem.author.name}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection poemId={poem.id} />
    </div>
  )
}
