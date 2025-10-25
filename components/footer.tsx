import Link from "next/link"
import { Phone, Mail, Facebook, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Top Section: Contact + Partner Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-xl mb-4">Contact Us</h3>
            <div className="flex flex-col gap-2 text-sm">
              <a href="tel:+15035551234" className="hover:text-primary">
                (503) 555-1234
              </a>
              <a href="mailto:info@chfrenchbulldogs.com" className="hover:text-primary">
                info@chfrenchbulldogs.com
              </a>
            </div>
          </div>

          {/* Partner Badges */}
          <div className="lg:col-span-3 flex flex-wrap justify-center lg:justify-end items-center gap-6">
            <img src="partners/american-kennel.png" alt="AKC Registered" className="h-20 w-20 object-contain" />
            <img src="partners/nuvetlab.png" alt="Nuvetlab Partners" className="h-20 w-20 object-contain" />
            <img src="partners/frenchies.png" alt="Frenchies" className="h-20 w-20 object-contain" />
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-8 pb-8 border-b border-border">
          <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
            <Instagram className="h-6 w-6" />
          </a>
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-muted-foreground">
          <span>© 2025 CH French Bulldogs</span>
          <span className="hidden sm:inline">•</span>
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          <span className="hidden sm:inline">•</span>
          <Link href="/refund" className="hover:text-primary">Refund Policy</Link>
          <span className="hidden sm:inline">•</span>
          <Link href="/policies/shipping" className="hover:text-primary">Shipping Policy</Link>
          <span className="hidden sm:inline">•</span>
          <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          <span className="hidden sm:inline">•</span>
          <Link href="/contact" className="hover:text-primary">Contact Information</Link>
        </div>

      </div>
    </footer>
  )
}
