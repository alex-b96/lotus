"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
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

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Poems", href: "/poems" },
    { name: "Authors", href: "/authors" },
    { name: "Feedback", href: "/feedback" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  // Loading state while checking session
  const isLoading = status === "loading"

  // Helper function to get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <LotusLogo />
            <div>
              <h1 className="text-2xl font-bold text-green-800">LOTUS</h1>
              <p className="text-xs text-green-600 italic">Open up like a lotus</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-green-700 hover:text-green-900 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
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
                <Button variant="outline" size="sm" asChild>
                  <Link href="/submit">
                    <PenTool className="w-4 h-4 mr-2" />
                    Submit Poem
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.avatarUrl || undefined}
                          alt={session.user.name}
                        />
                        <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                          {getUserInitials(session.user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium text-green-800">{session.user.name}</div>
                      <div className="text-green-600 text-xs">{session.user.email}</div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer text-orange-600">
                            <Shield className="w-4 h-4 mr-2" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // Not logged in - show login/register buttons
              <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">
                <User className="w-4 h-4 mr-2" />
                Register
              </Link>
            </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-100">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-green-700 hover:text-green-900 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-green-100">
                {isLoading ? (
                  <div className="py-2">
                    <div className="w-full h-8 bg-green-100 rounded animate-pulse" />
                  </div>
                ) : session ? (
                  // Logged in mobile menu
                  <>
                    <div className="px-2 py-2 text-sm border-b border-green-100">
                      <div className="font-medium text-green-800">{session.user.name}</div>
                      <div className="text-green-600 text-xs">{session.user.email}</div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/submit" onClick={() => setIsMenuOpen(false)}>
                        <PenTool className="w-4 h-4 mr-2" />
                        Submit Poem
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
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
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  // Not logged in mobile menu
                  <>
                <Button variant="ghost" size="sm" asChild>
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                </Button>
                <Button size="sm" asChild>
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
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
