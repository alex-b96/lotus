import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Providers } from "@/components/providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
})
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
  display: "swap", // Improve font loading performance
  preload: true,
})

export const metadata: Metadata = {
  title: "LOTUS - Poetry Website",
  description: "Open up like a lotus - A beautiful poetry community",
  generator: 'v0.dev',
  icons: {
    icon: '/icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${cormorantGaramond.variable}`}>
        <Providers>
          <div className="min-h-screen w-full flex flex-col bg-theme-dark">
            <Header />
            <main className="flex-1 container mx-auto px-4">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
