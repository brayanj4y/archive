import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy - ShipTrack Pro",
    description: "Privacy policy for ShipTrack Pro shipping and logistics services.",
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header currentPath="/privacy" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Legal</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                    <p className="text-lg text-slate-600">Last updated: January 2025</p>
                </div>

                <Card className="border-slate-200">
                    <CardContent className="p-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                We collect information that you provide directly to us when using our shipping services, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                <li>Personal identification information (name, email address, phone number)</li>
                                <li>Shipping addresses (pickup and delivery locations)</li>
                                <li>Payment information (processed securely through our payment partners)</li>
                                <li>Package details and tracking information</li>
                                <li>Communication preferences and customer service interactions</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">We use the information we collect to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                <li>Process and fulfill your shipping requests</li>
                                <li>Provide real-time tracking and delivery notifications</li>
                                <li>Communicate with you about your shipments and our services</li>
                                <li>Process payments and prevent fraudulent transactions</li>
                                <li>Improve our services and customer experience</li>
                                <li>Comply with legal obligations and resolve disputes</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Information Sharing</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                We do not sell your personal information. We may share your information with:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                <li>Service providers who assist in delivering our services (carriers, payment processors)</li>
                                <li>Law enforcement or regulatory authorities when required by law</li>
                                <li>Business partners with your explicit consent</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
                            <p className="text-slate-600 leading-relaxed">
                                We implement industry-standard security measures to protect your personal information from unauthorized
                                access, disclosure, alteration, or destruction. This includes encryption, secure servers, and regular
                                security audits.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Your Rights</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                <li>Access and review your personal information</li>
                                <li>Request corrections to inaccurate information</li>
                                <li>Request deletion of your personal information</li>
                                <li>Opt-out of marketing communications</li>
                                <li>Lodge a complaint with a supervisory authority</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cookies and Tracking</h2>
                            <p className="text-slate-600 leading-relaxed">
                                We use cookies and similar tracking technologies to improve your experience on our website, analyze
                                usage patterns, and deliver personalized content. You can control cookie preferences through your
                                browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Children's Privacy</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Our services are not directed to children under 13 years of age. We do not knowingly collect personal
                                information from children under 13.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Changes to This Policy</h2>
                            <p className="text-slate-600 leading-relaxed">
                                We may update this privacy policy from time to time. We will notify you of any material changes by
                                posting the new policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact Us</h2>
                            <p className="text-slate-600 leading-relaxed">
                                If you have questions about this privacy policy or our data practices, please contact us at:
                            </p>
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-slate-700 font-medium">ShipTrack Pro Privacy Team</p>
                                <p className="text-slate-600">Email: privacy@shiptrackpro.com</p>
                                <p className="text-slate-600">Phone: 1-800-SHIPTRACK</p>
                            </div>
                        </section>
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    )
}
