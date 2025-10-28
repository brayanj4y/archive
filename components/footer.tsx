import { Package } from "lucide-react"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <Package className="h-8 w-8 text-blue-400" />
                            <div>
                                <span className="text-xl font-bold">ShipTrack Pro</span>
                                <div className="text-sm text-slate-400">Professional Logistics</div>
                            </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed max-w-md">
                            Professional shipping solutions for all your logistics needs. Trusted by thousands of customers worldwide.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Services</h4>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="hover:text-white transition-colors cursor-pointer">Express Shipping</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Fragile Items</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Pet Transportation</li>
                            <li className="hover:text-white transition-colors cursor-pointer">International</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li>
                                <Link href="/track" className="hover:text-white transition-colors">
                                    Track Package
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-white transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/reviews" className="hover:text-white transition-colors">
                                    Reviews
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p className="text-slate-400">&copy; 2025 ShipTrack Pro. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0 text-slate-400">
                        <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
