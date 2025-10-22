import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HowToPurchasePage() {
  return (
    <main className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">How to Purchase a Puppy</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Follow our simple step-by-step process to bring home your perfect French Bulldog companion from CH French
          Bulldogs.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>The Purchase Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Browse Available Puppies</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Visit our Puppies page to see all currently available French Bulldog puppies. Each listing includes
                    photos, age, gender, color, and pricing information.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/puppies">View Available Puppies</Link>
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Contact Us</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Once you've found a puppy you're interested in, reach out to us via phone, WhatsApp, or our contact
                    form. We'll answer all your questions and provide additional information about the puppy.
                  </p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <a href="tel:+15035551234">Call Us</a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/contact">Contact Form</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Schedule a Visit</h3>
                  <p className="text-sm text-muted-foreground">
                    We encourage you to see your puppy, visit us in person in Dallas, Texas. This helps
                    you get to know your puppy and ensures you're comfortable with your decision.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Place Your Deposit</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    To reserve your puppy, place a $500 deposit. This secures your puppy and is applied to the total
                    purchase price. We accept various payment methods including PayPal, bank transfer, and approved
                    financing.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/financing">View Financing Options</Link>
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  5
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Review and Sign Contract</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    We'll provide you with a purchase contract that outlines all terms, health guarantees, and
                    responsibilities. Review it carefully and ask any questions before signing.
                  </p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/policies/warranty">Warranty Policy</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/policies/sales">Sales Policy</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  6
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Prepare for Your Puppy</h3>
                  <p className="text-sm text-muted-foreground">
                    While waiting for your puppy to be ready (typically 8-12 weeks old), prepare your home with
                    necessary supplies: food, bowls, bed, toys, collar, leash, and schedule a vet appointment.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  7
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Complete Final Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    The remaining balance is due before or at the time of pickup/delivery. We'll coordinate with you on
                    timing and payment method.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  8
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Choose Delivery or Pickup</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Decide whether you'd like to pick up your puppy in Dallas, Texas, or use our travel nanny service
                    ($500 flat fee to most U.S. cities). We'll coordinate all logistics.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/policies/shipping">Shipping Policy</Link>
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  9
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Receive Your Puppy</h3>
                  <p className="text-sm text-muted-foreground">
                    On delivery/pickup day, you'll receive your puppy along with health records, vaccination history,
                    microchip information (if applicable), care instructions, and a puppy care package.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  10
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Veterinary Check-Up</h3>
                  <p className="text-sm text-muted-foreground">
                    Within 72 hours of receiving your puppy, take them to your veterinarian for a health check-up. This
                    is required to maintain your health guarantee.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  11
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Ongoing Support</h3>
                  <p className="text-sm text-muted-foreground">
                    We're here for you! Contact us anytime with questions about care, training, or health. We love
                    receiving updates and photos of our puppies in their new homes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What You'll Receive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">When you purchase a puppy from CH French Bulldogs, you receive:</p>
            <ul className="space-y-2 text-sm">
              <li>• Health certificate from licensed veterinarian</li>
              <li>• Complete vaccination records</li>
              <li>• Deworming records</li>
              <li>• Microchip information (if applicable)</li>
              <li>• AKC registration papers</li>
              <li>• Written health guarantee</li>
              <li>• Purchase contract</li>
              <li>• Care instructions and feeding schedule</li>
              <li>• Puppy care package with food sample and toys</li>
              <li>• Lifetime breeder support</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-1">How long does the process take?</h3>
                <p className="text-sm text-muted-foreground">
                  From initial contact to bringing your puppy home typically takes 2-4 weeks, depending on the puppy's
                  age and your preparation timeline.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">Can I reserve a puppy that's not born yet?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Contact us about upcoming litters and we can place you on our waiting list.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">What if I change my mind?</h3>
                <p className="text-sm text-muted-foreground">
                  Deposits are non-refundable but can be transferred to another available puppy within 6 months. Please
                  review our sales policy for complete details.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">Do you offer financing?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! We work with third-party financing partners to offer flexible payment plans. Visit our financing
                  page for more information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">
            We're excited to help you find your perfect French Bulldog companion!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/puppies">View Available Puppies</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
