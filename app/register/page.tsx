"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
      setError("Prenumele este obligatoriu")
      return false
    }
    if (!formData.lastName.trim()) {
      setError("Numele de familie este obligatoriu")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email-ul este obligatoriu")
      return false
    }
    if (!formData.password) {
      setError("Parola este obligatorie")
      return false
    }
    if (formData.password.length < 6) {
      setError("Parola trebuie să aibă cel puțin 6 caractere")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Parolele nu se potrivesc")
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

      // Track signup in GTM
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'user_signup',
          signup_method: 'email',
        })
      }

      // Auto-login the user
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        // Registration worked but auto-login failed
        setError("Contul a fost creat cu succes, dar conectarea automată a eșuat. Te rugăm să te conectezi manual.")
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
      setError(error.message || "Ceva nu a mers bine. Te rugăm să încerci din nou.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show success state
  if (success && !error) {
    return (
      <div className="min-h-screen bg-theme-dark">
        <div className="max-w-md mx-auto pt-16 px-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
            <div className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-theme-accent-20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-theme-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-light mb-2 text-theme-primary">Bine ai venit la LOTUS!</h2>
                  <p className="font-light text-theme-secondary">
                    Contul tău a fost creat cu succes. Ești conectat automat...
                  </p>
                </div>
                <div className="w-full bg-theme-accent-20 rounded-full h-2">
                  <div className="bg-theme-accent h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme-dark">
      <div className="max-w-lg mx-auto pt-8 px-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
          <div className="p-6 border-b border-white/10 text-center">
            <div className="w-16 h-16 bg-theme-accent-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-theme-accent" />
            </div>
            <h1 className="text-2xl font-light text-theme-primary">Alătură-te LOTUS</h1>
            <p className="font-light text-theme-secondary">Creează-ți contul de poezie</p>
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
                  <Label htmlFor="firstName" className="font-medium text-theme-primary">
                    Prenume
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Prenume"
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent font-light"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-medium text-theme-primary">
                    Nume de familie
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Nume de familie"
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent font-light"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-theme-primary">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Introdu email-ul tău"
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent font-light"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium text-theme-primary">
                  Parolă
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Creează o parolă (min 6 caractere)"
                    required
                    minLength={6}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-medium text-theme-primary">
                  Confirmă parola
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirmă parola ta"
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent font-light pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-accent hover:text-[rgb(var(--theme-accent-light))]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="font-medium text-theme-primary">
                  Biografie <span className="text-xs font-light text-theme-secondary">(Va apărea pe profilul tău public de autor, opțional)</span>
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value.slice(0, 500) }))}
                  maxLength={500}
                  placeholder="Spune lumii despre tine ca poet... (opțional)"
                  className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent font-light"
                />
                <div className="text-xs font-light mt-1 text-theme-secondary">Maxim 500 de caractere.</div>
              </div>


              <Button
                type="submit"
                className="w-full bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light"
                disabled={isLoading}
              >
                {isLoading ? "Se creează contul..." : "Creează cont"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-light text-theme-secondary">
                Ai deja un cont?{" "}
                <Link href="/login" className="text-theme-accent hover:text-[rgb(var(--theme-accent-light))] font-medium transition-colors">
                  Conectează-te
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}