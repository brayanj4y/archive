import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { ArrowLeft, Mail, Calendar, MessageSquare, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col pt-24 pb-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start mb-12">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Ready to discuss your project? Get in touch with us today and let's start building something amazing
            together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="space-y-8">
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="budget" className="text-sm font-medium">
                  Budget <span className="text-xs text-muted-foreground">(Optional)</span>
                </label>
                <Input id="budget" name="budget" placeholder="$" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea id="message" name="message" placeholder="Tell us about your project..." rows={5} required />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>

            <div className="space-y-4 pt-6 border-t border-border">
              <h2 className="text-xl font-bold">Other Ways to Connect</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <a
                    href="mailto:souopsilvain@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    souopsilvain@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Call or WhatsApp</h3>
                  <a href="tel:+237652570592" className="text-muted-foreground hover:text-primary transition-colors">
                    +237 652 570 592
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Schedule a Call</h3>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Book a 30-minute consultation
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">What to Expect</h2>
              <p className="text-muted-foreground mb-4">After you reach out to us, here's what you can expect:</p>
              <ol className="space-y-4 text-muted-foreground">
                <li className="flex items-start">
                  <span className="font-bold text-primary mr-2">1.</span>
                  <span>We'll respond to your inquiry within 24 hours to schedule an initial consultation.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-primary mr-2">2.</span>
                  <span>
                    During the consultation, we'll discuss your project in detail, including your goals, requirements,
                    and timeline.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-primary mr-2">3.</span>
                  <span>
                    We'll provide you with a proposal that outlines our approach, timeline, and cost estimate.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-primary mr-2">4.</span>
                  <span>
                    Once you approve the proposal, we'll kick off the project with a detailed discovery session.
                  </span>
                </li>
              </ol>
            </div>

            <div className="pt-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">How long does it take to build an app?</AccordionTrigger>
                  <AccordionContent>
                    The timeline varies depending on complexity, but most no-code apps can be built in 4-8 weeks, while
                    custom websites typically take 2-6 weeks.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    What's the difference between no-code and custom development?
                  </AccordionTrigger>
                  <AccordionContent>
                    No-code development uses visual builders like FlutterFlow to create apps without traditional coding,
                    which is faster but has some limitations. Custom development offers complete flexibility but
                    typically takes longer and costs more.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">Do you provide ongoing support?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer ongoing support and maintenance packages to ensure your app or website continues to
                    run smoothly after launch.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">What is your typical process?</AccordionTrigger>
                  <AccordionContent>
                    We follow a four-step process: Discovery (understanding your needs), Design (creating mockups),
                    Build (development), and Launch (deployment with testing).
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
