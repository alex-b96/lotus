"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  const { data: session } = useSession()
  // Local state for form fields
  const [name, setName] = useState(session?.user?.name || "")
  const [email, setEmail] = useState(session?.user?.email || "")
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

  // Handle profile info update
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveMessage("")
    // TODO: Call your API to update name/email here
    // Example: await fetch('/api/user', { method: 'POST', body: JSON.stringify({ name, email }) })
    setTimeout(() => {
      setSaving(false)
      setSaveMessage("Profile updated! (API call not yet implemented)")
    }, 1000)
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
    // TODO: Upload avatarFile to your backend and update user avatarUrl
    // Example: use FormData and POST to /api/user/avatar
    setTimeout(() => {
      setAvatarSaving(false)
      setAvatarMessage("Avatar updated! (API call not yet implemented)")
      // Optionally, refresh session/user info here
    }, 1000)
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-green-800">Settings</h2>

      {/* Avatar upload section */}
      <form onSubmit={handleSaveAvatar} className="bg-white p-6 rounded shadow mb-8 flex items-center space-x-6">
        {/* Show current avatar or preview */}
        <div>
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarPreview || session?.user?.avatarUrl || undefined} alt={name} />
            <AvatarFallback className="bg-green-100 text-green-700 text-lg">
              {name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2)}
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