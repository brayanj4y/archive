"use client"

import type React from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { sendOrderEmail } from "@/app/actions/send-order-email"
import Image from "next/image"

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checkoutComplete, setCheckoutComplete] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    specialInstructions: "",
  })

  const microchipPrice = 50
  const subtotal = getCartTotal()
  const tax = subtotal * 0.08
  const total = subtotal + tax

  if (cart.length === 0 && !checkoutComplete) {
    router.push("/cart")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields")
      return false
    }
    if (!formData.email.includes("@")) {
      alert("Please enter a valid email address")
      return false
    }
    return true
  }

  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  const handleWhatsAppCheckout = () => {
    if (!validateForm()) return

    const orderId = generateOrderId()
    let message = `*New Order from Country Home French Bulldogs*\n\n`
    message += `*Order ID:* ${orderId}\n\n`
    message += `*Customer Information:*\n`
    message += `Name: ${formData.firstName} ${formData.lastName}\n`
    message += `Email: ${formData.email}\n`
    message += `Phone: ${formData.phone}\n`
    message += `Address: ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}\n\n`

    message += `*Order Details:*\n`
    cart.forEach((item, index) => {
      message += `\n${index + 1}. ${item.puppy.name}\n`
      message += `   - Age: ${item.puppy.age}\n`
      message += `   - Gender: ${item.puppy.gender}\n`
      message += `   - Color: ${item.puppy.color}\n`
      message += `   - Price: ${item.puppy.priceDisplay}\n`
      if (item.addMicrochip) {
        message += `   - Microchip: +$${microchipPrice}\n`
      }
    })

    message += `\n*Order Summary:*\n`
    message += `Subtotal: $${subtotal.toFixed(2)}\n`
    message += `Tax: $${tax.toFixed(2)}\n`
    message += `*Total: $${total.toFixed(2)}*\n`

    if (formData.specialInstructions) {
      message += `\n*Special Instructions:*\n${formData.specialInstructions}\n`
    }

    const whatsappUrl = `https://wa.me/12104604183?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    setCheckoutComplete(true)
    clearCart()
    router.push("/puppies")
  }

  const handleEmailCheckout = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      const orderId = generateOrderId()

      await sendOrderEmail({
        orderId,
        customerInfo: formData,
        cart,
        totals: {
          subtotal,
          tax,
          total,
        },
        specialInstructions: formData.specialInstructions,
        microchipPrice,
      })

      setCheckoutComplete(true)
      clearCart()
      router.push(`/order-success?orderId=${orderId}`)
    } catch (error) {
      console.error("Email checkout error:", error)
      alert(error instanceof Error ? error.message : "There was an error processing your order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Any special requests or instructions for your order..."
                  rows={4}
                  disabled={loading}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.puppy.id} className="flex gap-3 pb-3 border-b">
                    <Image
                      src={item.puppy.image}
                      alt={item.puppy.name}
                      className="w-16 h-16 object-cover rounded-sm"
                      width={64}
                      height={64}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.puppy.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.puppy.age} • {item.puppy.color}
                      </p>
                      {item.addMicrochip && <p className="text-xs text-primary">+ Microchip</p>}
                    </div>
                    <p className="font-medium text-sm">
                      ${(item.puppy.price + (item.addMicrochip ? microchipPrice : 0)).toFixed(2)}
                    </p>
                  </div>
                ))}

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Complete Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex gap-2">
                    <span className="text-amber-600 text-lg flex-shrink-0">💡</span>
                    <p className="text-sm text-amber-900 leading-relaxed">
                      <strong>Note:</strong> A $500 deposit is required to reserve your puppy. This amount is applied to
                      your total balance. If you wish for nanny delivery, an additional $500 will be added for safe
                      delivery to your location. We'll contact you after your order to confirm pickup or delivery
                      details.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                  size="lg"
                  disabled={loading}
                >
                  <WhatsAppIcon className="mr-2 h-5 w-5" />
                  Order via WhatsApp
                </Button>
                <Button
                  onClick={handleEmailCheckout}
                  disabled={loading}
                  className={`w-full transition-all duration-300 bg-primary hover:bg-primary/90`}
                  size="lg"
                >
                  {loading ? "Processing..." : "Order via Email"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Choose your preferred method to complete your order
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
