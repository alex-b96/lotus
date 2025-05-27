"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, MessageCircle, Search, Filter, User, Clock } from "lucide-react"
import Link from "next/link"

// Mock data
const poems = [
  {
    id: 1,
    title: "Morning Dew",
    author: "Sarah Chen",
    preview: "Gentle drops upon the grass, Morning whispers as they pass...",
    category: "Lyric",
    tags: ["nature", "morning", "peace"],
    likes: 42,
    comments: 8,
    publishedAt: "2024-01-15",
  },
  {
    id: 2,
    title: "City Lights",
    author: "Marcus Johnson",
    preview: "Neon dreams and midnight schemes, Electric pulse through urban streams...",
    category: "Modern",
    tags: ["urban", "night", "city"],
    likes: 28,
    comments: 5,
    publishedAt: "2024-01-14",
  },
  {
    id: 3,
    title: "Haiku Collection",
    author: "Yuki Tanaka",
    preview: "Cherry blossoms fall / Silent pond reflects the moon / Spring's gentle whisper",
    category: "Haiku",
    tags: ["haiku", "nature", "seasons"],
    likes: 35,
    comments: 12,
    publishedAt: "2024-01-13",
  },
  {
    id: 4,
    title: "The Road Not Taken",
    author: "Robert Frost",
    preview: "Two roads diverged in a yellow wood, And sorry I could not travel both...",
    category: "Classic",
    tags: ["classic", "choice", "life"],
    likes: 89,
    comments: 23,
    publishedAt: "1916-08-01",
  },
  {
    id: 5,
    title: "Digital Dreams",
    author: "Alex Rivera",
    preview: "In circuits deep and data streams, We chase our algorithmic dreams...",
    category: "Experimental",
    tags: ["technology", "future", "digital"],
    likes: 19,
    comments: 7,
    publishedAt: "2024-01-12",
  },
]

const categories = ["All", "Lyric", "Haiku", "Modern", "Classic", "Experimental"]

export default function PoemsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredPoems, setFilteredPoems] = useState(poems)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterPoems(term, selectedCategory)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterPoems(searchTerm, category)
  }

  const filterPoems = (term: string, category: string) => {
    let filtered = poems

    if (category !== "All") {
      filtered = filtered.filter((poem) => poem.category === category)
    }

    if (term) {
      filtered = filtered.filter(
        (poem) =>
          poem.title.toLowerCase().includes(term.toLowerCase()) ||
          poem.author.toLowerCase().includes(term.toLowerCase()) ||
          poem.tags.some((tag) => tag.toLowerCase().includes(term.toLowerCase())),
      )
    }

    setFilteredPoems(filtered)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Poetry Collection</h1>
        <p className="text-green-600 text-lg max-w-2xl mx-auto">
          Discover beautiful poems from talented writers around the world. Each piece tells a unique story.
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
              <Input
                placeholder="Search poems, authors, or tags..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-green-300 focus:border-green-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-green-600 w-4 h-4" />
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-48 border-green-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Poems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoems.map((poem) => (
          <Card
            key={poem.id}
            className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="border-green-300 text-green-600 mb-2">
                  {poem.category}
                </Badge>
              </div>
              <CardTitle className="text-xl text-green-800 hover:text-green-900 transition-colors">
                <Link href={`/poems/${poem.id}`}>{poem.title}</Link>
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-green-600">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <Link
                    href={`/authors/${poem.author.toLowerCase().replace(" ", "-")}`}
                    className="hover:text-green-800 transition-colors"
                  >
                    {poem.author}
                  </Link>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{poem.publishedAt}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-green-700 mb-4 italic line-clamp-3">"{poem.preview}"</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {poem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-green-100 text-green-700">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-green-100">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-green-700 hover:text-red-500 hover:bg-red-50">
                    <Heart className="w-4 h-4 mr-1" />
                    {poem.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-green-700 hover:text-blue-500 hover:bg-blue-50">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {poem.comments}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Link href={`/poems/${poem.id}`}>Read More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredPoems.length === 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-green-200">
          <CardContent className="p-12 text-center">
            <div className="text-green-600 mb-4">
              <Search className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">No poems found</h3>
            <p className="text-green-600 mb-4">Try adjusting your search terms or category filter.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
                setFilteredPoems(poems)
              }}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
