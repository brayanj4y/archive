"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { cart } = useCart()
  const router = useRouter()

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu)
  }

  const handleNavigate = (href: string) => {
    setMenuOpen(false)
    router.push(href)
  }

  return (
    <nav className="bg-white border-b border-border fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <img src="/logo-hori.png" alt="Logo" className="h-14" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/puppies">Puppies</NavLink>
            <NavLink href="/financing">Financing</NavLink>

            <Dropdown title="Our Policies">
              <DropdownLink href="/policies/sales">Sales Policy</DropdownLink>
              <DropdownLink href="/policies/shipping">Shipping Policy</DropdownLink>
              <DropdownLink href="/policies/warranty">Warranty Policy</DropdownLink>
              <DropdownLink href="/privacy">Privacy Policy</DropdownLink>
              <DropdownLink href="/terms">Terms of Service</DropdownLink>
              <DropdownLink href="/refund">Refund Policy</DropdownLink>
            </Dropdown>

            <Dropdown title="Advice">
              <DropdownLink href="/advice/the-bulldog">The Bulldog</DropdownLink>
              <DropdownLink href="/advice/fraudulent-breeders">Fraudulent Breeders</DropdownLink>
              <DropdownLink href="/advice/how-to-purchase">How to Purchase</DropdownLink>
            </Dropdown>

            <a
              href="https://www.nuvetlabs.com/order_new2/products.asp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary"
            >
              NuVet
            </a>
            <NavLink href="/contact">Contact Us</NavLink>

            <CartIcon count={cart.length} />
          </div>

          <div className="md:hidden flex items-center gap-4">
            <CartIcon count={cart.length} />
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-foreground">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg transition-all duration-300 ease-in-out ${menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
      >
        <div className="px-6 py-4 flex flex-col gap-3 text-base font-medium">
          <MobileButton onClick={() => handleNavigate("/puppies")}>Puppies</MobileButton>
          <MobileButton onClick={() => handleNavigate("/financing")}>Financing</MobileButton>

          <div>
            <MobileDropdown
              title="Our Policies"
              isOpen={openDropdown === "policies"}
              onToggle={() => toggleDropdown("policies")}
            >
              <MobileSubLink onClick={() => handleNavigate("/policies/sales")}>Sales Policy</MobileSubLink>
              <MobileSubLink onClick={() => handleNavigate("/policies/shipping")}>Shipping Policy</MobileSubLink>
              <MobileSubLink onClick={() => handleNavigate("/policies/warranty")}>Warranty Policy</MobileSubLink>
              <MobileSubLink onClick={() => handleNavigate("/privacy")}>Privacy Policy</MobileSubLink>
              <MobileSubLink onClick={() => handleNavigate("/terms")}>Terms of Service</MobileSubLink>
              <MobileSubLink onClick={() => handleNavigate("/refund")}>Refund Policy</MobileSubLink>
            </MobileDropdown>

            <MobileDropdown title="Advice" isOpen={openDropdown === "advice"} onToggle={() => toggleDropdown("advice")}>
              <MobileSubLink onClick={() => handleNavigate("/advice/the-bulldog")}>The Bulldog</MobileSubLink>
              <MobileSubLink onClick={() => handleNavigate("/advice/fraudulent-breeders")}>
                Fraudulent Breeders
              </MobileSubLink>
              <MobileSubLink onClick={() => handleNavigate("/advice/how-to-purchase")}>How to Purchase</MobileSubLink>
            </MobileDropdown>
          </div>

          <a
            href="https://www.nuvetlabs.com/order_new2/products.asp"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            NuVet
          </a>
          <MobileButton onClick={() => handleNavigate("/contact")}>Contact Us</MobileButton>
        </div>
      </div>
    </nav>
  )
}

const NavLink = ({ href, children }: any) => (
  <Link href={href} className="text-sm font-medium hover:text-primary transition-colors">
    {children}
  </Link>
)

const Dropdown = ({ title, children }: any) => (
  <div className="relative group">
    <button className="text-sm font-medium hover:text-primary flex items-center gap-1">
      {title} <ChevronDown className="h-4 w-4" />
    </button>
    <div className="absolute left-0 mt-1 w-48 bg-white border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
      {children}
    </div>
  </div>
)

const DropdownLink = ({ href, children }: any) => (
  <Link href={href} className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary">
    {children}
  </Link>
)

const MobileDropdown = ({ title, isOpen, onToggle, children }: any) => (
  <div>
    <button onClick={onToggle} className="w-full flex justify-between items-center py-2 text-base hover:text-primary">
      {title} <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ml-3 ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
    >
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  </div>
)

const MobileButton = ({ onClick, children }: any) => (
  <button onClick={onClick} className="w-full text-left py-2 text-base hover:text-primary transition-colors">
    {children}
  </button>
)

const MobileSubLink = ({ onClick, children }: any) => (
  <button onClick={onClick} className="w-full text-left py-2 text-sm text-gray-600 hover:text-primary">
    {children}
  </button>
)

const CartIcon = ({ count }: { count: number }) => (
  <Link href="/cart" className="relative">
    <ShoppingCart className="h-5 w-5 text-foreground hover:text-primary" />
    {count > 0 && (
      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
        {count}
      </Badge>
    )}
  </Link>
)
