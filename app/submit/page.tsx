"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
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
      newErrors.title = "Titlul este obligatoriu"
    } else if (formData.title.length > VALIDATION_LIMITS.TITLE_MAX) {
      newErrors.title = `Titlul trebuie să fie mai mic de ${VALIDATION_LIMITS.TITLE_MAX} caractere`
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = "Conținutul poeziei este obligatoriu"
    } else if (formData.content.length > VALIDATION_LIMITS.CONTENT_MAX) {
      newErrors.content = `Conținutul trebuie să fie mai mic de ${VALIDATION_LIMITS.CONTENT_MAX} caractere`
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Vă rugăm să selectați o categorie"
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
        title: "Eroare de validare",
        description: "Vă rugăm să corectați erorile din formular înainte de a trimite.",
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
        status: "SUBMITTED" // Submit for moderation review
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
        title: "Poezie trimisă pentru recenzie!",
        description: "Poezia dumneavoastră a fost trimisă la recenzie de către moderatorii noștri. Vă vom notifica odată ce va fi aprobată.",
      })

      setSubmitted(true)

    } catch (error: any) {
      console.error("Error submitting poem:", error)

      const errorMessage = error.message || "A apărut o eroare neașteptată la trimiterea poeziei"

      setErrors({ general: errorMessage })

      toast({
        variant: "destructive",
        title: "Trimiterea a eșuat",
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Don't render the form if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="max-w-2xl mx-auto pt-16 px-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-pink-300/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <PenTool className="w-8 h-8 text-pink-300" />
              </div>
              <p className="font-light" style={{ color: '#9b9b9b' }}>Se încarcă...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="max-w-2xl mx-auto pt-16 px-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-light mb-4" style={{ color: '#e2e2e2' }}>Autentificare necesară</h2>
              <p className="mb-6 font-light" style={{ color: '#9b9b9b' }}>
                Trebuie să fiți autentificat pentru a putea trimite o poezie. Vă veți fi redirecționat la pagina de login.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="max-w-2xl mx-auto pt-16 px-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-pink-300/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <PenTool className="w-8 h-8 text-pink-300" />
              </div>
              <h2 className="text-2xl font-light mb-4" style={{ color: '#e2e2e2' }}>Poezie trimisă pentru recenzie!</h2>
              <p className="mb-6 font-light" style={{ color: '#9b9b9b' }}>
                Vă mulțumim pentru partajarea creativității dumneavoastră cu comunitatea noastră. Poezia dumneavoastră a fost trimisă la recenzie și va fi publicată odată ce va fi aprobată de moderatorii noștri.
              </p>
              <div className="space-y-4">
                <Button asChild className="bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light">
                  <a href="/poems">Vezi alte poezii</a>
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
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
                >
                  Trimite o altă poezie
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="max-w-4xl mx-auto pt-16 px-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4" style={{ color: '#e2e2e2' }}>Trimite o poezie</h1>
          <p className="text-lg max-w-2xl mx-auto font-light" style={{ color: '#9b9b9b' }}>
            Partajați-ne creativitatea dumneavoastră cu comunitatea noastră. Toate poeziile sunt recenzate înainte de publicare.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 shadow-lg">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-light flex items-center space-x-2" style={{ color: '#e2e2e2' }}>
                <PenTool className="w-6 h-6 text-pink-300" />
                <span>Detalii poezie</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* General Error Alert */}
              {errors.general && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="text-red-200">{errors.general}</span>
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="font-medium" style={{ color: '#e2e2e2' }}>
                  Titlu poezie *
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
                  className={`bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && (
                  <p className="text-sm text-red-400">{errors.title}</p>
                )}
                <p className="text-sm font-light" style={{ color: '#9b9b9b' }}>
                  {formData.title.length}/{VALIDATION_LIMITS.TITLE_MAX} characters
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="font-medium" style={{ color: '#e2e2e2' }}>
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
                  <SelectTrigger className={`bg-white/5 border-white/20 text-white focus:border-pink-300 ${errors.category ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-md border-white/10">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-gray-300 focus:text-white focus:bg-white/5">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-400">{errors.category}</p>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="font-medium" style={{ color: '#e2e2e2' }}>
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
                  className={`min-h-[300px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-serif ${errors.content ? "border-red-500" : ""}`}
                />
                {errors.content && (
                  <p className="text-sm text-red-400">{errors.content}</p>
                )}
                <div className="flex justify-between text-sm">
                  <p className="font-light" style={{ color: '#9b9b9b' }}>
                    Tip: Folosiți linii noi pentru a forma poezia. Formatarea dumneavoastră va fi păstrată.
                  </p>
                  <p className="font-light" style={{ color: '#9b9b9b' }}>
                    {formData.content.length}/{VALIDATION_LIMITS.CONTENT_MAX} characters
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="font-medium" style={{ color: '#e2e2e2' }}>Etichete</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Adaugă o etichetă"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-pink-300/20 text-pink-300 border border-pink-300/40">
                        #{tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm font-light" style={{ color: '#9b9b9b' }}>Adaugă etichete relevante pentru a ajuta cititorii să descoperă poezia dumneavoastră.</p>
              </div>

              {/* Author Note */}
              <div className="space-y-2">
                <Label htmlFor="authorNote" className="font-medium" style={{ color: '#e2e2e2' }}>
                  Notă autorului (opțional)
                </Label>
                <Textarea
                  id="authorNote"
                  value={formData.authorNote}
                  onChange={(e) => setFormData((prev) => ({ ...prev, authorNote: e.target.value }))}
                  placeholder="Partajați orice inspirație sau context din spatele poeziei dumneavoastră..."
                  className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-end space-x-4">
                  {/* <Button type="button" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
                    Salvați ca proiect
                  </Button> */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.category}
                    className="bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Se trimite..." : "Trimite pentru recenzie"}
                  </Button>
                </div>
                <p className="text-sm font-light mt-4" style={{ color: '#9b9b9b' }}>
                  Prin trimiterea, sunteți de acord că poezia dumneavoastră este o lucrare originală și acordiți permisiunea de publicare pe LOTUS.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  )
}