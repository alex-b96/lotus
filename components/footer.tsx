import Link from "next/link"
import { LotusLogo } from "@/components/lotus-logo"

export function Footer() {
  return (
    <footer className="bg-green-800 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center space-x-3">
            <LotusLogo />
            <div>
              <h3 className="text-xl font-bold">LOTUS</h3>
              <p className="text-green-200 text-sm italic">Open up like a lotus</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-green-200">
              <li>
                <Link href="/poems" className="hover:text-white transition-colors">
                  Poems
                </Link>
              </li>
              <li>
                <Link href="/authors" className="hover:text-white transition-colors">
                  Authors
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-white transition-colors">
                  Submit Poem
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-green-200">
              <li>
                <Link href="/feedback" className="hover:text-white transition-colors">
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <p className="text-green-200 text-sm">
              Join our community of poetry lovers and share your creative expressions.
            </p>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
          <p>&copy; 2024 LOTUS Poetry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
