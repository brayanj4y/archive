"use client"

import { Package, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

interface HeaderProps {
    currentPath?: string
}

export default function Header({ currentPath = "/" }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = [
        { href: "/", label: "Home" },
        { href: "/track", label: "Track Package" },
        { href: "/contact", label: "Contact" },
        { href: "/reviews", label: "Reviews" },
        { href: "/faq", label: "FAQ" },
    ]

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3">
                        <Package className="h-8 w-8 text-blue-600" />
                        <div>
                            <span className="text-xl font-bold text-slate-900">ShipTrack Pro</span>
                            <div className="text-xs text-slate-500">Professional Logistics</div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${currentPath === item.href ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Link href="/track">Track Package</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-200">
                        <nav className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPath === item.href ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
