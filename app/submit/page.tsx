"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PenTool, Send, X, Plus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const categories = ["Lyric", "Haiku", "Modern", "Classic", "Experimental"]

// Form validation constants based on schema
const VALIDATION_LIMITS = {
  TITLE_MAX: 200,
  CONTENT_MAX: 10000,
}

// Form error types
interface FormErrors {
  title?: string
  content?: string
  category?: string
  general?: string
}

export default function SubmitPoemPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: [] as string[],
    authorNote: "",
  })
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Authentication check
  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to submit a poem. Redirecting to login...",
      })

      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }
  }, [session, status, router, toast])

  // Client-side validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length > VALIDATION_LIMITS.TITLE_MAX) {
      newErrors.title = `Title must be less than ${VALIDATION_LIMITS.TITLE_MAX} characters`
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = "Poem content is required"
    } else if (formData.content.length > VALIDATION_LIMITS.CONTENT_MAX) {
      newErrors.content = `Content must be less than ${VALIDATION_LIMITS.CONTENT_MAX} characters`
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setErrors({})

    // Validate form
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare the payload for the API
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: formData.tags,
        status: "review" // Submit for moderation review
      }

      const response = await fetch("/api/poems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle different error types
        if (response.status === 401) {
          throw new Error("You must be logged in to submit a poem")
        } else if (response.status === 400 && data.details) {
          // Validation errors from the server
          const serverErrors: FormErrors = {}
          data.details.forEach((error: any) => {
            if (error.path.includes("title")) {
              serverErrors.title = error.message
            } else if (error.path.includes("content")) {
              serverErrors.content = error.message
            } else if (error.path.includes("category")) {
              serverErrors.category = error.message
            }
          })
          setErrors(serverErrors)
          throw new Error("Please fix the validation errors")
        } else {
          throw new Error(data.error || "Failed to submit poem")
        }
      }

      // Success!
      toast({
        title: "Poem Submitted for Review!",
        description: "Your poem has been sent to our moderators for review. You'll be notified once it's approved.",
      })

      setSubmitted(true)

    } catch (error: any) {
      console.error("Error submitting poem:", error)

      const errorMessage = error.message || "An unexpected error occurred while submitting your poem"

      setErrors({ general: errorMessage })

      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Don't render the form if not authenticated
  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <PenTool className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-green-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm border-red-200 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-4">Authentication Required</h2>
            <p className="text-red-600 mb-6">
              You must be logged in to submit a poem. You will be redirected to the login page.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PenTool className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Poem Submitted for Review!</h2>
            <p className="text-green-600 mb-6">
              Thank you for sharing your creativity with our community. Your poem has been sent for review and will be
              published once approved by our moderators.
            </p>
            <div className="space-y-4">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href="/poems">Browse Other Poems</a>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false)
                  setFormData({
                    title: "",
                    content: "",
                    category: "",
                    tags: [],
                    authorNote: "",
                  })
                  setErrors({})
                }}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                Submit Another Poem
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Submit Your Poem</h1>
          <p className="text-green-600 text-lg max-w-2xl mx-auto">
            Share your creative expression with our community. All submissions are reviewed before publication.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-green-800 flex items-center space-x-2">
                <PenTool className="w-6 h-6" />
                <span>Poem Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* General Error Alert */}
              {errors.general && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-green-800 font-medium">
                  Poem Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                    // Clear title error when user starts typing
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: undefined }))
                    }
                  }}
                  placeholder="Enter your poem's title"
                  required
                  maxLength={VALIDATION_LIMITS.TITLE_MAX}
                  className={`border-green-300 focus:border-green-500 ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
                <p className="text-sm text-green-600">
                  {formData.title.length}/{VALIDATION_LIMITS.TITLE_MAX} characters
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-green-800 font-medium">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, category: value }))
                    // Clear category error when user selects
                    if (errors.category) {
                      setErrors((prev) => ({ ...prev, category: undefined }))
                    }
                  }}
                >
                  <SelectTrigger className={`border-green-300 focus:border-green-500 ${errors.category ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-green-800 font-medium">
                  Poem Content *
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, content: e.target.value }))
                    // Clear content error when user starts typing
                    if (errors.content) {
                      setErrors((prev) => ({ ...prev, content: undefined }))
                    }
                  }}
                  placeholder="Write your poem here..."
                  required
                  maxLength={VALIDATION_LIMITS.CONTENT_MAX}
                  className={`min-h-[300px] border-green-300 focus:border-green-500 font-serif ${errors.content ? "border-red-500" : ""}`}
                />
                {errors.content && (
                  <p className="text-sm text-red-600">{errors.content}</p>
                )}
                <div className="flex justify-between text-sm">
                  <p className="text-green-600">
                    Tip: Use line breaks to format your poem. Your formatting will be preserved.
                  </p>
                  <p className="text-green-600">
                    {formData.content.length}/{VALIDATION_LIMITS.CONTENT_MAX} characters
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-green-800 font-medium">Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="border-green-300 focus:border-green-500"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-green-100 text-green-700">
                        #{tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-green-600">Add relevant tags to help readers discover your poem.</p>
              </div>

              {/* Author Note */}
              <div className="space-y-2">
                <Label htmlFor="authorNote" className="text-green-800 font-medium">
                  Author's Note (Optional)
                </Label>
                <Textarea
                  id="authorNote"
                  value={formData.authorNote}
                  onChange={(e) => setFormData((prev) => ({ ...prev, authorNote: e.target.value }))}
                  placeholder="Share any inspiration or context behind your poem..."
                  className="min-h-[100px] border-green-300 focus:border-green-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-green-100">
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.category}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit for Review"}
                  </Button>
                </div>
                <p className="text-sm text-green-600 mt-4">
                  By submitting, you agree that your poem is original work and grant permission for publication on LOTUS.
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
      <Toaster />
    </>
  )
}
