"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PenTool, Send, X, Plus } from "lucide-react"

const categories = ["Lyric", "Haiku", "Modern", "Classic", "Experimental"]

export default function SubmitPoemPage() {
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
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PenTool className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Poem Submitted Successfully!</h2>
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
                onClick={() => setSubmitted(false)}
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
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-green-800 font-medium">
                Poem Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your poem's title"
                required
                className="border-green-300 focus:border-green-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-green-800 font-medium">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="border-green-300 focus:border-green-500">
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
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-green-800 font-medium">
                Poem Content *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Write your poem here..."
                required
                className="min-h-[300px] border-green-300 focus:border-green-500 font-serif"
              />
              <p className="text-sm text-green-600">
                Tip: Use line breaks to format your poem. Your formatting will be preserved.
              </p>
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
                  disabled={isSubmitting || !formData.title || !formData.content || !formData.category}
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
  )
}
