"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, MessageCircle, Share2, Clock, User, AlertCircle, RefreshCw, PenTool, BookOpen } from "lucide-react"
import Link from "next/link"
import { sharePoem, ShareData } from "@/lib/share-utils"
import { ShareModal } from "@/components/share-modal"
import { StarRating } from "@/components/star-rating"

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

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareData, setShareData] = useState<ShareData | null>(null)

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

  // Handle share button click
  const handleShare = async () => {
    if (!featuredPoem) return

    const success = await sharePoem(
      {
        id: featuredPoem.id,
        title: featuredPoem.title,
        author: featuredPoem.author
      },
      (data) => {
        setShareData(data)
        setShareModalOpen(true)
      }
    )
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-theme-dark">
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
        @keyframes stemWave {
          0% {
            opacity: 0.3;
            transform: translateX(-2px);
          }
          25% {
            opacity: 0.5;
            transform: translateX(1px);
          }
          50% {
            opacity: 0.4;
            transform: translateX(2px);
          }
          75% {
            opacity: 0.5;
            transform: translateX(-1px);
          }
          100% {
            opacity: 0.3;
            transform: translateX(-2px);
          }
        }
      `}</style>

      {/* Lotus background with reflection - positioned at top of columns */}
      <div className="absolute -top-[14rem] left-[calc(50%+100px)] transform -translate-x-1/2 sm:left-1/2 w-[25rem] h-[50rem] pointer-events-none">
        {/* Main lotus */}
        <div className="w-full h-1/2">
          <img
            src="/lotus-background-simple-blue.png"
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
              background: `url('/lotus-background-simple-blue.png') center/contain no-repeat`,
              opacity: 0.3,
              animation: 'float 10s ease-in-out infinite',
              maskImage: 'linear-gradient(to bottom, black 0%, transparent 90%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 90%)',
              filter: 'blur(1px)'
            }}
          />
        </div>
      </div>

      {/* Lotus stem - wavy path from lotus to bottom */}
      <div className="absolute left-[calc(50%+100px)] sm:left-1/2 top-[120px] w-[320px] h-[calc(100vh-120px)] pointer-events-none z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 320 800"
          preserveAspectRatio="none"
          style={{
            animation: 'stemWave 8s ease-in-out infinite'
          }}
        >
          <path
            d="M160 0 Q165 80 170 160 Q180 240 200 320 Q220 400 230 480 Q225 560 200 640 Q180 720 160 800"
            stroke="rgba(var(--theme-accent-primary), 0.2)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="5,5"
          />
        </svg>
      </div>

      {/* Main content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-0 sm:px-6 pt-16 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Main Section: Poem of the Month */}
        <section className="lg:col-span-3 self-start relative w-[100vw] sm:w-[90vw] lg:w-[680px] max-w-full">
          {/* Horizontal line above poem of the month */}
          <div className="absolute -top-8 left-0 w-2/3">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgb(var(--theme-accent-primary)/0.3)] to-transparent drop-shadow-sm"></div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-1"></div>
          </div>
          {/* Poem of the Month Header */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-theme-accent text-sm tracking-wide uppercase font-medium bg-gradient-to-r from-[rgb(var(--theme-accent-primary))] to-[rgb(var(--theme-accent-light))] bg-clip-text text-transparent drop-shadow-sm flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              POEMUL LUNII
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
            <div className="p-2 sm:p-8">
              {/* Title */}
              <h1 className="text-2xl lg:text-4xl font-light leading-none mb-6 drop-shadow-lg hover:drop-shadow-2xl transition-all duration-500 cursor-default text-theme-primary">
                {featuredPoem.title}
              </h1>

              {/* Author and Date */}
              <div className="text-lg mb-2 drop-shadow-sm text-theme-primary">
                by <Link
                  href={`/authors/${featuredPoem.author.id}`}
                  className="italic text-theme-accent drop-shadow-sm hover:text-[rgb(var(--theme-accent-light))] transition-colors duration-300 cursor-pointer"
                >
                  {featuredPoem.author.name}
                </Link>
                <span className="ml-6 text-base text-theme-secondary">{formatDate(featuredPoem.publishedAt)}</span>
              </div>

              {/* Poem Content */}
              <div className="text-md leading-relaxed whitespace-pre-line mb-12 drop-shadow-sm relative font-light text-theme-primary">
                <div className="max-h-96 overflow-hidden">
                  {featuredPoem.content}
                </div>
                {featuredPoem.content.length > 500 && (
                  <div className="italic mt-2 text-theme-secondary">...</div>
                )}
              </div>

              {/* Star Rating */}
              <div className="mb-8">
                <StarRating poemId={featuredPoem.id} size="lg" showStats={true} />
              </div>

              {/* Interaction Buttons */}
              <div className="flex items-center gap-8 mb-8">
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-light">{featuredPoem.comments ?? 0}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-400 hover:text-theme-accent transition-all duration-300 hover:scale-110 hover:drop-shadow-lg group"
                >
                  <Share2 className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="font-light">Distribuie</span>
                </button>
              </div>

              <Link href={`/poems/${featuredPoem.id}`}>
                <Button className="bg-gradient-to-r from-transparent via-[rgb(var(--theme-accent-primary)/0.1)] to-transparent text-white border border-theme-accent-40 hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all duration-300 px-8 py-3 rounded-lg font-light group">
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
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgb(var(--theme-accent-primary)/0.3)] to-transparent drop-shadow-sm"></div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-1"></div>
          </div>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-theme-accent text-sm tracking-wide uppercase font-medium bg-gradient-to-r from-[rgb(var(--theme-accent-primary))] to-[rgb(var(--theme-accent-light))] bg-clip-text text-transparent drop-shadow-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Adăugate Recent
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
                    className="group cursor-pointer p-4"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <Link href={`/poems/${poem.id}`} className="block">
                      <h3 className="group-hover:text-theme-accent transition-all duration-300 font-medium mb-2 drop-shadow-sm text-theme-primary">
                        {poem.title}
                      </h3>
                      <p className="text-sm mb-2 font-light text-theme-primary">
                        by <span className="text-theme-accent">{poem.author.name}</span>
                      </p>
                      <p className="text-xs italic mb-3 leading-relaxed text-theme-secondary">
                        "{getPoemPreview(poem.content)}"
                      </p>
                      <p className="text-xs font-light text-theme-secondary">
                        {formatDate(poem.publishedAt)}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Community Section - positioned to align with lotus */}
          <div>
            <Link href="/submit">
              <Button className="w-full bg-gradient-to-r from-[rgb(var(--theme-accent-primary)/0.2)] via-[rgb(var(--theme-accent-light)/0.2)] to-[rgb(var(--theme-accent-primary)/0.2)] text-white border border-theme-accent-30 hover:bg-theme-accent-30 hover:border-theme-accent-50 transition-all duration-300 py-3 rounded-lg font-light group">
                <span className="flex items-center justify-center gap-2">
                  Trimite Poezia Ta
                  <span className="group-hover:translate-y-[-2px] transition-transform duration-300">✨</span>
                </span>
              </Button>
            </Link>
          </div>
        </aside>
      </div>

      {/* Share Modal */}
      {shareData && (
        <ShareModal
          shareData={shareData}
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false)
            setShareData(null)
          }}
        />
      )}
    </div>
  )
}
