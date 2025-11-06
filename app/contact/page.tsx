import type { Metadata } from "next"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Contact Us - Customer Support & Shipping Inquiries",
  description:
    "Contact ShipTrack Pro for shipping inquiries, customer support, and logistics assistance. Available 24/7 for emergency support. Call 1-800-SHIPTRACK or email support@shiptrackpro.com.",
  keywords: [
    "contact shipping company",
    "customer support",
    "shipping inquiries",
    "logistics support",
    "emergency shipping",
    "track package support",
  ],
  openGraph: {
    title: "Contact Us - Customer Support & Shipping Inquiries | ShipTrack Pro",
    description: "Get in touch with our expert shipping team. Available 24/7 for emergency support.",
    url: "https://shiptrackpro.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us - Customer Support & Shipping Inquiries",
    description: "Get in touch with our expert shipping team. Available 24/7 for emergency support.",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentPath="/contact" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">Get In Touch</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We're here to help with all your shipping needs. Get in touch with our expert team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-blue-600 rounded-lg w-10 h-10 flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900">Send us a Message</CardTitle>
                  <CardDescription className="text-slate-500">We'll get back to you within 24 hours</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                      First Name
                    </label>
                    <Input id="firstName" name="firstName" required className="border-slate-300" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                      Last Name
                    </label>
                    <Input id="lastName" name="lastName" required className="border-slate-300" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <Input id="email" name="email" type="email" required className="border-slate-300" />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <Input id="phone" name="phone" type="tel" className="border-slate-300" />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                    Subject
                  </label>
                  <Input id="subject" name="subject" required className="border-slate-300" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    required
                    className="border-slate-300"
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 rounded-lg w-10 h-10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">Get in Touch</CardTitle>
                    <CardDescription className="text-slate-500">
                      Multiple ways to reach our support team
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Email Support</h3>
                    <p className="text-slate-600">support@shiptrackpro.com</p>
                    <p className="text-sm text-slate-500">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Phone Support</h3>
                    <p className="text-slate-600">1-800-SHIPTRACK</p>
                    <p className="text-sm text-slate-500">Mon-Fri 8AM-8PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Office Address</h3>
                    <p className="text-slate-600">
                      123 Logistics Drive
                      <br />
                      Shipping Center, SC 29401
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Business Hours</h3>
                    <div className="text-slate-600 text-sm space-y-1">
                      <p>Monday - Friday: 8:00 AM - 8:00 PM EST</p>
                      <p>Saturday: 9:00 AM - 5:00 PM EST</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 rounded-lg w-10 h-10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">Emergency Support</CardTitle>
                    <CardDescription className="text-slate-500">For urgent shipping issues</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-1">24/7 Emergency Line</h3>
                  <p className="text-blue-700 font-bold text-lg">1-800-URGENT-SHIP</p>
                  <p className="text-sm text-blue-600 mt-2">For lost packages and delivery emergencies</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
