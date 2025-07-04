"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Eye, EyeOff, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    bio: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required")
      return false
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!formData.password) {
      setError("Password is required")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return false
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Combine first and last name
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`

      // Call registration API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: formData.email.trim(),
          password: formData.password,
          bio: formData.bio.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Registration successful
      setSuccess(true)

      // Auto-login the user
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        // Registration worked but auto-login failed
        setError("Account created successfully, but auto-login failed. Please log in manually.")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        // Both registration and login successful
        setTimeout(() => {
          router.push("/")
        }, 1500)
      }

    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show success state
  if (success && !error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="max-w-md mx-auto pt-16 px-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
            <div className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-pink-300/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-pink-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-light mb-2" style={{ color: '#e2e2e2' }}>Welcome to LOTUS!</h2>
                  <p className="font-light" style={{ color: '#9b9b9b' }}>
                    Your account has been created successfully. You're being logged in automatically...
                  </p>
                </div>
                <div className="w-full bg-pink-300/20 rounded-full h-2">
                  <div className="bg-pink-300 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="max-w-md mx-auto pt-8 px-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
          <div className="p-6 border-b border-white/10 text-center">
            <div className="w-16 h-16 bg-pink-300/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-pink-300" />
            </div>
            <h1 className="text-2xl font-light" style={{ color: '#e2e2e2' }}>Join LOTUS</h1>
            <p className="font-light" style={{ color: '#9b9b9b' }}>Create your poetry account</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-4">
                  <span className="text-red-200">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-medium" style={{ color: '#e2e2e2' }}>
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                    placeholder="First name"
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-medium" style={{ color: '#e2e2e2' }}>
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Last name"
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium" style={{ color: '#e2e2e2' }}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium" style={{ color: '#e2e2e2' }}>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a password (min 6 characters)"
                    required
                    minLength={6}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-300 hover:text-pink-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-medium" style={{ color: '#e2e2e2' }}>
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your password"
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-300 hover:text-pink-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="font-medium" style={{ color: '#e2e2e2' }}>
                  Bio <span className="text-xs font-light" style={{ color: '#9b9b9b' }}>(This will appear on your public author profile, optional)</span>
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value.slice(0, 500) }))}
                  maxLength={500}
                  placeholder="Tell the world about yourself as a poet... (optional)"
                  className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-300 font-light"
                />
                <div className="text-xs font-light mt-1" style={{ color: '#9b9b9b' }}>Max 500 characters.</div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))}
                  className="mt-1"
                />
                <Label htmlFor="agreeToTerms" className="text-sm font-light leading-relaxed" style={{ color: '#9b9b9b' }}>
                  I agree to the{" "}
                  <Link href="/terms" className="text-pink-300 hover:text-pink-200 underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-pink-300 hover:text-pink-200 underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-transparent border-pink-300/40 text-white hover:bg-pink-300/20 hover:border-pink-300/60 transition-all font-light"
                disabled={isLoading || !formData.agreeToTerms}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-light" style={{ color: '#9b9b9b' }}>
                Already have an account?{" "}
                <Link href="/login" className="text-pink-300 hover:text-pink-200 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}