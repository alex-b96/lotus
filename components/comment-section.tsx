"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, Heart } from "lucide-react"

// Mock comments data
const mockComments = [
  {
    id: 1,
    author: "Emily Watson",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "This poem beautifully captures the serenity of morning. The imagery is so vivid I can almost feel the dewdrops.",
    timestamp: "2 hours ago",
    likes: 5,
  },
  {
    id: 2,
    author: "Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Sarah's use of metaphor here is exceptional. 'Nature's tears of joy' - what a beautiful way to describe dew.",
    timestamp: "1 day ago",
    likes: 3,
  },
  {
    id: 3,
    author: "Lisa Park",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "I love how this poem makes me want to wake up early just to witness the morning dew myself. Truly inspiring!",
    timestamp: "2 days ago",
    likes: 7,
  },
]

interface CommentSectionProps {
  poemId: number
}

export function CommentSection({ poemId }: CommentSectionProps) {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const comment = {
        id: comments.length + 1,
        author: "You", // In a real app, this would come from user session
        avatar: "/placeholder.svg?height=40&width=40",
        content: newComment,
        timestamp: "Just now",
        likes: 0,
      }

      setComments([comment, ...comments])
      setNewComment("")
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-green-200">
      <CardHeader>
        <CardTitle className="text-xl text-green-800 flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>Comments ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <div className="space-y-4">
          <Textarea
            placeholder="Share your thoughts about this poem..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] border-green-300 focus:border-green-500"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                  <AvatarFallback>
                    {comment.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-green-800">{comment.author}</h4>
                    <span className="text-sm text-green-600">{comment.timestamp}</span>
                  </div>
                  <p className="text-green-700 mb-3">{comment.content}</p>
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-red-500 hover:bg-red-50">
                    <Heart className="w-4 h-4 mr-1" />
                    {comment.likes}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-green-600">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
