import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LOTUS - Poetry Website",
  description: "Open up like a lotus - A beautiful poetry community",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: '#0d0d0d' }}>
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 mb-10">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
