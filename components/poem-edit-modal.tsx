"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, X, AlertCircle } from "lucide-react"
import { PoemDetail } from "@/hooks/use-poem-detail"
import { updatePoemSchema } from "@/lib/validations/poems"
import { z } from "zod"

interface PoemEditModalProps {
  poem: PoemDetail
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// const categories = ["Lyric", "Haiku", "Modern", "Classic", "Experimental"] // Disabled for now

export function PoemEditModal({ poem, isOpen, onClose, onSuccess }: PoemEditModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [title, setTitle] = useState(poem.title)
  const [content, setContent] = useState(poem.content)
  // const [category, setCategory] = useState(poem.category) // Disabled for now
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(poem.tags)

  // Reset form when poem changes
  useEffect(() => {
    setTitle(poem.title)
    setContent(poem.content)
    // setCategory(poem.category) // Disabled for now
    setTags(poem.tags)
    setTagInput("")
    setError(null)
  }, [poem])

  // Handle tag addition
  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  // Handle tag removal
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate input
      const validatedData = updatePoemSchema.parse({
        title: title.trim(),
        content: content.trim(),
        // category, // Disabled for now
        tags
      })

      const response = await fetch(`/api/poems/${poem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Eroare la actualizarea poeziei")
      }

      onSuccess()
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || "Date invalide")
      } else {
        setError(err instanceof Error ? err.message : "A apărut o eroare")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle close with confirmation if there are unsaved changes
  const handleClose = () => {
    const hasChanges = 
      title !== poem.title ||
      content !== poem.content ||
      // category !== poem.category || // Disabled for now
      JSON.stringify(tags) !== JSON.stringify(poem.tags)

    if (hasChanges && !isLoading) {
      if (confirm("Ai modificări nesalvate. Sigur vrei să închizi?")) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-theme-primary">
            Editează poezia
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert className="bg-red-900/20 border-red-800">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">
              Titlu *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Introdu titlul poeziei..."
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent"
              disabled={isLoading}
              required
            />
          </div>

          {/* Category - Disabled for now */}
          {/* <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">
              Categorie *
            </Label>
            <Select value={category} onValueChange={setCategory} disabled={isLoading}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Alege categoria">
                  {category || "Alege categoria"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {categories.map((cat) => (
                  <SelectItem 
                    key={cat} 
                    value={cat} 
                    className="text-gray-300 focus:text-white focus:bg-white/5"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-gray-300">
              Conținut *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Scrie poezia ta aici..."
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent min-h-[200px] resize-y"
              disabled={isLoading}
              required
            />
            <div className="text-sm text-gray-400 text-right">
              {content.length}/10000 caractere
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-gray-300">
              Etichete (opțional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Adaugă o etichetă..."
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent flex-1"
                disabled={isLoading || tags.length >= 10}
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim() || tags.length >= 10 || isLoading}
                className="bg-theme-accent hover:bg-theme-accent-dark"
              >
                Adaugă
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-theme-accent-20 text-theme-accent border border-theme-accent-40 pr-1"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-400"
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="text-sm text-gray-400">
              {tags.length}/10 etichete
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="bg-transparent border-white/30 text-white hover:bg-white hover:text-black"
            >
              Anulează
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="bg-theme-accent hover:bg-theme-accent-dark text-white"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvează modificările
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}