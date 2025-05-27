import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, Clock, User } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const poemOfTheDay = {
  id: 1,
  title: "Morning Dew",
  author: "Sarah Chen",
  content: `Gentle drops upon the grass,
Morning whispers as they pass,
Each one holds the sky so blue,
In this moment, fresh and new.

Nature's tears of joy and light,
Washing clean the darkest night,
In the silence, peace is found,
Where the earth and sky are bound.`,
  tags: ["nature", "morning", "peace"],
  likes: 42,
  comments: 8,
  publishedAt: "2024-01-15",
}

const recentPoems = [
  {
    id: 2,
    title: "City Lights",
    author: "Marcus Johnson",
    preview: "Neon dreams and midnight schemes...",
    tags: ["urban", "night"],
    publishedAt: "2024-01-14",
  },
  {
    id: 3,
    title: "Ocean's Song",
    author: "Elena Rodriguez",
    preview: "Waves that dance upon the shore...",
    tags: ["ocean", "nature"],
    publishedAt: "2024-01-13",
  },
  {
    id: 4,
    title: "Autumn Leaves",
    author: "David Kim",
    preview: "Golden memories falling down...",
    tags: ["autumn", "memories"],
    publishedAt: "2024-01-12",
  },
]

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Poem of the Day */}
      <div className="lg:col-span-2">
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader className="text-center border-b border-green-100">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">Poem of the Day</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <CardTitle className="text-3xl text-green-800 mb-2">{poemOfTheDay.title}</CardTitle>
            <div className="flex items-center justify-center space-x-4 text-sm text-green-600">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <Link
                  href={`/authors/${poemOfTheDay.author.toLowerCase().replace(" ", "-")}`}
                  className="hover:text-green-800 transition-colors"
                >
                  {poemOfTheDay.author}
                </Link>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{poemOfTheDay.publishedAt}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="prose prose-green max-w-none mb-6">
              <pre className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-green-900">
                {poemOfTheDay.content}
              </pre>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {poemOfTheDay.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-green-100">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-green-700 hover:text-red-500 hover:bg-red-50">
                  <Heart className="w-4 h-4 mr-2" />
                  {poemOfTheDay.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-green-700 hover:text-blue-500 hover:bg-blue-50">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {poemOfTheDay.comments}
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Recently Added Poems */}
      <div className="space-y-6">
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-green-800 flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Recently Added</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPoems.map((poem) => (
              <div
                key={poem.id}
                className="p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors"
              >
                <Link href={`/poems/${poem.id}`} className="block">
                  <h3 className="font-semibold text-green-800 mb-1 hover:text-green-900 transition-colors">
                    {poem.title}
                  </h3>
                  <p className="text-sm text-green-600 mb-2">by {poem.author}</p>
                  <p className="text-sm text-green-700 mb-3 italic">"{poem.preview}"</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {poem.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-green-300 text-green-600">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-green-500">{poem.publishedAt}</p>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-green-800">Join Our Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/submit">Submit Your Poem</Link>
            </Button>
            <Button variant="outline" asChild className="w-full border-green-300 text-green-700 hover:bg-green-50">
              <Link href="/register">Create Account</Link>
            </Button>
            <Button variant="ghost" asChild className="w-full text-green-600 hover:text-green-800 hover:bg-green-50">
              <Link href="/poems">Browse All Poems</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
