"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { generatePasswordStrengthScore } from "@/lib/password-validator"

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession()
  // Local state for form fields
  const [name, setName] = useState(session?.user?.name || "")
  const [email, setEmail] = useState(session?.user?.email || "")
  const [bio, setBio] = useState(session?.user?.bio || "")
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarSaving, setAvatarSaving] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState("")

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  
  // Password strength calculation
  const passwordStrength = newPassword ? generatePasswordStrengthScore(newPassword) : null

  // When the session loads, pre-fill the form with user's current data
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
      setBio(session.user.bio || "")
    }
  }, [session?.user?.name, session?.user?.email, session?.user?.bio])

  // Handle profile info update
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveMessage("")

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, bio }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.")
      }

      // Pass the updated user data to the session to trigger a refresh
      await updateSession(data)

      setSaveMessage("Profile updated successfully!")

    } catch (error: any) {
      setSaveMessage(error.message) // Display error message
    } finally {
      setSaving(false)
    }
  }

  // Handle password change
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordSaving(true)
    setPasswordMessage("")
    
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Parolele noi nu se potrivesc.")
      setPasswordSaving(false)
      return
    }

    if (newPassword.length < 8) {
      setPasswordMessage("Parola nouă trebuie să aibă cel puțin 8 caractere.")
      setPasswordSaving(false)
      return
    }

    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Eroare la schimbarea parolei.")
      }

      setPasswordMessage("Parola a fost schimbată cu succes!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

    } catch (error: any) {
      // Handle validation errors with details
      if (error.message.includes("Date de intrare invalide") && data?.details) {
        const errorMessages = data.details.map((detail: any) => detail.message).join(", ")
        setPasswordMessage(errorMessages)
      } else if (error.message.includes("Parola nu respectă cerințele") && data?.details) {
        const errorMessages = data.details.join(", ")
        setPasswordMessage(errorMessages)
      } else {
        setPasswordMessage(error.message || "Eroare la schimbarea parolei.")
      }
    } finally {
      setPasswordSaving(false)
    }
  }

  // Handle avatar file selection
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  // Handle avatar upload
  async function handleSaveAvatar(e: React.FormEvent) {
    e.preventDefault()
    if (!avatarFile) return
    setAvatarSaving(true)
    setAvatarMessage("")
    try {
      // Prepare FormData for file upload
      const formData = new FormData()
      formData.append("avatar", avatarFile)
      // POST to the avatar upload API
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload avatar.")
      }
      // Update the session so the new avatar appears everywhere
      await updateSession({ avatarUrl: data.url })
      setAvatarMessage("Avatar updated!")
      setAvatarFile(null)
      setAvatarPreview(null)
    } catch (error: any) {
      setAvatarMessage(error.message || "Failed to upload avatar.")
    } finally {
      setAvatarSaving(false)
    }
  }

  return (
    <div className="min-h-screen" className="bg-theme-dark">
      <div className="max-w-xl mx-auto py-16 px-6">
        <h2 className="text-4xl lg:text-5xl font-light mb-8 text-theme-primary">Setări</h2>

        {/* Avatar upload section */}
        <form onSubmit={handleSaveAvatar} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 p-6 mb-8 flex items-center space-x-6">
        {/* Show current avatar or preview */}
        <div>
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarPreview || session?.user?.avatarUrl || undefined} alt={name || "User avatar"} />
            <AvatarFallback className="bg-white/10 text-pink-200 text-lg">
              {name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "??_"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-theme-primary">Schimbă avatarul</label>
          <Input type="file" accept="image/*" onChange={handleAvatarChange} className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light" />
          <Button type="submit" disabled={!avatarFile || avatarSaving} className="mt-2 bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light">
            {avatarSaving ? "Se salvează..." : "Salvează avatarul"}
          </Button>
          {avatarMessage && <div className="text-pink-300 text-sm mt-2">{avatarMessage}</div>}
        </div>
      </form>

        {/* Profile info form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 p-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-theme-primary">Nume</label>
          <Input value={name} onChange={e => setName(e.target.value)} required className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-theme-primary">Adresă de email</label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-theme-primary">Bio <span className="text-xs text-theme-secondary">(Aceasta va apărea pe profilul dumneavoastră public)</span></label>
          <Textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={500} placeholder="Spune-ne despre tine ca poet..." className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light" />
          <div className="text-xs mt-1 text-theme-secondary">Max 500 caractere.</div>
        </div>
        <Button type="submit" disabled={saving} className="w-full mt-2 bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light">
          {saving ? "Se salvează..." : "Salvează modificările"}
        </Button>
        {saveMessage && <div className="text-pink-300 text-sm mt-2">{saveMessage}</div>}
      </form>

        {/* Password change form */}
        <form onSubmit={handleChangePassword} className="space-y-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-pink-300/30 hover:bg-white/10 transition-all duration-300 p-6 mt-8">
          <h3 className="text-lg font-light mb-2 text-theme-primary">Schimbă parola</h3>
        <div>
          <label className="block text-sm font-medium mb-1 text-theme-primary">Parola actuală</label>
          <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-theme-primary">Nouă parolă</label>
          <Input 
            type="password" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
            onFocus={() => setShowPasswordRequirements(true)}
            required 
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light" 
          />
          
          {/* Password Strength Indicator */}
          {newPassword && passwordStrength && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-theme-secondary">Puterea parolei:</span>
                <span className={passwordStrength.color}>{passwordStrength.label}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    passwordStrength.score <= 2 ? 'bg-red-400' :
                    passwordStrength.score <= 4 ? 'bg-yellow-400' :
                    passwordStrength.score <= 6 ? 'bg-blue-400' : 'bg-green-400'
                  }`}
                  style={{ width: `${(passwordStrength.score / 8) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Password Requirements */}
          {showPasswordRequirements && (
            <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs font-medium mb-2 text-theme-primary">Cerințele parolei:</p>
              <ul className="text-xs space-y-1 text-theme-secondary">
                <li className={`flex items-center ${newPassword.length >= 8 ? 'text-green-400' : ''}`}>
                  <span className="mr-2">{newPassword.length >= 8 ? '✓' : '•'}</span>
                  Cel puțin 8 caractere
                </li>
                <li className={`flex items-center ${/[a-z]/.test(newPassword) ? 'text-green-400' : ''}`}>
                  <span className="mr-2">{/[a-z]/.test(newPassword) ? '✓' : '•'}</span>
                  O literă mică
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(newPassword) ? 'text-green-400' : ''}`}>
                  <span className="mr-2">{/[A-Z]/.test(newPassword) ? '✓' : '•'}</span>
                  O literă mare
                </li>
                <li className={`flex items-center ${/\d/.test(newPassword) ? 'text-green-400' : ''}`}>
                  <span className="mr-2">{/\d/.test(newPassword) ? '✓' : '•'}</span>
                  O cifră
                </li>
                <li className={`flex items-center ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? 'text-green-400' : ''}`}>
                  <span className="mr-2">{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? '✓' : '•'}</span>
                  Un caracter special (!@#$%^&* etc.)
                </li>
              </ul>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-theme-primary">Confirmă noua parolă</label>
          <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light" />
        </div>
        <Button type="submit" disabled={passwordSaving} className="w-full mt-2 bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light">
          {passwordSaving ? "Se schimbă..." : "Schimbă parola"}
        </Button>
        {passwordMessage && <div className="text-pink-300 text-sm mt-2">{passwordMessage}</div>}
        </form>
        {/*
          TODO:
          - Implement API endpoints for updating user info and password
          - Add better error handling and validation
          - Consider requiring email verification for email changes
        */}
      </div>
    </div>
  )
}
// This page allows users to update their name, email, password, and avatar.
// API integration is required for full functionality.
// Avatar upload uses a file input and preview, and expects a backend endpoint for saving the image.