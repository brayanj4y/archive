"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Badge } from "@/components/ui/badge"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [policiesOpen, setPoliciesOpen] = useState(false)
  const [adviceOpen, setAdviceOpen] = useState(false)
  const { cart } = useCart()

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-primary">
            <img src="logo-hori.png" alt="Logo" className="h-16" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/puppies" className="text-sm font-medium hover:text-primary">
              Puppies
            </Link>
            <Link href="/financing" className="text-sm font-medium hover:text-primary">
              Financing
            </Link>

            {/* Our Policies Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium hover:text-primary flex items-center gap-1">
                Our Policies
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/policies/warranty" className="block px-4 py-2 text-sm hover:bg-muted">
                  Warranty Policy
                </Link>
                <Link href="/policies/shipping" className="block px-4 py-2 text-sm hover:bg-muted">
                  Shipping Policy
                </Link>
                <Link href="/policies/sales" className="block px-4 py-2 text-sm hover:bg-muted">
                  Sales Policy
                </Link>
              </div>
            </div>

            {/* Advice Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium hover:text-primary flex items-center gap-1">
                Advice
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/advice/the-bulldog" className="block px-4 py-2 text-sm hover:bg-muted">
                  The Bulldog
                </Link>
                <Link href="/advice/fraudulent-breeders" className="block px-4 py-2 text-sm hover:bg-muted">
                  Fraudulent Breeders
                </Link>
                <Link href="/advice/how-to-purchase" className="block px-4 py-2 text-sm hover:bg-muted">
                  How to Purchase
                </Link>
              </div>
            </div>

            <a
              href="https://www.nuvetlabs.com/order_new2/products.asp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary"
            >
              NuVet
            </a>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              Contact Us
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground hover:text-primary" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                  {cart.length}
                </Badge>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                  {cart.length}
                </Badge>
              )}
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link href="/puppies" className="text-sm font-medium hover:text-primary">
                Puppies
              </Link>
              <Link href="/financing" className="text-sm font-medium hover:text-primary">
                Financing
              </Link>

              {/* Mobile Policies Dropdown */}
              <div>
                <button
                  onClick={() => setPoliciesOpen(!policiesOpen)}
                  className="text-sm font-medium hover:text-primary flex items-center gap-1 w-full"
                >
                  Our Policies
                  <ChevronDown className={`h-4 w-4 ${policiesOpen ? "rotate-180" : ""}`} />
                </button>
                {policiesOpen && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    <Link href="/policies/warranty" className="text-sm hover:text-primary">
                      Warranty Policy
                    </Link>
                    <Link href="/policies/shipping" className="text-sm hover:text-primary">
                      Shipping Policy
                    </Link>
                    <Link href="/policies/sales" className="text-sm hover:text-primary">
                      Sales Policy
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Advice Dropdown */}
              <div>
                <button
                  onClick={() => setAdviceOpen(!adviceOpen)}
                  className="text-sm font-medium hover:text-primary flex items-center gap-1 w-full"
                >
                  Advice
                  <ChevronDown className={`h-4 w-4 ${adviceOpen ? "rotate-180" : ""}`} />
                </button>
                {adviceOpen && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    <Link href="/advice/the-bulldog" className="text-sm hover:text-primary">
                      The Bulldog
                    </Link>
                    <Link href="/advice/fraudulent-breeders" className="text-sm hover:text-primary">
                      Fraudulent Breeders
                    </Link>
                    <Link href="/advice/how-to-purchase" className="text-sm hover:text-primary">
                      How to Purchase
                    </Link>
                  </div>
                )}
              </div>

              <a
                href="https://www.nuvetlabs.com/order_new2/products.asp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary"
              >
                NuVet
              </a>
              <Link href="/contact" className="text-sm font-medium hover:text-primary">
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
