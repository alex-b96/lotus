import type React from "react"
import type { Metadata } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant-garamond"
})

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
