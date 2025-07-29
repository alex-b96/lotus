"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { useStarRating } from "@/hooks/use-star-rating"

interface StarRatingProps {
  poemId: string
  className?: string
  size?: "sm" | "md" | "lg"
  showStats?: boolean
  interactive?: boolean
}

export function StarRating({
  poemId,
  className = "",
  size = "md",
  showStats = true,
  interactive = true
}: StarRatingProps) {
  const {
    averageRating,
    totalRatings,
    userRating,
    loading,
    error,
    rate,
    removeRating,
    session
  } = useStarRating(poemId)

  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const starSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  // Mobile-specific star sizes - smaller for narrow screens
  const mobileStarSizes = {
    sm: "w-2.5 h-2.5 sm:w-3 sm:h-3",
    md: "w-3 h-3 sm:w-4 sm:h-4",
    lg: "w-3.5 h-3.5 sm:w-5 sm:h-5"
  }

  const handleStarClick = async (rating: number) => {
    if (!interactive || !session?.user || isSubmitting) return

    setIsSubmitting(true)
    try {
      if (userRating === rating) {
        // If clicking the same star, remove the rating
        await removeRating()
      } else {
        // Otherwise, set the new rating
        await rate(rating)
      }
    } catch (err) {
      console.error("Error handling star click:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStarHover = (rating: number) => {
    if (!interactive || !session?.user || isSubmitting) return
    setHoverRating(rating)
  }

  const handleMouseLeave = () => {
    if (!interactive || !session?.user || isSubmitting) return
    setHoverRating(null)
  }

  const getStarState = (starIndex: number) => {
    const effectiveRating = hoverRating !== null ? hoverRating : (userRating || 0)

    if (interactive && session?.user) {
      // Interactive mode: show hover or user rating
      return starIndex <= effectiveRating
    } else {
      // Display mode: show average rating
      return starIndex <= Math.round(averageRating)
    }
  }

  const formatRating = (rating: number) => {
    return rating.toFixed(1)
  }

  return (
    <div className={`flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2 ${className}`}>
      {/* Star buttons */}
      <div
        className="flex items-center space-x-0.5 sm:space-x-0.5 md:space-x-1"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starIndex) => (
          <button
            key={starIndex}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            disabled={!interactive || !session?.user || isSubmitting}
            className={`
              ${interactive && session?.user ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
              ${!interactive || !session?.user ? 'opacity-70' : ''}
              transition-all duration-200
              ${isSubmitting ? 'opacity-50' : ''}
              p-0.5 sm:p-1
            `}
          >
            <Star
              className={`
                ${mobileStarSizes[size]} md:${starSizes[size]}
                transition-all duration-200
                ${getStarState(starIndex)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-400 hover:text-yellow-400'
                }
              `}
            />
          </button>
        ))}
      </div>

      {/* Rating statistics */}
      {showStats && (
        <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 text-xs sm:text-sm text-gray-400">
          <span className="font-medium">
            {formatRating(averageRating)}
          </span>
          <span className="whitespace-nowrap">
            ({totalRatings})
          </span>
        </div>
      )}

      {/* Login prompt */}
      {interactive && !session?.user && (
        <div className="text-xs text-gray-500 italic whitespace-nowrap">
          <a href="/login" className="text-theme-accent hover:underline">
            Conectează-te
          </a> pentru a evalua
        </div>
      )}

      {/* Error message with login link */}
      {error && error.includes("Trebuie să fii conectat") && (
        <div className="text-xs text-red-400 flex items-center space-x-1 md:space-x-2">
          <span>{error}</span>
          <a
            href="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            Conectare
          </a>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-xs text-red-400 flex items-center space-x-1 md:space-x-2">
          <span>{error}</span>
          {error.includes("Sesiunea ta a expirat") && (
            <a
              href="/logout"
              className="text-blue-500 hover:underline font-medium"
            >
              Deconectare
            </a>
          )}
        </div>
      )}
    </div>
  )
}