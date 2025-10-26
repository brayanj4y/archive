import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Available French Bulldog Puppies for Sale | CH French Bulldogs",
    description:
        "Browse our selection of healthy, champion bloodline French Bulldog puppies for adoption. All puppies come with health guarantees, vaccinations, and vet checks. Family-raised with love and care.",
    keywords: [
        "French Bulldog puppies for sale",
        "French Bulldog breeders",
        "healthy French Bulldog puppies",
        "champion bloodline French Bulldogs",
        "French Bulldog adoption",
        "quality French Bulldog breeders",
        "French Bulldog puppies with health guarantee",
        "family-raised French Bulldogs",
        "vaccinated French Bulldog puppies",
        "blue French Bulldog",
        "fawn French Bulldog",
        "cream French Bulldog",
        "brindle French Bulldog",
    ],
    openGraph: {
        title: "Available French Bulldog Puppies for Sale | CH French Bulldogs",
        description:
            "Find your perfect French Bulldog companion from our trusted breeding program. Champion bloodlines, health guarantees, and family-raised puppies ready for their forever homes.",
        type: "website",
        url: "https://chfrenchbulldogs.com/puppies",
        siteName: "CH French Bulldogs",
        images: [
            {
                url: "/logo-hori.png",
                width: 1200,
                height: 630,
                alt: "CH French Bulldogs - Premium French Bulldog Puppies",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Available French Bulldog Puppies for Sale | CH French Bulldogs",
        description:
            "Browse our selection of healthy, champion bloodline French Bulldog puppies. All puppies come with health guarantees and are family-raised with love.",
        images: ["/logo-hori.png"],
    },
    alternates: {
        canonical: "https://chfrenchbulldogs.com/puppies",
    },
}

export default function PuppiesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
