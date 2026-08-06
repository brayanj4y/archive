"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Globe, Coffee, ShoppingCart, Rocket, TrendingUp, Search, Brush, Sparkles, ScanTextIcon, Brain, Compass } from "lucide-react"
import { motion } from "framer-motion"

export default function Services() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="services" className="w-full py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">What We Do</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We specialize in two core services to bring your digital ideas to life
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          <motion.div variants={item}>
            <Card className="h-full overflow-hidden group border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">No-Code Apps (FlutterFlow)</CardTitle>
                <CardDescription>Mobile applications built rapidly without traditional coding</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 text-primary">✓</span>
                    Rapid prototyping and development
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-primary">✓</span>
                    Native iOS and Android apps
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-primary">✓</span>
                    Custom UI/UX design
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-primary">✓</span>
                    Backend integration
                  </li>
                  <li className="flex items-center">
                    <Coffee className="mr-2 h-4 w-4 text-primary" />
                    Powered by expertise and innovation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full overflow-hidden group border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Custom Websites (Next.js)</CardTitle>
                <CardDescription>High-performance web applications with modern technology</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 text-primary">✓</span>
                    Blazing fast performance
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-primary">✓</span>
                    SEO optimized structure
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-primary">✓</span>
                    Responsive design
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-primary">✓</span>
                    Modern UI with animations
                  </li>
                  <li className="flex items-center">
                    <ScanTextIcon className="mr-2 h-4 w-4 text-primary" />
                    Attention to detail in every pixel
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="h-full overflow-hidden group border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Strategy & Consulting</CardTitle>
                <CardDescription>Define your digital roadmap with expert guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Digital transformation planning</li>
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Product-market fit analysis</li>
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Tech stack recommendations</li>
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Go-to-market strategy</li>
                  <li className="flex items-center"><Compass className="mr-2 h-4 w-4 text-primary" /> Navigate growth with clarity</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full overflow-hidden group border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Ecommerce Store Setup</CardTitle>
                <CardDescription>Launch your online store with ease and scalability</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Shopify, WooCommerce, and custom builds</li>
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Payment gateway integration</li>
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Inventory and order management</li>
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Conversion-focused design</li>
                  <li className="flex items-center"><Rocket className="mr-2 h-4 w-4 text-primary" /> Built for growth and performance</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="h-full overflow-hidden group border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">SEO & Ranking</CardTitle>
                <CardDescription>Climb search results and boost visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> On-page and off-page optimization</li>
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Keyword research and targeting</li>
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Technical SEO audits</li>
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Local and global strategies</li>
                  <li className="flex items-center"><Search className="mr-2 h-4 w-4 text-primary" /> Visibility that drives results</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full overflow-hidden group border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brush className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Image Editing</CardTitle>
                <CardDescription>Polish your visuals with professional edits</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Background removal and retouching</li>
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Color correction and enhancement</li>
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Social media-ready formats</li>
                  <li className="flex items-center"><span className="mr-2 text-primary">✓</span> Creative compositions</li>
                  <li className="flex items-center"><Sparkles className="mr-2 h-4 w-4 text-primary" /> Visuals that stand out</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
