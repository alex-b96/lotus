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
      const response = await fetch('/api/poems?limit=3&sortBy=publishedAt&order=desc')
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
    <div className="min-h-screen w-full relative overflow-hidden">
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
        @keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes driftSlow { 0% { transform: translateY(0px) translateX(0px); opacity: 0.15; } 50% { transform: translateY(-8px) translateX(3px); opacity: 0.28; } 100% { transform: translateY(0px) translateX(0px); opacity: 0.15; } }
      `}</style>

      {/* Calm dark gradient background with subtle, non-linear flow (fixed to viewport) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base angular gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(150deg, rgba(10,13,18,1) 0%, rgba(13,18,26,1) 45%, rgba(15,22,31,1) 100%)'
          }}
        />
        {/* Flow accents: layered conic + elliptical gradients for non-circular blending */}
        <div
          className="absolute inset-0 opacity-[0.18] blur-[120px]"
          style={{
            background:
              'conic-gradient(from 220deg at 28% 42%, rgba(56,97,160,0.35), transparent 70deg, rgba(88,140,200,0.30) 145deg, transparent 205deg, rgba(42,78,130,0.30) 300deg)'
            , transform: 'rotate(8deg)'
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.14] blur-[130px]"
          style={{
            background:
              'conic-gradient(from 120deg at 76% 34%, rgba(88,140,200,0.30), transparent 22%, rgba(56,97,160,0.28) 46%, transparent 70%, rgba(42,78,130,0.28) 88%, transparent)'
            , transform: 'rotate(-10deg)'
          }}
        />
        <div
          className="absolute left-[18%] bottom-[18%] -translate-x-1/2 translate-y-1/3 w-[70vw] h-[45vw] opacity-[0.18]"
          style={{
            background: 'radial-gradient(65% 45% at 40% 55%, rgba(56,97,160,0.40), rgba(0,0,0,0) 60%)',
            filter: 'blur(120px)',
            transform: 'rotate(10deg)'
          }}
        />
        <div
          className="absolute right-[12%] top-[22%] translate-x-1/3 -translate-y-1/3 w-[60vw] h-[40vw] opacity-[0.16]"
          style={{
            background: 'radial-gradient(55% 50% at 50% 50%, rgba(88,140,200,0.36), rgba(0,0,0,0) 62%)',
            filter: 'blur(130px)',
            transform: 'rotate(-8deg)'
          }}
        />
      </div>

      {/* Lotus watermark removed per request */}

      {/* Floating lotus between columns (restored) */}
      <div className="absolute -top-[14rem] left-[calc(50%+100px)] transform -translate-x-1/2 sm:left-1/2 w-[25rem] h-[50rem] pointer-events-none z-0">
        <div className="w-full h-1/2">
          <img
            src="/lotus-background-simple-blue.png"
            alt="Lotus"
            className="w-full h-full object-contain object-bottom opacity-80"
            style={{ animation: 'float 10s ease-in-out infinite' }}
          />
        </div>
      </div>

      {/* Lotus stem removed per request */}

      {/* Main content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-0 sm:px-6 pt-20 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Main Section: Poem of the Month */}
        <section className="lg:col-span-3 self-start relative w-[100vw] sm:w-[90vw] lg:w-[720px] max-w-full">
          {/* Poem of the Month Header */}
          <div className="flex items-center gap-3 mb-6">
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
            <div className="p-4">
              {/* Title */}
              <h1 className="text-xl lg:text-3xl font-light leading-tight mb-4 drop-shadow-lg transition-all duration-500 cursor-default text-theme-primary">
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
              <div className="flex items-center gap-8 mb-8 opacity-90">
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-light">{featuredPoem.comments ?? 0}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-400 hover:text-theme-accent transition-colors duration-300 group"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-light">Distribuie</span>
                </button>
              </div>

              <Link href={`/poems/${featuredPoem.id}`}>
                <Button className="text-white border border-theme-accent-40 bg-transparent hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all duration-300 rounded-lg font-light px-6 py-3 group">
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
                    className="group cursor-pointer p-4 transition-colors"
                  >
                    <Link href={`/poems/${poem.id}`} className="block">
                      <h3 className="group-hover:text-theme-accent transition-colors duration-300 font-medium mb-2 drop-shadow-sm text-theme-primary">
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
              <Button className="w-full text-white border border-theme-accent-40 bg-transparent hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all duration-300 rounded-lg font-light px-6 py-3 group">
                <span className="flex items-center justify-center gap-2">
                  Trimite Poezia Ta
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
