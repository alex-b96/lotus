"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, User, LogIn, LogOut, Settings, PenTool, Shield } from "lucide-react"
import { LotusLogo } from "@/components/lotus-logo"
import { useAdminStatus } from "@/hooks/use-admin-status"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const { isAdmin } = useAdminStatus()
  const pathname = usePathname()

  const navigation = [
    { name: "Acasă", href: "/" },
    { name: "Poezii", href: "/poems" },
    { name: "Autori", href: "/authors" },
    { name: "Feedback", href: "/feedback" },
    { name: "Despre", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  // Loading state while checking session
  const isLoading = status === "loading"

  // Helper function to get user initials for avatar fallback
  const getUserInitials = (name?: string | null) => {
    if (!name || typeof name !== 'string' || name.trim() === '') return '??'
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: "/",
      redirect: true 
    })
  }

  return (
    <header className="backdrop-blur-md sticky top-0 z-50 bg-theme-dark-alpha">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img
              src="/logo-simple.png"
              alt="Lotus Logo"
              className="w-20 h-20 object-contain filter brightness-200 contrast-100"
            />
            {/* <div>
              <h1 className="text-2xl font-light text-white group-hover:text-theme-accent transition-colors">LOTUS</h1>
              <p className="text-xs text-theme-accent italic tracking-wide">Open up like a lotus</p>
            </div> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative font-light text-sm tracking-wide uppercase transition-colors ${
                    isActive
                      ? 'text-theme-accent'
                      : 'hover:text-theme-accent'
                  }`}
                  style={{ color: isActive ? undefined : 'rgb(var(--theme-text-secondary))' }}
                >
                  {item.name}
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--theme-accent-primary))] to-transparent"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              // Loading state
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full animate-pulse" />
              </div>
            ) : session ? (
              // Logged in user menu
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild className="bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 hover:text-white transition-all font-light">
                  <Link href="/submit">
                    <PenTool className="w-4 h-4 mr-2" />
                    Trimite Poezie
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 rounded-full p-0 text-white">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.avatarUrl || undefined}
                          alt={session.user.name}
                        />
                        <AvatarFallback className="bg-white/20 text-white text-sm">
                          {getUserInitials(session.user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 backdrop-blur-md border-white/10 bg-theme-dark-alpha-80">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium text-theme-primary">{session.user.name}</div>
                      <div className="text-xs text-theme-secondary">{session.user.email}</div>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white">
                      <Link href={`/authors/${session.user.id}`} className="cursor-pointer text-gray-300 hover:text-white font-light">
                        <User className="w-4 h-4 mr-2" />
                        Profilul Meu
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white">
                      <Link href="/settings" className="cursor-pointer text-gray-300 hover:text-white font-light">
                        <Settings className="w-4 h-4 mr-2" />
                        Setări
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem asChild className="focus:bg-orange-900/20 focus:text-orange-300">
                          <Link href="/admin" className="cursor-pointer text-orange-400 hover:text-orange-300 font-light">
                            <Shield className="w-4 h-4 mr-2" />
                            Panoul Admin
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400 hover:text-red-300 font-light focus:bg-red-900/20 focus:text-red-300">
                      <LogOut className="w-4 h-4 mr-2" />
                      Deconectare
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // Not logged in - show login/register buttons
              <>
                <Button size="sm" asChild className="bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light">
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Conectare
                  </Link>
                </Button>
                <Button size="sm" asChild className="bg-transparent border-theme-accent-40 text-white hover:bg-theme-accent-20 hover:border-theme-accent-60 transition-all font-light">
                  <Link href="/register">
                    <User className="w-4 h-4 mr-2" />
                    Înregistrare
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/10 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative font-light tracking-wide transition-colors ${
                      isActive
                        ? 'text-theme-accent'
                        : 'text-gray-300 hover:text-theme-accent'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 w-8 h-px bg-theme-accent"></div>
                    )}
                  </Link>
                )
              })}

              {/* Mobile Auth Section */}
              <div className="flex flex-col space-y-3 pt-6 border-t border-white/10">
                {isLoading ? (
                  <div className="py-2">
                    <div className="w-full h-8 bg-white/10 rounded animate-pulse" />
                  </div>
                ) : session ? (
                  // Logged in mobile menu
                  <>
                    <div className="px-2 py-3 text-sm border-b border-white/10">
                      <div className="font-medium text-white">{session.user.name}</div>
                      <div className="text-gray-400 text-xs">{session.user.email}</div>
                    </div>
                    <Button variant="outline" size="sm" asChild className="bg-transparent border-white/30 text-white hover:bg-white hover:text-black font-light">
                      <Link href="/submit" onClick={() => setIsMenuOpen(false)}>
                        <PenTool className="w-4 h-4 mr-2" />
                        Trimite Poezie
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="text-gray-300 hover:text-white font-light justify-start">
                      <Link href={`/authors/${session.user.id}`} onClick={() => setIsMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        Profilul Meu
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="text-gray-300 hover:text-white font-light justify-start">
                      <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Setări
                      </Link>
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" asChild className="text-orange-400 hover:text-orange-300 font-light justify-start">
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                          <Shield className="w-4 h-4 mr-2" />
                          Panoul Admin
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleSignOut()
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 font-light justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Deconectare
                    </Button>
                  </>
                ) : (
                  // Not logged in mobile menu
                  <>
                    <Button variant="ghost" size="sm" asChild className="text-gray-300 hover:text-white font-light justify-start">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Conectare
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="bg-transparent border-white/30 text-white hover:bg-white hover:text-black font-light">
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        Înregistrare
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
