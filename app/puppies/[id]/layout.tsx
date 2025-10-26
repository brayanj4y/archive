import type React from "react"
import type { Metadata } from "next"

type Props = {
    params: { id: string }
}

// Puppy data for metadata generation
const puppies = [
    {
        id: 1,
        name: "Bella",
        age: "10 weeks",
        gender: "Female",
        color: "Fawn",
        price: "$4,500",
        description:
            "Bella is a sweet and playful fawn French Bulldog with a gentle temperament. She loves cuddles and is great with children.",
    },
    {
        id: 2,
        name: "Max",
        age: "12 weeks",
        gender: "Male",
        color: "Blue",
        price: "$5,500",
        description: "Max is an energetic blue French Bulldog with a stunning coat. He's confident and loves to play.",
    },
    {
        id: 3,
        name: "Luna",
        age: "8 weeks",
        gender: "Female",
        color: "Cream",
        price: "$4,800",
        description: "Luna is a beautiful cream French Bulldog with a calm and loving personality. Perfect for families.",
    },
    {
        id: 4,
        name: "Rocky",
        age: "11 weeks",
        gender: "Male",
        color: "Brindle",
        price: "$4,200",
        description:
            "Rocky is a handsome brindle French Bulldog with a playful spirit. He's adventurous and loves exploring.",
    },
    {
        id: 5,
        name: "Daisy",
        age: "9 weeks",
        gender: "Female",
        color: "Pied",
        price: "$4,600",
        description:
            "Daisy is a gorgeous pied French Bulldog with unique markings. She's affectionate and loves attention.",
    },
    {
        id: 6,
        name: "Duke",
        age: "10 weeks",
        gender: "Male",
        color: "Black",
        price: "$4,400",
        description: "Duke is a striking black French Bulldog with a bold personality. He's loyal and protective.",
    },
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const puppy = puppies.find((p) => p.id === Number.parseInt(params.id))

    if (!puppy) {
        return {
            title: "Puppy Not Found | CH French Bulldogs",
            description: "The puppy you're looking for is not available. Browse our other available French Bulldog puppies.",
        }
    }

    return {
        title: `${puppy.name} - ${puppy.color} French Bulldog Puppy for Sale | CH French Bulldogs`,
        description: `Meet ${puppy.name}, a ${puppy.age} old ${puppy.color.toLowerCase()} French Bulldog ${puppy.gender.toLowerCase()}. ${puppy.description} Champion bloodline, health guaranteed, vaccinated. ${puppy.price}`,
        keywords: [
            `${puppy.color} French Bulldog for sale`,
            `${puppy.name} French Bulldog`,
            `${puppy.gender} French Bulldog puppy`,
            "French Bulldog with health guarantee",
            "champion bloodline French Bulldog",
            "vaccinated French Bulldog puppy",
            "family-raised French Bulldog",
            `${puppy.age} French Bulldog`,
        ],
        openGraph: {
            title: `${puppy.name} - ${puppy.color} French Bulldog Puppy | CH French Bulldogs`,
            description: `${puppy.age} old ${puppy.color.toLowerCase()} French Bulldog ${puppy.gender.toLowerCase()}. ${puppy.description} Champion bloodline, health guaranteed. ${puppy.price}`,
            type: "website",
            url: `https://chfrenchbulldogs.com/puppies/${puppy.id}`,
            siteName: "CH French Bulldogs",
            images: [
                {
                    url: "/logo-hori.png",
                    width: 1200,
                    height: 630,
                    alt: `${puppy.name} - ${puppy.color} French Bulldog Puppy`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${puppy.name} - ${puppy.color} French Bulldog Puppy for Sale`,
            description: `Meet ${puppy.name}, a ${puppy.age} old ${puppy.color.toLowerCase()} French Bulldog. Champion bloodline, health guaranteed, vaccinated. ${puppy.price}`,
            images: ["/logo-hori.png"],
        },
        alternates: {
            canonical: `https://chfrenchbulldogs.com/puppies/${puppy.id}`,
        },
    }
}

export default function PuppyDetailLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
