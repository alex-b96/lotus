import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Share2, Clock, BookOpen } from "lucide-react"
import Link from "next/link"
import { CommentSection } from "@/components/comment-section"

// Mock data - in a real app, this would come from a database
const poem = {
  id: 1,
  title: "Morning Dew",
  author: {
    name: "Sarah Chen",
    bio: "Sarah is a nature poet who finds inspiration in the quiet moments of dawn.",
    avatar: "/placeholder.svg?height=100&width=100",
    website: "https://sarahchen.poetry.com",
    poemsCount: 23,
  },
  content: `Gentle drops upon the grass,
Morning whispers as they pass,
Each one holds the sky so blue,
In this moment, fresh and new.

Nature's tears of joy and light,
Washing clean the darkest night,
In the silence, peace is found,
Where the earth and sky are bound.

Crystal spheres of liquid grace,
Reflecting heaven's gentle face,
In the garden of my dreams,
Where nothing is quite what it seems.

Soon the sun will rise and shine,
Turning water into wine,
But for now, in morning's glow,
Let the gentle dewdrops flow.`,
  category: "Lyric",
  tags: ["nature", "morning", "peace", "dewdrops", "garden"],
  likes: 42,
  comments: 8,
  publishedAt: "2024-01-15",
  readingTime: "2 min read",
}

export default function PoemPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Poem Content */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
        <CardHeader className="text-center border-b border-green-100">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge variant="outline" className="border-green-300 text-green-600">
              {poem.category}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <BookOpen className="w-4 h-4" />
              <span>{poem.readingTime}</span>
            </div>
          </div>
          <CardTitle className="text-4xl text-green-800 mb-4">{poem.title}</CardTitle>
          <div className="flex items-center justify-center space-x-6 text-sm text-green-600">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={poem.author.avatar || "/placeholder.svg"} alt={poem.author.name} />
                <AvatarFallback>
                  {poem.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Link
                href={`/authors/${poem.author.name.toLowerCase().replace(" ", "-")}`}
                className="hover:text-green-800 transition-colors font-medium"
              >
                {poem.author.name}
              </Link>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{poem.publishedAt}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="prose prose-green max-w-none mb-8">
            <pre className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-green-900 text-center">
              {poem.content}
            </pre>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {poem.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-green-700 hover:text-red-500 hover:bg-red-50">
                <Heart className="w-5 h-5 mr-2" />
                {poem.likes} Likes
              </Button>
              <Button variant="ghost" className="text-green-700 hover:text-blue-500 hover:bg-blue-50">
                <MessageCircle className="w-5 h-5 mr-2" />
                {poem.comments} Comments
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Author Info */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="text-xl text-green-800">About the Author</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={poem.author.avatar || "/placeholder.svg"} alt={poem.author.name} />
              <AvatarFallback className="text-lg">
                {poem.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-2">{poem.author.name}</h3>
              <p className="text-green-700 mb-3">{poem.author.bio}</p>
              <div className="flex items-center space-x-4 text-sm text-green-600">
                <span>{poem.author.poemsCount} poems published</span>
                {poem.author.website && (
                  <Link href={poem.author.website} className="hover:text-green-800 transition-colors">
                    Visit website
                  </Link>
                )}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Link href={`/authors/${poem.author.name.toLowerCase().replace(" ", "-")}`}>
                    View all poems by {poem.author.name}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection poemId={poem.id} />
    </div>
  )
}
