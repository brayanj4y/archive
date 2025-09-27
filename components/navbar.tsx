"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, Mountain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || pathname !== "/" ? "bg-background/80 backdrop-blur-md py-3 shadow-sm" : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <Mountain className="h-5 w-5 text-primary" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">DevStudio</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm ${isActive("/") ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-sm ${isActive("/about") ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}
          >
            About
          </Link>
          <Link
            href="/services"
            className={`text-sm ${isActive("/services") ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}
          >
            Services
          </Link>
          <Link
            href="/work"
            className={`text-sm ${isActive("/work") ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}
          >
            Work
          </Link>
          <Link
            href="/contact"
            className={`text-sm ${isActive("/contact") ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}
          >
            Contact
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-2"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-4 md:hidden"
            >
              <Link
                href="/"
                className={`text-sm py-2 ${isActive("/") ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`text-sm py-2 ${isActive("/about") ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/services"
                className={`text-sm py-2 ${isActive("/services") ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/work"
                className={`text-sm py-2 ${isActive("/work") ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Work
              </Link>
              <Link
                href="/contact"
                className={`text-sm py-2 ${isActive("/contact") ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
