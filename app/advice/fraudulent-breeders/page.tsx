import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield, CheckCircle, XCircle } from "lucide-react"

export default function FraudulentBreedersPage() {
  return (
    <main className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Avoiding Fraudulent Breeders</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Protect yourself and ensure you're getting a healthy, ethically bred French Bulldog by learning to identify
          red flags and verify breeder legitimacy.
        </p>

        <div className="bg-red-50 border border-red-200 p-6 flex gap-3 mb-8">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold mb-2 text-red-900">Warning: Puppy Scams Are Common</h3>
            <p className="text-sm text-red-800">
              Unfortunately, puppy scams are increasingly common, especially online. Fraudulent breeders and scammers
              prey on people's emotions and desire for a puppy. Always verify before sending money.
            </p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Red Flags to Watch For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Be cautious if a breeder exhibits any of these warning signs:</p>
            <ul className="space-y-3">
              <li>
                <h3 className="font-bold mb-1 text-red-600">Prices Too Good to Be True</h3>
                <p className="text-sm text-muted-foreground">
                  French Bulldogs are expensive to breed. Extremely low prices often indicate scams or puppy mills.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1 text-red-600">Pressure to Pay Immediately</h3>
                <p className="text-sm text-muted-foreground">
                  Scammers create urgency. Legitimate breeders give you time to make informed decisions.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1 text-red-600">No Health Records or Guarantees</h3>
                <p className="text-sm text-muted-foreground">
                  Responsible breeders provide complete health records and written guarantees.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1 text-red-600">Multiple Breeds Always Available</h3>
                <p className="text-sm text-muted-foreground">
                  Puppy mills often have many breeds available at all times. Reputable breeders specialize.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1 text-red-600">Won't Provide References</h3>
                <p className="text-sm text-muted-foreground">
                  Legitimate breeders are happy to provide references from previous buyers and veterinarians.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1 text-red-600">Poor Communication or Grammar</h3>
                <p className="text-sm text-muted-foreground">
                  Many scams originate overseas. Watch for poor English or inconsistent information.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Signs of a Reputable Breeder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Look for these positive indicators when choosing a breeder:</p>
            <ul className="space-y-3">
              <li>
                <h3 className="font-bold mb-1 text-green-600">Provides Complete Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Offers health records, vaccination history, pedigree information, and written contracts.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1 text-green-600">Asks YOU Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Responsible breeders screen buyers to ensure puppies go to good homes.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1 text-green-600">Offers Health Guarantees</h3>
                <p className="text-sm text-muted-foreground">
                  Provides written health guarantees and stands behind their puppies.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1 text-green-600">Maintains Ongoing Relationship</h3>
                <p className="text-sm text-muted-foreground">
                  Offers support after purchase and wants updates on the puppy's progress.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1 text-green-600">Has Verifiable Presence</h3>
                <p className="text-sm text-muted-foreground">
                  Established business with reviews, social media presence, and verifiable location.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              How to Verify a Breeder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Take these steps to verify breeder legitimacy:</p>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <h3 className="font-bold mb-1">Check Online Reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    Search for reviews on Google, Facebook, and breed-specific forums.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <h3 className="font-bold mb-1">Verify Business Registration</h3>
                  <p className="text-sm text-muted-foreground">
                    Check if they're registered with the Better Business Bureau or local authorities.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <h3 className="font-bold mb-1">Ask for References</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact previous buyers and their veterinarians for feedback.
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why Choose CH French Bulldogs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We're committed to transparency and ethical breeding practices:</p>
            <ul className="space-y-2 text-sm">
              <li>• Over 15 years of breeding experience since 2008</li>
              <li>• Verifiable location in Dallas, Texas</li>
              <li>• Comprehensive health guarantees and documentation</li>
              <li>• Positive reviews from satisfied customers</li>
              <li>• Ongoing support after purchase</li>
              <li>• Transparent pricing and payment options</li>
              <li>• AKC registered and USDA licensed</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
