"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cart, removeFromCart, toggleMicrochip, getCartTotal } = useCart()
  const router = useRouter()

  const microchipPrice = 50
  const subtotal = getCartTotal()
  const shipping = 300 // Fixed shipping cost
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  if (cart.length === 0) {
    return (
      <main className="py-16 px-4 min-h-[60vh]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Your Cart</h1>
          <p className="text-muted-foreground mb-8">Your cart is empty</p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/puppies">Browse Puppies</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.puppy.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.puppy.image || "/placeholder.svg"}
                      alt={item.puppy.name}
                      className="w-24 h-24 object-cover rounded-sm"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-xl">{item.puppy.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.puppy.age} • {item.puppy.gender} • {item.puppy.color}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.puppy.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-bold text-lg text-primary mb-3">{item.puppy.priceDisplay}</p>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`microchip-${item.puppy.id}`}
                          checked={item.addMicrochip}
                          onCheckedChange={() => toggleMicrochip(item.puppy.id)}
                        />
                        <label htmlFor={`microchip-${item.puppy.id}`} className="text-sm cursor-pointer">
                          Add Microchip (+${microchipPrice})
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
                <Button asChild variant="outline" className="w-full mt-2 bg-transparent">
                  <Link href="/puppies">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
