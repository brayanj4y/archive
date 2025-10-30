import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Phone } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import Image from "next/image"
import { getFeaturedPuppies } from "@/data/puppies"

export default function HomePage() {
  const featuredPuppies = getFeaturedPuppies()

  return (
    <main>
      {/* Hero Sectio */}
      <section className="relative h-[600px] flex items-center justify-center bg-muted">
        <Image
          src="/hero.JPG"
          alt="French Bulldog Puppy"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={600}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="relative z-10 text-center px-4 py-12 max-w-2xl mx-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white text-balance">
            Find Your Perfect Frenchie Companion Today!
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/puppies">View Available Puppies</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
          <p className="text-base md:text-lg font-semibold text-white drop-shadow-xl">
            Pay in full or place a $500 deposit*
            <br />
            <span className="text-sm md:text-base font-medium text-white drop-shadow-xl">
              *Remaining balance due upon delivery or pick-up
            </span>
          </p>
        </div>
      </section>

      {/* Featured Puppies Section */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Featured Puppies</h2>
          <p className="text-center text-muted-foreground mb-8">
            Meet some of our adorable French Bulldog puppies available now
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {featuredPuppies.map((puppy) => (
              <Card key={puppy.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={puppy.image}
                    alt={puppy.name}
                    className="w-full h-64 object-cover"
                    width={400}
                    height={400}
                  />
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {puppy.status}
                  </div>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-3">{puppy.name}</h3>
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
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <Link href={`/puppies/${puppy.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/puppies">View All Available Puppies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Our Puppies */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">About Our Puppies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Up To Date on Vaccines", description: "All puppies receive age-appropriate vaccinations" },
              { title: "Warranty Commitment", description: "Comprehensive health guarantee included" },
              { title: "Quality Bloodlines", description: "Champion bloodlines with excellent temperaments" },
              { title: "Breeders since 2008", description: "Over 15 years of breeding experience" },
              { title: "Microchip ID (Optional)", description: "Permanent identification for your peace of mind" },
              { title: "Travel Nanny (Optional)", description: "Safe delivery to most U.S. cities" },
            ].map((feature, index) => (
              <Card
                key={index}
                className="relative flex border border-gray-200 rounded-[5px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div> {/* colored side bar */}
                <CardContent className="p-6 pl-8">
                  <div className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Got Any Questions */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Got Any Questions?</h2>
          <p className="text-lg mb-8 text-muted-foreground">
            Your bulldog journey starts with a conversation. Reach out for personalized assistance from breeding
            experts!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <a href="tel:+15035551234">
                <Phone className="mr-2 h-5 w-5" />
                Call Us
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://wa.me/15035551234" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="mr-2 h-5 w-5" />
                Message on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Dear Customers */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Dear Customers</h2>
          <p className="text-center text-lg mb-12 text-muted-foreground max-w-3xl mx-auto">
            Thank you for trusting us to help you find the perfect French Bulldog. We're grateful to be part of your
            journey.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "/families/473698730_909778324570416_2401626529167920430_n.jpg",
              "/families/482000327_747220897994141_6698476093348143559_n.jpg",
              "/families/482000327_747220897994141_6698476093348143559_.jpg",
              "/families/476276130_636008365451512_3084319020238372187_n.jpg",
              "/families/474556989_915538193994429_3768917080082251788_n.jpg",
              "/families/481987675_752800307436200_6977597339047910537_n.jpg",
              "/families/475142543_916409627240619_7185702206034761292_n.jpg",
              "/families/474736207_915538617327720_36310219468107562_n.jpg",
            ].map((imagePath, i) => (
              <div key={i} className="aspect-square">
                <Image
                  src={imagePath}
                  alt="Happy customer with their French Bulldog puppy"
                  className="w-full h-full object-cover border border-border rounded-lg hover:opacity-90 transition-opacity"
                  width={300}
                  height={300}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How to Buy a French Bulldog Puppy?</AccordionTrigger>
              <AccordionContent>
                Browse our available puppies, contact us to reserve your puppy with a $500 deposit, and we'll guide you
                through the entire process including delivery or pickup options.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What makes French Bulldog puppies special?</AccordionTrigger>
              <AccordionContent>
                French Bulldogs are known for their affectionate nature, adaptability to apartment living, low exercise
                needs, and charming personalities. They make excellent companions for families and individuals alike.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How big do French Bulldogs get when they grow up?</AccordionTrigger>
              <AccordionContent>
                French Bulldogs typically weigh between 16-28 pounds and stand about 11-13 inches tall at the shoulder
                when fully grown.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Are French Bulldogs good with children and other pets?</AccordionTrigger>
              <AccordionContent>
                Yes! French Bulldogs are known for their gentle and patient nature, making them excellent companions for
                children. They also generally get along well with other pets when properly socialized.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How often do French Bulldogs need exercise?</AccordionTrigger>
              <AccordionContent>
                French Bulldogs need moderate exercise - typically 15-30 minutes of walking per day. They're not
                high-energy dogs and are perfect for apartment living.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>French bulldog pups for sale near me?</AccordionTrigger>
              <AccordionContent>
                We're located in Dallas, Texas, and offer travel nanny services to most U.S. cities. You can also pick
                up your puppy locally if you're in the area.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>Are French Bulldogs easy to train?</AccordionTrigger>
              <AccordionContent>
                French Bulldogs are intelligent and eager to please, making them relatively easy to train with positive
                reinforcement methods. They respond well to consistency and patience.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>French Bulldogs and British Bulldogs are the same?</AccordionTrigger>
              <AccordionContent>
                No, they are different breeds. French Bulldogs are smaller, have distinctive bat ears, and originated in
                France. British Bulldogs (English Bulldogs) are larger and have a different appearance and temperament.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-9">
              <AccordionTrigger>
                Do you ship to other cities in the USA or to other parts of the world?
              </AccordionTrigger>
              <AccordionContent>
                Yes! We offer travel nanny services to most U.S. cities for a flat fee of $500. For international
                shipping, please contact us to discuss options and requirements.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-10">
              <AccordionTrigger>How much do French Bulldogs cost?</AccordionTrigger>
              <AccordionContent>
                Our French Bulldog puppies range in price depending on color, gender, and bloodlines. Please view our
                available puppies page or contact us for current pricing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-11">
              <AccordionTrigger>What is the typical behavior of a French Bulldog?</AccordionTrigger>
              <AccordionContent>
                French Bulldogs are affectionate, playful, and alert. They're known for being excellent companion dogs,
                forming strong bonds with their families, and having a gentle, patient temperament.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What our Adopting Families say about us!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">February 3, 2023</p>
                <p className="mb-4 text-pretty">
                  "We purchased our 2nd puppy from CH on Sunday!! Easy transaction and beautiful puppies!!"
                </p>
                <p className="font-bold">— Jason Rowe</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">November 3, 2022</p>
                <p className="mb-4 text-pretty">
                  "I have three of the CH French bulldogs and couldn't be happier. They are all very healthy and have
                  great temperaments. CH has been great at answering questions both before and after getting the puppies
                  on different occasions. If you are going to get a Frenchie definitely use these guys, my vet is very
                  impressed as well."
                </p>
                <p className="font-bold">— Breann Burke</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">November 3, 2022</p>
                <p className="mb-4 text-pretty">
                  "Have to give a huge thank you to Idella for all her help and transparency through this entire
                  process! I received my beautiful little princess and couldn't be happier with her. She is super
                  playful and energetic and we couldn't be happier. I would recommend CH French bulldogs to anyone!"
                </p>
                <p className="font-bold">— Jenny Ramirez</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Located in Dallas, Texas</h2>
              <p className="text-lg mb-6 text-pretty">
                As a French Bulldog breeder based in Dallas, Texas, we offer travel nanny services to most U.S. cities
                for a flat fee of $500 — or you're welcome to pick up locally if you're nearby or prefer a more personal
                adoption experience.
              </p>
              <Button asChild variant="outline">
                <Link href="/policies/shipping">Check our shipping policy</Link>
              </Button>
            </div>
            <div className="h-[400px] border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d134243.6242823796!2d-96.889963!3d32.776664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e9911c5f9d6e1%3A0x3a6c7f6b7e6e1c0!2sDallas%2C%20TX!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Adoption Map */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Where Have Our Puppies Been Adopted?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4 text-primary">Texas</h3>
              <div className="space-y-2">
                {["Dallas", "Houston", "Austin", "Fort Worth"].map((city) => (
                  <div key={city} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{city}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4 text-primary">Northwest</h3>
              <div className="space-y-2">
                {["Washington", "Oregon", "Idaho"].map((state) => (
                  <div key={state} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{state}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4 text-primary">Southwest</h3>
              <div className="space-y-2">
                {["California", "Nevada"].map((state) => (
                  <div key={state} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{state}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4 text-primary">Midwest</h3>
              <div className="space-y-2">
                {["Oklahoma", "Kansas", "Nevada"].map((state) => (
                  <div key={state} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{state}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4 text-primary">Northeast</h3>
              <div className="space-y-2">
                {["New York", "Illinois", "Maine", "NH", "Vermont"].map((state) => (
                  <div key={state} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{state}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4 text-primary">Southeast</h3>
              <div className="space-y-2">
                {["Florida", "Virginia", "W. Virginia", "N. Carolina"].map((state) => (
                  <div key={state} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{state}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
