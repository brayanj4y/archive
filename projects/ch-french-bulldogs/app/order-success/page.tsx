"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import Link from "next/link"
import { Suspense } from "react"
import Image from "next/image"

function OrderSuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId") || "N/A"

    return (
        <main className="py-8 md:py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-6 md:mb-8">
                    <div className="mb-4 md:mb-6 flex justify-center">
                        <Image
                            src="/thanks.png"
                            alt="Thank You"
                            className="h-48 w-90 md:h-55 md:w-100"
                            width={900}
                            height={400}
                        />
                    </div>
                    <p className="text-base md:text-lg text-muted-foreground px-4">
                        Your order has been successfully placed and confirmation emails have been sent.
                    </p>
                </div>

                <Card className="mb-6 md:mb-8">
                    <CardHeader>
                        <CardTitle className="text-lg md:text-xl">Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-b border-dashed pb-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                                <span className="text-sm md:text-base text-muted-foreground">Order ID:</span>
                                <span className="font-mono font-bold text-sm md:text-base break-all">{orderId}</span>
                            </div>
                        </div>
                        <div className="border-b border-dashed pb-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                                <span className="text-sm md:text-base text-muted-foreground">Order Date:</span>
                                <span className="font-medium text-sm md:text-base">
                                    {new Date().toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="pt-2">
                            <h3 className="font-semibold mb-3 text-base md:text-lg">What's Next?</h3>
                            <ul className="space-y-2 text-sm md:text-base text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                                    <span>You'll receive a confirmation email with your order details</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                                    <span>Our team will review your order and contact you within 24 hours</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                                    <span>We'll arrange payment and delivery details with you directly</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                                    <span>Your puppy will be prepared for their journey to their new home!</span>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6 md:mb-8">
                    <CardHeader>
                        <CardTitle className="text-lg md:text-xl">Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm md:text-base text-muted-foreground mb-4">
                            If you have any questions about your order, feel free to reach out to us:
                        </p>
                        <div className="flex justify-center">
                            <a
                                href="https://wa.me/12104604183"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-4 border rounded-lg hover:bg-accent transition-colors w-full sm:w-auto"
                            >
                                <WhatsAppIcon className="h-6 w-6 text-primary flex-shrink-0" />
                                <div className="text-left">
                                    <div className="text-xs text-muted-foreground">Support via WhatsApp</div>
                                    <div className="text-sm font-medium">+1 (210) 460-4183</div>
                                </div>
                            </a>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                        <Link href="/puppies">Browse More Puppies</Link>
                    </Button>
                    <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link href="/">Return to Home</Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}

export default function OrderSuccessPage() {
    return (
        <Suspense
            fallback={
                <main className="py-16 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <p>Loading...</p>
                    </div>
                </main>
            }
        >
            <OrderSuccessContent />
        </Suspense>
    )
}
