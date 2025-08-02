"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, Heart, Edit, Trash2, MoreVertical, Flower } from "lucide-react"
import { useComments } from "@/hooks/use-comments"
import { formatDistanceToNow } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CommentSectionProps {
  poemId: string
  onCommentAdded?: () => void // Optional callback for parent to update comment count
}

export function CommentSection({ poemId, onCommentAdded }: CommentSectionProps) {
  const { data: session } = useSession()
  const {
    comments,
    loading,
    error,
    totalCount,
    hasMore,
    addComment,
    updateComment,
    deleteComment,
    loadMore,
  } = useComments(poemId)

  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  // Handle submitting a new comment
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !session?.user) return

    setIsSubmitting(true)

    const success = await addComment(newComment.trim())

    if (success) {
      setNewComment("")
      // Notify parent to increment comment count
      if (onCommentAdded) onCommentAdded()
    }

    setIsSubmitting(false)
  }

  // Handle starting to edit a comment
  const handleStartEdit = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId)
    setEditContent(currentContent)
  }

  // Handle saving an edited comment
  const handleSaveEdit = async () => {
    if (!editContent.trim() || !editingCommentId) return

    const success = await updateComment(editingCommentId, editContent.trim())

    if (success) {
      setEditingCommentId(null)
      setEditContent("")
    }
  }

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditContent("")
  }

  // Handle deleting a comment
  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("Ești sigur că vrei să ștergi acest comentariu?")) {
      await deleteComment(commentId)
    }
  }

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  // Get user initials for avatar fallback (robust)
  const getInitials = (name?: string | null) => {
    if (!name || typeof name !== 'string' || name.trim() === '') return '??'
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div>
      <div className="p-2 sm:p-4 space-y-1">
        {/* Error display */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Add Comment Form - Only show if user is logged in */}
        {session?.user ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Partajează părerile tale despre această poezie..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Se postează..." : "Postează comentariu"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-theme-secondary">
            <p>Te rog să te autentifici pentru a lăsa un comentariu</p>
            <Button
              variant="outline"
              className="mt-2 bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light"
              onClick={() => window.location.href = '/login'}
            >
              Autentificare
            </Button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-1">
          {loading && comments.length === 0 ? (
            <div className="text-center py-8 text-theme-secondary">
              <div className="animate-spin w-8 h-8 border-2 border-pink-300 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Se încarcă comentariile...</p>
            </div>
          ) : comments.length > 0 ? (
            <>
              {comments.map((comment) => (
                <div key={comment.id} className="p-2">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={comment.author.avatarUrl}
                        alt={comment.author.name}
                      />
                      <AvatarFallback>
                        {getInitials(comment.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {comment.author.role === "ADMIN" ? (
                            <div className="flex items-center space-x-1">
                              <Flower className="w-4 h-4 text-pink-300" />
                              <h4 className="font-light text-pink-300">LOTUS</h4>
                            </div>
                          ) : (
                            <h4 className="font-light text-theme-primary">{comment.author.name}</h4>
                          )}
                          <span className="text-sm text-theme-secondary">
                            {formatTimestamp(comment.createdAt)}
                          </span>
                        </div>
                        {/* Comment actions menu - only show for comment author */}
                        {session?.user?.id === comment.author.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleStartEdit(comment.id, comment.content)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Editează
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Șterge
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      {/* Comment content - either display or edit mode */}
                      {editingCommentId === comment.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[80px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300"
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light"
                            >
                              Salvează
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
                            >
                              Anulează
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="mb-3 whitespace-pre-wrap font-light text-theme-primary">{comment.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More button */}
              {hasMore && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light"
                  >
                    {loading ? "Se încarcă..." : "Mai multe comentarii"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-theme-secondary">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Niciun comentariu încă. Fii primul care își partajează părerile!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
