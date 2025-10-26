"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Puppy } from "@/lib/cart-context"
import Link from "next/link"
import Image from "next/image"

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
    image: "/placeholder.svg?height=400&width=400",
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
    image: "/placeholder.svg?height=400&width=400",
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
    image: "/placeholder.svg?height=400&width=400",
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
    image: "/placeholder.svg?height=400&width=400",
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
    image: "/placeholder.svg?height=400&width=400",
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
    image: "/placeholder.svg?height=400&width=400",
    description: "Duke is a striking black French Bulldog with a bold personality. He's loyal and protective.",
    weight: "12 lbs",
    parents: "Champion bloodline",
    vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
  },
]

export default function PuppiesPage() {
  return (
    <main className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Available French Bulldog Puppies</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our current selection of adorable French Bulldog puppies. Each puppy comes with health guarantees,
            up-to-date vaccinations, and our commitment to quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {puppies.map((puppy) => (
            <Card key={puppy.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={puppy.image || "/placeholder.svg"}
                  alt={puppy.name}
                  className="w-full h-64 object-cover"
                  width={400}
                  height={400}
                />
                <Badge
                  className="absolute top-2 right-2"
                  variant={puppy.status === "Reserved" ? "secondary" : "default"}
                >
                  {puppy.status}
                </Badge>
              </div>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-2">{puppy.name}</h3>
                <div className="space-y-1 text-sm mb-4">
                  <p>
                    <span className="font-medium">Age:</span> {puppy.age}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span> {puppy.gender}
                  </p>
                  <p>
                    <span className="font-medium">Color:</span> {puppy.color}
                  </p>
                  <p className="text-xl font-bold text-primary mt-2">{puppy.priceDisplay}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href={`/puppies/${puppy.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Don't see the perfect puppy? We have more coming soon!</p>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Get Notified of New Arrivals</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
