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
    <div className="min-h-screen bg-theme-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 space-y-8 sm:space-y-10 lg:space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 text-theme-primary">Contactează-ne</h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto font-light text-theme-secondary px-4 sm:px-0">
          Ai întrebări, sugestii sau ai nevoie de asistență? Vrem să auzim de la tine. Contactează-ne.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-theme-accent-30 hover:bg-white/10 transition-all duration-300">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-white/10">
              <h2 className="text-xl sm:text-2xl font-light flex items-center space-x-2 text-theme-primary">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-theme-accent" />
                <span>Trimite-ne un mesaj</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-theme-accent-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-theme-accent" />
                  </div>
                  <h3 className="text-xl font-light mb-2 text-theme-primary">Mesaj trimis!</h3>
                  <p className="mb-4 font-light text-theme-secondary">
                    Vă mulțumim pentru contact. Vă vom răspunde în cel mai scurt timp posibil.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light"
                  >
                    Trimite un alt mesaj
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-medium text-theme-primary">
                        Nume *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Numele complet"
                        required
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent font-light"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-medium text-theme-primary">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        required
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent font-light"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="font-medium text-theme-primary">
                      Subiect *
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="Descriere rapidă a întrebării"
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent font-light"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-medium text-theme-primary">
                      Mesaj *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Vă rugăm să furnizați detalii despre întrebarea dumneavoastră..."
                      required
                      className="min-h-[150px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent font-light"
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm text-center">{error}</div>
                  )}
                  <Button type="submit" className="w-full bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light" disabled={isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Se trimite..." : "Trimite mesajul"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-theme-accent-30 hover:bg-white/10 transition-all duration-300">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-white/10">
              <h3 className="text-lg sm:text-xl font-light text-theme-primary">Contact Information</h3>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-theme-accent mt-1" />
                <div>
                  <h4 className="font-medium text-theme-primary">Email</h4>
                  <p className="font-light text-theme-secondary">contact@lotus-poetry.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-theme-accent mt-1" />
                <div>
                  <h4 className="font-medium text-theme-primary">Phone</h4>
                  <p className="font-light text-theme-secondary">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-theme-accent mt-1" />
                <div>
                  <h4 className="font-medium text-theme-primary">Address</h4>
                  <p className="font-light text-theme-secondary">
                    123 Poetry Lane
                    <br />
                    Creative District
                    <br />
                    San Francisco, CA 94102
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-theme-accent mt-1" />
                <div>
                  <h4 className="font-medium text-theme-primary">Răspunsul</h4>
                  <p className="font-light text-theme-secondary">Vă vom răspunde în cel mai scurt timp posibil.</p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-theme-accent-30 hover:bg-white/10 transition-all duration-300">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-light text-theme-primary">Quick Links</h3>
            </div>
            <div className="p-6 space-y-3">
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-white hover:text-theme-accent hover:bg-white/10 font-light"
              >
                <a href="/faq">Întrebări frecvente</a>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-white hover:text-theme-accent hover:bg-white/10 font-light"
              >
                <a href="/help">Centru de ajutor</a>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-white hover:text-theme-accent hover:bg-white/10 font-light"
              >
                <a href="/community-guidelines">Reguli de comunitate</a>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start text-white hover:text-theme-accent hover:bg-white/10 font-light"
              >
                <a href="/privacy">Politica de confidențialitate</a>
              </Button>
            </div>
          </div> */}
        </div>
      </div>
      </div>
    </div>
  )
}
