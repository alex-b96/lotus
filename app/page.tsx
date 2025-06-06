"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, MessageCircle, Share2, Clock, User, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

interface Author {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

interface Poem {
  id: string
  title: string
  content: string
  category: string
  author: Author
  tags: string[]
  readingTime: number
  publishedAt: string
  createdAt: string
  updatedAt: string
  likes: number
  comments: number
}

interface RecentPoem {
  id: string
  title: string
  content: string
  author: Author
  tags: string[]
  publishedAt: string
  likes: number
  comments: number
}

export default function HomePage() {
  const [featuredPoem, setFeaturedPoem] = useState<Poem | null>(null)
  const [recentPoems, setRecentPoems] = useState<RecentPoem[]>([])
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true)
  const [isLoadingRecent, setIsLoadingRecent] = useState(true)
  const [featuredError, setFeaturedError] = useState<string | null>(null)
  const [recentError, setRecentError] = useState<string | null>(null)

  // Fetch featured poem
  const fetchFeaturedPoem = async () => {
    setIsLoadingFeatured(true)
    setFeaturedError(null)
    try {
      const response = await fetch('/api/poems/featured')
      if (!response.ok) {
        throw new Error(`Failed to fetch featured poem: ${response.status}`)
      }
      const data = await response.json()
      setFeaturedPoem(data.poem)
    } catch (error) {
      console.error('Error fetching featured poem:', error)
      setFeaturedError(error instanceof Error ? error.message : 'Failed to load featured poem')
    } finally {
      setIsLoadingFeatured(false)
    }
  }

  // Fetch recent poems
  const fetchRecentPoems = async () => {
    setIsLoadingRecent(true)
    setRecentError(null)
    try {
      const response = await fetch('/api/poems?limit=4&sortBy=createdAt&order=desc')
      if (!response.ok) {
        throw new Error(`Failed to fetch recent poems: ${response.status}`)
      }
      const data = await response.json()
      setRecentPoems(data.poems || [])
    } catch (error) {
      console.error('Error fetching recent poems:', error)
      setRecentError(error instanceof Error ? error.message : 'Failed to load recent poems')
    } finally {
      setIsLoadingRecent(false)
    }
  }

  useEffect(() => {
    fetchFeaturedPoem()
    fetchRecentPoems()
  }, [])

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Helper function to get poem preview (first 50 characters)
  const getPoemPreview = (content: string) => {
    return content.length > 50 ? content.substring(0, 50) + '...' : content
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Poem of the Day */}
      <div className="lg:col-span-2">
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader className="text-center border-b border-green-100">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">Poem of the Day</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {isLoadingFeatured ? (
              <>
                <Skeleton className="h-8 w-48 mx-auto mb-2" />
                <div className="flex items-center justify-center space-x-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </>
            ) : featuredError ? (
              <div className="space-y-2">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{featuredError}</AlertDescription>
                </Alert>
                <Button
                  onClick={fetchFeaturedPoem}
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : featuredPoem ? (
              <>
                <CardTitle className="text-3xl text-green-800 mb-2">{featuredPoem.title}</CardTitle>
            <div className="flex items-center justify-center space-x-4 text-sm text-green-600">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <Link
                      href={`/authors/${featuredPoem.author.id}`}
                  className="hover:text-green-800 transition-colors"
                >
                      {featuredPoem.author.name}
                </Link>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                    <span>{formatDate(featuredPoem.publishedAt)}</span>
              </div>
            </div>
              </>
            ) : (
              <div className="text-green-600 italic">No featured poem available</div>
            )}
          </CardHeader>

          <CardContent className="p-8">
            {isLoadingFeatured ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>
                <div className="flex justify-between pt-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ) : featuredPoem ? (
              <>
            <div className="prose prose-green max-w-none mb-6">
              <pre className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-green-900">
                    {featuredPoem.content}
              </pre>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPoem.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                  #{tag}
                </Badge>
              ))}
            </div>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link href={`/poems/${featuredPoem.id}`}>
                      Read Full Poem
                    </Link>
                  </Button>
            <div className="flex items-center justify-between pt-4 border-t border-green-100">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-green-700 hover:text-red-500 hover:bg-red-50">
                  <Heart className="w-4 h-4 mr-2" />
                      {featuredPoem.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-green-700 hover:text-blue-500 hover:bg-blue-50">
                  <MessageCircle className="w-4 h-4 mr-2" />
                      {featuredPoem.comments}
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Recently Added Poems */}
      <div className="space-y-6">
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-green-800 flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Recently Added</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingRecent ? (
              // Loading skeleton for recent poems
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex gap-1 mb-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-3 w-20" />
                </div>
              ))
            ) : recentError ? (
              <div className="space-y-2">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{recentError}</AlertDescription>
                </Alert>
                <Button
                  onClick={fetchRecentPoems}
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : recentPoems.length > 0 ? (
              recentPoems.map((poem) => (
              <div
                key={poem.id}
                className="p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors"
              >
                <Link href={`/poems/${poem.id}`} className="block">
                  <h3 className="font-semibold text-green-800 mb-1 hover:text-green-900 transition-colors">
                    {poem.title}
                  </h3>
                    <p className="text-sm text-green-600 mb-2">by {poem.author.name}</p>
                    <p className="text-sm text-green-700 mb-3 italic">"{getPoemPreview(poem.content)}"</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {poem.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-green-300 text-green-600">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                    <p className="text-xs text-green-500">{formatDate(poem.publishedAt)}</p>
                </Link>
                </div>
              ))
            ) : (
              <div className="text-center text-green-600 italic py-8">
                No recent poems available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-green-800">Join Our Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/submit">Submit Your Poem</Link>
            </Button>
            <Button variant="outline" asChild className="w-full border-green-300 text-green-700 hover:bg-green-50">
              <Link href="/register">Create Account</Link>
            </Button>
            <Button variant="ghost" asChild className="w-full text-green-600 hover:text-green-800 hover:bg-green-50">
              <Link href="/poems">Browse All Poems</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
