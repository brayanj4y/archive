import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { getPuppyById, PUPPIES } from "@/data/puppies"
import { PuppyImageCarousel } from "@/components/puppy-image-carousel"
import { ProductSchema, BreadcrumbSchema } from "@/components/structured-data"
import { PuppyDetailClient } from "@/components/puppy-detail-client"

export async function generateStaticParams() {
  return PUPPIES.map((puppy) => ({
    id: puppy.id.toString(),
  }))
}

export const revalidate = 3600

export default function PuppyDetailPage({ params }: { params: { id: string } }) {
  const puppy = getPuppyById(Number.parseInt(params.id))
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://chfrenchbulldogs.com"

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

  const breadcrumbItems = [
    { name: "Home", url: baseUrl },
    { name: "Puppies", url: `${baseUrl}/puppies` },
    { name: puppy.name, url: `${baseUrl}/puppies/${puppy.id}` },
  ]

  return (
    <>
      <ProductSchema puppy={puppy} baseUrl={baseUrl} />
      <BreadcrumbSchema items={breadcrumbItems} />
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
              <PuppyImageCarousel puppy={puppy} />
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

              <PuppyDetailClient puppy={puppy} />

              <div className="text-sm text-muted-foreground">
                <p>
                  All our puppies come with a health guarantee and are raised in a loving home environment. Contact us
                  for more information about {puppy.name}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
