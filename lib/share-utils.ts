export interface ShareData {
  title: string
  text: string
  url: string
}

export interface PoemShareData {
  id: string
  title: string
  author: {
    name: string
  }
}

// Generate share data for a poem
export function generatePoemShareData(poem: PoemShareData): ShareData {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/poems/${poem.id}`
  return {
    title: poem.title,
    text: `Check out "${poem.title}" by ${poem.author.name} on LOTUS Poetry`,
    url
  }
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const success = document.execCommand('copy')
      textArea.remove()
      return success
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

// Generate social media sharing URLs
export function generateSocialUrls(shareData: ShareData) {
  const encodedUrl = encodeURIComponent(shareData.url)
  const encodedText = encodeURIComponent(shareData.text)
  const encodedTitle = encodeURIComponent(shareData.title)

  return {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
  }
}

// Main share function with Web Share API fallback
export async function sharePoem(
  poem: PoemShareData,
  onFallback?: (shareData: ShareData) => void
): Promise<boolean> {
  const shareData = generatePoemShareData(poem)

  // Check if Web Share API is supported and can share the data
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
      return true
    } catch (error: any) {
      // User cancelled the share (AbortError) - this is normal behavior
      if (error.name === 'AbortError') {
        return false
      }
      
      // Other errors - fall back to custom sharing
      console.error('Web Share API failed:', error)
      if (onFallback) {
        onFallback(shareData)
      }
      return false
    }
  } else {
    // Web Share API not supported - use fallback
    if (onFallback) {
      onFallback(shareData)
    }
    return false
  }
}

// Utility to open social sharing in new window
export function openSocialShare(url: string, platform: string) {
  const width = 600
  const height = 400
  const left = (window.innerWidth - width) / 2
  const top = (window.innerHeight - height) / 2
  
  window.open(
    url,
    `share-${platform}`,
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
  )
}