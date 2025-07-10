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
      <div className="min-h-screen bg-theme-dark">
        <div className="max-w-6xl mx-auto px-1 sm:px-6 py-16">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-theme-accent" />
            <span className="ml-2 font-light text-theme-secondary">Se încarcă profilul autorului...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-theme-dark">
        <div className="max-w-2xl mx-auto px-1 sm:px-6 py-16">
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-3 sm:p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="text-red-200 flex items-center justify-between w-full">
                <span>Eroare la încărcarea profilului autorului: {error}</span>
                <Button variant="outline" size="sm" onClick={fetchAuthor} className="ml-4 bg-transparent border-red-400 text-red-400 hover:bg-red-400 hover:text-black">
                  <RefreshCcw className="w-4 h-4 mr-1" />
                  Reîncarcă
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
              <Link href="/authors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Înapoi la autori
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-theme-dark">
        <div className="max-w-2xl mx-auto px-1 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-light mb-4 text-theme-primary">Autorul nu a fost găsit</h1>
          <p className="mb-6 font-light text-theme-secondary">Autorul căutat nu există sau nu are poezii publicate.</p>
          <Button asChild className="bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light">
            <Link href="/authors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Înapoi la autori
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme-dark">
      <div className="max-w-6xl mx-auto px-1 sm:px-6 py-16 space-y-8">
        {/* Back Navigation */}
        <div>
          <Button asChild variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
          <Link href="/authors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Înapoi la autori
          </Link>
        </Button>
        </div>

        {/* Author Profile Header */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-theme-accent-30 hover:bg-white/10 transition-all duration-300">
          <div className="p-3 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Author Avatar */}
            <Avatar className="w-32 h-32 mx-auto md:mx-0 flex-shrink-0">
              <AvatarImage src={author.avatarUrl} alt={author.name} />
              <AvatarFallback className="text-2xl bg-white/10 text-theme-accent">
                {getInitials(author.name)}
              </AvatarFallback>
            </Avatar>

            {/* Author Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-light mb-3 text-theme-primary">{author.name}</h1>

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                <div className="flex items-center space-x-1 text-theme-secondary">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">{author.totalPoems}</span>
                  <span>poem{author.totalPoems !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-1 text-theme-secondary">
                  <User className="w-5 h-5 text-theme-accent" />
                  <span className="text-theme-accent">Autor</span>
                </div>
                <div className="flex items-center space-x-1 text-theme-secondary">
                  <Calendar className="w-5 h-5" />
                  <span>Aderat la {formatDistanceToNow(new Date(author.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Bio */}
              {author.bio && (
                <p className="leading-relaxed mb-4 max-w-2xl font-light text-theme-secondary">
                  {author.bio}
                </p>
              )}

              {/* Website Link */}
              {/* {author.website && (
                <Button asChild variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
                  <a href={author.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Vezi website-ul
                  </a>
                </Button>
              )} */}
            </div>
          </div>
          </div>
        </div>

        {/* Poems Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-theme-primary">
              Părți publicate ({author.totalPoems})
            </h2>
          </div>

          {/* Poems Grid */}
          {author.poems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {author.poems.map((poem) => (
                <div
                  key={poem.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-theme-accent-30 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="p-3 sm:p-6 border-b border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-light mb-2 line-clamp-2 text-theme-primary">
                        {poem.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Category disabled for now */}
                        {/* <Badge variant="secondary" className="bg-theme-accent-20 text-theme-accent border border-theme-accent-40">
                          {poem.category}
                        </Badge> */}
                        {poem.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="border-white/30 text-white bg-white/5">
                            #{tag}
                          </Badge>
                        ))}
                        {poem.tags.length > 3 && (
                          <Badge variant="outline" className="border-white/30 text-white bg-white/5">
                            +{poem.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>

                  <div className="p-3 sm:p-6">
                  {/* Poem Excerpt */}
                    <p className="mb-4 line-clamp-3 leading-relaxed font-light text-theme-secondary">
                    {poem.content}
                  </p>

                    {/* Poem Meta */}
                    <div className="flex items-center justify-between text-sm mb-4 text-theme-secondary">
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
                        <span>{poem.readingTime} min citit</span>
                      </div>
                    </div>
                    <span className="text-xs">
                      {formatDistanceToNow(new Date(poem.publishedAt), { addSuffix: true })}
                    </span>
                  </div>

                    {/* Read More Button */}
                    <Button asChild className="w-full bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light">
                    <Link href={`/poems/${poem.id}`}>
                      Citește poezia completă
                    </Link>
                  </Button>
                  </div>
                </div>
            ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 sm:p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-theme-accent mb-4" />
              <h3 className="text-xl font-light mb-2 text-theme-primary">Nu există poezii publicate</h3>
              <p className="font-light text-theme-secondary">
                {author.name} nu a publicat încă nicio poezie. Revino mai târziu!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}