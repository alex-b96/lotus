"use client"

import type React from "react"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { LogIn, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        // Refresh the session and redirect to home
        await getSession()
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-theme-dark">
      <div className="max-w-md mx-auto pt-16 px-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
          <div className="p-6 border-b border-white/10 text-center">
            <div className="w-16 h-16 bg-theme-accent-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-theme-accent" />
            </div>
            <h1 className="text-2xl font-light text-theme-primary">Welcome Back</h1>
            <p className="font-light text-theme-secondary">Sign in to your LOTUS account</p>
          </div>

          <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-4">
                <span className="text-red-200">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-theme-primary">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent font-light"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium text-theme-primary">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent font-light pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-accent hover:text-[rgb(var(--theme-accent-light))]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))}
                />
                <Label htmlFor="rememberMe" className="text-sm font-light text-theme-secondary">
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password" className="text-sm text-theme-accent hover:text-[rgb(var(--theme-accent-light))] transition-colors font-light">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-light text-theme-secondary">
              Don't have an account?{" "}
              <Link href="/register" className="text-theme-accent hover:text-[rgb(var(--theme-accent-light))] font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-300/40 rounded-xl text-sm text-theme-blue-info">
            <strong>Test Account:</strong><br />
            Email: sarah@example.com<br />
            Password: password123
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
