"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Mail, MessageSquare, Phone } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
    budget: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log(formState)
    // Reset form
    setFormState({ name: "", email: "", message: "", budget: "" })
    // Show success message
    alert("Thanks for your message! We'll get back to you soon.")
  }

  const faqs = [
    {
      question: "How long does it take to build an app?",
      answer:
        "The timeline varies depending on complexity, but most no-code apps can be built in 4-8 weeks, while custom websites typically take 2-6 weeks.",
    },
    {
      question: "What's the difference between no-code and custom development?",
      answer:
        "No-code development uses visual builders like FlutterFlow to create apps without traditional coding, which is faster but has some limitations. Custom development offers complete flexibility but typically takes longer and costs more.",
    },
    {
      question: "Do you provide ongoing support?",
      answer:
        "Yes, we offer ongoing support and maintenance packages to ensure your app or website continues to run smoothly after launch.",
    },
    {
      question: "What is your typical process?",
      answer:
        "We follow a four-step process: Discovery (understanding your needs), Design (creating mockups), Build (development), and Launch (deployment with testing).",
    },
  ]

  return (
    <section id="contact" className="w-full py-20">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Get In Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to bring your idea to life? Contact us today to get started.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="budget" className="text-sm font-medium">
                  Budget <span className="text-xs text-muted-foreground">(Optional)</span>
                </label>
                <Input id="budget" name="budget" value={formState.budget} onChange={handleChange} placeholder="$" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-4">
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

            <div className="pt-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
