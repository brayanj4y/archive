"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Puppy } from "@/lib/types"
import { cn } from "@/lib/utils"

interface PuppyImageCarouselProps {
    puppy: Puppy
}

export function PuppyImageCarousel({ puppy }: PuppyImageCarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const images = puppy.images || [puppy.image]

    const goToPrevious = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
    }

    const goToNext = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }

    const goToImage = (index: number) => {
        setCurrentImageIndex(index)
    }

    return (
        <div className="space-y-4">
            {/* Main Image Display */}
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-muted">
                <Image
                    src={images[currentImageIndex] || "/placeholder.svg"}
                    alt={`${puppy.name} - ${puppy.color} French Bulldog puppy - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    width={800}
                    height={800}
                    priority={currentImageIndex === 0}
                />
                <Badge className="absolute top-4 right-4" variant={puppy.status === "Reserved" ? "secondary" : "default"}>
                    {puppy.status}
                </Badge>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                            onClick={goToPrevious}
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                            onClick={goToNext}
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => goToImage(index)}
                            className={cn(
                                "relative aspect-square overflow-hidden rounded-sm border-2 transition-all hover:opacity-100",
                                currentImageIndex === index
                                    ? "border-primary opacity-100 ring-2 ring-primary ring-offset-2"
                                    : "border-transparent opacity-60",
                            )}
                            aria-label={`View image ${index + 1}`}
                        >
                            <Image
                                src={image || "/placeholder.svg"}
                                alt={`${puppy.name} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                                width={200}
                                height={200}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
