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
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl lg:text-6xl font-light mb-6" style={{ color: '#e2e2e2' }}>Get in Touch</h1>
        <p className="text-lg max-w-2xl mx-auto font-light" style={{ color: '#9b9b9b' }}>
          Have questions, suggestions, or need support? We'd love to hear from you. Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-light flex items-center space-x-2" style={{ color: '#e2e2e2' }}>
                <Mail className="w-6 h-6 text-pink-300" />
                <span>Send us a Message</span>
              </h2>
            </div>
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-pink-300/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-pink-300" />
                  </div>
                  <h3 className="text-xl font-light mb-2" style={{ color: '#e2e2e2' }}>Message Sent!</h3>
                  <p className="mb-4 font-light" style={{ color: '#9b9b9b' }}>
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-medium" style={{ color: '#e2e2e2' }}>
                        Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        required
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-medium" style={{ color: '#e2e2e2' }}>
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        required
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="font-medium" style={{ color: '#e2e2e2' }}>
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
                    <Label htmlFor="message" className="font-medium" style={{ color: '#e2e2e2' }}>
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Please provide details about your inquiry..."
                      required
                      className="min-h-[150px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm text-center">{error}</div>
                  )}
                  <Button type="submit" className="w-full bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light" disabled={isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-light" style={{ color: '#e2e2e2' }}>Contact Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-pink-300 mt-1" />
                <div>
                  <h4 className="font-medium" style={{ color: '#e2e2e2' }}>Email</h4>
                  <p className="font-light" style={{ color: '#9b9b9b' }}>hello@lotus-poetry.com</p>
                  <p className="font-light" style={{ color: '#9b9b9b' }}>support@lotus-poetry.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-pink-300 mt-1" />
                <div>
                  <h4 className="font-medium" style={{ color: '#e2e2e2' }}>Phone</h4>
                  <p className="font-light" style={{ color: '#9b9b9b' }}>+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-pink-300 mt-1" />
                <div>
                  <h4 className="font-medium" style={{ color: '#e2e2e2' }}>Address</h4>
                  <p className="font-light" style={{ color: '#9b9b9b' }}>
                    123 Poetry Lane
                    <br />
                    Creative District
                    <br />
                    San Francisco, CA 94102
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-pink-300 mt-1" />
                <div>
                  <h4 className="font-medium" style={{ color: '#e2e2e2' }}>Response Time</h4>
                  <p className="font-light" style={{ color: '#9b9b9b' }}>We typically respond within 24 hours during business days.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-light" style={{ color: '#e2e2e2' }}>Quick Links</h3>
            </div>
            <div className="p-6 space-y-3">
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-white hover:text-pink-300 hover:bg-white/10 font-light"
              >
                <a href="/faq">Frequently Asked Questions</a>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-white hover:text-pink-300 hover:bg-white/10 font-light"
              >
                <a href="/help">Help Center</a>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-white hover:text-pink-300 hover:bg-white/10 font-light"
              >
                <a href="/community-guidelines">Community Guidelines</a>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-white hover:text-pink-300 hover:bg-white/10 font-light"
              >
                <a href="/privacy">Privacy Policy</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
