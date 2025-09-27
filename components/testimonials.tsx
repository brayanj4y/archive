'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

interface Testimonial {
    content: string
    author: string
    role: string
    image: string
}

const testimonials: Testimonial[] = [
    {
        content:
            "These folks really came through! Their creativity and dedication brought our vision to life in ways we didn't imagine.",
        author: "Amina Nkem",
        role: "Founder, NaijaTech Hub",
        image: "/placeholder-user.jpg",
    },
    {
        content:
            "Working with this team felt like family. They understood our goals and helped us build a strong online presence that speaks to our people.",
        author: "Kwame Mensah",
        role: "Digital Lead, Accra Creatives",
        image: "/placeholder-user.jpg",
    },
    {
        content:
            "From start to finish, they were professional, patient, and full of ideas. Our project now stands out in the market thanks to their input.",
        author: "Zanele Dube",
        role: "CEO, Ubuntu Innovations",
        image: "/placeholder-user.jpg",
    },
    {
        content:
            "They didn't just build a product—they built trust. Their work ethic and attention to detail made all the difference for our brand.",
        author: "Jean-Claude Mbappe",
        role: "Marketing Strategist, Douala Digital",
        image: "/placeholder-user.jpg",
    },
]

export function Testimonials() {
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
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16">
                    <h2 className="text-4xl font-bold tracking-tight mb-4">Client Testimonials</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Hear what our partners say about working with us
                    </p>
                </motion.div>

                {/* Mobile: Vertical Stack */}
                <div className="block md:hidden">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                variants={item}
                                className="group transform transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                            >
                                <Card
                                    className={`rounded-xl shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between
                                        ${index % 3 === 0
                                            ? 'rotate-[1deg]'
                                            : index % 3 === 1
                                                ? '-rotate-[1deg]'
                                                : 'rotate-[0.5deg]'
                                        } group-hover:rotate-0`}
                                >
                                    <CardContent className="p-6 flex flex-col justify-between h-full">
                                        <blockquote className="text-lg italic text-muted-foreground mb-6 leading-relaxed">
                                            "{testimonial.content}"
                                        </blockquote>
                                        <div className="flex items-center gap-4 mt-auto">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={testimonial.image} alt={testimonial.author} />
                                                <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold text-base text-purple-500">{testimonial.author}</div>
                                                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Desktop: Carousel */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="hidden md:block"
                >
                    <Carousel
                        opts={{
                            align: "center",
                            loop: true,
                        }}
                        className="w-full max-w-6xl mx-auto"
                    >
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem
                                    key={index}
                                    className="basis-full sm:basis-1/2 lg:basis-1/3 group transform transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                                >
                                    <motion.div
                                        variants={item}
                                        className="p-4 h-full">
                                        <Card
                                            className={`rounded-xl shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between
                                                ${index % 3 === 0
                                                    ? 'rotate-[1deg]'
                                                    : index % 3 === 1
                                                        ? '-rotate-[1deg]'
                                                        : 'rotate-[0.5deg]'
                                                } group-hover:rotate-0`}
                                        >
                                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                                <blockquote className="text-2xl italic text-muted-foreground mb-6 leading-relaxed">
                                                    "{testimonial.content}"
                                                </blockquote>
                                                <div className="flex items-center gap-4 mt-auto">
                                                    <Avatar className="w-12 h-12">
                                                        <AvatarImage src={testimonial.image} alt={testimonial.author} />
                                                        <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold text-base text-purple-500">{testimonial.author}</div>
                                                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </motion.div>
            </div>
        </section>
    )
}