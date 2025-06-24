"use client"

import React, { useState, useEffect } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, MapPin, Phone, Clock } from "lucide-react"
import { useSession } from "next-auth/react"

export default function ContactPage() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill name/email for logged-in users
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
      }))
    }
  }, [session])

  // Handle form submission: send data to backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Failed to send message. Please try again later.")
      }
      setSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Get in Touch</h1>
        <p className="text-green-600 text-lg max-w-2xl mx-auto">
          Have questions, suggestions, or need support? We'd love to hear from you. Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-green-800 flex items-center space-x-2">
                <Mail className="w-6 h-6" />
                <span>Send us a Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-600 mb-4">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-green-800 font-medium">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        required
                        className="border-green-300 focus:border-green-500"
                      />
                    </div>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-green-800 font-medium">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your inquiry"
                      required
                      className="border-green-300 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-green-800 font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Please provide details about your inquiry..."
                      required
                      className="min-h-[150px] border-green-300 focus:border-green-500"
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm text-center">{error}</div>
                  )}
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-green-800">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-800">Email</h4>
                  <p className="text-green-700">hello@lotus-poetry.com</p>
                  <p className="text-green-700">support@lotus-poetry.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-800">Phone</h4>
                  <p className="text-green-700">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-800">Address</h4>
                  <p className="text-green-700">
                    123 Poetry Lane
                    <br />
                    Creative District
                    <br />
                    San Francisco, CA 94102
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-800">Response Time</h4>
                  <p className="text-green-700">We typically respond within 24 hours during business days.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-green-800">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-green-700 hover:text-green-800 hover:bg-green-50"
              >
                <a href="/faq">Frequently Asked Questions</a>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-green-700 hover:text-green-800 hover:bg-green-50"
              >
                <a href="/help">Help Center</a>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-green-700 hover:text-green-800 hover:bg-green-50"
              >
                <a href="/community-guidelines">Community Guidelines</a>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-green-700 hover:text-green-800 hover:bg-green-50"
              >
                <a href="/privacy">Privacy Policy</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
