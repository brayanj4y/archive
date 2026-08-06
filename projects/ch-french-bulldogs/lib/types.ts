export interface Puppy {
    id: number
    name: string
    age: string
    gender: "Male" | "Female"
    color: string
    price: number
    priceDisplay: string
    status: "Available" | "Reserved" | "New Arrival"
    image: string
    images: string[]
    description: string
    weight: string
    parents: string
    vaccinations: string[]
}
