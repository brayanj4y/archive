import { Card, CardContent } from "@/components/ui/card"

export default function RefundPolicyPage() {
    return (
        <main className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
                <Card>
                    <CardContent className="prose prose-sm dark:prose-invert pt-6">
                        <p className="text-muted-foreground mb-6">Last updated: October 24, 2025</p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Deposit Policy</h2>
                            <p>
                                To reserve a French Bulldog puppy, we require a non-refundable deposit of $500. This deposit is applied
                                to the final purchase price of your puppy and indicates your serious commitment to providing a loving home
                                for one of our puppies.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Health Guarantee</h2>
                            <p>
                                All our puppies come with a comprehensive health guarantee. If your puppy is diagnosed with a
                                life-threatening congenital defect within the first year:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>We will replace your puppy with another of equal value</li>
                                <li>Or provide a refund of up to 50% of the purchase price for veterinary care</li>
                                <li>
                                    The health guarantee is valid only if you maintain regular veterinary care and follow our recommended
                                    care guidelines
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Refund Conditions</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Deposits are non-refundable except in specific circumstances</li>
                                <li>Full refunds are only provided if the puppy is found to have a serious health issue before delivery</li>
                                <li>
                                    No refunds will be given for color changes, size variations, or other normal developmental characteristics
                                </li>
                                <li>Behavioral issues are not covered under our refund policy</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
                            <p>To request a refund under our health guarantee:</p>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>Contact us immediately upon discovering any health issues</li>
                                <li>Provide documentation from a licensed veterinarian</li>
                                <li>Submit all required paperwork within 48 hours of diagnosis</li>
                                <li>Allow our veterinarian to examine the puppy if requested</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                            <p>
                                If you have questions about our refund policy, please contact us at:{" "}
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
