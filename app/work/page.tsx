import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function WorkPage() {
  return (
    <main className="flex min-h-screen flex-col pt-24 pb-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start mb-12">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Our Work</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            While we're just getting started, we've put our expertise into creating our own website. Here's how we
            approached the DevStudio landing page.
          </p>
        </div>

        {/* DevStudio Project */}
        <div className="border-t border-border pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">DevStudio Landing Page</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline">Next.js</Badge>
                  <Badge variant="outline">Tailwind CSS</Badge>
                  <Badge variant="outline">Framer Motion</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                </div>
                <p className="text-muted-foreground">
                  A modern, high-converting landing page designed to showcase our services in building no-code apps and
                  custom websites.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">The Challenge</h3>
                <p className="text-muted-foreground">
                  We needed to create a landing page that would effectively communicate our services, showcase our
                  expertise, and convert visitors into clients. The site needed to be visually appealing, fast, and
                  responsive across all devices.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Our Approach</h3>
                <p className="text-muted-foreground">
                  Using Next.js and modern web technologies, we built a landing page that demonstrates our capabilities:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                  <li>Interactive particle background for visual interest</li>
                  <li>Smooth scroll animations to enhance user engagement</li>
                  <li>Responsive design that works flawlessly on all devices</li>
                  <li>Dark/light mode with seamless transitions</li>
                  <li>Optimized performance with Next.js App Router</li>
                  <li>Accessible design following WCAG guidelines</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">The Results</h3>
                <p className="text-muted-foreground">
                  The landing page achieves a perfect 100 score on Google PageSpeed Insights, loads in under 1 second,
                  and provides an engaging user experience that effectively communicates our value proposition.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative h-[500px] rounded-xl overflow-hidden border border-border/40 shadow-xl">
                <Image
                  src="/screenshot.png"
                  alt="DevStudio Website Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-[200px] rounded-lg overflow-hidden border border-border/40">
                  <Image
                    src="/screenshot.png"
                    alt="DevStudio Mobile View"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-[200px] rounded-lg overflow-hidden border border-border/40">
                  <Image
                    src="/screenshot.png"
                    alt="DevStudio Dark Mode"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="border-t border-border pt-16 pb-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">More Projects Coming Soon</h2>
            <p className="text-muted-foreground mb-8">
              We're currently working on several exciting projects that we'll be adding to our portfolio soon. Check
              back regularly to see our latest work.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
