"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, MessageCircle, Share2, Clock, User, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { usePoemLike } from "@/hooks/use-poem-like"

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

  // Like state for featured poem
  const likeHook = usePoemLike(featuredPoem?.id)
  const { liked, count: likeCount, loading: likeLoading, like, unlike, session } = likeHook

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
      const response = await fetch('/api/poems?limit=3&sortBy=createdAt&order=desc')
      console.log(response)
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
    <div className="min-h-screen w-full relative overflow-hidden" style={{ backgroundColor: '#0d0d0d' }}>
      {/* Add custom keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-0.8deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
          75% { transform: translateY(-6px) rotate(-0.5deg); }
        }
      `}</style>

      {/* Lotus background with reflection - positioned at top of columns */}
      <div className="absolute -top-[14rem] left-1/2 transform -translate-x-1/2 w-[25rem] h-[50rem] pointer-events-none">
        {/* Main lotus */}
        <div className="w-full h-1/2">
          <img
            src="/lotus-background-simple.png"
            alt="Lotus"
            className="w-full h-full object-contain object-bottom opacity-80"
            style={{
              animation: 'float 10s ease-in-out infinite'
            }}
          />
        </div>

        {/* Reflection */}
        <div className="absolute top-[220px] left-0 w-full h-1/2 transform scale-y-[-1] overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              background: `url('/lotus-background-simple.png') center/contain no-repeat`,
              opacity: 0.3,
              animation: 'float 10s ease-in-out infinite',
              maskImage: 'linear-gradient(to bottom, black 0%, transparent 90%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 90%)',
              filter: 'blur(1px)'
            }}
          />
        </div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Main Section: Poem of the Week */}
        <section className="lg:col-span-3 self-start relative w-[90vw] lg:w-[680px] max-w-full">
          {/* Horizontal line above poem of the week */}
          <div className="absolute -top-8 left-0 w-2/3">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-300/30 to-transparent drop-shadow-sm"></div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-1"></div>
          </div>
          {/* Poem of the Week Header */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-pink-300 text-sm tracking-wide uppercase font-medium bg-gradient-to-r from-pink-300 to-pink-200 bg-clip-text text-transparent drop-shadow-sm">
              🖊️ POEZIA SĂPTĂMÂNII
            </span>
          </div>

          {isLoadingFeatured ? (
            <>
              <Skeleton className="h-16 w-2/3 mb-4 bg-white/10" />
              <Skeleton className="h-6 w-1/3 mb-8 bg-white/10" />
              <Skeleton className="h-32 w-full bg-white/10" />
            </>
          ) : featuredError ? (
            <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">{featuredError}</AlertDescription>
            </Alert>
          ) : featuredPoem ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300">
              {/* Title */}
              <h1 className="text-2xl lg:text-4xl font-light leading-none mb-6 drop-shadow-lg hover:drop-shadow-2xl transition-all duration-500 cursor-default" style={{ color: '#e2e2e2' }}>
                {featuredPoem.title}
              </h1>

              {/* Author and Date */}
              <div className="text-lg mb-10 drop-shadow-sm" style={{ color: '#e2e2e2' }}>
                by <span className="italic text-pink-200 drop-shadow-sm hover:text-pink-100 transition-colors duration-300">{featuredPoem.author.name}</span>
                <span className="ml-6 text-base" style={{ color: '#9b9b9b' }}>{formatDate(featuredPoem.publishedAt)}</span>
              </div>

              {/* Poem Content */}
              <div className="text-md leading-relaxed whitespace-pre-line mb-12 border-l-2 border-pink-300/50 pl-8 font-cormorant drop-shadow-sm relative" style={{ color: '#e2e2e2' }}>
                <div className="max-h-96 overflow-hidden">
                  {featuredPoem.content}
                </div>
                {featuredPoem.content.length > 500 && (
                  <div className="italic mt-2" style={{ color: '#9b9b9b' }}>...</div>
                )}
              </div>

              {/* Interaction Buttons */}
              <div className="flex items-center gap-8 mb-8">
                <button 
                  className={`flex items-center gap-2 ${liked ? "text-pink-300" : "text-gray-400 hover:text-pink-300"} transition-all duration-300 hover:scale-110 hover:drop-shadow-lg group`}
                  onClick={async () => {
                    if (!session?.user) {
                      window.location.href = "/login"
                      return
                    }
                    if (likeLoading) return
                    liked ? await unlike() : await like()
                  }}
                  disabled={likeLoading}
                >
                  <Heart className={`w-5 h-5 group-hover:animate-pulse ${liked ? "fill-pink-300" : ""}`} />
                  <span className="font-light">{likeCount ?? featuredPoem.likes ?? 0}</span>
                </button>
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-light">{featuredPoem.comments ?? 0}</span>
                </div>
                <button className="flex items-center gap-2 text-gray-400 hover:text-pink-300 transition-all duration-300 hover:scale-110 hover:drop-shadow-lg group">
                  <Share2 className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="font-light">Distribuie</span>
                </button>
              </div>

              <Link href={`/poems/${featuredPoem.id}`}>
                <Button className="bg-gradient-to-r from-transparent via-pink-300/10 to-transparent text-white border border-pink-300/40 hover:bg-pink-300/20 hover:border-pink-300/60 transition-all duration-300 px-8 py-3 rounded-lg font-light group">
                  <span className="flex items-center gap-2">
                    📖 Citește Întreaga Poezie
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-gray-400 italic">Nu este disponibilă nicio poezie recomandată</div>
          )}
        </section>

        {/* Sidebar: Recently Added */}
        <aside className="lg:col-span-2 self-start relative">
          {/* Horizontal line above sidebar - desktop only */}
          <div className="hidden lg:block absolute -top-8 left-0 right-0">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-300/30 to-transparent drop-shadow-sm"></div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-1"></div>
          </div>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-pink-300 text-sm tracking-wide uppercase font-medium bg-gradient-to-r from-pink-300 to-pink-200 bg-clip-text text-transparent drop-shadow-sm">
                📚 Adăugate Recent
              </span>
            </div>

            {isLoadingRecent ? (
              <div className="space-y-6">
                {[1,2,3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-3/4 bg-white/10" />
                    <Skeleton className="h-4 w-1/2 bg-white/10" />
                    <Skeleton className="h-3 w-1/4 bg-white/10" />
                  </div>
                ))}
              </div>
            ) : recentError ? (
              <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-200">{recentError}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {recentPoems.map((poem, index) => (
                  <div
                    key={poem.id}
                    className="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:drop-shadow-lg"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <Link href={`/poems/${poem.id}`} className="block">
                      <h3 className="group-hover:text-pink-300 transition-all duration-300 font-medium mb-2 drop-shadow-sm" style={{ color: '#e2e2e2' }}>
                        {poem.title}
                      </h3>
                      <p className="text-sm mb-2 font-light" style={{ color: '#e2e2e2' }}>
                        by <span className="text-pink-200/80">{poem.author.name}</span>
                      </p>
                      <p className="text-xs italic mb-3 leading-relaxed" style={{ color: '#9b9b9b' }}>
                        "{getPoemPreview(poem.content)}"
                      </p>
                      <p className="text-xs font-light" style={{ color: '#9b9b9b' }}>
                        {formatDate(poem.publishedAt)}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Community Section - positioned to align with lotus */}
          <div className="bg-gradient-to-br from-white/5 via-pink-300/5 to-white/10 backdrop-blur-md rounded-xl p-8 border border-white/10 hover:border-pink-300/20 transition-all duration-500 hover:from-white/10 hover:via-pink-300/10 hover:to-white/15 group">
            <h3 className="text-xl text-white mb-4 drop-shadow-sm bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              Alătură-te Comunității
            </h3>
            <p className="mb-6 text-sm leading-relaxed font-light drop-shadow-sm" style={{ color: '#9b9b9b' }}>
              Conectează-te cu ceilalți poeți și împărtășește călătoria creativă în comunitatea noastră în creștere de artă a cuvintelor.
            </p>
            <Link href="/submit">
              <Button className="w-full bg-gradient-to-r from-pink-300/20 via-pink-200/20 to-pink-300/20 text-white border border-pink-300/30 hover:bg-pink-300/30 hover:border-pink-300/50 transition-all duration-300 py-3 rounded-lg font-light group">
                <span className="flex items-center justify-center gap-2">
                  Trimite Poezia Ta
                  <span className="group-hover:translate-y-[-2px] transition-transform duration-300">✨</span>
                </span>
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
