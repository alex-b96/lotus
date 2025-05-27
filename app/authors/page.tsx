import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, ExternalLink, Users } from "lucide-react"
import Link from "next/link"

// Mock authors data
const authors = [
  {
    id: 1,
    name: "Sarah Chen",
    bio: "Nature poet who finds inspiration in the quiet moments of dawn and the whispers of the wind.",
    avatar: "/placeholder.svg?height=100&width=100",
    poemsCount: 23,
    followers: 156,
    specialties: ["nature", "lyric", "morning"],
    website: "https://sarahchen.poetry.com",
    featured: true,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    bio: "Urban poet capturing the rhythm and soul of city life through modern verse.",
    avatar: "/placeholder.svg?height=100&width=100",
    poemsCount: 18,
    followers: 89,
    specialties: ["urban", "modern", "social"],
    website: null,
    featured: false,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    bio: "Bilingual poet exploring themes of identity, love, and the ocean's eternal dance.",
    avatar: "/placeholder.svg?height=100&width=100",
    poemsCount: 31,
    followers: 203,
    specialties: ["ocean", "identity", "bilingual"],
    website: "https://elenapoetry.com",
    featured: true,
  },
  {
    id: 4,
    name: "Yuki Tanaka",
    bio: "Traditional haiku master bringing ancient wisdom to contemporary readers.",
    avatar: "/placeholder.svg?height=100&width=100",
    poemsCount: 45,
    followers: 312,
    specialties: ["haiku", "traditional", "zen"],
    website: "https://yukihaiku.jp",
    featured: true,
  },
  {
    id: 5,
    name: "David Kim",
    bio: "Experimental poet pushing the boundaries of form and digital expression.",
    avatar: "/placeholder.svg?height=100&width=100",
    poemsCount: 12,
    followers: 67,
    specialties: ["experimental", "digital", "avant-garde"],
    website: null,
    featured: false,
  },
  {
    id: 6,
    name: "Alex Rivera",
    bio: "Tech-inspired poet exploring the intersection of humanity and digital innovation.",
    avatar: "/placeholder.svg?height=100&width=100",
    poemsCount: 15,
    followers: 94,
    specialties: ["technology", "future", "innovation"],
    website: "https://alexrivera.tech",
    featured: false,
  },
]

export default function AuthorsPage() {
  const featuredAuthors = authors.filter((author) => author.featured)
  const allAuthors = authors

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Our Authors</h1>
        <p className="text-green-600 text-lg max-w-2xl mx-auto">
          Meet the talented poets who share their hearts and souls through beautiful verse.
        </p>
      </div>

      {/* Featured Authors */}
      <section>
        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Featured Authors</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAuthors.map((author) => (
            <Card
              key={author.id}
              className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                  <AvatarFallback className="text-lg">
                    {author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl text-green-800">{author.name}</CardTitle>
                <div className="flex items-center justify-center space-x-4 text-sm text-green-600">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{author.poemsCount} poems</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{author.followers} followers</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-green-700 mb-4 text-center">{author.bio}</p>

                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {author.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs bg-green-100 text-green-700">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-col space-y-2">
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href={`/authors/${author.name.toLowerCase().replace(" ", "-")}`}>View Poems</Link>
                  </Button>
                  {author.website && (
                    <Button variant="outline" asChild className="border-green-300 text-green-700 hover:bg-green-50">
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
      </section>

      {/* All Authors */}
      <section>
        <h2 className="text-2xl font-bold text-green-800 mb-6">All Authors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allAuthors.map((author) => (
            <Card
              key={author.id}
              className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                    <AvatarFallback>
                      {author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-green-800">{author.name}</h3>
                      {author.featured && <Badge className="bg-green-600 text-white">Featured</Badge>}
                    </div>
                    <p className="text-green-700 mb-3 text-sm">{author.bio}</p>
                    <div className="flex items-center space-x-4 text-sm text-green-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{author.poemsCount} poems</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{author.followers} followers</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {author.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs border-green-300 text-green-600">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">
                        <Link href={`/authors/${author.name.toLowerCase().replace(" ", "-")}`}>View Poems</Link>
                      </Button>
                      {author.website && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <a href={author.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
