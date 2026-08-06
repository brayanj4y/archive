import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { PUPPIES } from "@/data/puppies"

export const revalidate = 3600

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
          {PUPPIES.map((puppy) => (
            <Card key={puppy.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={puppy.image}
                  alt={`${puppy.name} - ${puppy.color} French Bulldog puppy for sale`}
                  className="w-full h-64 object-cover"
                  width={400}
                  height={400}
                  loading="lazy"
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
