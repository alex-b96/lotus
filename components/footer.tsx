import Link from "next/link"
import { LotusLogo } from "@/components/lotus-logo"

export function Footer() {
  return (
    <footer className="backdrop-blur-md border-t border-white/5 text-theme-primary bg-theme-dark-alpha">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex items-center space-x-3">
            <LotusLogo />
            {/* <div>
              <h3 className="text-xl font-light text-theme-primary">LOTUS</h3>
              <p className="text-sm italic tracking-wide text-theme-secondary">Open up like a lotus</p>
            </div> */}
          </div>

          <div>
            <h4 className="font-light mb-6 tracking-wide uppercase text-sm text-theme-primary">Explore</h4>
            <ul className="space-y-3 text-theme-secondary">
              <li>
                <Link href="/poems" className="transition-colors font-light hover:text-white text-theme-secondary">
                  Poems
                </Link>
              </li>
              <li>
                <Link href="/authors" className="transition-colors font-light hover:text-white text-theme-secondary">
                  Authors
                </Link>
              </li>
              <li>
                <Link href="/submit" className="transition-colors font-light hover:text-white text-theme-secondary">
                  Submit Poem
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-light mb-6 tracking-wide uppercase text-sm text-theme-primary">Community</h4>
            <ul className="space-y-3 text-theme-secondary">
              <li>
                <Link href="/feedback" className="transition-colors font-light hover:text-white text-theme-secondary">
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors font-light hover:text-white text-theme-secondary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors font-light hover:text-white text-theme-secondary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-light mb-6 tracking-wide uppercase text-sm text-theme-primary">Connect</h4>
            <p className="text-sm font-light leading-relaxed text-theme-secondary">
              Join our community of poetry lovers and share your creative expressions.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-theme-secondary">
          <p className="font-light text-sm">&copy; 2024 LOTUS Poetry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
