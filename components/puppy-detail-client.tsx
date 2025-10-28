"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import type { Puppy } from "@/lib/types"

interface PuppyDetailClientProps {
    puppy: Puppy
}

export function PuppyDetailClient({ puppy }: PuppyDetailClientProps) {
    const router = useRouter()
    const { addToCart, toggleMicrochip } = useCart()
    const [addMicrochip, setAddMicrochip] = useState(false)
    const [added, setAdded] = useState(false)

    const microchipPrice = 50
    const totalPrice = puppy.price + (addMicrochip ? microchipPrice : 0)

    const handleAddToCart = () => {
        addToCart(puppy)
        if (addMicrochip) {
            toggleMicrochip(puppy.id)
        }
        setAdded(true)
        setTimeout(() => {
            router.push("/cart")
        }, 1000)
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                    <input
                        type="checkbox"
                        id="microchip"
                        checked={addMicrochip}
                        onChange={(e) => setAddMicrochip(e.target.checked)}
                        className="mt-1"
                    />
                    <div className="flex-1">
                        <label htmlFor="microchip" className="font-medium cursor-pointer">
                            Add Microchip (+${microchipPrice})
                        </label>
                        <p className="text-sm text-muted-foreground">Ensure your puppy's safety with a registered microchip</p>
                    </div>
                </div>
                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Total Price:</span>
                        <span className="text-2xl font-bold text-primary">${totalPrice.toLocaleString()}</span>
                    </div>
                    <Button
                        onClick={handleAddToCart}
                        disabled={added || puppy.status === "Reserved"}
                        className="w-full"
                        size="lg"
                    >
                        {added ? "Added to Cart!" : puppy.status === "Reserved" ? "Reserved" : "Add to Cart"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
