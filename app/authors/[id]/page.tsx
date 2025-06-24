"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  ExternalLink,
  Calendar,
  Heart,
  MessageCircle,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCcw,
  ArrowLeft,
  User
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Types for the API response
interface Author {
  id: string
  name: string
  bio: string | null
  avatarUrl: string | null
  website: string | null
  createdAt: string
  totalPoems: number
  poems: Poem[]
}

interface Poem {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  readingTime: number
  publishedAt: string
  createdAt: string
  likes: number
  comments: number
}

interface ApiResponse {
  author: Author
}

export default function AuthorProfilePage() {
  const params = useParams()
  const authorId = params.id as string

  const [author, setAuthor] = useState<Author | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  // Fetch author data
  const fetchAuthor = async () => {
    if (!authorId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/authors/${authorId}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Author not found")
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      setAuthor(data.author)
    } catch (err) {
      console.error("Error fetching author:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch author")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthor()
  }, [authorId])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2 text-green-600">Loading author profile...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load author: {error}</span>
            <Button variant="outline" size="sm" onClick={fetchAuthor} className="ml-4">
              <RefreshCcw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="border-green-300 text-green-700">
            <Link href="/authors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Authors
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!author) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-green-800 mb-4">Author Not Found</h1>
        <p className="text-green-600 mb-6">The author you're looking for doesn't exist or has no published poems.</p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/authors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Authors
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <div>
        <Button asChild variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
          <Link href="/authors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Authors
          </Link>
        </Button>
      </div>

      {/* Author Profile Header */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-200">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Author Avatar */}
            <Avatar className="w-32 h-32 mx-auto md:mx-0 flex-shrink-0">
              <AvatarImage src={author.avatarUrl} alt={author.name} />
              <AvatarFallback className="text-2xl bg-green-100 text-green-700">
                {getInitials(author.name)}
              </AvatarFallback>
            </Avatar>

            {/* Author Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-green-800 mb-3">{author.name}</h1>

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                <div className="flex items-center space-x-1 text-green-600">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">{author.totalPoems}</span>
                  <span>poem{author.totalPoems !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <User className="w-5 h-5" />
                  <span>Author</span>
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <Calendar className="w-5 h-5" />
                  <span>Joined {formatDistanceToNow(new Date(author.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Bio */}
              {author.bio && (
                <p className="text-green-700 leading-relaxed mb-4 max-w-2xl">
                  {author.bio}
                </p>
              )}

              {/* Website Link */}
              {author.website && (
                <Button asChild variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                  <a href={author.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Poems Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-green-800">
            Published Poems ({author.totalPoems})
          </h2>
        </div>

        {/* Poems Grid */}
        {author.poems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {author.poems.map((poem) => (
              <Card
                key={poem.id}
                className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-green-800 mb-2 line-clamp-2">
                        {poem.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {poem.category}
                        </Badge>
                        {poem.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="border-green-300 text-green-600">
                            {tag}
                          </Badge>
                        ))}
                        {poem.tags.length > 2 && (
                          <Badge variant="outline" className="border-green-300 text-green-600">
                            +{poem.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Poem Excerpt */}
                  <p className="text-green-700 mb-4 line-clamp-3 leading-relaxed">
                    {poem.content}
                  </p>

                  {/* Poem Meta */}
                  <div className="flex items-center justify-between text-sm text-green-600 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{poem.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{poem.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{poem.readingTime} min read</span>
                      </div>
                    </div>
                    <span className="text-xs">
                      {formatDistanceToNow(new Date(poem.publishedAt), { addSuffix: true })}
                    </span>
                  </div>

                  {/* Read More Button */}
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link href={`/poems/${poem.id}`}>
                      Read Full Poem
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/70 backdrop-blur-sm border-green-200">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">No Published Poems Yet</h3>
              <p className="text-green-600">
                {author.name} hasn't published any poems yet. Check back later!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}