import type { Metadata } from "next"
import { Package, HelpCircle, Search, MessageCircle, Phone } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "FAQ - ShipTrack Pro",
  description: "Frequently asked questions about ShipTrack Pro shipping services, tracking, pricing, and policies.",
  keywords: "FAQ, shipping questions, tracking help, shipping policies",
}

const faqCategories = [
  {
    title: "General Shipping",
    icon: Package,
    questions: [
      {
        question: "What types of items can you ship?",
        answer:
          "We ship a wide variety of items including general parcels, fragile items, electronics, documents, and even pets. We specialize in providing appropriate handling and packaging for each type of shipment to ensure safe delivery.",
      },
      {
        question: "How do I get a shipping quote?",
        answer:
          "You can get a shipping quote by contacting our customer service team at 1-800-SHIPTRACK or by filling out our contact form. We'll need details about your package dimensions, weight, pickup and delivery locations, and any special requirements.",
      },
      {
        question: "What are your delivery timeframes?",
        answer:
          "Delivery times vary by service type: Express delivery (1-2 business days), Standard shipping (3-5 business days), International shipping (5-10 business days depending on destination). Pet transportation may require additional time for health certificate processing.",
      },
      {
        question: "Do you provide packaging services?",
        answer:
          "Yes, we offer professional packaging services, especially for fragile items and valuable goods. Our team uses appropriate materials and techniques to ensure your items are properly protected during transit.",
      },
    ],
  },
  {
    title: "Pet Transportation",
    icon: Package,
    questions: [
      {
        question: "What is included in the $1,200 refundable crate service?",
        answer:
          "Our refundable crate service includes a professional-grade, airline-approved travel crate that meets all safety standards. The crate is spacious, well-ventilated, and designed for your pet's comfort. The $1,200 is fully refundable upon return of the crate in good condition.",
      },
      {
        question: "What does the $800 insurance coverage include?",
        answer:
          "Our pet insurance coverage protects against loss, injury, or illness during transport up to $800. This includes veterinary expenses if your pet requires medical attention during or immediately after transport due to shipping-related issues.",
      },
      {
        question: "What health certificates are required?",
        answer:
          "We require current veterinary health certificates issued within 10 days of travel. Our team can help coordinate with your veterinarian to ensure all necessary documentation is completed properly.",
      },
      {
        question: "How do you ensure my pet's safety during transport?",
        answer:
          "We use climate-controlled vehicles, provide regular monitoring, employ trained pet handlers, and maintain communication throughout the journey. Your pet's safety and comfort are our top priorities.",
      },
    ],
  },
  {
    title: "Tracking & Delivery",
    icon: Search,
    questions: [
      {
        question: "How do I track my package?",
        answer:
          "You can track your package using the tracking number provided when you ship. Simply enter it on our tracking page or use our mobile app. You'll receive real-time updates on your shipment's location and status.",
      },
      {
        question: "What if my tracking number isn't working?",
        answer:
          "If your tracking number isn't working, please check that you've entered it correctly. Tracking information may take a few hours to appear in our system after pickup. If you continue to have issues, contact our support team.",
      },
      {
        question: "Can I change the delivery address after shipping?",
        answer:
          "Address changes may be possible depending on the shipment status. Contact our customer service team immediately with your tracking number and new address. Additional fees may apply for address changes.",
      },
      {
        question: "What happens if no one is available for delivery?",
        answer:
          "If no one is available for delivery, we'll leave a delivery notice and attempt redelivery the next business day. For valuable items or pets, we require someone to be present for delivery. You can also arrange to pick up your package at our local facility.",
      },
    ],
  },
  {
    title: "International Shipping",
    icon: Package,
    questions: [
      {
        question: "Do you handle customs documentation?",
        answer:
          "Yes, we provide comprehensive customs documentation support for international shipments. Our team will help you complete all necessary paperwork and ensure compliance with destination country requirements.",
      },
      {
        question: "What items are restricted for international shipping?",
        answer:
          "Restricted items vary by destination country but commonly include hazardous materials, certain foods, plants, and some electronics. We'll review your shipment and advise on any restrictions before shipping.",
      },
      {
        question: "How are customs duties and taxes handled?",
        answer:
          "Customs duties and taxes are typically the responsibility of the recipient. We can provide guidance on estimated costs and help with documentation to minimize delays at customs.",
      },
      {
        question: "Can you ship pets internationally?",
        answer:
          "Yes, we provide international pet transportation services. This requires additional documentation including health certificates, import permits, and sometimes quarantine arrangements. We handle all the complex requirements for international pet travel.",
      },
    ],
  },
  {
    title: "Pricing & Insurance",
    icon: Package,
    questions: [
      {
        question: "How is shipping cost calculated?",
        answer:
          "Shipping costs are based on package weight, dimensions, distance, service type, and any special handling requirements. We provide transparent pricing with no hidden fees.",
      },
      {
        question: "What insurance options are available?",
        answer:
          "We offer various insurance options based on your shipment value. Basic coverage is included with all shipments, and additional coverage is available for high-value items. Pet shipments include specialized insurance coverage.",
      },
      {
        question: "Do you offer business accounts and volume discounts?",
        answer:
          "Yes, we offer business accounts with volume discounts, dedicated support, and API integration for automated shipping. Contact our business development team to discuss your specific needs.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards, business checks, and offer net payment terms for established business accounts. Payment is typically required at the time of shipping.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* New Header Component */}
      <Header currentPath="/faq" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">Help Center</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our shipping services, tracking, and policies
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-12 border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input placeholder="Search for answers..." className="h-12 pl-10 border-slate-300" />
              </div>
              <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-700">Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Categories */}
        <div className="space-y-6 mb-12">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="border-slate-200">
              <CardHeader className="bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 rounded-lg w-12 h-12 flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>Common questions about {category.title.toLowerCase()}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, questionIndex) => (
                    <AccordionItem
                      key={questionIndex}
                      value={`${categoryIndex}-${questionIndex}`}
                      className="border-slate-200"
                    >
                      <AccordionTrigger className="text-left font-medium text-slate-800 hover:text-blue-600">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 leading-relaxed pt-2">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-blue-600 rounded-lg w-14 h-14 flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div className="bg-green-600 rounded-lg w-14 h-14 flex items-center justify-center">
                <Phone className="w-7 h-7 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Still Have Questions?</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Our customer support team is here to help with any additional questions
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-300 bg-transparent">
                <a href="tel:1-800-SHIPTRACK">
                  <Phone className="w-5 h-5 mr-2" />
                  Call 1-800-SHIPTRACK
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Footer Component */}
      <Footer />
    </div>
  )
}
