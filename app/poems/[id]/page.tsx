"use client"

import { use, useState, useEffect } from "react"
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
import { usePoemLike } from "@/hooks/use-poem-like"
import { sharePoem, ShareData } from "@/lib/share-utils"
import { ShareModal } from "@/components/share-modal"

interface PoemPageProps {
  params: Promise<{ id: string }>
}

export default function PoemPage({ params }: PoemPageProps) {
  const { id } = use(params)
  const { poem, loading, error, retry } = usePoemDetail(id)
  const [commentCount, setCommentCount] = useState<number | undefined>(undefined)
  
  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareData, setShareData] = useState<ShareData | null>(null)

  // Like state management (always call the hook)
  const { liked, count: likeCount, loading: likeLoading, like, unlike, session } = usePoemLike(poem?.id)

  useEffect(() => {
    if (poem) setCommentCount(poem.comments)
  }, [poem])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-theme-dark">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="text-center border-b border-white/10 p-8">
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
          </div>
          <div className="p-8">
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
          </div>
        </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-theme-dark">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="text-red-200">
            {error === "Poem not found" ? (
              <div>
                <p className="font-medium mb-2">Poezia nu a fost găsită</p>
                <p>Poezia pe care o cauți nu există sau ar putea fi ștearsă.</p>
                <div className="mt-4 space-x-2">
                  <Button variant="outline" size="sm" asChild className="bg-transparent border-red-400 text-red-400 hover:bg-red-400 hover:text-black">
                    <Link href="/poems">Navighează toate poeziile</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="bg-transparent border-red-400 text-red-400 hover:bg-red-400 hover:text-black">
                    <Link href="/">Mergi acasă</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-medium mb-2">Eroare la încărcarea poeziei</p>
                <p>{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retry}
                  className="mt-4 bg-transparent border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Încearcă din nou
                </Button>
              </div>
            )}
            </div>
          </div>
        </div>
        </div>
      </div>
    )
  }

  // No poem data
  if (!poem) {
    return null
  }

  // Handler to increment comment count when a new comment is added
  const handleCommentAdded = () => {
    setCommentCount((prev) => (prev ?? 0) + 1)
  }

  // Format reading time
  const readingTimeText = poem.readingTime === 1 ? "1 min citire" : `${poem.readingTime} min citire`

  // Format published date
  const publishedDate = poem.publishedAt
    ? new Date(poem.publishedAt).toLocaleDateString()
    : new Date(poem.createdAt).toLocaleDateString()

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

  // Handle share button click
  const handleShare = async () => {
    if (!poem) return
    
    const success = await sharePoem(
      {
        id: poem.id,
        title: poem.title,
        author: poem.author
      },
      (data) => {
        setShareData(data)
        setShareModalOpen(true)
      }
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-theme-dark">
      {/* Add custom keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-0.8deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
          75% { transform: translateY(-6px) rotate(-0.5deg); }
        }
      `}</style>

      {/* Lotus background - positioned at top
      <div className="absolute -top-[10rem] left-1/2 transform -translate-x-1/2 w-[25rem] h-[25rem] pointer-events-none z-0">
        <img
          src="/lotus-background-simple.png"
          alt="Lotus"
          className="w-full h-full object-contain opacity-40"
          style={{
            animation: 'float 10s ease-in-out infinite'
          }}
        />
      </div> */}

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 space-y-8">
      {/* Poem Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-theme-accent-30 hover:bg-white/10 transition-all duration-300">
        <div className="border-b border-white/10 p-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="outline" className="border-theme-accent-40 text-theme-accent bg-theme-accent-10">
              {poem.category}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-theme-secondary">
              <BookOpen className="w-4 h-4" />
              <span>{readingTimeText}</span>
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-light leading-none mb-4 drop-shadow-lg text-theme-primary">{poem.title}</h1>
          <div className="flex items-center space-x-6 text-sm text-theme-secondary">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={poem.author.avatarUrl} alt={poem.author.name} />
                <AvatarFallback>
                  {getInitials(poem.author.name)}
                </AvatarFallback>
              </Avatar>
              <Link
                href={`/authors/${poem.author.id}`}
                className="text-theme-accent hover:text-[rgb(var(--theme-accent-light))] transition-colors font-medium"
              >
                {poem.author.name}
              </Link>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{publishedDate}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="prose prose-theme max-w-none mb-8">
            <pre className="whitespace-pre-wrap font-cormorant text-lg leading-relaxed text-left text-theme-primary">
              {poem.content}
            </pre>
          </div>

          {poem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {poem.tags.map((tag) => (
                <Link key={tag} href={`/poems?tag=${encodeURIComponent(tag)}`}>
                  <Badge
                    variant="secondary"
                    className="bg-theme-accent-20 text-theme-accent hover:bg-theme-accent-30 cursor-pointer border border-theme-accent-40"
                  >
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <div className="my-6 h-px bg-gradient-to-r from-transparent via-[rgb(var(--theme-accent-primary)/0.3)] to-transparent"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Like Button */}
              <Button
                variant="ghost"
                className={`${liked ? "text-theme-accent" : "text-gray-400 hover:text-theme-accent"} transition-all duration-300 hover:scale-110 hover:drop-shadow-lg group`}
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
                <Heart className={`w-5 h-5 mr-2 group-hover:animate-pulse ${liked ? "fill-theme-accent" : ""}`} />
                <span className="hidden sm:inline">{likeCount} Aprecieri</span>
                <span className="sm:hidden">{likeCount}</span>
              </Button>
              {/* Comments count: static, not a button */}
              <div className="flex items-center text-gray-400 text-sm">
                <MessageCircle className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">{commentCount ?? 0} Comentarii</span>
                <span className="sm:hidden">{commentCount ?? 0}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={handleShare}
                variant="outline" 
                className="bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light"
              >
                <Share2 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Partajează</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Author Info */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-theme-accent-30 hover:bg-white/10 transition-all duration-300">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-light text-theme-primary">Despre autor</h2>
        </div>
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={poem.author.avatarUrl} alt={poem.author.name} />
              <AvatarFallback className="text-lg">
                {getInitials(poem.author.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-light mb-2 text-theme-primary">{poem.author.name}</h3>
              {poem.author.bio && (
                <p className="mb-3 font-light text-theme-secondary">{poem.author.bio}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-theme-secondary">
                <span>{poem.author._count.poems} poezii publicate</span>
                {poem.author.website && (
                  <Link
                    href={poem.author.website}
                    className="text-theme-accent hover:text-[rgb(var(--theme-accent-light))] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Vizitează site-ul
                  </Link>
                )}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light"
                >
                  <Link href={`/authors/${poem.author.id}`}>
                    Vezi toate poeziile de {poem.author.name}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection poemId={poem.id} onCommentAdded={handleCommentAdded} />

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
    </div>
  )
}
