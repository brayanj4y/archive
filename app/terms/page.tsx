import { Card, CardContent } from "@/components/ui/card"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms of Service",
}

export default function TermsOfServicePage() {
    return (
        <main className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <Card>
                    <CardContent className="prose prose-sm dark:prose-invert pt-6">
                        <p className="text-muted-foreground mb-6">Last updated: October 24, 2025</p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
                            <p>
                                By accessing and using the Country Home French Bulldogs website, you agree to be bound by these Terms of Service.
                                If you do not agree to these terms, please do not use our website or services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Purchase Terms</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>A non-refundable deposit of $500 is required to reserve a puppy</li>
                                <li>Deposits may be transferred to another available puppy within 6 months</li>
                                <li>Full payment must be received within 48 hours of scheduled pickup or delivery</li>
                                <li>Prices are subject to change without notice</li>
                                <li>Health guarantees are provided as specified in our health guarantee agreement</li>
                                <li>Delivery via travel nanny service is available for a flat fee of $500 to most U.S. cities</li>
                                <li>Pickup in Dallas, Texas is available at no additional charge</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Website Usage</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Content is for informational purposes only</li>
                                <li>Photos and descriptions are representative but may vary</li>
                                <li>We reserve the right to modify or discontinue services without notice</li>
                                <li>Users must not misuse or attempt to exploit our website</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Buyer Responsibilities</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide accurate information during purchase</li>
                                <li>Follow recommended care guidelines</li>
                                <li>Maintain regular veterinary care</li>
                                <li>Comply with local laws and regulations regarding pet ownership</li>
                                <li>Provide a suitable home environment</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
                            <p>
                                Country Home French Bulldogs shall not be liable for any indirect, incidental, special, consequential, or punitive
                                damages resulting from the use or inability to use our services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
                            <p>Any disputes arising from these terms or our services shall be resolved through:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Direct negotiation between parties</li>
                                <li>Mediation if necessary</li>
                                <li>Binding arbitration as a last resort</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                            <p>
                                For questions about these Terms of Service, please contact us via WhatsApp:{" "}
                                <a href="https://wa.me/12104604183" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    +1 (210) 460-4183
                                </a>
                            </p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

