"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Copy, MessageCircle, Mail, Share2 } from "lucide-react"
import { ShareData, generateSocialUrls, copyToClipboard, openSocialShare } from "@/lib/share-utils"
import { useToast } from "@/hooks/use-toast"

interface ShareModalProps {
  shareData: ShareData
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ shareData, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const socialUrls = generateSocialUrls(shareData)

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareData.url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Link copiat!",
        description: "Link-ul poeziei a fost copiat în clipboard.",
      })
    } else {
      toast({
        title: "Eroare",
        description: "Nu s-a putut copia link-ul. Încearcă din nou.",
        variant: "destructive",
      })
    }
  }

  const handleSocialShare = (url: string, platform: string) => {
    openSocialShare(url, platform)
  }

  const socialPlatforms = [
    {
      name: "WhatsApp",
      url: socialUrls.whatsapp,
      icon: "💬",
      color: "bg-green-600 hover:bg-green-700",
      textColor: "text-white"
    },
    {
      name: "Facebook",
      url: socialUrls.facebook,
      icon: "📘",
      color: "bg-blue-600 hover:bg-blue-700", 
      textColor: "text-white"
    },
    {
      name: "Twitter",
      url: socialUrls.twitter,
      icon: "🐦",
      color: "bg-sky-500 hover:bg-sky-600",
      textColor: "text-white"
    },
    {
      name: "Email",
      url: socialUrls.email,
      icon: "📧",
      color: "bg-gray-600 hover:bg-gray-700",
      textColor: "text-white"
    },
    {
      name: "Telegram",
      url: socialUrls.telegram,
      icon: "✈️",
      color: "bg-blue-500 hover:bg-blue-600",
      textColor: "text-white"
    },
    {
      name: "LinkedIn",
      url: socialUrls.linkedin,
      icon: "💼",
      color: "bg-blue-700 hover:bg-blue-800",
      textColor: "text-white"
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-md border border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-light text-theme-primary">
            <Share2 className="h-5 w-5 text-pink-300" />
            Distribuie Poezia
          </DialogTitle>
          <DialogDescription className="font-light text-theme-secondary">
            Alege platforma pentru a distribui această poezie
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Poem Info */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <h4 className="font-medium text-sm mb-1 text-theme-primary">
              {shareData.title}
            </h4>
            <p className="text-xs text-theme-secondary">
              {shareData.text}
            </p>
          </div>

          {/* Copy Link Button */}
          <Button
            onClick={handleCopyLink}
            className="w-full bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all font-light"
            variant="outline"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-400" />
                Link Copiat!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiază Link-ul
              </>
            )}
          </Button>

          {/* Social Platform Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {socialPlatforms.map((platform) => (
              <Button
                key={platform.name}
                onClick={() => handleSocialShare(platform.url, platform.name.toLowerCase())}
                className={`${platform.color} ${platform.textColor} border-0 font-light justify-start`}
                variant="outline"
              >
                <span className="mr-2 text-lg">{platform.icon}</span>
                {platform.name}
              </Button>
            ))}
          </div>

          {/* URL Preview */}
          <div className="bg-white/5 rounded p-2 border border-white/10">
            <p className="text-xs font-mono break-all text-theme-secondary">
              {shareData.url}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}