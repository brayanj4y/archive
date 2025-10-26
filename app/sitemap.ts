import { MetadataRoute } from 'next'

if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not set')
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '')

const puppies = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 }
]

export default function sitemap(): MetadataRoute.Sitemap {
    // Static pages
    const staticPages = [
        '',
        'puppies',
        'contact',
        'cart',
        'checkout',
        'privacy',
        'terms',
        'financing',
        'refund',
        'advice/the-bulldog',
        'advice/how-to-purchase',
        'advice/fraudulent-breeders',
        'policies/sales',
        'policies/shipping',
        'policies/warranty'
    ].map((route) => ({
        url: `${baseUrl}/${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic puppy pages
    const puppyPages = puppies.map((puppy) => ({
        url: `${baseUrl}/puppies/${puppy.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }))

    return [...staticPages, ...puppyPages]
} 