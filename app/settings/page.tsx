"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

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
      setPasswordMessage("New passwords do not match.")
      setPasswordSaving(false)
      return
    }
    // TODO: Call your API to update password here
    // Example: await fetch('/api/user/password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) })
    setTimeout(() => {
      setPasswordSaving(false)
      setPasswordMessage("Password changed! (API call not yet implemented)")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }, 1000)
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
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-green-800">Settings</h2>

      {/* Avatar upload section */}
      <form onSubmit={handleSaveAvatar} className="bg-white p-6 rounded shadow mb-8 flex items-center space-x-6">
        {/* Show current avatar or preview */}
        <div>
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarPreview || session?.user?.avatarUrl || undefined} alt={name || "User avatar"} />
            <AvatarFallback className="bg-green-100 text-green-700 text-lg">
              {name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "??_"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-green-700 mb-1">Change Avatar</label>
          <Input type="file" accept="image/*" onChange={handleAvatarChange} />
          <Button type="submit" disabled={!avatarFile || avatarSaving} className="mt-2">
            {avatarSaving ? "Saving..." : "Save Avatar"}
          </Button>
          {avatarMessage && <div className="text-green-600 text-sm mt-2">{avatarMessage}</div>}
        </div>
      </form>

      {/* Profile info form */}
      <form onSubmit={handleSaveProfile} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Email</label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Bio <span className="text-xs text-green-600">(This will appear on your public author profile)</span></label>
          <Textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={500} placeholder="Tell the world about yourself as a poet..." className="min-h-[100px]" />
          <div className="text-xs text-gray-500 mt-1">Max 500 characters.</div>
        </div>
        <Button type="submit" disabled={saving} className="w-full mt-2">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        {saveMessage && <div className="text-green-600 text-sm mt-2">{saveMessage}</div>}
      </form>

      {/* Password change form */}
      <form onSubmit={handleChangePassword} className="space-y-4 bg-white p-6 rounded shadow mt-8">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Change Password</h3>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Current Password</label>
          <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">New Password</label>
          <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Confirm New Password</label>
          <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        </div>
        <Button type="submit" disabled={passwordSaving} className="w-full mt-2">
          {passwordSaving ? "Changing..." : "Change Password"}
        </Button>
        {passwordMessage && <div className="text-green-600 text-sm mt-2">{passwordMessage}</div>}
      </form>
      {/*
        TODO:
        - Implement API endpoints for updating user info and password
        - Add better error handling and validation
        - Consider requiring email verification for email changes
      */}
    </div>
  )
}
// This page allows users to update their name, email, password, and avatar.
// API integration is required for full functionality.
// Avatar upload uses a file input and preview, and expects a backend endpoint for saving the image.