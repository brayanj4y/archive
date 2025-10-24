"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import type { Puppy } from "@/lib/cart-context"

const puppies: Puppy[] = [
  {
    id: 1,
    name: "Bella",
    age: "10 weeks",
    gender: "Female",
    color: "Fawn",
    price: 4500,
    priceDisplay: "$4,500",
    status: "Available",
    image: "/placeholder.svg?height=600&width=600",
    description:
      "Bella is a sweet and playful fawn French Bulldog with a gentle temperament. She loves cuddles and is great with children.",
    weight: "12 lbs",
    parents: "Champion bloodline",
    vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
  },
  {
    id: 2,
    name: "Max",
    age: "12 weeks",
    gender: "Male",
    color: "Blue",
    price: 5500,
    priceDisplay: "$5,500",
    status: "Available",
    image: "/placeholder.svg?height=600&width=600",
    description: "Max is an energetic blue French Bulldog with a stunning coat. He's confident and loves to play.",
    weight: "14 lbs",
    parents: "Champion bloodline",
    vaccinations: ["First and second round of shots", "Dewormed", "Vet checked"],
  },
  {
    id: 3,
    name: "Luna",
    age: "8 weeks",
    gender: "Female",
    color: "Cream",
    price: 4800,
    priceDisplay: "$4,800",
    status: "New Arrival",
    image: "/placeholder.svg?height=600&width=600",
    description: "Luna is a beautiful cream French Bulldog with a calm and loving personality. Perfect for families.",
    weight: "10 lbs",
    parents: "Champion bloodline",
    vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
  },
  {
    id: 4,
    name: "Rocky",
    age: "11 weeks",
    gender: "Male",
    color: "Brindle",
    price: 4200,
    priceDisplay: "$4,200",
    status: "Available",
    image: "/placeholder.svg?height=600&width=600",
    description:
      "Rocky is a handsome brindle French Bulldog with a playful spirit. He's adventurous and loves exploring.",
    weight: "13 lbs",
    parents: "Champion bloodline",
    vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
  },
  {
    id: 5,
    name: "Daisy",
    age: "9 weeks",
    gender: "Female",
    color: "Pied",
    price: 4600,
    priceDisplay: "$4,600",
    status: "Reserved",
    image: "/placeholder.svg?height=600&width=600",
    description:
      "Daisy is a gorgeous pied French Bulldog with unique markings. She's affectionate and loves attention.",
    weight: "11 lbs",
    parents: "Champion bloodline",
    vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
  },
  {
    id: 6,
    name: "Duke",
    age: "10 weeks",
    gender: "Male",
    color: "Black",
    price: 4400,
    priceDisplay: "$4,400",
    status: "Available",
    image: "/placeholder.svg?height=600&width=600",
    description: "Duke is a striking black French Bulldog with a bold personality. He's loyal and protective.",
    weight: "12 lbs",
    parents: "Champion bloodline",
    vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
  },
]

export default function PuppyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { addToCart, toggleMicrochip } = useCart()
  const [addMicrochip, setAddMicrochip] = useState(false)
  const [added, setAdded] = useState(false)

  const puppy = puppies.find((p) => p.id === Number.parseInt(params.id))

  if (!puppy) {
    return (
      <main className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Puppy Not Found</h1>
          <Button asChild>
            <Link href="/puppies">Back to Puppies</Link>
          </Button>
        </div>
      </main>
    )
  }

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
    <main className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/puppies">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Puppies
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="relative">
              <img
                src={puppy.image || "/placeholder.svg"}
                alt={puppy.name}
                className="w-full h-auto rounded-sm object-cover"
              />
              <Badge className="absolute top-4 right-4" variant={puppy.status === "Reserved" ? "secondary" : "default"}>
                {puppy.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{puppy.name}</h1>
              <p className="text-3xl font-bold text-primary">{puppy.priceDisplay}</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-medium">{puppy.age}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium">{puppy.gender}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Color</p>
                    <p className="font-medium">{puppy.color}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-medium">{puppy.weight}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Parents</p>
                    <p className="font-medium">{puppy.parents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-xl font-bold mb-2">About {puppy.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{puppy.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Health & Vaccinations</h2>
              <ul className="space-y-2">
                {puppy.vaccinations?.map((vaccination, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{vaccination}</span>
                  </li>
                ))}
              </ul>
            </div>

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
                    <p className="text-sm text-muted-foreground">
                      Ensure your puppy's safety with a registered microchip
                    </p>
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

            <div className="text-sm text-muted-foreground">
              <p>
                All our puppies come with a health guarantee and are raised in a loving home environment. Contact us for
                more information about {puppy.name}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
