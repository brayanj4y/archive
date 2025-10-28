import type { Puppy } from "@/lib/types"

export const PUPPIES: Puppy[] = [
    {
        id: 1,
        name: "Bella",
        age: "10 weeks",
        gender: "Female",
        color: "Fawn",
        price: 4500,
        priceDisplay: "$4,500",
        status: "Available",
        image: "/placeholder.svg?height=600&width=600",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
        description:
            "Bella is a sweet and playful fawn French Bulldog with a gentle temperament. She loves cuddles and is great with children.",
        weight: "12 lbs",
        parents: "Champion bloodline",
        vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
    },
    {
        id: 2,
        name: "Max",
        age: "12 weeks",
        gender: "Male",
        color: "Blue",
        price: 5500,
        priceDisplay: "$5,500",
        status: "Available",
        image: "/placeholder.svg?height=600&width=600",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
        description: "Max is an energetic blue French Bulldog with a stunning coat. He's confident and loves to play.",
        weight: "14 lbs",
        parents: "Champion bloodline",
        vaccinations: ["First and second round of shots", "Dewormed", "Vet checked"],
    },
    {
        id: 3,
        name: "Luna",
        age: "8 weeks",
        gender: "Female",
        color: "Cream",
        price: 4800,
        priceDisplay: "$4,800",
        status: "New Arrival",
        image: "/placeholder.svg?height=600&width=600",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
        description: "Luna is a beautiful cream French Bulldog with a calm and loving personality. Perfect for families.",
        weight: "10 lbs",
        parents: "Champion bloodline",
        vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
    },
    {
        id: 4,
        name: "Rocky",
        age: "11 weeks",
        gender: "Male",
        color: "Brindle",
        price: 4200,
        priceDisplay: "$4,200",
        status: "Available",
        image: "/placeholder.svg?height=600&width=600",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
        description:
            "Rocky is a handsome brindle French Bulldog with a playful spirit. He's adventurous and loves exploring.",
        weight: "13 lbs",
        parents: "Champion bloodline",
        vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
    },
    {
        id: 5,
        name: "Daisy",
        age: "9 weeks",
        gender: "Female",
        color: "Pied",
        price: 4600,
        priceDisplay: "$4,600",
        status: "Reserved",
        image: "/placeholder.svg?height=600&width=600",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
        description:
            "Daisy is a gorgeous pied French Bulldog with unique markings. She's affectionate and loves attention.",
        weight: "11 lbs",
        parents: "Champion bloodline",
        vaccinations: ["First round of shots", "Dewormed", "Vet checked"],
    },
    {
        id: 6,
        name: "Duke",
        age: "10 weeks",
        gender: "Male",
        color: "Black",
        price: 4400,
        priceDisplay: "$4,400",
        status: "Available",
        image: "/placeholder.svg?height=600&width=600",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
        description: "Duke is a striking black French Bulldog with a bold personality. He's loyal and protective.",
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
