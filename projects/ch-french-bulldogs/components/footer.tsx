import Link from "next/link"
import { Phone, Mail, Facebook, Instagram } from "lucide-react"
import Image from "next/image"

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
              <a href="https://wa.me/12104604183" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +1 (210) 460-4183 (WhatsApp)
              </a>
              <a href="https://www.facebook.com/share/176W7Li8Hr/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Facebook
              </a>
            </div>
          </div>

          {/* Partner Badges */}
          <div className="lg:col-span-3 flex flex-wrap justify-center lg:justify-end items-center gap-6">
            <Image
              src="partners/american-kennel.png"
              alt="AKC Registered"
              className="h-20 w-20 object-contain"
              width={80}
              height={80}
            />
            <Image
              src="partners/nuvetlab.png"
              alt="Nuvetlab Partners"
              className="h-20 w-20 object-contain"
              width={80}
              height={80}
            />
            <Image
              src="partners/frenchies.png"
              alt="Frenchies"
              className="h-20 w-20 object-contain"
              width={80}
              height={80}
            />
          </div>
        </div>


        {/* Legal Links */}
        <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-muted-foreground">
          <span>© 2025 Country Home French Bulldogs</span>
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

