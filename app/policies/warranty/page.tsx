import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function WarrantyPage() {
  return (
    <main className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Warranty Policy</h1>
        <p className="text-lg text-muted-foreground mb-12">
          We stand behind the health and quality of our French Bulldog puppies with a comprehensive warranty commitment.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Health Guarantee Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              All puppies come with a 1-year health guarantee against genetic defects and congenital conditions. This
              warranty covers:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Congenital heart defects</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Liver shunt</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Severe hip dysplasia</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Other life-threatening genetic conditions</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Warranty Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">To maintain warranty coverage, the following conditions must be met:</p>
            <ul className="space-y-3">
              <li>
                <h3 className="font-bold mb-1">Veterinary Examination</h3>
                <p className="text-sm text-muted-foreground">
                  Puppy must be examined by a licensed veterinarian within 72 hours of delivery or pickup.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Proper Care</h3>
                <p className="text-sm text-muted-foreground">
                  Puppy must receive proper nutrition, housing, and veterinary care as recommended.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Vaccination Schedule</h3>
                <p className="text-sm text-muted-foreground">
                  All recommended vaccinations must be administered on schedule.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Keep all veterinary records and provide them if a warranty claim is filed.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's NOT Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The warranty does not cover:</p>
            <ul className="space-y-2 text-sm">
              <li>• Injuries or illnesses resulting from accidents, abuse, or neglect</li>
              <li>• Parasites (worms, fleas, etc.) - treatable conditions</li>
              <li>• Viral infections contracted after delivery</li>
              <li>• Conditions resulting from improper diet or care</li>
              <li>• Normal breed characteristics (underbite, elongated soft palate, etc.)</li>
              <li>• Cosmetic issues that don't affect health</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filing a Warranty Claim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">If you believe your puppy has a covered genetic condition:</p>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <p className="text-sm">Contact us immediately with details of the condition</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <p className="text-sm">Obtain a written diagnosis from a licensed veterinarian</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <p className="text-sm">Provide all veterinary records and documentation</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </span>
                <div>
                  <p className="text-sm">We may request a second opinion from a veterinarian of our choice</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  5
                </span>
                <div>
                  <p className="text-sm">If approved, we will offer a replacement puppy or refund per our policy</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
