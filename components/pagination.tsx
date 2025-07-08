import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  className = "",
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5 // Show 5 page numbers at most

    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Show first few pages
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Show pages around current page
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) {
    return null // Don't show pagination if there's only one page
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      className={`flex items-center justify-center space-x-2 ${className}`}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="bg-transparent border-white/30 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-light"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <div key={`ellipsis-${index}`} className="px-2 py-1">
              <MoreHorizontal className="w-4 h-4 text-theme-secondary" />
            </div>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={
                page === currentPage
                  ? "bg-pink-300/20 text-pink-300 border-pink-300/40 hover:bg-pink-300/30 font-light"
                  : "bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
              }
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          )
        )}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="bg-transparent border-white/30 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-light"
        aria-label="Go to next page"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </nav>
  )
}

// Additional pagination info component
interface PaginationInfoProps {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  className?: string
}

export function PaginationInfo({
  currentPage,
  totalPages,
  totalCount,
  limit,
  className = "",
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * limit + 1
  const endItem = Math.min(currentPage * limit, totalCount)

  return (
    <div className={`text-sm ${className}`} className="text-theme-secondary">
      Afișează {startItem} la {endItem} din {totalCount} poezii
      {totalPages > 1 && (
        <span className="ml-2">
          (Pagina {currentPage} din {totalPages})
        </span>
      )}
    </div>
  )
}