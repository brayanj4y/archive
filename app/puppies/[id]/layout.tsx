import type React from "react"
import type { Metadata } from "next"
import { getPuppyById } from "@/data/puppies"

type Props = {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const puppy = getPuppyById(Number.parseInt(params.id))

    if (!puppy) {
        return {
            title: "Puppy Not Found | CH French Bulldogs",
            description:
                "The puppy you're looking for is not available. Browse our other available French Bulldog puppies for sale and adoption.",
        }
    }

    return {
        title: `${puppy.name} - ${puppy.color} French Bulldog Puppy for Sale | CH French Bulldogs`,
        description: `Meet ${puppy.name}, a ${puppy.age} old ${puppy.color.toLowerCase()} French Bulldog ${puppy.gender.toLowerCase()} for sale. ${puppy.description} Champion bloodline, health guaranteed, vaccinated, and ready for adoption. ${puppy.priceDisplay}. Located in Dallas, Texas with nationwide delivery available.`,
        keywords: [
            `${puppy.color} French Bulldog for sale`,
            `${puppy.color} French Bulldog puppy`,
            `${puppy.name} French Bulldog`,
            `${puppy.gender} French Bulldog puppy`,
            `${puppy.age} French Bulldog`,
            "French Bulldog with health guarantee",
            "champion bloodline French Bulldog",
            "vaccinated French Bulldog puppy",
            "family-raised French Bulldog",
            "French Bulldog adoption",
            "French Bulldog for sale Dallas",
            "French Bulldog for sale Texas",
            "French Bulldog breeder",
            "buy French Bulldog puppy",
        ],
        openGraph: {
            title: `${puppy.name} - ${puppy.color} French Bulldog Puppy for Sale | CH French Bulldogs`,
            description: `${puppy.age} old ${puppy.color.toLowerCase()} French Bulldog ${puppy.gender.toLowerCase()} for sale. ${puppy.description} Champion bloodline, health guaranteed. ${puppy.priceDisplay}`,
            type: "website",
            url: `https://chfrenchbulldogs.com/puppies/${puppy.id}`,
            siteName: "CH French Bulldogs",
            images: [
                {
                    url: puppy.image.startsWith("http") ? puppy.image : `https://chfrenchbulldogs.com${puppy.image}`,
                    width: 1200,
                    height: 630,
                    alt: `${puppy.name} - ${puppy.color} French Bulldog Puppy`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${puppy.name} - ${puppy.color} French Bulldog Puppy for Sale`,
            description: `Meet ${puppy.name}, a ${puppy.age} old ${puppy.color.toLowerCase()} French Bulldog. Champion bloodline, health guaranteed, vaccinated. ${puppy.priceDisplay}`,
            images: [puppy.image.startsWith("http") ? puppy.image : `https://chfrenchbulldogs.com${puppy.image}`],
        },
        alternates: {
            canonical: `https://chfrenchbulldogs.com/puppies/${puppy.id}`,
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}

export default function PuppyDetailLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
