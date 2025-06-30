import Link from "next/link"
import { LotusLogo } from "@/components/lotus-logo"

export function Footer() {
  return (
    <footer className="backdrop-blur-md border-t border-white/5 mt-20" style={{ backgroundColor: 'rgba(13, 13, 13, 0.4)', color: '#e2e2e2' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex items-center space-x-3">
            <LotusLogo />
            {/* <div>
              <h3 className="text-xl font-light" style={{ color: '#e2e2e2' }}>LOTUS</h3>
              <p className="text-sm italic tracking-wide" style={{ color: '#9b9b9b' }}>Open up like a lotus</p>
            </div> */}
          </div>

          <div>
            <h4 className="font-light mb-6 tracking-wide uppercase text-sm" style={{ color: '#e2e2e2' }}>Explore</h4>
            <ul className="space-y-3" style={{ color: '#9b9b9b' }}>
              <li>
                <Link href="/poems" className="transition-colors font-light hover:text-white" style={{ color: '#9b9b9b' }}>
                  Poems
                </Link>
              </li>
              <li>
                <Link href="/authors" className="transition-colors font-light hover:text-white" style={{ color: '#9b9b9b' }}>
                  Authors
                </Link>
              </li>
              <li>
                <Link href="/submit" className="transition-colors font-light hover:text-white" style={{ color: '#9b9b9b' }}>
                  Submit Poem
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-light mb-6 tracking-wide uppercase text-sm" style={{ color: '#e2e2e2' }}>Community</h4>
            <ul className="space-y-3" style={{ color: '#9b9b9b' }}>
              <li>
                <Link href="/feedback" className="transition-colors font-light hover:text-white" style={{ color: '#9b9b9b' }}>
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors font-light hover:text-white" style={{ color: '#9b9b9b' }}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors font-light hover:text-white" style={{ color: '#9b9b9b' }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-light mb-6 tracking-wide uppercase text-sm" style={{ color: '#e2e2e2' }}>Connect</h4>
            <p className="text-sm font-light leading-relaxed" style={{ color: '#9b9b9b' }}>
              Join our community of poetry lovers and share your creative expressions.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center" style={{ color: '#9b9b9b' }}>
          <p className="font-light text-sm">&copy; 2024 LOTUS Poetry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
