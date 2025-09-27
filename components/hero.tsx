"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import ParticleBackground from "@/components/particle-background"

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <ParticleBackground />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              We build no-code apps & custom websites —
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">fast.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Using FlutterFlow & Next.js to launch your idea quickly & beautifully.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Link href="/contact">
              <Button size="lg" className="px-8">
                Let&apos;s Build Yours
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Moved scroll indicator to bottom of screen with proper spacing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <Link href="#services" scroll={false} className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1 h-1 bg-muted-foreground rounded-full" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  )
}
