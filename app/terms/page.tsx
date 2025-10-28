import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms of Service - ShipTrack Pro",
    description: "Terms of service for ShipTrack Pro shipping and logistics services.",
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header currentPath="/terms" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Legal</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Terms of Service</h1>
                    <p className="text-lg text-slate-600">Last updated: January 2025</p>
                </div>

                <Card className="border-slate-200">
                    <CardContent className="p-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-slate-600 leading-relaxed">
                                By accessing or using ShipTrack Pro's services, you agree to be bound by these Terms of Service and all
                                applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from
                                using our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Service Description</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                ShipTrack Pro provides shipping and logistics services including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                <li>Express and standard shipping services</li>
                                <li>Specialized handling for fragile and valuable items</li>
                                <li>Pet transportation services</li>
                                <li>International shipping and customs support</li>
                                <li>Real-time package tracking</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Responsibilities</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">When using our services, you agree to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                <li>Provide accurate and complete shipping information</li>
                                <li>Properly package items according to our guidelines</li>
                                <li>Comply with all applicable shipping regulations and restrictions</li>
                                <li>Pay all fees and charges associated with your shipments</li>
                                <li>Not ship prohibited or restricted items</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Prohibited Items</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">The following items are prohibited from shipment:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                <li>Hazardous materials and explosives</li>
                                <li>Illegal drugs and controlled substances</li>
                                <li>Weapons and ammunition (unless properly licensed)</li>
                                <li>Perishable items without proper packaging</li>
                                <li>Items that violate intellectual property rights</li>
                                <li>Any items prohibited by local, national, or international law</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Pricing and Payment</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Shipping costs are calculated based on package weight, dimensions, destination, and service type. You
                                agree to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                <li>Pay all charges at the time of shipping or as agreed for business accounts</li>
                                <li>Accept that prices may change without prior notice</li>
                                <li>Pay any additional fees for special services or address corrections</li>
                                <li>Be responsible for customs duties and taxes on international shipments</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Liability and Insurance</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Our liability for loss or damage is limited as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                <li>Basic coverage is included with all shipments up to declared value</li>
                                <li>Additional insurance is available for high-value items</li>
                                <li>Claims must be filed within 30 days of delivery or expected delivery date</li>
                                <li>We are not liable for delays caused by circumstances beyond our control</li>
                                <li>Pet transportation includes specialized insurance as outlined in service terms</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Delivery Terms</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Delivery timeframes are estimates and not guaranteed unless specifically stated. We will make reasonable
                                efforts to deliver within the estimated timeframe. Delays may occur due to weather, customs clearance,
                                or other factors beyond our control.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Claims and Disputes</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                For claims regarding lost, damaged, or delayed shipments:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-600">
                                <li>Contact our customer service within 30 days</li>
                                <li>Provide tracking number and supporting documentation</li>
                                <li>Allow reasonable time for investigation</li>
                                <li>Accept our determination or pursue arbitration as outlined below</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Limitation of Liability</h2>
                            <p className="text-slate-600 leading-relaxed">
                                To the maximum extent permitted by law, ShipTrack Pro shall not be liable for any indirect, incidental,
                                special, consequential, or punitive damages resulting from your use of our services. Our total liability
                                shall not exceed the amount paid for the specific shipment in question.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Modifications to Terms</h2>
                            <p className="text-slate-600 leading-relaxed">
                                We reserve the right to modify these terms at any time. Changes will be effective immediately upon
                                posting to our website. Your continued use of our services after changes constitutes acceptance of the
                                modified terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Governing Law</h2>
                            <p className="text-slate-600 leading-relaxed">
                                These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
                                ShipTrack Pro operates, without regard to conflict of law provisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Information</h2>
                            <p className="text-slate-600 leading-relaxed">For questions about these terms, please contact us:</p>
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-slate-700 font-medium">ShipTrack Pro Legal Department</p>
                                <p className="text-slate-600">Email: legal@shiptrackpro.com</p>
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
