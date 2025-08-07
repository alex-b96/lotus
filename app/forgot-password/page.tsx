"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        setError(data.error || "A apărut o eroare. Te rog să încerci din nou.")
      }
    } catch (error) {
      setError("A apărut o eroare. Te rog să încerci din nou.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-theme-dark">
      <div className="max-w-lg mx-auto pt-16 px-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
          <div className="p-6 border-b border-white/10 text-center">
            <div className="w-16 h-16 bg-theme-accent-20 rounded-full flex items-center justify-center mx-auto mb-4">
              {isSubmitted ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <Mail className="w-8 h-8 text-theme-accent" />
              )}
            </div>
            <h1 className="text-2xl font-light text-theme-primary">
              {isSubmitted ? "Email trimis!" : "Ai uitat parola?"}
            </h1>
            <p className="font-light text-theme-secondary">
              {isSubmitted 
                ? "Verifică-ți emailul pentru instrucțiunile de resetare"
                : "Introdu adresa ta de email și îți vom trimite un link pentru resetare"
              }
            </p>
          </div>

          <div className="p-6">
            {isSubmitted ? (
              <div className="space-y-6">
                <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div className="text-green-200">
                      <p className="font-medium mb-2">Email trimis cu succes!</p>
                      <p className="text-sm">
                        Am trimis instrucțiunile de resetare la <strong>{email}</strong>. 
                        Verifică-ți folderul de spam dacă nu vezi emailul în următoarele minute.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-theme-secondary text-center">
                    Nu ai primit emailul? Încearcă din nou în câteva minute.
                  </p>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        setIsSubmitted(false)
                        setEmail("")
                        setError("")
                      }}
                      variant="outline"
                      className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
                    >
                      Încearcă din nou
                    </Button>
                    <Button
                      asChild
                      className="flex-1 bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light"
                    >
                      <Link href="/login">
                        Înapoi la conectare
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                    <span className="text-red-200">{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium text-theme-primary">
                    Adresa de email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Introdu adresa ta de email"
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-theme-accent font-light"
                  />
                  <p className="text-sm text-theme-secondary">
                    Îți vom trimite un link pentru resetarea parolei
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light" 
                  disabled={isLoading || !email.trim()}
                >
                  {isLoading ? "Se trimite..." : "Trimite link de resetare"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-theme-accent hover:text-[rgb(var(--theme-accent-light))] transition-colors font-light"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Înapoi la conectare
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}