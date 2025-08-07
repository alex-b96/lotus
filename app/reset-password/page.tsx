"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [userEmail, setUserEmail] = useState("")

  // Validate token on page load
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Token lipseşte. Te rog să soliciți din nou resetarea parolei.")
        setIsValidatingToken(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setTokenValid(true)
          setUserEmail(data.email)
        } else {
          setError(data.error || "Token invalid sau expirat")
        }
      } catch (error) {
        setError("A apărut o eroare la validarea token-ului")
      } finally {
        setIsValidatingToken(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Parolele nu se potrivesc")
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Parola trebuie să aibă cel puțin 6 caractere")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(data.error || "A apărut o eroare. Te rog să încerci din nou.")
      }
    } catch (error) {
      setError("A apărut o eroare. Te rog să încerci din nou.")
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-theme-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-pink-300 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-theme-secondary">Validez token-ul...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme-dark">
      <div className="max-w-lg mx-auto pt-16 px-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
          <div className="p-6 border-b border-white/10 text-center">
            <div className="w-16 h-16 bg-theme-accent-20 rounded-full flex items-center justify-center mx-auto mb-4">
              {isSuccess ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : !tokenValid ? (
                <AlertCircle className="w-8 h-8 text-red-400" />
              ) : (
                <Key className="w-8 h-8 text-theme-accent" />
              )}
            </div>
            <h1 className="text-2xl font-light text-theme-primary">
              {isSuccess ? "Parolă resetată!" : !tokenValid ? "Token invalid" : "Parolă nouă"}
            </h1>
            <p className="font-light text-theme-secondary">
              {isSuccess 
                ? "Parola ta a fost resetată cu succes"
                : !tokenValid 
                ? "Link-ul de resetare este invalid sau a expirat"
                : `Setează o parolă nouă pentru ${userEmail}`
              }
            </p>
          </div>

          <div className="p-6">
            {isSuccess ? (
              <div className="space-y-6">
                <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div className="text-green-200">
                      <p className="font-medium mb-2">Parola resetată cu succes!</p>
                      <p className="text-sm">
                        Te poți conecta acum cu noua ta parolă. Vei fi redirecționat automat în câteva secunde.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light"
                >
                  <Link href="/login">
                    Mergi la conectare
                  </Link>
                </Button>
              </div>
            ) : !tokenValid ? (
              <div className="space-y-6">
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div className="text-red-200">
                      <p className="font-medium mb-2">Token invalid sau expirat</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light"
                  >
                    <Link href="/forgot-password">
                      Solicită din nou resetarea
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 font-light"
                  >
                    <Link href="/login">
                      Înapoi la conectare
                    </Link>
                  </Button>
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
                  <Label htmlFor="password" className="font-medium text-theme-primary">
                    Parolă nouă
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Introdu parola nouă"
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
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirmă parola nouă"
                      required
                      minLength={6}
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

                <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4">
                  <p className="text-blue-200 text-sm">
                    <strong>Cerințe parolă:</strong>
                  </p>
                  <ul className="text-blue-200 text-sm mt-2 space-y-1">
                    <li>• Cel puțin 6 caractere</li>
                    <li>• Recomandăm să incluzi litere, cifre și simboluri</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light" 
                  disabled={isLoading || !formData.password || !formData.confirmPassword}
                >
                  {isLoading ? "Se resetează..." : "Resetează parola"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-theme-accent hover:text-[rgb(var(--theme-accent-light))] transition-colors font-light"
              >
                Înapoi la conectare
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-theme-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-pink-300 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-theme-secondary">Se încarcă...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}