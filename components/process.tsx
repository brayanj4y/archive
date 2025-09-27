"use client"

import { motion } from "framer-motion"
import { Search, Palette, Code, Rocket, Coffee, Clock } from "lucide-react"

export default function Process() {
  const steps = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Discovery",
      description: "We learn about your business, goals, and requirements to create a tailored solution.",
      secondaryIcon: <Coffee className="h-4 w-4" />,
      secondaryText: "Research & Planning",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Design",
      description: "Our designers create wireframes and mockups for your approval before development begins.",
      secondaryIcon: <Clock className="h-4 w-4" />,
      secondaryText: "Creative Process",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Build",
      description: "We develop your solution using FlutterFlow for mobile apps or Next.js for websites.",
      secondaryIcon: <Coffee className="h-4 w-4" />,
      secondaryText: "Development Phase",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Launch",
      description: "We deploy your solution and provide ongoing support to ensure everything runs smoothly.",
      secondaryIcon: <Clock className="h-4 w-4" />,
      secondaryText: "Deployment & Support",
    },
  ]

  return (
    <section id="process" className="w-full py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process ensures your project is completed efficiently and effectively
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

          <div className="space-y-12 md:space-y-0 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`md:flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div
                      className={`flex items-center text-xs text-muted-foreground ${index % 2 === 0 ? "justify-end" : "justify-start"}`}
                    >
                      {step.secondaryIcon}
                      <span className="ml-1">{step.secondaryText}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center relative z-10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <div className="text-primary">{step.icon}</div>
                  </div>
                </div>

                <div className="md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
