import type { Puppy } from "@/lib/types"

export const PUPPIES: Puppy[] = [
    {
        id: 1,
        name: "Daisy",
        age: "9 weeks",
        gender: "Female",
        color: "Fawn",
        price: 4600,
        priceDisplay: "$4,600",
        status: "New Arrival",
        image: "/puppies/5/IMG_1742.JPG?height=600&width=600",
        images: [
            "/puppies/5/IMG_1742.JPG?height=600&width=600",
            "/puppies/5/IMG_1737.JPG?height=600&width=600",
            "/puppies/5/IMG_1738.JPG?height=600&width=600",
            "/puppies/5/IMG_1739.JPG?height=600&width=600",
            "/puppies/5/IMG_1740.JPG?height=600&width=600",
            "/puppies/5/IMG_1741.JPG?height=600&width=600"
        ],
        description:
            "Meet Daisy! This sweet fawn cutie loves cuddles and belly rubs. She's full of love and ready to steal your heart.",
        weight: "10 lbs",
        parents: "Champion bloodline",
        vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
    },
    {
        id: 2,
        name: "Bruno",
        age: "8 weeks",
        gender: "Male",
        color: "Blue and Tan",
        price: 4800,
        priceDisplay: "$4,800",
        status: "New Arrival",
        image: "/puppies/3/IMG_1767.JPG?height=600&width=600",
        images: [
            "/puppies/3/IMG_1767.JPG?height=600&width=600",
            "/puppies/3/IMG_1749.JPG?height=600&width=600",
            "/puppies/3/IMG_1750.JPG?height=600&width=600",
            "/puppies/3/IMG_1761.JPG?height=600&width=600",
            "/puppies/3/IMG_1763.JPG?height=600&width=600",
            "/puppies/3/IMG_1769.JPG?height=600&width=600",
            "/puppies/3/IMG_1771.JPG?height=600&width=600"
        ],
        description:
            "Say hi to Bruno! This charming blue and tan boy is all about snuggles and gentle playtime. Perfect little companion for your family adventures!",
        weight: "9 lbs",
        parents: "Champion bloodline",
        vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
    },
    {
        id: 3,
        name: "Bella",
        age: "10 weeks",
        gender: "Female",
        color: "Fawn with Black Mask",
        price: 4200,
        priceDisplay: "$4,200",
        status: "Available",
        image: "/puppies/4/IMG_1768.JPG?height=600&width=600",
        images: [
            "/puppies/4/IMG_1768.JPG?height=600&width=600",
            "/puppies/4/IMG_1748.JPG?height=600&width=600",
            "/puppies/4/IMG_1751.JPG?height=600&width=600",
            "/puppies/4/IMG_1752.JPG?height=600&width=600",
            "/puppies/4/IMG_1753.JPG?height=600&width=600",
            "/puppies/4/IMG_1754.JPG?height=600&width=600",
            "/puppies/4/IMG_1770.JPG?height=600&width=600",
            "/puppies/4/IMG_1772.JPG?height=600&width=600",
            "/puppies/4/IMG_1773.JPG?height=600&width=600"
        ],
        description:
            "Bella is a little explorer with a heart full of love! This fawn cutie with a black mask loves playtime and adventures with her favorite humans.",
        weight: "13 lbs",
        parents: "Champion bloodline",
        vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
    },
    {
        id: 4,
        name: "Max",
        age: "8 weeks",
        gender: "Male",
        color: "White with Black Patches",
        price: 2500,
        priceDisplay: "$2,500",
        status: "Available",
        image: "/puppies/2/camo2.JPG?height=600&width=600",
        images: [
            "/puppies/2/camo1.JPG?height=600&width=600",
            "/puppies/2/camo2.JPG?height=600&width=600",
            "/puppies/2/camo3.JPG?height=600&width=600",
            "/puppies/2/camo4.JPG?height=600&width=600",
            "/puppies/2/camo5.JPG?height=600&width=600",
            "/puppies/2/camo6.JPG?height=600&width=600"
        ],
        description:
            "Max is a playful bundle of energy! This white and black patchy boy loves zoomies, cuddles, and making everyone smile.",
        weight: "8 lbs",
        parents: "Champion bloodline",
        vaccinations: ["First and second round of shots", "Dewormed", "Vet checked"],
    },
    {
        id: 5,
        name: "Rocky",
        age: "11 weeks",
        gender: "Male",
        color: "Black and Tan",
        price: 3600,
        priceDisplay: "$3,600",
        status: "Available",
        image: "/puppies/1/IMG_1781.JPG?height=600&width=600",
        images: [
            "/puppies/1/IMG_1775.JPG?height=600&width=600",
            "/puppies/1/IMG_1776.JPG?height=600&width=600",
            "/puppies/1/IMG_1777.JPG?height=600&width=600",
            "/puppies/1/IMG_1778.JPG?height=600&width=600",
            "/puppies/1/IMG_1779.JPG?height=600&width=600",
            "/puppies/1/IMG_1780.JPG?height=600&width=600",
            "/puppies/1/IMG_1781.JPG?height=600&width=600",
            "/puppies/1/IMG_1782.JPG?height=600&width=600",
        ],
        description:
            "Rocky is the sweetest cuddle buddy! This black and tan boy loves gentle play, snuggles, and making everyone around him happy.",
        weight: "12 lbs",
        parents: "Champion bloodline",
        vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
    },
]

// Helper function to get a puppy by ID
export function getPuppyById(id: number): Puppy | undefined {
    return PUPPIES.find((puppy) => puppy.id === id)
}

// Helper function to get all available puppies
export function getAvailablePuppies(): Puppy[] {
    return PUPPIES.filter((puppy) => puppy.status === "Available" || puppy.status === "New Arrival")
}

// Helper function to get featured puppies (first 2 available)
export function getFeaturedPuppies(): Puppy[] {
    return getAvailablePuppies().slice(0, 2)
}
