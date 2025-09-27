"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section id="work" ref={sectionRef} className="w-full py-20">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Our Work</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            While we're just getting started, we've put our expertise into creating our own website
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">DevStudio Landing Page</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Next.js</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="outline">Framer Motion</Badge>
                <Badge variant="outline">TypeScript</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                A modern, high-converting landing page designed to showcase our services in building no-code apps and custom websites.
              </p>
              <Link href="/work" className="inline-flex items-center gap-2">
                <Button variant="outline">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

          </motion.div>

          <motion.div
            style={{ y }}
            className="relative h-[500px] rounded-xl overflow-hidden border border-border/40 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
            <Image
              src="/placeholder.svg?height=1000&width=800"
              alt="DevStudio Website Preview"
              fill
              className="object-cover"
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4">
              <div className="w-[120px] h-[240px] rounded-xl overflow-hidden border-4 border-background/80 shadow-lg">
                <Image
                  src="/placeholder.svg?height=480&width=240"
                  alt="Mobile Preview"
                  width={240}
                  height={480}
                  className="object-cover"
                />
              </div>
              <div className="w-[120px] h-[240px] rounded-xl overflow-hidden border-4 border-background/80 shadow-lg">
                <Image
                  src="/placeholder.svg?height=480&width=240"
                  alt="Mobile Preview"
                  width={240}
                  height={480}
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
