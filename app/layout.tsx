import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Providers } from "@/components/providers"
import Script from "next/script"
import { GTMRouteListener } from "@/components/gtm-route-listener"

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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-54B8VGKJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d, s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-54B8VGKJ');`}
        </Script>
        {/* End Google Tag Manager */}
        <Providers>
          <div className="min-h-screen w-full flex flex-col bg-theme-dark">
            <Header />
            <main className="flex-1 container mx-auto px-4">{children}</main>
            <Footer />
          </div>
        </Providers>
        {/* Push page_view events on client-side route changes */}
        <GTMRouteListener />
      </body>
    </html>
  )
}
