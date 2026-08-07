import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowLeft, Smartphone, Globe, Zap, Shield, Users, BarChart } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  return (
    <main className="flex min-h-screen flex-col pt-24 pb-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start mb-12">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            We specialize in building no-code mobile applications and custom websites that help businesses grow and
            succeed in the digital landscape.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">No-Code Mobile Apps</CardTitle>
              <CardDescription className="text-base">
                Rapidly build and deploy native mobile applications without traditional coding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Using FlutterFlow, we create beautiful, functional mobile applications for iOS and Android in a fraction
                of the time of traditional development. Our no-code approach allows for rapid iteration and lower costs
                without sacrificing quality.
              </p>

              <div className="space-y-4">
                <h3 className="font-medium">What's Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Native iOS and Android applications</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Custom UI/UX design tailored to your brand</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Backend integration with your existing systems</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>User authentication and account management</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Push notifications and real-time updates</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>App Store and Google Play submission assistance</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Custom Websites</CardTitle>
              <CardDescription className="text-base">
                High-performance web applications built with modern technologies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                We build custom websites and web applications using Next.js, React, and other modern technologies. Our
                websites are fast, responsive, and designed to convert visitors into customers.
              </p>

              <div className="space-y-4">
                <h3 className="font-medium">What's Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Responsive design that works on all devices</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>SEO optimization for better search rankings</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Performance optimization for fast load times</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Content management system integration</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>E-commerce functionality (if needed)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Analytics and conversion tracking</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tighter mb-8">Additional Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/40">
              <CardHeader>
                <Zap className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-xl">Performance Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We optimize your existing applications for speed and efficiency, improving user experience and
                  conversion rates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <Shield className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-xl">Security Audits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive security reviews to identify and address vulnerabilities in your applications.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <Users className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-xl">UX Consulting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Expert analysis and recommendations to improve the usability and user experience of your digital
                  products.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <BarChart className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-xl">Analytics Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set up comprehensive analytics to track user behavior and make data-driven decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Process Overview */}
        <div className="border-t border-border pt-16">
          <h2 className="text-3xl font-bold tracking-tighter mb-8">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                1
              </div>
              <h3 className="text-xl font-bold">Discovery</h3>
              <p className="text-muted-foreground">
                We learn about your business, goals, and requirements to create a tailored solution.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                2
              </div>
              <h3 className="text-xl font-bold">Design</h3>
              <p className="text-muted-foreground">
                Our designers create wireframes and mockups for your approval before development begins.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                3
              </div>
              <h3 className="text-xl font-bold">Build</h3>
              <p className="text-muted-foreground">
                We develop your solution using FlutterFlow for mobile apps or Next.js for websites.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                4
              </div>
              <h3 className="text-xl font-bold">Launch</h3>
              <p className="text-muted-foreground">
                We deploy your solution and provide ongoing support to ensure everything runs smoothly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
