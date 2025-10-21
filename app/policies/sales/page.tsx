import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function SalesPage() {
  return (
    <main className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Sales Policy</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Please review our sales terms and conditions carefully before purchasing a French Bulldog puppy from CH French
          Bulldogs.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Deposit and Payment Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <h3 className="font-bold mb-1">Reservation Deposit</h3>
                <p className="text-sm text-muted-foreground">
                  A non-refundable deposit of $500 is required to reserve a puppy. This deposit will be applied to the
                  total purchase price.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Final Payment</h3>
                <p className="text-sm text-muted-foreground">
                  The remaining balance must be paid in full before or at the time of pickup/delivery. We accept cash,
                  certified check, bank transfer, or approved financing.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Payment Deadline</h3>
                <p className="text-sm text-muted-foreground">
                  Final payment must be received within 48 hours of scheduled pickup/delivery. Failure to pay may result
                  in forfeiture of deposit and puppy.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Refund and Cancellation Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <h3 className="font-bold mb-1">Deposit Refunds</h3>
                <p className="text-sm text-muted-foreground">
                  Deposits are non-refundable once paid. However, deposits may be transferred to another available puppy
                  within 6 months.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Buyer Cancellation</h3>
                <p className="text-sm text-muted-foreground">
                  If the buyer cancels after final payment, no refund will be issued unless the puppy has a health issue
                  covered by our warranty.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Breeder Cancellation</h3>
                <p className="text-sm text-muted-foreground">
                  If we must cancel the sale due to unforeseen circumstances, all payments will be refunded in full.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buyer Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">By purchasing a puppy from CH French Bulldogs, you agree to:</p>
            <ul className="space-y-2 text-sm">
              <li>• Provide proper nutrition, housing, and veterinary care</li>
              <li>• Have the puppy examined by a veterinarian within 72 hours of receipt</li>
              <li>• Keep the puppy up to date on all vaccinations and preventative care</li>
              <li>• Not resell the puppy to pet stores, puppy mills, or research facilities</li>
              <li>• Contact us first if you can no longer care for the puppy</li>
              <li>• Provide updates and photos (optional but appreciated!)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Breeder Rights and Disclaimers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <h3 className="font-bold mb-1">Right to Refuse Sale</h3>
                <p className="text-sm text-muted-foreground">
                  We reserve the right to refuse sale to anyone for any reason, including concerns about the puppy's
                  welfare.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Puppy Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Puppy availability is subject to change. We will notify you immediately if your reserved puppy becomes
                  unavailable.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Adult Size and Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  While we provide estimates, we cannot guarantee exact adult size, weight, or color as puppies mature.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Breeding Rights</h3>
                <p className="text-sm text-muted-foreground">
                  All puppies are sold as pets only unless otherwise specified in writing. Breeding rights require a
                  separate agreement and additional fees.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Age Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Buyers must be at least 18 years of age and provide valid government-issued identification. Minors may not
              purchase puppies without parental consent and presence.
            </p>
          </CardContent>
        </Card>

        <div className="bg-amber-50 border border-amber-200 p-6 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold mb-2">Important Notice</h3>
            <p className="text-sm text-muted-foreground">
              By placing a deposit or purchasing a puppy, you acknowledge that you have read, understood, and agree to
              all terms outlined in this sales policy, as well as our warranty and shipping policies.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
