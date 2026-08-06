import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col pt-24 pb-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start mb-12">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">About DevStudio</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            We're a small, passionate team of developers and designers focused on building beautiful, functional digital
            products that help businesses succeed.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-muted-foreground">
              DevStudio, was founded with a simple mission: to make high-quality digital
              products accessible to businesses of all sizes. We saw that many small and medium-sized businesses were
              struggling to find affordable, high-quality development services that could deliver both mobile apps and
              websites.
            </p>
            <p className="text-muted-foreground">
              By combining our expertise in no-code development using FlutterFlow and custom web development with
              Next.js, we're able to offer solutions that are faster to market, more cost-effective, and just as
              powerful as traditional development approaches.
            </p>
            <p className="text-muted-foreground">
              Our team brings together years of experience in design, development, and project management to deliver
              digital products that not only look great but also drive real business results.
            </p>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden border border-border/40 shadow-xl">
            <Image src="\098.PNG" alt="DevStudio Team" fill className="object-cover" />
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality First</h3>
              <p className="text-muted-foreground">
                We never compromise on quality. Every line of code, every design element, and every interaction is
                crafted with care and attention to detail.
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 22v-5" />
                  <path d="M9 8V2" />
                  <path d="M15 8V2" />
                  <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in open, honest communication. You'll always know exactly where your project stands, what
                we're working on, and what to expect next.
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We're constantly exploring new technologies and approaches to deliver better results for our clients.
                We're not afraid to challenge conventions when it serves the project.
              </p>
            </div>
          </div>
        </div>

        {/* Our Approach */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Our Approach</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold">No-Code First</h3>
              <p className="text-muted-foreground">
                We believe that no-code tools like FlutterFlow have revolutionized app development, making it faster,
                more cost-effective, and more accessible than ever before. Our no-code first approach means we'll always
                consider whether a no-code solution can meet your needs before recommending custom development.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Faster time to market</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Lower development costs</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Easier maintenance and updates</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Scalable solutions that grow with your business</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold">Custom When Needed</h3>
              <p className="text-muted-foreground">
                While we love no-code solutions, we also recognize that some projects require custom development to
                achieve their full potential. Our expertise in Next.js and modern web technologies allows us to build
                custom solutions when they're the right fit for your needs.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Fully customized user experiences</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Integration with complex systems and APIs</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>High-performance applications for demanding use cases</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Unique features that go beyond no-code capabilities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose DevStudio</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Expertise in Both Worlds</h3>
              <p className="text-muted-foreground">
                Unlike agencies that specialize in either no-code or custom development, we bring expertise in both
                approaches. This means we can recommend and implement the best solution for your specific needs, whether
                that's a no-code app, a custom website, or a hybrid approach.
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Focus on Business Outcomes</h3>
              <p className="text-muted-foreground">
                We're not just building apps and websites; we're helping you achieve your business goals. Every decision
                we make is guided by what will deliver the best results for your business, whether that's increasing
                conversions, improving user engagement, or streamlining operations.
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Transparent Process</h3>
              <p className="text-muted-foreground">
                Our development process is designed to keep you informed and involved at every step. From initial
                discovery to final launch, you'll always know what we're working on, why we're making certain decisions,
                and what to expect next.
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Ongoing Support</h3>
              <p className="text-muted-foreground">
                Our relationship doesn't end when your project launches. We offer ongoing support and maintenance to
                ensure your digital products continue to perform at their best, adapt to changing needs, and stay up to
                date with the latest technologies.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-border pt-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Work Together?</h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss how we can help bring your vision to life with our expertise in no-code apps and custom
              websites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="px-8">
                  Contact Us
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="px-8">
                  View Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
