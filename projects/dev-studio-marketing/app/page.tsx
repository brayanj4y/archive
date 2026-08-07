import Hero from "@/components/hero"
import Services from "@/components/services"
import Work from "@/components/work"
import Process from "@/components/process"
import Contact from "@/components/contact"
import { Testimonials } from "@/components/testimonials"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <Services />
      <Work />
      <Process />
      <Testimonials />
      <Contact />
    </main>
  )
}
