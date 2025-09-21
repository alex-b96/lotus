"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Megaphone, AlertCircle, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"

interface Announcement {
  id: string
  title: string
  content: string
  publishedAt: string
  priority: number
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch announcements
  const fetchAnnouncements = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/announcements')
      if (!response.ok) {
        throw new Error(`Failed to fetch announcements: ${response.status}`)
      }
      const data = await response.json()
      setAnnouncements(data || [])
    } catch (error) {
      console.error('Error fetching announcements:', error)
      setError(error instanceof Error ? error.message : 'Failed to load announcements')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper function to format relative time
  const formatRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `acum ${diffInHours} ${diffInHours === 1 ? 'oră' : 'ore'}`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `acum ${diffInDays} ${diffInDays === 1 ? 'zi' : 'zile'}`
    }
  }

  return (
    <div className="min-h-screen bg-theme-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-theme-secondary hover:text-theme-accent transition-colors duration-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Înapoi la pagina principală
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="w-8 h-8 text-theme-accent" />
            <h1 className="text-3xl font-light text-theme-primary">Anunțuri</h1>
          </div>
          
          <p className="text-theme-secondary">
            Rămâi la curent cu toate evenimentele, concursurile și noutățile din comunitatea noastră literară.
          </p>
        </div>

        {/* Announcements List */}
        {isLoading ? (
          <div className="space-y-6">
            {[1,2,3,4].map((i) => (
              <Card key={i} className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-6 w-2/3 bg-white/10" />
                    <Skeleton className="h-5 w-20 bg-white/10" />
                  </div>
                  <Skeleton className="h-4 w-1/3 bg-white/10" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full bg-white/10 mb-2" />
                  <Skeleton className="h-4 w-full bg-white/10 mb-2" />
                  <Skeleton className="h-4 w-3/4 bg-white/10" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="bg-red-900/20 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <Card 
                key={announcement.id} 
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-theme-primary font-medium text-lg">
                      {announcement.title}
                    </CardTitle>
                    {announcement.priority > 0 && (
                      <Badge className="bg-theme-accent-20 text-theme-accent">
                        Important
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-theme-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(announcement.publishedAt)}</span>
                    <span className="text-xs">({formatRelativeTime(announcement.publishedAt)})</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-theme-secondary leading-relaxed">
                    {announcement.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && announcements.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="w-16 h-16 text-theme-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-theme-primary mb-2">
              Nu sunt anunțuri disponibile
            </h3>
            <p className="text-theme-secondary">
              Verifică din nou mai târziu pentru noutăți și evenimente.
            </p>
          </div>
        )}
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}