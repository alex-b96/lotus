"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Send, MessageSquare } from "lucide-react"

// Mock testimonials data
const testimonials = [
  {
    id: 1,
    name: "Emily Watson",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    comment:
      "LOTUS has become my daily source of inspiration. The quality of poetry here is exceptional, and the community is so supportive.",
    date: "2024-01-10",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    comment:
      "As a new poet, I was nervous about sharing my work. The feedback I received here helped me grow tremendously. Thank you!",
    date: "2024-01-08",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4,
    comment:
      "Beautiful platform with an intuitive design. I love discovering new poets and their unique perspectives on life.",
    date: "2024-01-05",
  },
]

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      alert("Please select a rating")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({ name: "", email: "", comment: "" })
      setRating(0)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Your Feedback Matters</h1>
        <p className="text-green-600 text-lg max-w-2xl mx-auto">
          Help us improve LOTUS by sharing your thoughts and experiences. Your feedback shapes our community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feedback Form */}
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800 flex items-center space-x-2">
              <MessageSquare className="w-6 h-6" />
              <span>Share Your Experience</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h3>
                <p className="text-green-600 mb-4">
                  Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Submit Another Review
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div className="space-y-2">
                  <Label className="text-green-800 font-medium">Overall Rating *</Label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-green-600">
                    {rating === 0 && "Please select a rating"}
                    {rating === 1 && "Poor - Needs significant improvement"}
                    {rating === 2 && "Fair - Some issues to address"}
                    {rating === 3 && "Good - Meets expectations"}
                    {rating === 4 && "Very Good - Exceeds expectations"}
                    {rating === 5 && "Excellent - Outstanding experience"}
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-green-800 font-medium">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    required
                    className="border-green-300 focus:border-green-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-green-800 font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    required
                    className="border-green-300 focus:border-green-500"
                  />
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <Label htmlFor="comment" className="text-green-800 font-medium">
                    Your Feedback *
                  </Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="Tell us about your experience with LOTUS..."
                    required
                    className="min-h-[120px] border-green-300 focus:border-green-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting || rating === 0}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800">What Our Community Says</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-800">{testimonial.name}</h4>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-green-700 mb-2">"{testimonial.comment}"</p>
                    <p className="text-sm text-green-600">{testimonial.date}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center pt-4">
              <p className="text-green-600 text-sm">Join our community and share your own experience!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
