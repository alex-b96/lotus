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

export function FeaturedAuthors() {
  const { featuredAuthors, isLoading, error, retry } = useFeaturedAuthors()

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-600" />
            <h2 className="text-3xl font-bold text-green-800">Featured Authors</h2>
            <Crown className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-green-600">Discover our most celebrated poets</p>
        </div>

        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          <span className="ml-2 text-green-600">Loading featured authors...</span>
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
            <Crown className="w-6 h-6 text-yellow-600" />
            <h2 className="text-3xl font-bold text-green-800">Featured Authors</h2>
            <Crown className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-green-600">Discover our most celebrated poets</p>
        </div>

        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load featured authors: {error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={retry}
              className="ml-4"
            >
              <RefreshCcw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
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
          <Crown className="w-6 h-6 text-yellow-600" />
          <h2 className="text-3xl font-bold text-green-800">Featured Authors</h2>
          <Crown className="w-6 h-6 text-yellow-600" />
        </div>
        <p className="text-green-600 text-lg">
          Discover our most celebrated poets who have enriched our community with their creativity
        </p>
      </div>

      {/* Featured Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredAuthors.map((author, index) => (
          <Card
            key={author.id}
            className="bg-gradient-to-br from-white/90 to-green-50/90 backdrop-blur-sm border-2 border-green-300 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
          >
            {/* Ranking Badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'}
              `}>
                {index + 1}
              </div>
            </div>

            {/* Featured Star Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-green-600 text-white px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium">
                <Star className="w-3 h-3 fill-current" />
                <span>Featured</span>
              </div>
            </div>

            <CardHeader className="text-center pt-16">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-green-200">
                <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                <AvatarFallback className="text-xl bg-green-100 text-green-700">
                  {author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl text-green-800 mb-2">{author.name}</CardTitle>

              {/* Stats */}
              <div className="flex items-center justify-center space-x-4 text-sm text-green-600">
                <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-semibold">{author.poemsCount}</span>
                  <span>poem{author.poemsCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                  <User className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-600 font-medium">Top Author</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-green-700 mb-6 text-center line-clamp-3 text-sm leading-relaxed">
                {author.bio || "A gifted poet whose words touch hearts and inspire minds through the beauty of verse."}
              </p>

              <div className="flex flex-col space-y-3">
                <Button asChild className="bg-green-600 hover:bg-green-700 shadow-md">
                  <Link href={`/authors/${author.id}`}>
                    <Crown className="w-4 h-4 mr-2" />
                    View Profile
                  </Link>
                </Button>
                {author.website && (
                  <Button
                    variant="outline"
                    asChild
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <a href={author.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Authors CTA */}
      <div className="text-center pt-4">
        <p className="text-green-600 mb-4">Explore more talented authors in our community</p>
      </div>
    </div>
  )
}