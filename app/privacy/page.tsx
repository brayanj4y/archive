import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
    return (
        <main className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <Card>
                    <CardContent className="prose prose-sm dark:prose-invert pt-6">
                        <p className="text-muted-foreground mb-6">Last updated: October 24, 2025</p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                            <p>
                                CH French Bulldogs ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                                explains how we collect, use, and safeguard your information when you visit our website and make purchases.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    Personal information (name, email address, phone number, shipping address) when you make a purchase or
                                    contact us
                                </li>
                                <li>Payment information (processed securely through our payment providers)</li>
                                <li>Communication preferences and history</li>
                                <li>Device and browser information</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Process and fulfill your orders</li>
                                <li>Communicate with you about your purchase</li>
                                <li>Send you important updates about our services</li>
                                <li>Improve our website and customer service</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                            <p>
                                We do not sell or rent your personal information to third parties. We may share your information with:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Service providers who assist in our operations</li>
                                <li>Professional advisers and legal authorities when required by law</li>
                                <li>Business partners with your consent</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access your personal information</li>
                                <li>Correct inaccurate information</li>
                                <li>Request deletion of your information</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                            <p>
                                If you have questions about this Privacy Policy, please contact us at:{" "}
                                <a href="mailto:info@chfrenchbulldogs.com" className="text-primary hover:underline">
                                    info@chfrenchbulldogs.com
                                </a>
                            </p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
