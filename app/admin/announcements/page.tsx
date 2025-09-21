"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Megaphone, Plus, Edit, Trash2, AlertCircle, RefreshCcw, Shield, Calendar, Loader2, Eye } from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  priority: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

interface AnnouncementFormData {
  title: string
  content: string
  priority: number
}

export default function AdminAnnouncementsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  // Form state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    priority: 0
  })
  const [formError, setFormError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Fetch announcements
  const fetchAnnouncements = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/announcements')
      if (!response.ok) {
        throw new Error(`Failed to fetch announcements: ${response.status}`)
      }
      const data = await response.json()
      setAnnouncements(data || [])
    } catch (error) {
      console.error('Error fetching announcements:', error)
      setError('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === 'ADMIN') {
      fetchAnnouncements()
    }
  }, [status, session])

  // Form handlers
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 0
    })
    setFormError(null)
  }

  const handleCreateClick = () => {
    resetForm()
    setIsCreateDialogOpen(true)
  }

  const handleEditClick = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority
    })
    setFormError(null)
    setIsEditDialogOpen(true)
  }

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError('Title and content are required')
      return
    }

    setActionLoading('create')
    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to create announcement')
      }

      // Refresh the announcements list
      await fetchAnnouncements()
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      setFormError('Failed to create announcement')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdate = async () => {
    if (!editingAnnouncement || !formData.title.trim() || !formData.content.trim()) {
      setFormError('Title and content are required')
      return
    }

    setActionLoading('update')
    try {
      const response = await fetch(`/api/admin/announcements/${editingAnnouncement.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update announcement')
      }

      // Refresh the announcements list
      await fetchAnnouncements()
      setIsEditDialogOpen(false)
      setEditingAnnouncement(null)
      resetForm()
    } catch (error) {
      setFormError('Failed to update announcement')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete announcement')
      }

      // Refresh the announcements list
      await fetchAnnouncements()
    } catch (error) {
      setError('Failed to delete announcement')
    } finally {
      setActionLoading(null)
    }
  }


  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Show loading spinner during authentication check
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-dark">
        <Loader2 className="h-8 w-8 animate-spin text-theme-accent" />
      </div>
    )
  }

  // Show sign-in message if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-dark">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-theme-accent" />
          <h1 className="text-xl font-light mb-2 text-theme-primary">Authentication Required</h1>
          <p className="font-light text-theme-secondary">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-theme-dark">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="h-8 w-8 text-theme-accent" />
            <h1 className="text-3xl font-light text-theme-primary">Administrare Anunțuri</h1>
          </div>
          <p className="font-light text-theme-secondary mb-4">
            Creează, editează și administrează anunțurile pentru comunitatea literară.
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Button asChild variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
                <a href="/admin">
                  <Shield className="h-4 w-4 mr-2" />
                  Înapoi la Admin
                </a>
              </Button>
              <Button asChild variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
                <a href="/announcements">
                  <Eye className="h-4 w-4 mr-2" />
                  Vezi Anunțurile Publice
                </a>
              </Button>
            </div>
            
            <Button 
              onClick={handleCreateClick}
              className="bg-gradient-to-r from-theme-accent-40 to-theme-accent-60 text-white hover:from-theme-accent-60 hover:to-theme-accent-80 font-light"
            >
              <Plus className="h-4 w-4 mr-2" />
              Anunț Nou
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-2xl font-light text-theme-primary">
                {announcements.filter(a => a.priority > 0).length}
              </div>
              <div className="text-sm text-theme-secondary">Anunțuri Importante</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="text-2xl font-light text-theme-primary">
                {announcements.length}
              </div>
              <div className="text-sm text-theme-secondary">Total Anunțuri</div>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-theme-accent" />
            <span className="ml-3 font-light text-theme-secondary">Se încarcă anunțurile...</span>
          </div>
        )}

        {/* Announcements List */}
        {!loading && (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg font-medium text-theme-primary">
                          {announcement.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          {announcement.priority > 0 && (
                            <Badge className="bg-theme-accent-20 text-theme-accent">
                              Important
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-theme-secondary">
                        Creat {formatDate(announcement.createdAt)}
                        {announcement.publishedAt && (
                          <> • Publicat {formatDate(announcement.publishedAt)}</>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(announcement)}
                        className="bg-transparent border-white/30 text-white hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={actionLoading === announcement.id}
                          >
                            {actionLoading === announcement.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-black/90 backdrop-blur-md border border-white/10">
                          <DialogHeader>
                            <DialogTitle className="font-light text-theme-primary">Șterge Anunțul</DialogTitle>
                            <DialogDescription className="font-light text-theme-secondary">
                              Ești sigur că vrei să ștergi anunțul "{announcement.title}"? Această acțiune nu poate fi anulată.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light">
                              Anulează
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(announcement.id)}
                              disabled={actionLoading === announcement.id}
                            >
                              {actionLoading === announcement.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              Șterge
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-theme-secondary leading-relaxed">
                    {announcement.content}
                  </p>
                </CardContent>
              </Card>
            ))}

            {announcements.length === 0 && !loading && (
              <div className="text-center py-12">
                <Megaphone className="h-16 w-16 mx-auto mb-4 text-theme-secondary opacity-50" />
                <h3 className="text-xl font-light mb-2 text-theme-primary">
                  Nu există anunțuri
                </h3>
                <p className="text-theme-secondary mb-4">
                  Creează primul anunț pentru comunitatea ta.
                </p>
                <Button 
                  onClick={handleCreateClick}
                  className="bg-gradient-to-r from-theme-accent-40 to-theme-accent-60 text-white hover:from-theme-accent-60 hover:to-theme-accent-80 font-light"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Creează Anunț
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="bg-black/90 backdrop-blur-md border border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-light text-theme-primary">Anunț Nou</DialogTitle>
              <DialogDescription className="font-light text-theme-secondary">
                Creează un anunț nou pentru comunitatea literară.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {formError && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-200">{formError}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="title" className="font-medium text-theme-primary">Titlu</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-2 bg-white/5 border-white/20 text-white"
                  placeholder="Introdu titlul anunțului..."
                />
              </div>
              <div>
                <Label htmlFor="content" className="font-medium text-theme-primary">Conținut</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                  placeholder="Scrie conținutul anunțului..."
                />
              </div>
              <div>
                <Label htmlFor="priority" className="font-medium text-theme-primary">Prioritate</Label>
                <Select value={formData.priority.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: parseInt(value) }))}>
                  <SelectTrigger className="mt-2 bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-md border-white/10">
                    <SelectItem value="0" className="text-gray-300 focus:text-white focus:bg-white/5">Normal</SelectItem>
                    <SelectItem value="1" className="text-gray-300 focus:text-white focus:bg-white/5">Important</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
              >
                Anulează
              </Button>
              <Button
                onClick={handleCreate}
                disabled={actionLoading === 'create'}
                className="bg-gradient-to-r from-theme-accent-40 to-theme-accent-60 text-white hover:from-theme-accent-60 hover:to-theme-accent-80 font-light"
              >
                {actionLoading === 'create' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Creează Anunț
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-black/90 backdrop-blur-md border border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-light text-theme-primary">Editează Anunțul</DialogTitle>
              <DialogDescription className="font-light text-theme-secondary">
                Modifică informațiile anunțului.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {formError && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-200">{formError}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="edit-title" className="font-medium text-theme-primary">Titlu</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-2 bg-white/5 border-white/20 text-white"
                  placeholder="Introdu titlul anunțului..."
                />
              </div>
              <div>
                <Label htmlFor="edit-content" className="font-medium text-theme-primary">Conținut</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                  placeholder="Scrie conținutul anunțului..."
                />
              </div>
              <div>
                <Label htmlFor="edit-priority" className="font-medium text-theme-primary">Prioritate</Label>
                <Select value={formData.priority.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: parseInt(value) }))}>
                  <SelectTrigger className="mt-2 bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/80 backdrop-blur-md border-white/10">
                    <SelectItem value="0" className="text-gray-300 focus:text-white focus:bg-white/5">Normal</SelectItem>
                    <SelectItem value="1" className="text-gray-300 focus:text-white focus:bg-white/5">Important</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
              >
                Anulează
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={actionLoading === 'update'}
                className="bg-gradient-to-r from-theme-accent-40 to-theme-accent-60 text-white hover:from-theme-accent-60 hover:to-theme-accent-80 font-light"
              >
                {actionLoading === 'update' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Salvează Modificările
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}