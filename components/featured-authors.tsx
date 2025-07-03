"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  ExternalLink,
  Star,
  Loader2,
  AlertCircle,
  RefreshCcw,
  Crown,
  User
} from "lucide-react"
import Link from "next/link"
import { useFeaturedAuthors } from "@/hooks/use-featured-authors"

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

export function FeaturedAuthors() {
  const { featuredAuthors, isLoading, error, retry } = useFeaturedAuthors()

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="w-6 h-6 text-pink-300" />
            <h2 className="text-3xl font-light" style={{ color: '#e2e2e2' }}>Autori de top</h2>
            <Crown className="w-6 h-6 text-pink-300" />
          </div>
          <p style={{ color: '#9b9b9b' }}>Descoperă cei mai buni poeți ai comunității noastre</p>
        </div>

        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-pink-300" />
          <span className="ml-2" style={{ color: '#9b9b9b' }}>Se încarcă autori de top...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="w-6 h-6 text-pink-300" />
            <h2 className="text-3xl font-light" style={{ color: '#e2e2e2' }}>Autori de top</h2>
            <Crown className="w-6 h-6 text-pink-300" />
          </div>
          <p style={{ color: '#9b9b9b' }}>Descoperă cei mai buni poeți ai comunității noastre</p>
        </div>

        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="text-red-200 flex items-center justify-between w-full">
              <span>Eroare la încărcarea autorilor de top: {error}</span>
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
      </div>
    )
  }

  // Empty state
  if (featuredAuthors.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Crown className="w-6 h-6 text-pink-300" />
          <h2 className="text-3xl font-light" style={{ color: '#e2e2e2' }}>Autori de top</h2>
          <Crown className="w-6 h-6 text-pink-300" />
        </div>
        <p className="text-lg" style={{ color: '#9b9b9b' }}>
          Descoperă cei mai buni poeți ai comunității noastre
        </p>
      </div>

      {/* Featured Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredAuthors.map((author, index) => (
          <div
            key={author.id}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 hover:scale-105 relative overflow-hidden"
          >
            {/* // Ranking Badge
            <div className="absolute top-4 right-4 z-10">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'}
              `}>
                {index + 1}
              </div>
            </div> */}

            {/* Featured Star Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-pink-300/20 text-pink-300 border border-pink-300/40 px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium">
                <Star className="w-3 h-3 fill-current" />
                <span>Autor de top</span>
              </div>
            </div>

            <div className="text-center pt-16 p-6">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-pink-300/30">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback className="text-xl bg-white/10 text-pink-200">
                  {getInitials(author.name)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-light mb-2" style={{ color: '#e2e2e2' }}>{author.name}</h3>

              {/* Stats */}
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-full" style={{ color: '#9b9b9b' }}>
                  <BookOpen className="w-4 h-4" />
                  <span className="font-semibold">{author.poemsCount}</span>
                  <span>poem{author.poemsCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-1 bg-pink-300/20 px-2 py-1 rounded-full">
                  <User className="w-4 h-4 text-pink-300" />
                  <span className="text-pink-300 font-medium">Autor de top</span>
                </div>
              </div>
            </div>

            <div className="pt-0 p-6">
              {author.bio ? (
                <p className="mb-6 text-center line-clamp-3 text-sm leading-relaxed font-light" style={{ color: '#9b9b9b' }}>
                  {author.bio}
                </p>
              ) : null}

              <div className="flex flex-col space-y-3">
                <Button asChild className="bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light">
                  <Link href={`/authors/${author.id}`}>
                    <Crown className="w-4 h-4 mr-2" />
                    Vezi profilul
                  </Link>
                </Button>
                {author.website && (
                  <Button
                    variant="outline"
                    asChild
                    className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
                  >
                    <a href={author.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Authors CTA */}
      <div className="text-center pt-4">
        <p className="mb-4" style={{ color: '#9b9b9b' }}>Ești un autor talentat? Trimite-ne o poezie!</p>
      </div>
    </div>
  )
}