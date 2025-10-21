import Link from "next/link"
import { Phone, Mail, Facebook, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <div className="flex flex-col gap-2">
              <a href="tel:+15035551234" className="flex items-center gap-2 text-sm hover:text-primary">
                <Phone className="h-4 w-4" />
                (503) 555-1234
              </a>
              <a href="mailto:info@chfrenchbulldogs.com" className="flex items-center gap-2 text-sm hover:text-primary">
                <Mail className="h-4 w-4" />
                info@chfrenchbulldogs.com
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Location</h3>
            <p className="text-sm">Dallas, Texas</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 pb-8 border-b border-border">
          <img src="partners/american-kennel.png" alt="AKC Registered" className="h-26" />
          <img src="partners/trupanion.avif" alt="Trupanion Partners" className="h-26" />
          <img src="partners/nuvetlab.png" alt="Nuvetlab Partners" className="h-26" />
          <img src="partners/frenchies.webp" alt="Frenchies" className="h-26" />
        </div>



        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <span>© 2025 CH French Bulldogs</span>
          <Link href="/privacy" className="hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/refund" className="hover:text-primary">
            Refund Policy
          </Link>
          <Link href="/policies/shipping" className="hover:text-primary">
            Shipping Policy
          </Link>
          <Link href="/terms" className="hover:text-primary">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact Information
          </Link>
        </div>
      </div>
    </footer>
  )
}
